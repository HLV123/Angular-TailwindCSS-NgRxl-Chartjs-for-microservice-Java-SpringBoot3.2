# Database Schema — BRT Gestão

13 PostgreSQL schemas (database-per-service) + Neo4j graph + Hive warehouse.
Tất cả DDL dưới đây được derive 1:1 từ 45 TypeScript interfaces trong frontend.

---

## Tổng quan

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         PostgreSQL 16 Instance                          │
│                                                                         │
│  brt_auth ── brt_route ── brt_vehicle ── brt_station ── brt_driver     │
│  brt_schedule ── brt_ticket ── brt_incident ── brt_maintenance         │
│  brt_notification ── brt_passenger                                      │
│                                                                         │
│  Extensions: PostGIS (route, station) · TimescaleDB (vehicle, station, │
│              schedule, ticket)                                          │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐   ┌──────────────────────────────────────────────┐
│   Neo4j 5 Instance   │   │          Hive (on HDFS)                      │
│   Route ↔ Station    │   │   brt_warehouse.gps_raw                     │
│   graph model        │   │   brt_warehouse.telemetry_raw               │
└──────────────────────┘   │   brt_warehouse.ticket_events               │
                           │   brt_warehouse.passenger_counts             │
                           └──────────────────────────────────────────────┘
```

| Service | Database | Tables | PostGIS | TimescaleDB |
|---|---|:---:|:---:|:---:|
| auth-service | brt_auth | 4 | | |
| route-service | brt_route | 4 (+Neo4j) | ✅ | |
| vehicle-service | brt_vehicle | 3 | | ✅ |
| station-service | brt_station | 2 | ✅ | ✅ |
| driver-service | brt_driver | 2 | | |
| schedule-service | brt_schedule | 3 | | ✅ |
| ticket-service | brt_ticket | 5 | | ✅ |
| incident-service | brt_incident | 1 | | |
| maintenance-service | brt_maintenance | 2 | | |
| notification-service | brt_notification | 2 | | |
| passenger-service | brt_passenger | 1 | | |
| **Tổng** | **11 databases** | **29 tables** | | |

---

## 1. `brt_auth` — Auth Service (Port 8081)

Mapping từ: `interface User`, `MOCK_USERS` (7 records), `MOCK_CREDENTIALS` (7 records)

```sql
CREATE TABLE users (
    id                  VARCHAR(20)  PRIMARY KEY,             -- u-001
    username            VARCHAR(50)  NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,                -- bcrypt
    email               VARCHAR(100) NOT NULL UNIQUE,
    full_name           VARCHAR(100) NOT NULL,
    role                VARCHAR(20)  NOT NULL,                -- ADMIN, OPS_MANAGER, DISPATCHER, DRIVER, MAINTENANCE, ANALYST, FINANCE
    avatar              VARCHAR(500),
    phone               VARCHAR(20),
    department          VARCHAR(50),
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login          TIMESTAMPTZ,
    two_factor_enabled  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
    id          VARCHAR(20)  PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description VARCHAR(200),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
    id       SERIAL       PRIMARY KEY,
    role_id  VARCHAR(20)  NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    resource VARCHAR(100) NOT NULL,                          -- routes, vehicles, incidents, ...
    action   VARCHAR(20)  NOT NULL,                          -- READ, CREATE, UPDATE, DELETE
    UNIQUE(role_id, resource, action)
);

CREATE TABLE refresh_tokens (
    id         VARCHAR(50)  PRIMARY KEY,
    user_id    VARCHAR(20)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ  NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role       ON users(role);
CREATE INDEX idx_users_active     ON users(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_rtoken_user      ON refresh_tokens(user_id);
CREATE INDEX idx_rtoken_expires   ON refresh_tokens(expires_at);
```

---

## 2. `brt_route` — Route Service (Port 8082)

Mapping từ: `interface BrtRoute` (5 records), `RouteStation`, `ServiceZone` (5 records)

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE routes (
    id                  VARCHAR(20)  PRIMARY KEY,             -- r-001
    code                VARCHAR(20)  NOT NULL UNIQUE,         -- BRT-01
    name                VARCHAR(100) NOT NULL,
    description         TEXT,
    route_type          VARCHAR(20)  NOT NULL,                -- MAIN, BRANCH, NIGHT, SPECIAL
    status              VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',-- ACTIVE, INACTIVE, DRAFT, SUSPENDED
    total_length_km     NUMERIC(6,2),
    avg_travel_time_min INTEGER,
    geometry            GEOMETRY(LINESTRING, 4326),           -- ★ PostGIS
    service_zone_id     VARCHAR(20),
    color               VARCHAR(10),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE route_stations (
    id                        SERIAL       PRIMARY KEY,
    route_id                  VARCHAR(20)  NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    station_id                VARCHAR(20)  NOT NULL,
    station_name              VARCHAR(100) NOT NULL,
    station_code              VARCHAR(10)  NOT NULL,
    station_order             INTEGER      NOT NULL,
    distance_from_start_km    NUMERIC(6,2) NOT NULL DEFAULT 0,
    travel_time_from_prev_min INTEGER      NOT NULL DEFAULT 0,
    lat                       NUMERIC(10,7) NOT NULL,
    lng                       NUMERIC(10,7) NOT NULL,
    UNIQUE(route_id, station_id),
    UNIQUE(route_id, station_order)
);

CREATE TABLE service_zones (
    id               VARCHAR(20)  PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    type             VARCHAR(20),                             -- CENTER, SUBURB, INDUSTRIAL, RESIDENTIAL
    population       INTEGER,
    area_sq_km       NUMERIC(8,2),
    coverage_percent NUMERIC(5,2),
    station_count    INTEGER,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE zone_routes (
    zone_id  VARCHAR(20) NOT NULL REFERENCES service_zones(id) ON DELETE CASCADE,
    route_id VARCHAR(20) NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    PRIMARY KEY (zone_id, route_id)
);

CREATE INDEX idx_routes_status ON routes(status);
CREATE INDEX idx_routes_type   ON routes(route_type);
CREATE INDEX idx_routes_geo    ON routes USING GIST(geometry);
CREATE INDEX idx_rs_route      ON route_stations(route_id);
CREATE INDEX idx_rs_station    ON route_stations(station_id);
```

### Neo4j Schema (cùng route-service)

```cypher
CREATE CONSTRAINT route_id_unique  IF NOT EXISTS FOR (r:Route)   REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT station_id_unique IF NOT EXISTS FOR (s:Station) REQUIRE s.id IS UNIQUE;

// Nodes
// (:Route   {id, code, name, routeType, status, totalLengthKm, color})
// (:Station {id, code, name, nameEn, lat, lng, district, stationType})

// Relationships
// (:Route)-[:HAS_STATION {order, distanceFromStartKm}]->(:Station)
// (:Station)-[:CONNECTS_TO {travelTimeMin, distanceKm}]->(:Station)

// ★ Tìm đường ngắn nhất giữa 2 trạm
MATCH path = shortestPath((a:Station {id:'s-001'})-[:CONNECTS_TO*]-(b:Station {id:'s-011'}))
RETURN path, reduce(t=0, r IN relationships(path) | t + r.travelTimeMin) AS totalMin;

// ★ Transfer Hub detection
MATCH (s:Station)<-[:HAS_STATION]-(r:Route)
WITH s, count(r) AS cnt, collect(r.code) AS routes
WHERE cnt > 1
RETURN s.name, cnt, routes;
```

---

## 3. `brt_vehicle` — Vehicle Service (Port 8083)

Mapping từ: `interface Vehicle` (12 records), `VehiclePosition` (7), `VehicleTelemetry` (5)

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE vehicles (
    id                    VARCHAR(20)  PRIMARY KEY,
    plate_number          VARCHAR(20)  NOT NULL UNIQUE,
    vehicle_type          VARCHAR(20)  NOT NULL,              -- ARTICULATED, STANDARD, MINI, ELECTRIC
    capacity_seated       INTEGER      NOT NULL,
    capacity_standing     INTEGER      NOT NULL,
    fuel_type             VARCHAR(20)  NOT NULL,              -- DIESEL, CNG, ELECTRIC, HYBRID
    manufacturer          VARCHAR(50),
    model                 VARCHAR(50),
    manufacture_year      INTEGER,
    current_status        VARCHAR(30)  NOT NULL DEFAULT 'REGISTERED',
                                                             -- ACTIVE, IDLE, MAINTENANCE_REQUIRED,
                                                             -- UNDER_REPAIR, DECOMMISSIONED, REGISTERED
    current_route_id      VARCHAR(20),
    current_route_name    VARCHAR(100),
    current_driver_id     VARCHAR(20),
    current_driver_name   VARCHAR(100),
    total_km              NUMERIC(10,1) NOT NULL DEFAULT 0,
    last_maintenance_km   NUMERIC(10,1) NOT NULL DEFAULT 0,
    last_maintenance_date TIMESTAMPTZ,
    gps_device_id         VARCHAR(20),
    has_camera            BOOLEAN NOT NULL DEFAULT FALSE,
    has_ticket_scanner    BOOLEAN NOT NULL DEFAULT FALSE,
    has_info_display      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ★ TimescaleDB Hypertable: GPS mỗi 5 giây
CREATE TABLE vehicle_positions (
    time       TIMESTAMPTZ   NOT NULL,
    vehicle_id VARCHAR(20)   NOT NULL,
    lat        NUMERIC(10,7) NOT NULL,
    lng        NUMERIC(10,7) NOT NULL,
    speed      NUMERIC(5,1),
    heading    NUMERIC(5,1),
    trip_id    VARCHAR(20),
    status     VARCHAR(20)                                   -- ON_TIME, SLIGHTLY_DELAYED, HEAVILY_DELAYED
);
SELECT create_hypertable('vehicle_positions', 'time',
    chunk_time_interval => INTERVAL '1 hour');

-- ★ TimescaleDB Hypertable: telemetry mỗi 30 giây
CREATE TABLE vehicle_telemetry (
    time             TIMESTAMPTZ NOT NULL,
    vehicle_id       VARCHAR(20) NOT NULL,
    fuel_level       NUMERIC(5,1),                           -- %
    engine_temp      NUMERIC(5,1),                           -- °C
    battery_voltage  NUMERIC(6,1),                           -- V (24V CNG/Diesel, 380V Electric)
    tire_pressure_fl NUMERIC(4,1),                           -- bar
    tire_pressure_fr NUMERIC(4,1),
    tire_pressure_rl NUMERIC(4,1),
    tire_pressure_rr NUMERIC(4,1),
    odometer         NUMERIC(10,1),
    ac_status        BOOLEAN
);
SELECT create_hypertable('vehicle_telemetry', 'time',
    chunk_time_interval => INTERVAL '1 hour');

CREATE INDEX idx_vehicles_status ON vehicles(current_status);
CREATE INDEX idx_vehicles_route  ON vehicles(current_route_id);
CREATE INDEX idx_vp_vehicle_time ON vehicle_positions(vehicle_id, time DESC);
CREATE INDEX idx_vt_vehicle_time ON vehicle_telemetry(vehicle_id, time DESC);

-- ★ Compression + Retention
ALTER TABLE vehicle_positions SET (timescaledb.compress, timescaledb.compress_segmentby = 'vehicle_id');
SELECT add_compression_policy('vehicle_positions', INTERVAL '7 days');
SELECT add_retention_policy('vehicle_positions', INTERVAL '90 days');

ALTER TABLE vehicle_telemetry SET (timescaledb.compress, timescaledb.compress_segmentby = 'vehicle_id');
SELECT add_compression_policy('vehicle_telemetry', INTERVAL '7 days');
SELECT add_retention_policy('vehicle_telemetry', INTERVAL '90 days');

-- ★ Continuous aggregate: vị trí mới nhất mỗi xe
CREATE MATERIALIZED VIEW vehicle_latest_position
WITH (timescaledb.continuous) AS
SELECT vehicle_id,
       last(lat, time) AS lat, last(lng, time) AS lng,
       last(speed, time) AS speed, last(status, time) AS status,
       max(time) AS last_seen
FROM vehicle_positions
GROUP BY vehicle_id, time_bucket('1 minute', time);
```

---

## 4. `brt_station` — Station Service (Port 8084)

Mapping từ: `interface Station` (8 records), `StationPassengerCount` (31 records)

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE stations (
    id                   VARCHAR(20)  PRIMARY KEY,
    code                 VARCHAR(10)  NOT NULL UNIQUE,
    name                 VARCHAR(100) NOT NULL,
    name_en              VARCHAR(100),
    location             GEOMETRY(POINT, 4326),               -- ★ PostGIS
    address              VARCHAR(200),
    district             VARCHAR(50),
    ward                 VARCHAR(50),
    station_type         VARCHAR(20)  NOT NULL,               -- INLINE, SIDE, TERMINAL, TRANSFER_HUB
    gate_count           INTEGER      NOT NULL DEFAULT 2,
    platform_length      NUMERIC(5,1),
    has_cover            BOOLEAN NOT NULL DEFAULT TRUE,
    has_ticket_machine   BOOLEAN NOT NULL DEFAULT FALSE,
    has_realtime_display BOOLEAN NOT NULL DEFAULT FALSE,
    has_wifi             BOOLEAN NOT NULL DEFAULT FALSE,
    has_toilet           BOOLEAN NOT NULL DEFAULT FALSE,
    has_elevator         BOOLEAN NOT NULL DEFAULT FALSE,
    bike_parking         BOOLEAN NOT NULL DEFAULT FALSE,
    taxi_stand           BOOLEAN NOT NULL DEFAULT FALSE,
    metro_connection     BOOLEAN NOT NULL DEFAULT FALSE,
    status               VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    capacity             INTEGER,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ★ TimescaleDB Hypertable: đếm khách mỗi phút
CREATE TABLE station_passenger_counts (
    time                   TIMESTAMPTZ NOT NULL,
    station_id             VARCHAR(20) NOT NULL,
    count_in               INTEGER     NOT NULL DEFAULT 0,
    count_out              INTEGER     NOT NULL DEFAULT 0,
    cumulative_on_platform INTEGER     NOT NULL DEFAULT 0
);
SELECT create_hypertable('station_passenger_counts', 'time',
    chunk_time_interval => INTERVAL '1 hour');

CREATE INDEX idx_stations_location ON stations USING GIST(location);
CREATE INDEX idx_stations_type     ON stations(station_type);
CREATE INDEX idx_spc_station_time  ON station_passenger_counts(station_id, time DESC);

-- ★ Continuous aggregate: tổng khách theo giờ
CREATE MATERIALIZED VIEW station_hourly_summary
WITH (timescaledb.continuous) AS
SELECT station_id,
       time_bucket('1 hour', time) AS hour,
       sum(count_in) AS total_in, sum(count_out) AS total_out,
       last(cumulative_on_platform, time) AS platform_count
FROM station_passenger_counts
GROUP BY station_id, time_bucket('1 hour', time);
```

---

## 5. `brt_driver` — Driver Service (Port 8085)

Mapping từ: `interface Driver` (8 records), `DriverShift` (8 records)

```sql
CREATE TABLE drivers (
    id                     VARCHAR(20)  PRIMARY KEY,
    full_name              VARCHAR(100) NOT NULL,
    employee_code          VARCHAR(20)  NOT NULL UNIQUE,
    national_id            VARCHAR(20)  NOT NULL UNIQUE,
    phone                  VARCHAR(20),
    email                  VARCHAR(100),
    address                TEXT,
    avatar                 VARCHAR(500),
    license_number         VARCHAR(20)  NOT NULL,
    license_class          VARCHAR(5)   NOT NULL,
    license_expiry         DATE         NOT NULL,
    license_authority      VARCHAR(100),
    hire_date              DATE         NOT NULL,
    department             VARCHAR(50),
    rank                   VARCHAR(50),
    status                 VARCHAR(20)  NOT NULL DEFAULT 'AVAILABLE',
                                                             -- AVAILABLE, ON_DUTY, OFF_DUTY, ON_LEAVE, SUSPENDED
    certifications         TEXT[],                            -- ★ PostgreSQL array
    health_check_date      DATE,
    health_check_result    VARCHAR(20),
    next_health_check_date DATE,
    total_trips            INTEGER      NOT NULL DEFAULT 0,
    otp_score              NUMERIC(5,1) NOT NULL DEFAULT 0,
    rating                 NUMERIC(3,1) NOT NULL DEFAULT 0,
    violation_count        INTEGER      NOT NULL DEFAULT 0,
    eco_score              NUMERIC(5,1) NOT NULL DEFAULT 0,
    current_vehicle_id     VARCHAR(20),
    current_route_id       VARCHAR(20),
    created_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE driver_shifts (
    id            VARCHAR(20)  PRIMARY KEY,
    driver_id     VARCHAR(20)  NOT NULL REFERENCES drivers(id),
    driver_name   VARCHAR(100) NOT NULL,
    shift_type    VARCHAR(20)  NOT NULL,                      -- MORNING, AFTERNOON, EVENING, NIGHT
    start_time    TIMESTAMPTZ  NOT NULL,
    end_time      TIMESTAMPTZ  NOT NULL,
    route_id      VARCHAR(20)  NOT NULL,
    route_name    VARCHAR(100),
    vehicle_id    VARCHAR(20),
    vehicle_plate VARCHAR(20),
    status        VARCHAR(20)  NOT NULL DEFAULT 'SCHEDULED',  -- SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_shift_time CHECK (end_time > start_time)
);

CREATE INDEX idx_drivers_status      ON drivers(status);
CREATE INDEX idx_drivers_license_exp ON drivers(license_expiry);
CREATE INDEX idx_shifts_driver       ON driver_shifts(driver_id);
CREATE INDEX idx_shifts_date         ON driver_shifts(start_time);
CREATE INDEX idx_shifts_status       ON driver_shifts(status);
```

---

## 6. `brt_schedule` — Schedule Service (Port 8086)

Mapping từ: `interface Schedule` (3), `TripDetail` (10), `DispatchRequest` (3)

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE schedules (
    id                     VARCHAR(20)  PRIMARY KEY,
    route_id               VARCHAR(20)  NOT NULL,
    route_name             VARCHAR(100),
    route_code             VARCHAR(20),
    operating_hours_start  VARCHAR(5)   NOT NULL,
    operating_hours_end    VARCHAR(5)   NOT NULL,
    peak_frequency_min     INTEGER      NOT NULL,
    normal_frequency_min   INTEGER      NOT NULL,
    off_peak_frequency_min INTEGER      NOT NULL,
    required_vehicles      INTEGER      NOT NULL,
    required_drivers       INTEGER      NOT NULL,
    effective_date         DATE         NOT NULL,
    end_date               DATE,
    schedule_type          VARCHAR(20)  NOT NULL,             -- WEEKDAY, WEEKEND, HOLIDAY, SPECIAL_EVENT
    status                 VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    created_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ★ TimescaleDB: trips partitioned by time
CREATE TABLE trips (
    scheduled_start   TIMESTAMPTZ  NOT NULL,
    id                VARCHAR(20)  NOT NULL,
    trip_number       VARCHAR(30)  NOT NULL,
    route_id          VARCHAR(20)  NOT NULL,
    route_code        VARCHAR(20),
    schedule_id       VARCHAR(20),
    vehicle_id        VARCHAR(20),
    vehicle_plate     VARCHAR(20),
    driver_id         VARCHAR(20),
    driver_name       VARCHAR(100),
    direction         VARCHAR(10)  NOT NULL,                  -- OUTBOUND, INBOUND
    scheduled_arrival TIMESTAMPTZ,
    actual_departure  TIMESTAMPTZ,
    actual_arrival    TIMESTAMPTZ,
    status            VARCHAR(20)  NOT NULL DEFAULT 'SCHEDULED',
    passengers        INTEGER      NOT NULL DEFAULT 0,
    delay_minutes     INTEGER      NOT NULL DEFAULT 0,
    UNIQUE(id, scheduled_start)
);
SELECT create_hypertable('trips', 'scheduled_start',
    chunk_time_interval => INTERVAL '1 day');

CREATE TABLE dispatch_requests (
    id                     VARCHAR(20)  PRIMARY KEY,
    type                   VARCHAR(20)  NOT NULL,             -- EMERGENCY, SUPPLEMENT, REPLACEMENT
    route_id               VARCHAR(20)  NOT NULL,
    route_name             VARCHAR(100),
    reason                 TEXT         NOT NULL,
    requested_by           VARCHAR(100),
    status                 VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    assigned_vehicle_id    VARCHAR(20),
    assigned_vehicle_plate VARCHAR(20),
    assigned_driver_id     VARCHAR(20),
    assigned_driver_name   VARCHAR(100),
    created_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_schedules_route  ON schedules(route_id);
CREATE INDEX idx_schedules_status ON schedules(status);
CREATE INDEX idx_trips_route      ON trips(route_id, scheduled_start DESC);
CREATE INDEX idx_trips_status     ON trips(status, scheduled_start DESC);
CREATE INDEX idx_dispatch_status  ON dispatch_requests(status);
```

---

## 7. `brt_ticket` — Ticket Service (Port 8087)

Mapping từ: `TicketType` (7), `TicketTransaction` (10), `TicketRefund` (3), `EWallet` (1), `WalletTransaction` (5)

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE ticket_types (
    id                VARCHAR(20)   PRIMARY KEY,
    name              VARCHAR(100)  NOT NULL,
    code              VARCHAR(20)   NOT NULL UNIQUE,
    description       TEXT,
    price             NUMERIC(12,0) NOT NULL,                 -- VNĐ
    validity_type     VARCHAR(20)   NOT NULL,
    validity_duration VARCHAR(50),
    validity_days     INTEGER,
    discount          NUMERIC(5,2)  NOT NULL DEFAULT 0,
    is_active         BOOLEAN       NOT NULL DEFAULT TRUE,
    max_uses_per_day  INTEGER,
    max_trips         INTEGER,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ★ TimescaleDB Hypertable: giao dịch vé
CREATE TABLE ticket_transactions (
    time             TIMESTAMPTZ   NOT NULL,
    id               VARCHAR(20)   NOT NULL,
    ticket_type_id   VARCHAR(20)   NOT NULL,
    ticket_type_name VARCHAR(100),
    passenger_id     VARCHAR(20),
    amount           NUMERIC(12,0) NOT NULL,
    payment_method   VARCHAR(20)   NOT NULL,                  -- MOMO, VNPAY, BANK_CARD, BRT_WALLET, CASH
    status           VARCHAR(20)   NOT NULL,                  -- COMPLETED, PENDING, FAILED, REFUNDED
    qr_code          VARCHAR(500),
    used_at          TIMESTAMPTZ,
    station_id       VARCHAR(20),
    station_name     VARCHAR(100),
    route_id         VARCHAR(20),
    UNIQUE(id, time)
);
SELECT create_hypertable('ticket_transactions', 'time',
    chunk_time_interval => INTERVAL '1 day');

CREATE TABLE ticket_refunds (
    id               VARCHAR(20)   PRIMARY KEY,
    transaction_id   VARCHAR(20)   NOT NULL,
    ticket_type_name VARCHAR(100),
    amount           NUMERIC(12,0) NOT NULL,
    reason           TEXT          NOT NULL,
    status           VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    requested_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    processed_at     TIMESTAMPTZ,
    processed_by     VARCHAR(100)
);

CREATE TABLE ewallets (
    id                    VARCHAR(20)   PRIMARY KEY,
    passenger_name        VARCHAR(100)  NOT NULL,
    phone                 VARCHAR(20)   NOT NULL UNIQUE,
    balance               NUMERIC(12,0) NOT NULL DEFAULT 0,
    auto_top_up           BOOLEAN       NOT NULL DEFAULT FALSE,
    auto_top_up_threshold NUMERIC(12,0),
    auto_top_up_amount    NUMERIC(12,0),
    created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
    id          VARCHAR(20)   PRIMARY KEY,
    wallet_id   VARCHAR(20)   NOT NULL REFERENCES ewallets(id),
    type        VARCHAR(20)   NOT NULL,                       -- TOP_UP, PURCHASE, REFUND, TRANSFER
    amount      NUMERIC(12,0) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_txn_status    ON ticket_transactions(status, time DESC);
CREATE INDEX idx_txn_payment   ON ticket_transactions(payment_method, time DESC);
CREATE INDEX idx_refund_status ON ticket_refunds(status);
CREATE INDEX idx_wtxn_wallet   ON wallet_transactions(wallet_id, created_at DESC);

-- ★ Continuous aggregate: doanh thu theo giờ
CREATE MATERIALIZED VIEW revenue_hourly
WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', time) AS hour,
       ticket_type_id, payment_method,
       count(*) AS txn_count, sum(amount) AS total_revenue
FROM ticket_transactions
WHERE status = 'COMPLETED'
GROUP BY time_bucket('1 hour', time), ticket_type_id, payment_method;
```

---

## 8. `brt_incident` — Incident Service (Port 8088)

Mapping từ: `interface Incident` + 14 `IncidentType` values + `MOCK_INCIDENTS` (5 records)

```sql
CREATE TABLE incidents (
    id               VARCHAR(20)  PRIMARY KEY,
    code             VARCHAR(30)  NOT NULL UNIQUE,            -- INC-20250220-001
    type             VARCHAR(30)  NOT NULL,                   -- ACCIDENT, BREAKDOWN, DELAY, OVERCROWDING,
                                                             -- EQUIPMENT_FAILURE, SPEEDING, OFF_ROUTE,
                                                             -- BUNCHING, ABNORMAL_STOP, LOW_BATTERY,
                                                             -- DEVICE_OFFLINE, AC_FAILURE,
                                                             -- PASSENGER_COMPLAINT, OTHER
    severity         VARCHAR(5)   NOT NULL,                   -- P1, P2, P3, P4
    title            VARCHAR(200) NOT NULL,
    description      TEXT,
    status           VARCHAR(20)  NOT NULL DEFAULT 'OPEN',    -- OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED
    reported_by      VARCHAR(100),
    reported_by_role VARCHAR(20),
    assigned_to      VARCHAR(20),
    assigned_to_name VARCHAR(100),
    vehicle_id       VARCHAR(20),
    vehicle_plate    VARCHAR(20),
    route_id         VARCHAR(20),
    route_name       VARCHAR(100),
    station_id       VARCHAR(20),
    station_name     VARCHAR(100),
    lat              NUMERIC(10,7),
    lng              NUMERIC(10,7),
    resolution       TEXT,
    images           TEXT[],                                  -- ★ PostgreSQL array
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    resolved_at      TIMESTAMPTZ
);

CREATE INDEX idx_inc_status   ON incidents(status);
CREATE INDEX idx_inc_severity ON incidents(severity);
CREATE INDEX idx_inc_type     ON incidents(type);
CREATE INDEX idx_inc_vehicle  ON incidents(vehicle_id);
CREATE INDEX idx_inc_route    ON incidents(route_id);
CREATE INDEX idx_inc_created  ON incidents(created_at DESC);
```

---

## 9. `brt_maintenance` — Maintenance Service (Port 8089)

Mapping từ: `interface WorkOrder` (6 records), `SparePart` (6 records)

```sql
CREATE TABLE work_orders (
    id                       VARCHAR(20)   PRIMARY KEY,
    code                     VARCHAR(30)   NOT NULL UNIQUE,
    vehicle_id               VARCHAR(20)   NOT NULL,
    vehicle_plate            VARCHAR(20),
    type                     VARCHAR(20)   NOT NULL,          -- SCHEDULED, EMERGENCY, PREDICTIVE
    priority                 VARCHAR(10)   NOT NULL,          -- LOW, MEDIUM, HIGH, CRITICAL
    description              TEXT          NOT NULL,
    status                   VARCHAR(20)   NOT NULL DEFAULT 'OPEN',
                                                             -- OPEN, IN_PROGRESS, WAITING_PARTS,
                                                             -- COMPLETED, INSPECTING, CLOSED
    assigned_technician_id   VARCHAR(20),
    assigned_technician_name VARCHAR(100),
    estimated_cost           NUMERIC(12,0),
    labor_cost               NUMERIC(12,0) NOT NULL DEFAULT 0,
    parts_cost               NUMERIC(12,0) NOT NULL DEFAULT 0,
    downtime_hours           NUMERIC(6,1)  NOT NULL DEFAULT 0,
    maintenance_type         VARCHAR(100),
    scheduled_date           DATE,
    completed_date           DATE,
    notes                    TEXT,
    created_at               TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE spare_parts (
    id                VARCHAR(20)   PRIMARY KEY,
    code              VARCHAR(20)   NOT NULL UNIQUE,
    name              VARCHAR(100)  NOT NULL,
    category          VARCHAR(50)   NOT NULL,
    supplier          VARCHAR(100),
    current_stock     INTEGER       NOT NULL DEFAULT 0,
    min_stock         INTEGER       NOT NULL DEFAULT 0,
    unit_price        NUMERIC(12,0) NOT NULL,
    last_restock_date DATE
);

CREATE INDEX idx_wo_status   ON work_orders(status);
CREATE INDEX idx_wo_vehicle  ON work_orders(vehicle_id);
CREATE INDEX idx_wo_priority ON work_orders(priority);
CREATE INDEX idx_wo_type     ON work_orders(type);
CREATE INDEX idx_sp_category ON spare_parts(category);
CREATE INDEX idx_sp_low_stock ON spare_parts(current_stock) WHERE current_stock <= min_stock;
```

---

## 10. `brt_notification` — Notification Service (Port 8091)

Mapping từ: `interface AppNotification` (5 records), `AuditLog` (5 records)

```sql
CREATE TABLE notifications (
    id                  VARCHAR(20)  PRIMARY KEY,
    type                VARCHAR(10)  NOT NULL,                -- ALERT, INFO, WARNING, SUCCESS
    title               VARCHAR(200) NOT NULL,
    message             TEXT,
    channel             VARCHAR(10)  NOT NULL,                -- PUSH, SMS, DISPLAY, WEB
    target_audience     VARCHAR(20)  NOT NULL,                -- ALL, PASSENGERS, DRIVERS, OPERATORS
    is_read             BOOLEAN      NOT NULL DEFAULT FALSE,
    related_entity_id   VARCHAR(20),
    related_entity_type VARCHAR(30),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id         VARCHAR(20)  PRIMARY KEY,
    user_id    VARCHAR(20)  NOT NULL,
    user_name  VARCHAR(100) NOT NULL,
    user_role  VARCHAR(20),
    action     VARCHAR(20)  NOT NULL,                         -- LOGIN, CREATE, UPDATE, DELETE, EXPORT
    module     VARCHAR(50),
    entity     VARCHAR(50)  NOT NULL,
    entity_id  VARCHAR(20),
    details    TEXT,
    ip_address VARCHAR(45),
    timestamp  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notif_unread  ON notifications(is_read, created_at DESC) WHERE is_read = FALSE;
CREATE INDEX idx_notif_entity  ON notifications(related_entity_type, related_entity_id);
CREATE INDEX idx_audit_user    ON audit_logs(user_id, timestamp DESC);
CREATE INDEX idx_audit_entity  ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_time    ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_action  ON audit_logs(action);
```

---

## 11. `brt_passenger` — Passenger Service (Port 8093)

Mapping từ: `interface PassengerFeedback` (5 records), `ODMatrixEntry` (8 records)

```sql
CREATE TABLE passenger_feedback (
    id             VARCHAR(20)  PRIMARY KEY,
    trip_id        VARCHAR(20),
    route_id       VARCHAR(20)  NOT NULL,
    route_code     VARCHAR(20),
    route_name     VARCHAR(100),
    rating         INTEGER      NOT NULL CHECK (rating BETWEEN 1 AND 5),
    categories     TEXT[]       NOT NULL DEFAULT '{}',        -- ★ array: 'Đúng giờ', 'Sạch sẽ', ...
    comment        TEXT,
    passenger_name VARCHAR(100),
    status         VARCHAR(20)  NOT NULL DEFAULT 'NEW',       -- NEW, REVIEWED, RESPONDED
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fb_route  ON passenger_feedback(route_id);
CREATE INDEX idx_fb_rating ON passenger_feedback(rating);
CREATE INDEX idx_fb_status ON passenger_feedback(status);
```

> **Lưu ý:** OD Matrix (`ODMatrixEntry`) không lưu trực tiếp vào database — nó được **computed** bằng analytics-service từ `vehicle_positions` (TimescaleDB) hoặc từ `brt_warehouse.gps_raw` (Hive).

---

## 12. Hive Warehouse — `brt_warehouse` (trên HDFS)

Dữ liệu từ NiFi → Kafka → HDFS (Parquet) → Hive external tables.

```sql
CREATE EXTERNAL TABLE brt_warehouse.gps_raw (
    vehicle_id STRING, lat DOUBLE, lng DOUBLE,
    speed DOUBLE, heading DOUBLE, trip_id STRING,
    status STRING, event_time TIMESTAMP
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/data/brt/gps/';

CREATE EXTERNAL TABLE brt_warehouse.telemetry_raw (
    vehicle_id STRING, fuel_level DOUBLE, engine_temp DOUBLE,
    battery_voltage DOUBLE, odometer DOUBLE, event_time TIMESTAMP
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/data/brt/telemetry/';

CREATE EXTERNAL TABLE brt_warehouse.ticket_events (
    transaction_id STRING, ticket_type_id STRING,
    amount BIGINT, payment_method STRING,
    station_id STRING, route_id STRING, event_time TIMESTAMP
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/data/brt/tickets/';

CREATE EXTERNAL TABLE brt_warehouse.passenger_counts (
    station_id STRING, count_in INT, count_out INT,
    cumulative_on_platform INT, event_time TIMESTAMP
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/data/brt/passenger_counts/';
```

---

## 13. Naming Conventions

| Đối tượng | Quy tắc | Ví dụ |
|---|---|---|
| Database name | `brt_{service}` | brt_route, brt_ticket |
| Table name | snake_case, số nhiều | vehicles, work_orders |
| Column name | snake_case | plate_number, created_at |
| Primary key | `id` (VARCHAR(20)) | id = 'v-001' |
| Foreign key | `{entity}_id` | route_id, vehicle_id |
| Timestamp | `{verb}_at` | created_at, resolved_at |
| Boolean | `is_` hoặc `has_` | is_active, has_camera |
| Index | `idx_{abbrev}_{column}` | idx_vp_vehicle_time |
| Hypertable time | luôn `time` TIMESTAMPTZ | |

---

## 14. Flyway Migrations

Mỗi service có `src/main/resources/db/migration/`:

```
V1__create_tables.sql
V2__create_indexes.sql
V3__enable_postgis.sql                  (route, station)
V4__enable_timescaledb.sql              (vehicle, station, schedule, ticket)
V5__create_hypertables.sql
V6__create_continuous_aggregates.sql
V7__create_retention_compression.sql
V10__seed_data.sql                      (dev profile only)
```

---

## 15. TypeScript → PostgreSQL Type Mapping

| TypeScript | PostgreSQL | Ghi chú |
|---|---|---|
| `string` | `VARCHAR(n)` | n phù hợp dữ liệu |
| `string` (long) | `TEXT` | description, resolution |
| `number` (int) | `INTEGER` | passengers, gateCount |
| `number` (decimal) | `NUMERIC(p,s)` | lat, totalLengthKm |
| `number` (VNĐ) | `NUMERIC(12,0)` | price, amount |
| `boolean` | `BOOLEAN` | isActive, hasCamera |
| `Date` | `TIMESTAMPTZ` | createdAt → ISO 8601 |
| `Date` (date only) | `DATE` | licenseExpiry, hireDate |
| `string` (time) | `VARCHAR(5)` | "05:00" |
| Union type | `VARCHAR(n)` + comment | enum values in comment |
| `string[]` | `TEXT[]` | certifications, images |
| `T[]` (nested) | Separate table | stations[] → route_stations |
| Optional (`?`) | nullable | không có NOT NULL |