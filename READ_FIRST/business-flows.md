# Luồng nghiệp vụ chính — BRT Gestão

10 luồng nghiệp vụ cốt lõi của hệ thống, mô tả bằng sequence diagram text-based.

---

## Luồng 1: Đăng nhập & Phân quyền

```
User          Frontend            Gateway          auth-service        PostgreSQL
 │   nhập user/pass   │               │                │                  │
 │──────────────────►│               │                │                  │
 │                    │  POST /api/auth/login          │                  │
 │                    │──────────────►│                │                  │
 │                    │               │  forward       │                  │
 │                    │               │───────────────►│                  │
 │                    │               │                │  SELECT users    │
 │                    │               │                │─────────────────►│
 │                    │               │                │  user + role     │
 │                    │               │                │◄─────────────────│
 │                    │               │                │  generate JWT    │
 │                    │               │  {token, user, role}              │
 │                    │               │◄───────────────│                  │
 │                    │  AuthResponse │                │                  │
 │                    │◄──────────────│                │                  │
 │                    │  lưu JWT vào localStorage      │                  │
 │                    │  render sidebar theo role       │                  │
 │  dashboard hiển thị│               │                │                  │
 │◄───────────────────│               │                │                  │
```

**7 roles quyết định sidebar:**
- ADMIN: thấy tất cả 17 modules
- OPS_MANAGER: routes, vehicles, stations, drivers, schedules, dispatch, incidents, maintenance, analytics, revenue
- DISPATCHER: routes, vehicles, drivers, schedules, dispatch, incidents
- DRIVER: routes, schedules, incidents
- MAINTENANCE: vehicles, incidents, maintenance (work orders, parts, schedule)
- ANALYST: routes, vehicles, stations, tickets, analytics, data-platform
- FINANCE: tickets, ticket-types, revenue, analytics

---

## Luồng 2: Tạo tuyến BRT mới

```
OPS_MANAGER    RouteForm      Gateway      route-service     PostgreSQL    Neo4j
    │  nhập thông tin    │          │             │              │           │
    │  tuyến + stations  │          │             │              │           │
    │───────────────────►│          │             │              │           │
    │                    │ POST /api/routes       │              │           │
    │                    │─────────►│             │              │           │
    │                    │          │  forward    │              │           │
    │                    │          │────────────►│              │           │
    │                    │          │             │ validate     │           │
    │                    │          │             │ Feign → station-service  │
    │                    │          │             │ (kiểm tra station IDs)   │
    │                    │          │             │              │           │
    │                    │          │             │ INSERT route │           │
    │                    │          │             │─────────────►│           │
    │                    │          │             │              │           │
    │                    │          │             │ INSERT PostGIS geometry  │
    │                    │          │             │─────────────►│           │
    │                    │          │             │              │           │
    │                    │          │             │ CREATE (:Route)          │
    │                    │          │             │ CREATE (:Route)-[:HAS_STATION]->(:Station)
    │                    │          │             │──────────────────────────►│
    │                    │          │             │              │           │
    │                    │          │  RouteDto   │              │           │
    │                    │◄─────────│◄────────────│              │           │
    │  hiển thị tuyến mới│          │             │              │           │
    │◄───────────────────│          │             │              │           │
```

**Dual-write Neo4j + PostgreSQL:**
- PostgreSQL: lưu route metadata, PostGIS geometry, route_stations join table
- Neo4j: lưu graph relationships để query pathfinding, transfer detection

---

## Luồng 3: Điều xe & Theo dõi Real-time

```
Dispatcher    DispatchComp    Gateway    schedule-svc   vehicle-svc    Kafka      Frontend
    │  tạo dispatch    │         │           │              │           │          │
    │  request         │         │           │              │           │          │
    │─────────────────►│         │           │              │           │          │
    │                  │ POST /api/dispatch  │              │           │          │
    │                  │────────►│           │              │           │          │
    │                  │         │──────────►│              │           │          │
    │                  │         │           │ Feign: get   │           │          │
    │                  │         │           │ available    │           │          │
    │                  │         │           │ vehicles     │           │          │
    │                  │         │           │─────────────►│           │          │
    │                  │         │           │◄─────────────│           │          │
    │                  │         │           │ assign vehicle + driver  │          │
    │                  │         │           │              │           │          │
    │                  │         │           │ publish event│           │          │
    │                  │         │           │──────────────────────────►│         │
    │                  │         │           │              │  brt.dispatch.requested
    │                  │◄────────│◄──────────│              │           │          │
    │  dispatch OK     │         │           │              │           │          │
    │◄─────────────────│         │           │              │           │          │
    │                  │         │           │              │           │          │
    │                  │         │           │              │           │          │
    ═══ Sau đó, xe bắt đầu chạy: GPS gửi position mỗi 5 giây ════════════════════
    │                  │         │           │              │           │          │
    │                  │         │           │   GPS device │           │          │
    │                  │         │           │   ──────────►│           │          │
    │                  │         │           │              │ save TimescaleDB     │
    │                  │         │           │              │ publish   │          │
    │                  │         │           │              │──────────►│          │
    │                  │         │           │              │  brt.vehicle.position.updated
    │                  │         │           │              │           │          │
    │                  │         │           │              │           │WebSocket │
    │                  │         │           │              │           │─────────►│
    │                  │         │           │              │           │          │
    │                  │  map cập nhật marker xe trên Leaflet           │  update  │
    │◄─────────────────────────────────────────────────────────────────────────────│
```

---

## Luồng 4: Hành khách mua vé

```
Hành khách    PassengerApp    Gateway    ticket-service    PostgreSQL    Kafka
    │  chọn loại vé     │         │            │              │           │
    │  chọn payment     │         │            │              │           │
    │──────────────────►│         │            │              │           │
    │                   │ POST /api/tickets/purchase          │           │
    │                   │────────►│            │              │           │
    │                   │         │───────────►│              │           │
    │                   │         │            │ validate ticket type     │
    │                   │         │            │ check EWallet balance    │
    │                   │         │            │─────────────►│           │
    │                   │         │            │              │           │
    │                   │         │            │ INSERT transaction       │
    │                   │         │            │ (TimescaleDB hypertable) │
    │                   │         │            │─────────────►│           │
    │                   │         │            │              │           │
    │                   │         │            │ generate QR code         │
    │                   │         │            │              │           │
    │                   │         │            │ deduct EWallet           │
    │                   │         │            │─────────────►│           │
    │                   │         │            │              │           │
    │                   │         │            │ publish event│           │
    │                   │         │            │──────────────────────────►│
    │                   │         │            │              │ brt.ticket.purchased
    │                   │         │            │              │           │
    │                   │  {qrCode, transaction}              │           │
    │                   │◄────────│◄───────────│              │           │
    │  hiển thị QR      │         │            │              │           │
    │◄──────────────────│         │            │              │           │
    │                   │         │            │              │           │
    │  quét QR tại trạm │         │            │              │           │
    │  ──────────────────────────────────────►│              │           │
    │                   │         │            │ validate QR  │           │
    │                   │         │            │ UPDATE usedAt│           │
```

**Phương thức thanh toán:** MoMo, VNPay, Bank Card, BRT Wallet, Cash

---

## Luồng 5: Báo cáo sự cố

```
Driver/Dispatch   IncidentForm    Gateway    incident-svc    Kafka    notification-svc    maintenance-svc
    │  báo sự cố     │           │            │             │            │                    │
    │  (loại, mức    │           │            │             │            │                    │
    │   độ, mô tả)   │           │            │             │            │                    │
    │────────────────►│           │            │             │            │                    │
    │                 │ POST /api/incidents    │             │            │                    │
    │                 │──────────►│            │             │            │                    │
    │                 │           │───────────►│             │            │                    │
    │                 │           │            │ INSERT      │            │                    │
    │                 │           │            │ incident    │            │                    │
    │                 │           │            │             │            │                    │
    │                 │           │            │ publish     │            │                    │
    │                 │           │            │────────────►│            │                    │
    │                 │           │            │  brt.incident.created    │                    │
    │                 │           │            │             │            │                    │
    │                 │           │            │             │ consume    │                    │
    │                 │           │            │             │───────────►│                    │
    │                 │           │            │             │            │ push notification  │
    │                 │           │            │             │            │ → OPS_MANAGER      │
    │                 │           │            │             │            │ → DISPATCHER       │
    │                 │           │            │             │            │                    │
    │                 │           │            │             │ consume    │                    │
    │                 │           │            │             │────────────────────────────────►│
    │                 │           │            │             │            │                    │
    │                 │           │            │             │ nếu type = BREAKDOWN:          │
    │                 │           │            │             │ auto tạo WorkOrder EMERGENCY   │
    │                 │           │            │             │            │                    │
    │                 │  IncidentDto           │             │            │                    │
    │                 │◄──────────│◄───────────│             │            │                    │
    │  xác nhận       │           │            │             │            │                    │
    │◄────────────────│           │            │             │            │                    │
```

**14 loại sự cố:** ACCIDENT, BREAKDOWN, DELAY, OVERCROWDING, EQUIPMENT_FAILURE, SPEEDING, OFF_ROUTE, BUNCHING, ABNORMAL_STOP, LOW_BATTERY, DEVICE_OFFLINE, AC_FAILURE, PASSENGER_COMPLAINT, OTHER

**4 mức độ:** P1 (critical), P2 (high), P3 (medium), P4 (low)

**Auto-action rules:**
- BREAKDOWN → auto tạo WorkOrder type EMERGENCY
- SPEEDING → auto ghi nhận violation cho driver
- LOW_BATTERY (xe điện) → alert MAINTENANCE

---

## Luồng 6: Bảo trì xe (Predictive)

```
Vehicle (sensor)    vehicle-svc    Kafka    maintenance-svc    notification-svc    Maintenance staff
      │  telemetry data  │          │            │                  │                    │
      │  (mỗi 30s)       │          │            │                  │                    │
      │──────────────────►│          │            │                  │                    │
      │                   │ save     │            │                  │                    │
      │                   │ TimescaleDB           │                  │                    │
      │                   │          │            │                  │                    │
      │                   │ detect anomaly:       │                  │                    │
      │                   │ engine_temp > 100°C   │                  │                    │
      │                   │ OR tire_pressure < 7  │                  │                    │
      │                   │ OR fuel_level < 10%   │                  │                    │
      │                   │          │            │                  │                    │
      │                   │ publish  │            │                  │                    │
      │                   │─────────►│            │                  │                    │
      │                   │  brt.maintenance.alert│                  │                    │
      │                   │          │            │                  │                    │
      │                   │          │ consume    │                  │                    │
      │                   │          │───────────►│                  │                    │
      │                   │          │            │ auto create      │                    │
      │                   │          │            │ WorkOrder        │                    │
      │                   │          │            │ type=PREDICTIVE  │                    │
      │                   │          │            │ priority=HIGH    │                    │
      │                   │          │            │                  │                    │
      │                   │          │            │ publish          │                    │
      │                   │          │            │─────────────────►│                    │
      │                   │          │            │                  │ push notification  │
      │                   │          │            │                  │───────────────────►│
      │                   │          │            │                  │ "Xe 29B-001.03     │
      │                   │          │            │                  │  rung động bất     │
      │                   │          │            │                  │  thường - cần kiểm │
      │                   │          │            │                  │  tra drivetrain"    │
```

**3 loại work order:**
- SCHEDULED: bảo dưỡng định kỳ (theo km hoặc theo thời gian)
- EMERGENCY: sự cố đột xuất (từ incident)
- PREDICTIVE: phát hiện từ telemetry data bất thường

---

## Luồng 7: Dashboard Analytics

```
User         DashboardComp    Gateway    analytics-svc    TimescaleDB    Hive/HDFS
 │  mở dashboard   │            │             │               │             │
 │────────────────►│            │             │               │             │
 │                  │ GET /api/dashboard/stats │               │             │
 │                  │───────────►│             │               │             │
 │                  │            │────────────►│               │             │
 │                  │            │             │               │             │
 │                  │            │             │ REAL-TIME:    │             │
 │                  │            │             │ continuous    │             │
 │                  │            │             │ aggregate     │             │
 │                  │            │             │──────────────►│             │
 │                  │            │             │ activeVehicles│             │
 │                  │            │             │ passengersToday             │
 │                  │            │             │ revenueToday  │             │
 │                  │            │             │ activeIncidents│            │
 │                  │            │             │◄──────────────│             │
 │                  │            │             │               │             │
 │                  │            │             │ HISTORICAL:   │             │
 │                  │            │             │ Hive query    │             │
 │                  │            │             │───────────────────────────►│
 │                  │            │             │ passengersChange (vs hôm qua)
 │                  │            │             │ revenueChange (vs tuần trước)
 │                  │            │             │◄──────────────────────────│
 │                  │            │             │               │             │
 │                  │  DashboardStats          │               │             │
 │                  │◄───────────│◄────────────│               │             │
 │                  │            │             │               │             │
 │  render:         │            │             │               │             │
 │  - 12 stat cards │            │             │               │             │
 │  - passenger hourly chart                  │               │             │
 │  - route performance table                 │               │             │
 │  - vehicle map (Leaflet)                   │               │             │
 │  - headway monitoring                      │               │             │
 │  - trip details table                      │               │             │
 │◄─────────────────│            │             │               │             │
```

---

## Luồng 8: Data Pipeline Ingestion

```
GPS Device     NiFi            Kafka           HDFS          Kylo          Hive
    │  raw GPS      │              │              │             │             │
    │  data         │              │              │             │             │
    │──────────────►│              │              │             │             │
    │               │ parse,       │              │             │             │
    │               │ validate,    │              │             │             │
    │               │ enrich       │              │             │             │
    │               │              │              │             │             │
    │               │ produce      │              │             │             │
    │               │─────────────►│              │             │             │
    │               │  brt.gps.raw │              │             │             │
    │               │              │              │             │             │
    │               │              │ consume      │             │             │
    │               │              │ (batch 5min) │             │             │
    │               │              │─────────────►│             │             │
    │               │              │ write Parquet│             │             │
    │               │              │ /data/brt/gps/2025/02/20/  │             │
    │               │              │              │             │             │
    │               │              │              │ data feed   │             │
    │               │              │              │────────────►│             │
    │               │              │              │             │ schema      │
    │               │              │              │             │ validation  │
    │               │              │              │             │ profiling   │
    │               │              │              │             │ quality     │
    │               │              │              │             │ check       │
    │               │              │              │             │             │
    │               │              │              │             │ register    │
    │               │              │              │             │ in catalog  │
    │               │              │              │             │             │
    │               │              │              │             │ create Hive │
    │               │              │              │             │ external    │
    │               │              │              │             │ table       │
    │               │              │              │             │────────────►│
    │               │              │              │             │             │
    │               │              │              │             │ Ranger      │
    │               │              │              │             │ enforce     │
    │               │              │              │             │ access      │
    │               │              │              │             │ policy      │
```

**6 NiFi flows hiện có:**
1. GPS Data Collection Pipeline (1250 records/min)
2. Ticket Event Processing (85 records/min)
3. Vehicle Telemetry Ingestion (600 records/min)
4. Station Passenger Count (200 records/min)
5. HDFS Batch Export mỗi 5 phút
6. Alert Detection Pipeline (AI-based anomaly detection)

---

## Luồng 9: Quản lý ca làm việc tài xế

```
OPS_MANAGER    ShiftForm    Gateway    driver-svc    schedule-svc    PostgreSQL
    │  tạo ca        │         │           │              │              │
    │  (driver,      │         │           │              │              │
    │   shift type,  │         │           │              │              │
    │   route, time) │         │           │              │              │
    │───────────────►│         │           │              │              │
    │                │ POST /api/shifts    │              │              │
    │                │────────►│           │              │              │
    │                │         │──────────►│              │              │
    │                │         │           │ validate:    │              │
    │                │         │           │ - driver AVAILABLE?         │
    │                │         │           │ - license not expired?      │
    │                │         │           │ - no overlap shift?         │
    │                │         │           │──────────────────────────►│
    │                │         │           │              │              │
    │                │         │           │ INSERT shift │              │
    │                │         │           │──────────────────────────►│
    │                │         │           │              │              │
    │                │         │           │ Feign → schedule-svc       │
    │                │         │           │ link shift to trip         │
    │                │         │           │─────────────►│              │
    │                │         │           │              │ UPDATE trip  │
    │                │         │           │              │ set driver   │
    │                │         │           │              │─────────────►│
    │                │         │           │              │              │
    │                │  ShiftDto│           │              │              │
    │                │◄────────│◄──────────│              │              │
    │  xác nhận      │         │           │              │              │
    │◄───────────────│         │           │              │              │
```

**4 ca:** MORNING (05:00–13:00), AFTERNOON (13:00–21:00), EVENING (21:00–05:00), NIGHT (tuyến đêm)

**Validation rules:**
- Tài xế phải ở trạng thái AVAILABLE
- Bằng lái chưa hết hạn (`licenseExpiry > now()`)
- Không trùng ca (check overlap startTime–endTime)
- Nghỉ tối thiểu 8h giữa 2 ca

---

## Luồng 10: Xuất báo cáo doanh thu

```
FINANCE      RevenueComp    Gateway    ticket-svc    analytics-svc    Hive
   │  chọn khoảng    │         │           │              │             │
   │  thời gian       │         │           │              │             │
   │─────────────────►│         │           │              │             │
   │                  │ GET /api/revenue?from=...&to=...   │             │
   │                  │────────►│           │              │             │
   │                  │         │──────────►│              │             │
   │                  │         │           │ aggregate    │             │
   │                  │         │           │ transactions │             │
   │                  │         │           │ by ticket    │             │
   │                  │         │           │ type, route, │             │
   │                  │         │           │ payment      │             │
   │                  │         │           │              │             │
   │                  │         │           │ Feign →      │             │
   │                  │         │           │ analytics    │             │
   │                  │         │           │─────────────►│             │
   │                  │         │           │              │ Hive query  │
   │                  │         │           │              │ historical  │
   │                  │         │           │              │ comparison  │
   │                  │         │           │              │────────────►│
   │                  │         │           │              │◄────────────│
   │                  │         │           │◄─────────────│             │
   │                  │         │           │              │             │
   │                  │  RevenueReport[]    │              │             │
   │                  │◄────────│◄──────────│              │             │
   │  render:         │         │           │              │             │
   │  - tổng doanh thu│         │           │              │             │
   │  - chart by ticket type    │           │              │             │
   │  - chart by route│         │           │              │             │
   │  - chart by payment method │           │              │             │
   │  - export PDF/Excel        │           │              │             │
   │◄─────────────────│         │           │              │             │
```

**Revenue breakdown hiện tại (mock data ngày 20/02/2025):**
- Tổng doanh thu: 185.600.000 VNĐ
- 12.845 giao dịch
- Top ticket type: Vé lượt đơn (65.8M, 9.400 lượt)
- Top route: BRT-01 (78.5M)
- Top payment: MoMo (70.5M, 38%)
