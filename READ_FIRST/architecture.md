# Kiến trúc hệ thống BRT Gestão

## 1. Tổng quan

Hệ thống quản lý vận hành xe buýt nhanh BRT Hà Nội, phục vụ quản lý 5 tuyến, 23+ trạm, 12+ xe, 8+ tài xế với real-time tracking, ticketing, analytics và big data pipeline.

## 2. Sơ đồ kiến trúc tổng thể

```
                              ┌────────────────────────┐
                              │     Angular 17 SPA      │
                              │  Tailwind · NgRx · Leaflet · Chart.js
                              └───────────┬────────────┘
                                          │ HTTP / WebSocket
                              ┌───────────▼────────────┐
                              │     API Gateway :8080   │
                              │   Spring Cloud Gateway  │
                              │   JWT filter · CORS     │
                              │   Rate limit · Logging  │
                              └───────────┬────────────┘
                                          │
                 ┌──────────────┬─────────┼─────────┬───────────────┐
                 │              │         │         │               │
          ┌──────▼──────┐ ┌────▼────┐ ┌──▼───┐ ┌──▼────┐ ┌───────▼────────┐
          │ auth :8081  │ │route    │ │vehic.│ │statio.│ │ ...9 services  │
          │ PostgreSQL  │ │:8082    │ │:8083 │ │:8084  │ │ :8085 → :8093  │
          └─────────────┘ │Neo4j   │ │Timesc│ │PostGIS│ └────────────────┘
                          │PostGIS │ │aleDB │ │Timesc.│
                          └────────┘ └──────┘ └───────┘
                 │              │         │         │               │
          ┌──────▼──────────────▼─────────▼─────────▼───────────────▼──┐
          │                    Apache Kafka                             │
          │  10 topics · event-driven communication                    │
          └──────┬─────────────────────────────────────────────────────┘
                 │
          ┌──────▼──────────────────────────────────────────┐
          │              Big Data Pipeline                   │
          │  NiFi → Kafka → HDFS → Kylo → Hive → Ranger    │
          └─────────────────────────────────────────────────┘
```

## 3. Quyết định thiết kế (Architecture Decision Records)

### ADR-01: Microservices thay vì Monolith

**Bối cảnh:** Hệ thống BRT có 17 feature modules độc lập, 7 roles khác nhau, yêu cầu scale real-time tracking riêng biệt khỏi nghiệp vụ CRUD.

**Quyết định:** Tách thành 13 microservices theo domain boundary.

**Lý do:**
- vehicle-service cần scale ngang để xử lý GPS data mỗi 5 giây từ hàng trăm xe
- analytics-service cần query Hive nặng mà không ảnh hưởng CRUD operations
- Mỗi team có thể deploy độc lập (route-service không cần redeploy khi sửa ticket-service)

**Hệ quả:** Cần API Gateway, Service Discovery, distributed tracing, phức tạp hơn monolith.

### ADR-02: Neo4j cho Route Graph

**Bối cảnh:** Tuyến BRT có mối quan hệ graph tự nhiên: tuyến → trạm → trạm liền kề. Cần tìm đường ngắn nhất, phát hiện transfer hub, phân tích network connectivity.

**Quyết định:** Dùng Neo4j song song với PostgreSQL trong route-service.

**Mô hình graph:**
```
(:Route {id, code, name, status})
    -[:HAS_STATION {order, distance_km}]->
(:Station {id, code, name, lat, lng})
    -[:CONNECTS_TO {travel_time_min}]->
(:Station)
```

**Lý do:**
- Query tìm đường `SHORTEST_PATH` trong Neo4j là O(n) thay vì self-join phức tạp trong SQL
- Transfer hub detection: `MATCH (s:Station)<-[:HAS_STATION]-(:Route) WITH s, count(*) AS routeCount WHERE routeCount > 1`
- Network analysis (connected components, centrality) native trong graph database

### ADR-03: PostGIS cho Spatial Data

**Bối cảnh:** Mỗi trạm có tọa độ GPS, mỗi tuyến có geometry LineString. Cần query không gian: trạm gần nhất, xe trong bán kính, tuyến giao nhau.

**Quyết định:** Bật extension PostGIS trên PostgreSQL 16.

**Ví dụ query:**
```sql
-- Tìm trạm trong bán kính 500m
SELECT * FROM stations
WHERE ST_DWithin(location::geography, ST_MakePoint(105.8142, 21.0285)::geography, 500);

-- Tuyến geometry
SELECT ST_AsGeoJSON(geometry) FROM routes WHERE id = 'r-001';
```

### ADR-04: TimescaleDB cho Time-Series

**Bối cảnh:** GPS position mỗi 5s, telemetry mỗi 30s, passenger count mỗi phút, ticket transaction liên tục. Cần query aggregate theo thời gian hiệu quả.

**Quyết định:** Bật extension TimescaleDB, tạo hypertable cho 4 bảng time-series.

**Hypertables:**
```
vehicle_positions    → chunk by time (1 hour), partition by vehicle_id
vehicle_telemetry    → chunk by time (1 hour), partition by vehicle_id
ticket_transactions  → chunk by time (1 day)
station_passenger_counts → chunk by time (1 hour), partition by station_id
```

**Lý do:**
- Compression tự động: dữ liệu cũ nén 10-20x
- Continuous aggregates: materialized view tự cập nhật cho dashboard
- Retention policy: tự xóa raw data sau 90 ngày, giữ aggregate vĩnh viễn

### ADR-05: Kafka cho Event-Driven Communication

**Bối cảnh:** Khi xe gửi GPS, cần đồng thời: cập nhật map, check headway, detect anomaly, lưu HDFS. Synchronous REST call sẽ tạo bottleneck.

**Quyết định:** Kafka cho tất cả real-time events, REST cho CRUD operations.

**Phân loại communication:**
```
Synchronous (REST via Feign Client):
  schedule-service → route-service: lấy thông tin tuyến khi tạo lịch
  incident-service → vehicle-service: lấy biển số xe khi report

Asynchronous (Kafka):
  vehicle-service → brt.vehicle.position.updated → analytics, notification, data-platform
  incident-service → brt.incident.created → notification, maintenance
  ticket-service → brt.ticket.purchased → analytics
```

### ADR-06: Big Data Pipeline (NiFi + Kylo + Hadoop + Hive + Ranger)

**Bối cảnh:** Raw GPS data ~1.5 triệu records/ngày (12 xe × 5s interval × 18h). Cần lưu trữ lâu dài, query historical analysis, đảm bảo data quality và access control.

**Quyết định:** Pipeline 5 stages:

```
Stage 1: NiFi         → Thu thập raw data từ Kafka topics
Stage 2: Kafka        → Buffer và distribute events
Stage 3: HDFS         → Lưu trữ raw data (Parquet format)
Stage 4: Kylo         → Data quality check, transform, catalog
Stage 5: Hive         → SQL-on-Hadoop cho historical analytics
         Ranger       → Access control policy enforcement
```

### ADR-07: CQRS cho Analytics Service

**Bối cảnh:** Dashboard cần aggregate real-time (hôm nay bao nhiêu khách, revenue bao nhiêu) đồng thời với historical analysis (so sánh tháng này vs tháng trước).

**Quyết định:** analytics-service dùng CQRS pattern:
- **Command side:** Nhận events từ Kafka, ghi vào TimescaleDB continuous aggregates
- **Query side:** Read từ TimescaleDB (real-time) hoặc Hive (historical)

### ADR-08: Circuit Breaker cho Inter-Service Calls

**Bối cảnh:** schedule-service gọi route-service, vehicle-service, driver-service. Nếu một service down, cascading failure.

**Quyết định:** Resilience4j circuit breaker trên tất cả Feign Client.

```
Config mỗi circuit breaker:
  failure-rate-threshold: 50%
  wait-duration-in-open-state: 30s
  sliding-window-size: 10 calls
  fallback: trả cached data hoặc degraded response
```

## 4. Giao tiếp giữa các services

### Synchronous (REST — Feign Client)

```
schedule-service ──GET──→ route-service      (lấy route info)
schedule-service ──GET──→ vehicle-service    (lấy available vehicles)
schedule-service ──GET──→ driver-service     (lấy available drivers)
incident-service ──GET──→ vehicle-service    (lấy plate number)
incident-service ──GET──→ route-service      (lấy route name)
incident-service ──GET──→ station-service    (lấy station name)
analytics-service ──GET──→ route-service     (lấy route list)
analytics-service ──GET──→ ticket-service    (lấy revenue data)
analytics-service ──GET──→ station-service   (lấy station list)
passenger-service ──GET──→ route-service     (lấy route info)
passenger-service ──GET──→ station-service   (lấy station info)
maintenance-service ──GET──→ vehicle-service (lấy vehicle info)
```

### Asynchronous (Kafka — 10 topics)

```
PUBLISHER                  TOPIC                          SUBSCRIBERS
──────────────────────────────────────────────────────────────────────
vehicle-service       → brt.vehicle.position.updated  → analytics, notification, data-platform
vehicle-service       → brt.vehicle.telemetry.received→ analytics, maintenance, data-platform
schedule-service      → brt.trip.status.changed       → notification, analytics
incident-service      → brt.incident.created          → notification, maintenance
incident-service      → brt.incident.status.changed   → notification
ticket-service        → brt.ticket.purchased          → analytics, data-platform
maintenance-service   → brt.maintenance.alert         → notification
schedule-service      → brt.dispatch.requested        → notification
station-service       → brt.passenger.count.updated   → analytics, data-platform
notification-service  → brt.audit.event.logged        → (log storage)
```

## 5. Authentication & Authorization Flow

```
1. User nhập username/password → Frontend POST /api/auth/login
2. API Gateway forward → auth-service
3. auth-service verify credentials → trả JWT token (chứa userId, role, permissions)
4. Frontend lưu JWT vào localStorage
5. Mọi request sau đó: Frontend gắn header Authorization: Bearer {token}
6. API Gateway: JwtAuthGatewayFilter validate token, extract role
7. Target microservice: @PreAuthorize("hasRole('ADMIN')") kiểm tra role
8. Token hết hạn → Frontend POST /api/auth/refresh với refreshToken
```

## 6. Service Discovery & Configuration Flow

```
Startup order:
1. Config Server :8888     ← đọc config từ Git repo hoặc local files
2. Eureka :8761            ← register chính nó
3. API Gateway :8080       ← register vào Eureka, fetch route config từ Config Server
4. Business services       ← register vào Eureka, fetch config từ Config Server
                              Eureka heartbeat mỗi 30s

Runtime:
  API Gateway nhận request → query Eureka tìm service instance → load balance → forward
  Nếu service có 3 instances: round-robin hoặc least-connections
```

## 7. Technology stack tổng hợp

| Layer | Technology | Mục đích |
|---|---|---|
| Frontend | Angular 17, Tailwind CSS, NgRx, Leaflet, Chart.js | SPA, state management, map, charts |
| API Gateway | Spring Cloud Gateway | Routing, JWT filter, rate limit, CORS |
| Service Discovery | Eureka | Service registry, health check |
| Configuration | Spring Cloud Config | Centralized config management |
| Business Logic | Spring Boot 3.2 | REST API, business services |
| Security | Spring Security 6 + JWT | Authentication, authorization |
| Relational DB | PostgreSQL 16 | CRUD data, referential integrity |
| Spatial DB | PostGIS | Tọa độ GPS, geometry tuyến |
| Time-Series DB | TimescaleDB | Vehicle tracking, telemetry, transactions |
| Graph DB | Neo4j 5 | Route-station graph, pathfinding |
| Message Broker | Apache Kafka | Event-driven async communication |
| Data Ingestion | Apache NiFi | ETL data pipeline |
| Data Quality | Kylo | Data profiling, quality check |
| Data Storage | Hadoop HDFS | Raw data lake storage |
| Data Warehouse | Apache Hive | SQL analytics trên big data |
| Data Governance | Apache Ranger | Access control policies |
| Monitoring | Prometheus + Grafana | Metrics, dashboards |
| Logging | ELK Stack | Centralized logging |
| Resilience | Resilience4j | Circuit breaker, retry, rate limiter |
| DB Migration | Flyway | Schema versioning |
| API Docs | SpringDoc OpenAPI | Swagger UI |
