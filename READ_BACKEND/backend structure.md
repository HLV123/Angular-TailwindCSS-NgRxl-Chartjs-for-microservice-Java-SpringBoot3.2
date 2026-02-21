# BRT Gestão — Backend Microservices Structure

Cấu trúc thư mục backend theo kiến trúc **microservices** cho hệ thống quản lý vận hành xe buýt nhanh BRT.

**Stack:** Spring Boot 3.2 · Spring Cloud · Spring Security 6 · Neo4j · PostgreSQL 16 + PostGIS + TimescaleDB · Kylo · Apache NiFi · Hadoop/HDFS · Hive · Ranger

---

## Tổng quan kiến trúc

```
                          ┌──────────────────┐
                          │   Angular 17     │
                          │   Frontend       │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │  API Gateway     │
                          │  (Spring Cloud)  │
                          │  :8080           │
                          └────────┬─────────┘
                                   │
              ┌──────────┬─────────┼─────────┬──────────┬──────────┐
              │          │         │         │          │          │
        ┌─────▼──┐ ┌─────▼──┐ ┌───▼────┐ ┌──▼───┐ ┌───▼────┐ ┌──▼─────────┐
        │ Auth   │ │ Route  │ │Vehicle │ │Ticket│ │Incident│ │  ...       │
        │ :8081  │ │ :8082  │ │ :8083  │ │:8084 │ │ :8085  │ │ (others)   │
        └────────┘ └────────┘ └────────┘ └──────┘ └────────┘ └────────────┘
              │          │         │         │          │
        ┌─────▼──────────▼─────────▼─────────▼──────────▼──────────┐
        │              Message Broker (Kafka / RabbitMQ)           │
        └──────────────────────────────────────────────────────────┘
```

---

## Cấu trúc thư mục gốc

```
brt-gestao-backend/
├── .gitignore
├── .env.example
├── README.md
├── pom.xml
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.infra.yml
├── Makefile
│
├── docs/
│   ├── architecture.md
│   ├── api-contracts/
│   │   ├── auth-service.yaml
│   │   ├── route-service.yaml
│   │   ├── vehicle-service.yaml
│   │   ├── station-service.yaml
│   │   ├── driver-service.yaml
│   │   ├── schedule-service.yaml
│   │   ├── ticket-service.yaml
│   │   ├── incident-service.yaml
│   │   ├── maintenance-service.yaml
│   │   ├── analytics-service.yaml
│   │   ├── notification-service.yaml
│   │   └── data-platform-service.yaml
│   ├── database/
│   │   ├── postgres-schema.sql
│   │   ├── neo4j-schema.cypher
│   │   └── timescaledb-hypertables.sql
│   └── postman/
│       └── BRT-Gestao.postman_collection.json
│
├── docker/
│   ├── postgres/
│   │   └── init.sql
│   ├── neo4j/
│   │   └── init.cypher
│   ├── kafka/
│   │   └── create-topics.sh
│   ├── nifi/
│   │   └── flow.xml.gz
│   ├── hadoop/
│   │   ├── core-site.xml
│   │   └── hdfs-site.xml
│   ├── hive/
│   │   └── hive-site.xml
│   ├── ranger/
│   │   └── ranger-admin-site.xml
│   └── kylo/
│       └── application.properties
│
├── infrastructure/
│   ├── config-server/
│   ├── discovery-server/
│   ├── api-gateway/
│   └── monitoring/
│
├── services/
│   ├── auth-service/
│   ├── route-service/
│   ├── vehicle-service/
│   ├── station-service/
│   ├── driver-service/
│   ├── schedule-service/
│   ├── ticket-service/
│   ├── incident-service/
│   ├── maintenance-service/
│   ├── analytics-service/
│   ├── notification-service/
│   ├── data-platform-service/
│   └── passenger-service/
│
└── shared/
    └── common-lib/
```

---

## Chi tiết `infrastructure/`

```
infrastructure/
│
├── config-server/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/
│       ├── resources/
│       │   ├── application.yml
│       │   └── configurations/
│       │       ├── auth-service.yml
│       │       ├── route-service.yml
│       │       ├── vehicle-service.yml
│       │       ├── station-service.yml
│       │       ├── driver-service.yml
│       │       ├── schedule-service.yml
│       │       ├── ticket-service.yml
│       │       ├── incident-service.yml
│       │       ├── maintenance-service.yml
│       │       ├── analytics-service.yml
│       │       ├── notification-service.yml
│       │       ├── data-platform-service.yml
│       │       └── passenger-service.yml
│       └── java/com/brtgestao/configserver/
│           └── ConfigServerApplication.java
│
├── discovery-server/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/
│       ├── resources/
│       │   └── application.yml
│       └── java/com/brtgestao/discovery/
│           └── DiscoveryServerApplication.java
│
├── api-gateway/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/
│       ├── resources/
│       │   └── application.yml
│       └── java/com/brtgestao/gateway/
│           ├── ApiGatewayApplication.java
│           ├── config/
│           │   ├── RouteConfig.java
│           │   ├── CorsGlobalConfig.java
│           │   ├── RateLimitConfig.java
│           │   └── SecurityConfig.java
│           └── filter/
│               ├── JwtAuthGatewayFilter.java
│               ├── LoggingFilter.java
│               └── RateLimitFilter.java
│
└── monitoring/
    ├── prometheus/
    │   └── prometheus.yml
    ├── grafana/
    │   └── dashboards/
    │       ├── brt-overview.json
    │       ├── vehicles-realtime.json
    │       └── service-health.json
    └── elk/
        ├── elasticsearch.yml
        ├── logstash.conf
        └── kibana.yml
```

---

## Chi tiết `shared/common-lib/`

```
shared/
└── common-lib/
    ├── pom.xml
    └── src/main/java/com/brtgestao/common/
        ├── dto/
        │   ├── ApiResponse.java
        │   ├── PaginatedResponse.java
        │   ├── DateRange.java
        │   └── SelectOption.java
        ├── enums/
        │   ├── UserRole.java
        │   ├── VehicleStatus.java
        │   ├── VehicleType.java
        │   ├── FuelType.java
        │   ├── StationType.java
        │   ├── RouteType.java
        │   ├── RouteStatus.java
        │   ├── DriverStatus.java
        │   ├── ShiftType.java
        │   ├── ScheduleType.java
        │   ├── ScheduleStatus.java
        │   ├── TripStatus.java
        │   ├── TripDirection.java
        │   ├── TicketValidityType.java
        │   ├── PaymentMethod.java
        │   ├── TransactionStatus.java
        │   ├── IncidentType.java
        │   ├── IncidentSeverity.java
        │   ├── IncidentStatus.java
        │   ├── WorkOrderType.java
        │   ├── WorkOrderPriority.java
        │   ├── WorkOrderStatus.java
        │   ├── NotificationType.java
        │   ├── NotificationChannel.java
        │   └── TargetAudience.java
        ├── event/
        │   ├── VehiclePositionEvent.java
        │   ├── TripStatusChangedEvent.java
        │   ├── IncidentCreatedEvent.java
        │   ├── TicketPurchasedEvent.java
        │   ├── MaintenanceAlertEvent.java
        │   ├── DispatchRequestEvent.java
        │   └── PassengerCountEvent.java
        ├── exception/
        │   ├── BaseException.java
        │   ├── ResourceNotFoundException.java
        │   ├── DuplicateResourceException.java
        │   ├── UnauthorizedException.java
        │   ├── ForbiddenException.java
        │   ├── ValidationException.java
        │   └── GlobalExceptionHandler.java
        ├── security/
        │   ├── JwtTokenUtil.java
        │   ├── SecurityContextUtil.java
        │   └── UserPrincipal.java
        └── util/
            ├── GeoJsonUtil.java
            ├── DateTimeUtil.java
            ├── SlugUtil.java
            └── PaginationUtil.java
```

---

## Chi tiết từng microservice trong `services/`

Mỗi service đều tuân theo cấu trúc Hexagonal / Clean Architecture. Dưới đây liệt kê đầy đủ.

---

### `auth-service/` — Port 8081

```
services/auth-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.yml
    │   │   └── db/migration/
    │   │       ├── V1__create_users.sql
    │   │       ├── V2__create_roles_permissions.sql
    │   │       └── V3__seed_default_users.sql
    │   └── java/com/brtgestao/auth/
    │       ├── AuthServiceApplication.java
    │       ├── config/
    │       │   ├── SecurityConfig.java
    │       │   └── JwtConfig.java
    │       ├── controller/
    │       │   ├── AuthController.java
    │       │   ├── UserController.java
    │       │   └── RoleController.java
    │       ├── dto/
    │       │   ├── LoginRequest.java
    │       │   ├── LoginResponse.java
    │       │   ├── RefreshTokenRequest.java
    │       │   ├── UserDto.java
    │       │   ├── UserCreateRequest.java
    │       │   ├── UserUpdateRequest.java
    │       │   ├── RoleDto.java
    │       │   ├── ChangePasswordRequest.java
    │       │   └── TwoFactorSetupResponse.java
    │       ├── entity/
    │       │   ├── User.java
    │       │   ├── Role.java
    │       │   ├── Permission.java
    │       │   └── RefreshToken.java
    │       ├── repository/
    │       │   ├── UserRepository.java
    │       │   ├── RoleRepository.java
    │       │   ├── PermissionRepository.java
    │       │   └── RefreshTokenRepository.java
    │       ├── service/
    │       │   ├── AuthService.java
    │       │   ├── AuthServiceImpl.java
    │       │   ├── UserService.java
    │       │   ├── UserServiceImpl.java
    │       │   ├── RoleService.java
    │       │   ├── RoleServiceImpl.java
    │       │   ├── JwtTokenProvider.java
    │       │   └── TwoFactorAuthService.java
    │       ├── security/
    │       │   ├── JwtAuthenticationFilter.java
    │       │   └── CustomUserDetailsService.java
    │       ├── mapper/
    │       │   ├── UserMapper.java
    │       │   └── RoleMapper.java
    │       └── exception/
    │           ├── InvalidCredentialsException.java
    │           └── TokenExpiredException.java
    └── test/
        └── java/com/brtgestao/auth/
            ├── controller/
            │   ├── AuthControllerTest.java
            │   └── UserControllerTest.java
            ├── service/
            │   ├── AuthServiceTest.java
            │   └── UserServiceTest.java
            └── repository/
                └── UserRepositoryTest.java
```

**Database:** PostgreSQL  
**API Prefix:** `/api/auth/**`, `/api/users/**`, `/api/roles/**`

---

### `route-service/` — Port 8082

```
services/route-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.yml
    │   │   └── db/migration/
    │   │       ├── V1__create_routes.sql
    │   │       ├── V2__create_route_stations.sql
    │   │       ├── V3__enable_postgis_geometry.sql
    │   │       └── V4__seed_routes.sql
    │   └── java/com/brtgestao/route/
    │       ├── RouteServiceApplication.java
    │       ├── config/
    │       │   ├── Neo4jConfig.java
    │       │   └── PostGisConfig.java
    │       ├── controller/
    │       │   ├── RouteController.java
    │       │   ├── ServiceZoneController.java
    │       │   └── RouteAnalyticsController.java
    │       ├── dto/
    │       │   ├── RouteDto.java
    │       │   ├── RouteCreateRequest.java
    │       │   ├── RouteUpdateRequest.java
    │       │   ├── RouteStationDto.java
    │       │   ├── RoutePerformanceDto.java
    │       │   ├── ServiceZoneDto.java
    │       │   ├── HeadwayDataDto.java
    │       │   └── GeoJsonLineStringDto.java
    │       ├── entity/
    │       │   ├── postgres/
    │       │   │   ├── Route.java
    │       │   │   ├── RouteStation.java
    │       │   │   └── ServiceZone.java
    │       │   └── neo4j/
    │       │       ├── RouteNode.java
    │       │       ├── StationNode.java
    │       │       └── ConnectsToRelationship.java
    │       ├── repository/
    │       │   ├── postgres/
    │       │   │   ├── RouteRepository.java
    │       │   │   ├── RouteStationRepository.java
    │       │   │   └── ServiceZoneRepository.java
    │       │   └── neo4j/
    │       │       ├── RouteGraphRepository.java
    │       │       └── StationGraphRepository.java
    │       ├── service/
    │       │   ├── RouteService.java
    │       │   ├── RouteServiceImpl.java
    │       │   ├── RouteGraphService.java
    │       │   ├── RouteGraphServiceImpl.java
    │       │   ├── ServiceZoneService.java
    │       │   ├── ServiceZoneServiceImpl.java
    │       │   ├── HeadwayCalculationService.java
    │       │   └── RouteOptimizationService.java
    │       ├── mapper/
    │       │   ├── RouteMapper.java
    │       │   └── ServiceZoneMapper.java
    │       └── client/
    │           ├── StationClient.java
    │           └── VehicleClient.java
    └── test/
        └── java/com/brtgestao/route/
            ├── controller/
            │   └── RouteControllerTest.java
            ├── service/
            │   ├── RouteServiceTest.java
            │   └── RouteGraphServiceTest.java
            └── repository/
                └── RouteGraphRepositoryTest.java
```

**Database:** PostgreSQL + PostGIS (geometry tuyến), Neo4j (graph quan hệ tuyến–trạm)  
**API Prefix:** `/api/routes/**`, `/api/zones/**`

---

### `vehicle-service/` — Port 8083

```
services/vehicle-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.yml
    │   │   └── db/migration/
    │   │       ├── V1__create_vehicles.sql
    │   │       ├── V2__create_vehicle_positions_hypertable.sql
    │   │       ├── V3__create_vehicle_telemetry_hypertable.sql
    │   │       └── V4__seed_vehicles.sql
    │   └── java/com/brtgestao/vehicle/
    │       ├── VehicleServiceApplication.java
    │       ├── config/
    │       │   ├── TimescaleDbConfig.java
    │       │   └── WebSocketConfig.java
    │       ├── controller/
    │       │   ├── VehicleController.java
    │       │   ├── VehiclePositionController.java
    │       │   └── TelemetryController.java
    │       ├── dto/
    │       │   ├── VehicleDto.java
    │       │   ├── VehicleCreateRequest.java
    │       │   ├── VehicleUpdateRequest.java
    │       │   ├── VehiclePositionDto.java
    │       │   └── VehicleTelemetryDto.java
    │       ├── entity/
    │       │   ├── Vehicle.java
    │       │   ├── VehiclePosition.java
    │       │   └── VehicleTelemetry.java
    │       ├── repository/
    │       │   ├── VehicleRepository.java
    │       │   ├── VehiclePositionRepository.java
    │       │   └── VehicleTelemetryRepository.java
    │       ├── service/
    │       │   ├── VehicleService.java
    │       │   ├── VehicleServiceImpl.java
    │       │   ├── VehiclePositionService.java
    │       │   ├── VehiclePositionServiceImpl.java
    │       │   ├── TelemetryService.java
    │       │   ├── TelemetryServiceImpl.java
    │       │   └── VehicleTrackingWebSocketHandler.java
    │       ├── mapper/
    │       │   └── VehicleMapper.java
    │       ├── listener/
    │       │   ├── VehiclePositionEventListener.java
    │       │   └── TelemetryEventListener.java
    │       └── client/
    │           └── RouteClient.java
    └── test/
        └── java/com/brtgestao/vehicle/
            ├── controller/
            │   └── VehicleControllerTest.java
            └── service/
                ├── VehicleServiceTest.java
                └── VehiclePositionServiceTest.java
```

**Database:** PostgreSQL + TimescaleDB (hypertable cho position & telemetry time-series)  
**API Prefix:** `/api/vehicles/**`, `/api/vehicle-positions/**`, `/api/telemetry/**`

---

### `station-service/` — Port 8084

```
services/station-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.yml
    │   │   └── db/migration/
    │   │       ├── V1__create_stations.sql
    │   │       ├── V2__enable_postgis_station_point.sql
    │   │       ├── V3__create_passenger_counts_hypertable.sql
    │   │       └── V4__seed_stations.sql
    │   └── java/com/brtgestao/station/
    │       ├── StationServiceApplication.java
    │       ├── controller/
    │       │   └── StationController.java
    │       ├── dto/
    │       │   ├── StationDto.java
    │       │   ├── StationCreateRequest.java
    │       │   ├── StationUpdateRequest.java
    │       │   └── StationPassengerCountDto.java
    │       ├── entity/
    │       │   ├── Station.java
    │       │   └── StationPassengerCount.java
    │       ├── repository/
    │       │   ├── StationRepository.java
    │       │   └── StationPassengerCountRepository.java
    │       ├── service/
    │       │   ├── StationService.java
    │       │   ├── StationServiceImpl.java
    │       │   ├── PassengerCountService.java
    │       │   └── PassengerCountServiceImpl.java
    │       ├── mapper/
    │       │   └── StationMapper.java
    │       └── listener/
    │           └── PassengerCountEventListener.java
    └── test/
        └── java/com/brtgestao/station/
            ├── controller/
            │   └── StationControllerTest.java
            └── service/
                └── StationServiceTest.java
```

**Database:** PostgreSQL + PostGIS (tọa độ trạm) + TimescaleDB (lượng khách theo thời gian)  
**API Prefix:** `/api/stations/**`

---

### `driver-service/` — Port 8085

```
services/driver-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.yml
    │   │   └── db/migration/
    │   │       ├── V1__create_drivers.sql
    │   │       ├── V2__create_driver_shifts.sql
    │   │       └── V3__seed_drivers.sql
    │   └── java/com/brtgestao/driver/
    │       ├── DriverServiceApplication.java
    │       ├── controller/
    │       │   ├── DriverController.java
    │       │   └── ShiftController.java
    │       ├── dto/
    │       │   ├── DriverDto.java
    │       │   ├── DriverCreateRequest.java
    │       │   ├── DriverUpdateRequest.java
    │       │   └── DriverShiftDto.java
    │       ├── entity/
    │       │   ├── Driver.java
    │       │   └── DriverShift.java
    │       ├── repository/
    │       │   ├── DriverRepository.java
    │       │   └── DriverShiftRepository.java
    │       ├── service/
    │       │   ├── DriverService.java
    │       │   ├── DriverServiceImpl.java
    │       │   ├── ShiftService.java
    │       │   └── ShiftServiceImpl.java
    │       └── mapper/
    │           └── DriverMapper.java
    └── test/
        └── java/com/brtgestao/driver/
            ├── controller/
            │   └── DriverControllerTest.java
            └── service/
                └── DriverServiceTest.java
```

**Database:** PostgreSQL  
**API Prefix:** `/api/drivers/**`, `/api/shifts/**`

---

### `schedule-service/` — Port 8086

```
services/schedule-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.yml
    │   │   └── db/migration/
    │   │       ├── V1__create_schedules.sql
    │   │       ├── V2__create_trips.sql
    │   │       ├── V3__create_dispatch_requests.sql
    │   │       └── V4__seed_schedules.sql
    │   └── java/com/brtgestao/schedule/
    │       ├── ScheduleServiceApplication.java
    │       ├── controller/
    │       │   ├── ScheduleController.java
    │       │   ├── TripController.java
    │       │   └── DispatchController.java
    │       ├── dto/
    │       │   ├── ScheduleDto.java
    │       │   ├── ScheduleCreateRequest.java
    │       │   ├── ScheduleUpdateRequest.java
    │       │   ├── TripDto.java
    │       │   ├── TripDetailDto.java
    │       │   └── DispatchRequestDto.java
    │       ├── entity/
    │       │   ├── Schedule.java
    │       │   ├── Trip.java
    │       │   └── DispatchRequest.java
    │       ├── repository/
    │       │   ├── ScheduleRepository.java
    │       │   ├── TripRepository.java
    │       │   └── DispatchRequestRepository.java
    │       ├── service/
    │       │   ├── ScheduleService.java
    │       │   ├── ScheduleServiceImpl.java
    │       │   ├── TripService.java
    │       │   ├── TripServiceImpl.java
    │       │   ├── DispatchService.java
    │       │   └── DispatchServiceImpl.java
    │       ├── mapper/
    │       │   ├── ScheduleMapper.java
    │       │   └── TripMapper.java
    │       ├── publisher/
    │       │   └── TripStatusEventPublisher.java
    │       └── client/
    │           ├── RouteClient.java
    │           ├── VehicleClient.java
    │           └── DriverClient.java
    └── test/
        └── java/com/brtgestao/schedule/
            ├── controller/
            │   └── ScheduleControllerTest.java
            └── service/
                ├── ScheduleServiceTest.java
                └── DispatchServiceTest.java
```

**Database:** PostgreSQL + TimescaleDB (trip time-series)  
**API Prefix:** `/api/schedules/**`, `/api/trips/**`, `/api/dispatch/**`

---

### `ticket-service/` — Port 8087

```
services/ticket-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.yml
    │   │   └── db/migration/
    │   │       ├── V1__create_ticket_types.sql
    │   │       ├── V2__create_ticket_transactions_hypertable.sql
    │   │       ├── V3__create_refunds.sql
    │   │       ├── V4__create_ewallets.sql
    │   │       ├── V5__create_wallet_transactions.sql
    │   │       └── V6__seed_ticket_types.sql
    │   └── java/com/brtgestao/ticket/
    │       ├── TicketServiceApplication.java
    │       ├── controller/
    │       │   ├── TicketTypeController.java
    │       │   ├── TicketTransactionController.java
    │       │   ├── RefundController.java
    │       │   ├── EWalletController.java
    │       │   └── RevenueController.java
    │       ├── dto/
    │       │   ├── TicketTypeDto.java
    │       │   ├── TicketTransactionDto.java
    │       │   ├── TicketPurchaseRequest.java
    │       │   ├── TicketRefundDto.java
    │       │   ├── EWalletDto.java
    │       │   ├── WalletTransactionDto.java
    │       │   └── RevenueReportDto.java
    │       ├── entity/
    │       │   ├── TicketType.java
    │       │   ├── TicketTransaction.java
    │       │   ├── TicketRefund.java
    │       │   ├── EWallet.java
    │       │   └── WalletTransaction.java
    │       ├── repository/
    │       │   ├── TicketTypeRepository.java
    │       │   ├── TicketTransactionRepository.java
    │       │   ├── TicketRefundRepository.java
    │       │   ├── EWalletRepository.java
    │       │   └── WalletTransactionRepository.java
    │       ├── service/
    │       │   ├── TicketTypeService.java
    │       │   ├── TicketTypeServiceImpl.java
    │       │   ├── TicketTransactionService.java
    │       │   ├── TicketTransactionServiceImpl.java
    │       │   ├── RefundService.java
    │       │   ├── RefundServiceImpl.java
    │       │   ├── EWalletService.java
    │       │   ├── EWalletServiceImpl.java
    │       │   ├── RevenueService.java
    │       │   ├── RevenueServiceImpl.java
    │       │   └── QrCodeGeneratorService.java
    │       ├── mapper/
    │       │   ├── TicketMapper.java
    │       │   └── WalletMapper.java
    │       └── publisher/
    │           └── TicketPurchasedEventPublisher.java
    └── test/
        └── java/com/brtgestao/ticket/
            ├── controller/
            │   └── TicketTransactionControllerTest.java
            └── service/
                ├── TicketTransactionServiceTest.java
                └── RevenueServiceTest.java
```

**Database:** PostgreSQL + TimescaleDB (transaction hypertable)  
**API Prefix:** `/api/ticket-types/**`, `/api/tickets/**`, `/api/refunds/**`, `/api/wallets/**`, `/api/revenue/**`

---

### `incident-service/` — Port 8088

```
services/incident-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.yml
    │   │   └── db/migration/
    │   │       ├── V1__create_incidents.sql
    │   │       └── V2__seed_incidents.sql
    │   └── java/com/brtgestao/incident/
    │       ├── IncidentServiceApplication.java
    │       ├── controller/
    │       │   └── IncidentController.java
    │       ├── dto/
    │       │   ├── IncidentDto.java
    │       │   ├── IncidentCreateRequest.java
    │       │   ├── IncidentUpdateRequest.java
    │       │   └── IncidentStatusUpdateRequest.java
    │       ├── entity/
    │       │   └── Incident.java
    │       ├── repository/
    │       │   └── IncidentRepository.java
    │       ├── service/
    │       │   ├── IncidentService.java
    │       │   └── IncidentServiceImpl.java
    │       ├── mapper/
    │       │   └── IncidentMapper.java
    │       ├── publisher/
    │       │   └── IncidentEventPublisher.java
    │       └── client/
    │           ├── VehicleClient.java
    │           ├── RouteClient.java
    │           └── StationClient.java
    └── test/
        └── java/com/brtgestao/incident/
            ├── controller/
            │   └── IncidentControllerTest.java
            └── service/
                └── IncidentServiceTest.java
```

**Database:** PostgreSQL  
**API Prefix:** `/api/incidents/**`

---

### `maintenance-service/` — Port 8089

```
services/maintenance-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.yml
    │   │   └── db/migration/
    │   │       ├── V1__create_work_orders.sql
    │   │       ├── V2__create_spare_parts.sql
    │   │       └── V3__seed_data.sql
    │   └── java/com/brtgestao/maintenance/
    │       ├── MaintenanceServiceApplication.java
    │       ├── controller/
    │       │   ├── WorkOrderController.java
    │       │   ├── SparePartController.java
    │       │   └── MaintenanceScheduleController.java
    │       ├── dto/
    │       │   ├── WorkOrderDto.java
    │       │   ├── WorkOrderCreateRequest.java
    │       │   ├── WorkOrderUpdateRequest.java
    │       │   ├── SparePartDto.java
    │       │   └── SparePartUpdateStockRequest.java
    │       ├── entity/
    │       │   ├── WorkOrder.java
    │       │   └── SparePart.java
    │       ├── repository/
    │       │   ├── WorkOrderRepository.java
    │       │   └── SparePartRepository.java
    │       ├── service/
    │       │   ├── WorkOrderService.java
    │       │   ├── WorkOrderServiceImpl.java
    │       │   ├── SparePartService.java
    │       │   ├── SparePartServiceImpl.java
    │       │   ├── MaintenanceScheduleService.java
    │       │   └── MaintenanceScheduleServiceImpl.java
    │       ├── mapper/
    │       │   ├── WorkOrderMapper.java
    │       │   └── SparePartMapper.java
    │       ├── publisher/
    │       │   └── MaintenanceAlertPublisher.java
    │       └── client/
    │           └── VehicleClient.java
    └── test/
        └── java/com/brtgestao/maintenance/
            ├── controller/
            │   └── WorkOrderControllerTest.java
            └── service/
                └── WorkOrderServiceTest.java
```

**Database:** PostgreSQL  
**API Prefix:** `/api/work-orders/**`, `/api/spare-parts/**`, `/api/maintenance-schedule/**`

---

### `analytics-service/` — Port 8090

```
services/analytics-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.yml
    │   │   └── hive/
    │   │       ├── passenger_hourly_query.hql
    │   │       ├── route_performance_query.hql
    │   │       ├── od_matrix_query.hql
    │   │       └── revenue_aggregation_query.hql
    │   └── java/com/brtgestao/analytics/
    │       ├── AnalyticsServiceApplication.java
    │       ├── config/
    │       │   ├── HiveConfig.java
    │       │   ├── HadoopConfig.java
    │       │   └── TimescaleDbConfig.java
    │       ├── controller/
    │       │   ├── DashboardController.java
    │       │   ├── NetworkAnalysisController.java
    │       │   ├── PassengerAnalysisController.java
    │       │   └── ReportController.java
    │       ├── dto/
    │       │   ├── DashboardStatsDto.java
    │       │   ├── PassengerHourlyDataDto.java
    │       │   ├── RoutePerformanceDto.java
    │       │   ├── ODMatrixEntryDto.java
    │       │   ├── NetworkAnalysisDto.java
    │       │   └── ReportExportRequest.java
    │       ├── repository/
    │       │   ├── DashboardRepository.java
    │       │   └── AnalyticsRepository.java
    │       ├── service/
    │       │   ├── DashboardService.java
    │       │   ├── DashboardServiceImpl.java
    │       │   ├── NetworkAnalysisService.java
    │       │   ├── NetworkAnalysisServiceImpl.java
    │       │   ├── PassengerAnalysisService.java
    │       │   ├── PassengerAnalysisServiceImpl.java
    │       │   ├── ReportService.java
    │       │   ├── ReportServiceImpl.java
    │       │   └── HiveQueryService.java
    │       ├── mapper/
    │       │   └── AnalyticsMapper.java
    │       └── client/
    │           ├── RouteClient.java
    │           ├── VehicleClient.java
    │           ├── TicketClient.java
    │           └── StationClient.java
    └── test/
        └── java/com/brtgestao/analytics/
            ├── controller/
            │   └── DashboardControllerTest.java
            └── service/
                ├── DashboardServiceTest.java
                └── HiveQueryServiceTest.java
```

**Database:** Hive (big data query), PostgreSQL + TimescaleDB (aggregation), HDFS (raw storage)  
**API Prefix:** `/api/dashboard/**`, `/api/analytics/**`, `/api/reports/**`

---

### `notification-service/` — Port 8091

```
services/notification-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.yml
    │   │   └── db/migration/
    │   │       ├── V1__create_notifications.sql
    │   │       ├── V2__create_audit_logs.sql
    │   │       └── V3__seed_notifications.sql
    │   └── java/com/brtgestao/notification/
    │       ├── NotificationServiceApplication.java
    │       ├── config/
    │       │   └── WebSocketConfig.java
    │       ├── controller/
    │       │   ├── NotificationController.java
    │       │   └── AuditLogController.java
    │       ├── dto/
    │       │   ├── NotificationDto.java
    │       │   ├── NotificationCreateRequest.java
    │       │   └── AuditLogDto.java
    │       ├── entity/
    │       │   ├── AppNotification.java
    │       │   └── AuditLog.java
    │       ├── repository/
    │       │   ├── NotificationRepository.java
    │       │   └── AuditLogRepository.java
    │       ├── service/
    │       │   ├── NotificationService.java
    │       │   ├── NotificationServiceImpl.java
    │       │   ├── AuditLogService.java
    │       │   ├── AuditLogServiceImpl.java
    │       │   ├── PushNotificationService.java
    │       │   ├── SmsNotificationService.java
    │       │   └── WebSocketNotificationHandler.java
    │       ├── mapper/
    │       │   ├── NotificationMapper.java
    │       │   └── AuditLogMapper.java
    │       └── listener/
    │           ├── IncidentEventListener.java
    │           ├── MaintenanceAlertListener.java
    │           ├── TripStatusListener.java
    │           └── AuditEventListener.java
    └── test/
        └── java/com/brtgestao/notification/
            ├── controller/
            │   └── NotificationControllerTest.java
            └── service/
                └── NotificationServiceTest.java
```

**Database:** PostgreSQL  
**API Prefix:** `/api/notifications/**`, `/api/audit-logs/**`

---

### `data-platform-service/` — Port 8092

```
services/data-platform-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   └── application.yml
    │   └── java/com/brtgestao/dataplatform/
    │       ├── DataPlatformServiceApplication.java
    │       ├── config/
    │       │   ├── NiFiConfig.java
    │       │   ├── KyloConfig.java
    │       │   ├── HadoopConfig.java
    │       │   └── RangerConfig.java
    │       ├── controller/
    │       │   ├── DataFlowController.java
    │       │   ├── DataCatalogController.java
    │       │   └── DataPlatformOverviewController.java
    │       ├── dto/
    │       │   ├── NiFiFlowStatusDto.java
    │       │   ├── KafkaTopicStatusDto.java
    │       │   ├── DataCatalogEntryDto.java
    │       │   ├── HdfsFileInfoDto.java
    │       │   └── DataPlatformOverviewDto.java
    │       ├── service/
    │       │   ├── NiFiIntegrationService.java
    │       │   ├── NiFiIntegrationServiceImpl.java
    │       │   ├── KafkaMonitorService.java
    │       │   ├── KafkaMonitorServiceImpl.java
    │       │   ├── KyloIntegrationService.java
    │       │   ├── KyloIntegrationServiceImpl.java
    │       │   ├── HdfsService.java
    │       │   ├── HdfsServiceImpl.java
    │       │   ├── RangerPolicyService.java
    │       │   └── RangerPolicyServiceImpl.java
    │       └── mapper/
    │           └── DataPlatformMapper.java
    └── test/
        └── java/com/brtgestao/dataplatform/
            └── service/
                ├── NiFiIntegrationServiceTest.java
                └── KafkaMonitorServiceTest.java
```

**Database:** Không có DB riêng — giao tiếp qua REST API với NiFi, Kylo, HDFS, Ranger  
**API Prefix:** `/api/data-platform/**`, `/api/data-flows/**`, `/api/data-catalog/**`

---

### `passenger-service/` — Port 8093

```
services/passenger-service/
├── pom.xml
├── Dockerfile
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.yml
    │   │   └── db/migration/
    │   │       ├── V1__create_passenger_feedback.sql
    │   │       └── V2__seed_feedback.sql
    │   └── java/com/brtgestao/passenger/
    │       ├── PassengerServiceApplication.java
    │       ├── controller/
    │       │   ├── PassengerPortalController.java
    │       │   └── FeedbackController.java
    │       ├── dto/
    │       │   ├── PassengerFeedbackDto.java
    │       │   ├── FeedbackCreateRequest.java
    │       │   ├── ODMatrixEntryDto.java
    │       │   └── PassengerPortalInfoDto.java
    │       ├── entity/
    │       │   └── PassengerFeedback.java
    │       ├── repository/
    │       │   └── PassengerFeedbackRepository.java
    │       ├── service/
    │       │   ├── FeedbackService.java
    │       │   ├── FeedbackServiceImpl.java
    │       │   ├── ODMatrixService.java
    │       │   └── ODMatrixServiceImpl.java
    │       ├── mapper/
    │       │   └── FeedbackMapper.java
    │       └── client/
    │           ├── RouteClient.java
    │           └── StationClient.java
    └── test/
        └── java/com/brtgestao/passenger/
            └── service/
                └── FeedbackServiceTest.java
```

**Database:** PostgreSQL  
**API Prefix:** `/api/passenger-portal/**`, `/api/feedback/**`

---

## API Gateway routing tổng hợp

| Gateway Path | Target Service | Port |
|---|---|---|
| `/api/auth/**`, `/api/users/**`, `/api/roles/**` | auth-service | 8081 |
| `/api/routes/**`, `/api/zones/**` | route-service | 8082 |
| `/api/vehicles/**`, `/api/vehicle-positions/**`, `/api/telemetry/**` | vehicle-service | 8083 |
| `/api/stations/**` | station-service | 8084 |
| `/api/drivers/**`, `/api/shifts/**` | driver-service | 8085 |
| `/api/schedules/**`, `/api/trips/**`, `/api/dispatch/**` | schedule-service | 8086 |
| `/api/ticket-types/**`, `/api/tickets/**`, `/api/refunds/**`, `/api/wallets/**`, `/api/revenue/**` | ticket-service | 8087 |
| `/api/incidents/**` | incident-service | 8088 |
| `/api/work-orders/**`, `/api/spare-parts/**`, `/api/maintenance-schedule/**` | maintenance-service | 8089 |
| `/api/dashboard/**`, `/api/analytics/**`, `/api/reports/**` | analytics-service | 8090 |
| `/api/notifications/**`, `/api/audit-logs/**` | notification-service | 8091 |
| `/api/data-platform/**`, `/api/data-flows/**`, `/api/data-catalog/**` | data-platform-service | 8092 |
| `/api/passenger-portal/**`, `/api/feedback/**` | passenger-service | 8093 |

---

## Database ownership

| Service | PostgreSQL | PostGIS | TimescaleDB | Neo4j | Hive/HDFS | External API |
|---|---|---|---|---|---|---|
| auth-service | ✅ | | | | | |
| route-service | ✅ | ✅ | | ✅ | | |
| vehicle-service | ✅ | | ✅ | | | |
| station-service | ✅ | ✅ | ✅ | | | |
| driver-service | ✅ | | | | | |
| schedule-service | ✅ | | ✅ | | | |
| ticket-service | ✅ | | ✅ | | | |
| incident-service | ✅ | | | | | |
| maintenance-service | ✅ | | | | | |
| analytics-service | ✅ | | ✅ | | ✅ | |
| notification-service | ✅ | | | | | |
| data-platform-service | | | | | | NiFi · Kylo · HDFS · Ranger |
| passenger-service | ✅ | | | | | |

---

## Event-driven communication (Kafka topics)

```
brt.vehicle.position.updated
brt.vehicle.telemetry.received
brt.trip.status.changed
brt.incident.created
brt.incident.status.changed
brt.ticket.purchased
brt.maintenance.alert
brt.dispatch.requested
brt.passenger.count.updated
brt.audit.event.logged
```
