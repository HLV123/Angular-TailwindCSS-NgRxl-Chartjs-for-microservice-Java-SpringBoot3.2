# Mock Data — BRT Gestão Frontend

Toàn bộ dữ liệu mock nằm trong `src/app/core/mock-data/index.ts`. Backend developer seed data phải khớp format này.

---

## Tổng quan

32 bộ dữ liệu mock, tổng cộng ~280 records.

| # | Dataset | Records | Component sử dụng | Backend service tương ứng |
|---|---|:---:|---|---|
| 1 | MOCK_USERS | 7 | Login, Security/Users | auth-service |
| 2 | MOCK_CREDENTIALS | 7 | Login | auth-service |
| 3 | MOCK_ROUTES | 5 | RouteList, RouteDetail, RouteForm | route-service |
| 4 | MOCK_VEHICLES | 12 | VehicleList, VehicleDetail | vehicle-service |
| 5 | MOCK_VEHICLE_POSITIONS | 7 | Dashboard (Leaflet map) | vehicle-service |
| 6 | MOCK_VEHICLE_TELEMETRY | 5 | VehicleDetail | vehicle-service |
| 7 | MOCK_STATIONS | 8 | StationList, StationDetail | station-service |
| 8 | MOCK_STATION_PASSENGER_COUNTS | 31 | StationDetail (chart) | station-service |
| 9 | MOCK_DRIVERS | 8 | DriverList, DriverDetail | driver-service |
| 10 | MOCK_DRIVER_SHIFTS | 8 | DriverDetail, Dispatch | driver-service |
| 11 | MOCK_SCHEDULES | 3 | ScheduleList, ScheduleDetail | schedule-service |
| 12 | MOCK_TRIP_DETAILS | 10 | Dashboard, ScheduleDetail | schedule-service |
| 13 | MOCK_DISPATCH_REQUESTS | 3 | Dispatch | schedule-service |
| 14 | MOCK_INCIDENTS | 5 | IncidentList, IncidentDetail | incident-service |
| 15 | MOCK_TICKET_TYPES | 7 | TicketTypes | ticket-service |
| 16 | MOCK_TICKET_TRANSACTIONS | 10 | TicketList | ticket-service |
| 17 | MOCK_TICKET_REFUNDS | 3 | TicketList | ticket-service |
| 18 | MOCK_EWALLET | 1 | PassengerPortal | ticket-service |
| 19 | MOCK_WORK_ORDERS | 6 | WorkOrders | maintenance-service |
| 20 | MOCK_SPARE_PARTS | 6 | PartsInventory | maintenance-service |
| 21 | MOCK_NOTIFICATIONS | 5 | NotificationCenter | notification-service |
| 22 | MOCK_AUDIT_LOGS | 5 | AuditLog | notification-service |
| 23 | MOCK_DASHBOARD_STATS | 1 | Dashboard | analytics-service |
| 24 | MOCK_PASSENGER_HOURLY | 18 | Dashboard (chart) | analytics-service |
| 25 | MOCK_ROUTE_PERFORMANCE | 4 | Dashboard, Analytics | analytics-service |
| 26 | MOCK_HEADWAY_DATA | 3 | Dashboard | analytics-service |
| 27 | MOCK_REVENUE_REPORTS | 1 | Revenue | ticket-service |
| 28 | MOCK_SERVICE_ZONES | 5 | RouteList | route-service |
| 29 | MOCK_NIFI_FLOWS | 6 | DataFlows | data-platform-service |
| 30 | MOCK_KAFKA_TOPICS | 7 | DataFlows | data-platform-service |
| 31 | MOCK_PASSENGER_FEEDBACK | 5 | PassengerPortal | passenger-service |
| 32 | MOCK_OD_MATRIX | 8 | PassengerAnalysis | passenger-service |

---

## Quy tắc ID

Tất cả ID đều là string với prefix theo entity:

| Entity | Format | Ví dụ |
|---|---|---|
| User | `u-{3 digit}` | u-001, u-002 |
| Route | `r-{3 digit}` | r-001, r-005 |
| Vehicle | `v-{3 digit}` | v-001, v-012 |
| Station | `s-{3 digit}` | s-001, s-023 |
| Driver | `d-{3 digit}` | d-001, d-008 |
| Schedule | `sch-{3 digit}` | sch-001 |
| Trip | `trip-{3 digit}` | trip-001 |
| Incident | `inc-{3 digit}` | inc-001 |
| WorkOrder | `wo-{3 digit}` | wo-001 |
| SparePart | `sp-{3 digit}` | sp-001 |
| Notification | `n-{3 digit}` | n-001 |
| AuditLog | `al-{3 digit}` | al-001 |
| TicketType | `tt-{3 digit}` | tt-001 |
| Transaction | `tx-{3 digit}` | tx-001 |
| DriverShift | `sh-{3 digit}` | sh-001 |
| DispatchReq | `dis-{3 digit}` | dis-001 |
| Refund | `ref-{3 digit}` | ref-001 |
| EWallet | `ew-{3 digit}` | ew-001 |
| Feedback | `fb-{3 digit}` | fb-001 |
| NiFiFlow | `nf-{3 digit}` | nf-001 |
| ServiceZone | `z-{3 digit}` | z-001 |

Backend seed data **phải giữ đúng format ID** này vì frontend dùng ID để navigate, filter, và cross-reference.

---

## Quan hệ giữa các dataset (Foreign Keys)

```
MOCK_USERS
  └──► MOCK_CREDENTIALS (userId)
  └──► MOCK_AUDIT_LOGS (userId)
  └──► MOCK_INCIDENTS (reportedBy, assignedTo)

MOCK_ROUTES
  ├──► MOCK_VEHICLES (currentRouteId)
  ├──► MOCK_DRIVERS (currentRouteId)
  ├──► MOCK_SCHEDULES (routeId)
  ├──► MOCK_DRIVER_SHIFTS (routeId)
  ├──► MOCK_INCIDENTS (routeId)
  ├──► MOCK_ROUTE_PERFORMANCE (routeId)
  ├──► MOCK_HEADWAY_DATA (routeId)
  ├──► MOCK_TRIP_DETAILS (routeId)
  ├──► MOCK_DISPATCH_REQUESTS (routeId)
  ├──► MOCK_PASSENGER_FEEDBACK (routeId)
  ├──► MOCK_REVENUE_REPORTS.byRoute (routeId)
  └──► MOCK_SERVICE_ZONES (routeIds[])

MOCK_VEHICLES
  ├──► MOCK_VEHICLE_POSITIONS (vehicleId)
  ├──► MOCK_VEHICLE_TELEMETRY (vehicleId)
  ├──► MOCK_DRIVERS (currentVehicleId)
  ├──► MOCK_DRIVER_SHIFTS (vehicleId)
  ├──► MOCK_INCIDENTS (vehicleId)
  ├──► MOCK_WORK_ORDERS (vehicleId)
  └──► MOCK_DISPATCH_REQUESTS (assignedVehicleId)

MOCK_STATIONS
  ├──► MOCK_ROUTES.stations[] (stationId)
  ├──► MOCK_STATION_PASSENGER_COUNTS (stationId)
  ├──► MOCK_INCIDENTS (stationId)
  ├──► MOCK_TICKET_TRANSACTIONS (stationId)
  └──► MOCK_OD_MATRIX (originStationId, destStationId)

MOCK_DRIVERS
  ├──► MOCK_DRIVER_SHIFTS (driverId)
  └──► MOCK_DISPATCH_REQUESTS (assignedDriverId)

MOCK_TICKET_TYPES
  └──► MOCK_TICKET_TRANSACTIONS (ticketTypeId)

MOCK_INCIDENTS
  └──► MOCK_NOTIFICATIONS (relatedEntityId where type=INCIDENT)

MOCK_WORK_ORDERS
  └──► MOCK_NOTIFICATIONS (relatedEntityId where type=WORK_ORDER)
```

---

## Tài khoản đăng nhập

| Username | Password | Role | userId | Họ tên |
|---|---|---|---|---|
| admin | admin123 | ADMIN | u-001 | Nguyễn Văn Admin |
| opsmanager | ops123 | OPS_MANAGER | u-002 | Trần Thị Ops Manager |
| dispatcher1 | disp123 | DISPATCHER | u-003 | Lê Văn Dispatcher |
| driver01 | drv123 | DRIVER | u-004 | Phạm Minh Tài Xế |
| analyst1 | ana123 | ANALYST | u-005 | Võ Thị Analyst |
| finance1 | fin123 | FINANCE | u-006 | Hoàng Văn Finance |
| maint1 | mnt123 | MAINTENANCE | u-007 | Đỗ Văn Bảo Trì |

---

## Dữ liệu mẫu theo domain

### Tuyến BRT (5 tuyến)

| ID | Code | Tên | Loại | Trạng thái | Dài (km) | Số trạm | Thời gian (phút) |
|---|---|---|---|---|---|---|---|
| r-001 | BRT-01 | Kim Mã - Yên Nghĩa | MAIN | ACTIVE | 14.7 | 11 | 45 |
| r-002 | BRT-02 | Cầu Giấy - Hà Đông | MAIN | ACTIVE | 12.3 | 7 | 38 |
| r-003 | BRT-03 | Đông Anh - Hoàn Kiếm | BRANCH | ACTIVE | 16.5 | 5 | 52 |
| r-004 | BRT-N1 | Tuyến đêm Trung tâm | NIGHT | ACTIVE | 8.2 | 4 | 28 |
| r-005 | BRT-S1 | Tuyến đặc biệt Sân vận động | SPECIAL | INACTIVE | 5.5 | 3 | 18 |

### Xe BRT (12 xe)

| ID | Biển số | Loại | Nhiên liệu | Trạng thái | Tuyến |
|---|---|---|---|---|---|
| v-001 | 29B-001.01 | ARTICULATED | CNG | ACTIVE | BRT-01 |
| v-002 | 29B-001.02 | ARTICULATED | CNG | ACTIVE | BRT-01 |
| v-003 | 29B-001.03 | STANDARD | DIESEL | ACTIVE | BRT-02 |
| v-004 | 29B-001.04 | STANDARD | DIESEL | ACTIVE | BRT-02 |
| v-005 | 29B-001.05 | ELECTRIC | ELECTRIC | ACTIVE | BRT-01 |
| v-006 | 29B-001.06 | ELECTRIC | ELECTRIC | IDLE | — |
| v-007 | 29B-001.07 | ARTICULATED | CNG | MAINTENANCE_REQUIRED | — |
| v-008 | 29B-001.08 | STANDARD | HYBRID | UNDER_REPAIR | — |
| v-009 | 29B-001.09 | MINI | ELECTRIC | ACTIVE | BRT-03 |
| v-010 | 29B-001.10 | STANDARD | CNG | DECOMMISSIONED | — |
| v-011 | 29B-001.11 | ARTICULATED | CNG | ACTIVE | BRT-03 |
| v-012 | 29B-001.12 | STANDARD | DIESEL | IDLE | — |

### Trạm BRT (8 trạm trong mock, 23 trạm tham chiếu trong routes)

| ID | Code | Tên | Quận | Loại | Kết nối tuyến |
|---|---|---|---|---|---|
| s-001 | S001 | Kim Mã | Ba Đình | TERMINAL | BRT-01, BRT-N1 |
| s-002 | S002 | Giảng Võ | Đống Đa | INLINE | BRT-01 |
| s-003 | S003 | Láng Hạ | Đống Đa | INLINE | BRT-01 |
| s-005 | S005 | Ngã Tư Sở | Đống Đa | TRANSFER_HUB | BRT-01, BRT-02 |
| s-011 | S011 | Yên Nghĩa | Hà Đông | TERMINAL | BRT-01 |
| s-012 | S012 | Cầu Giấy | Cầu Giấy | TRANSFER_HUB | BRT-02, BRT-N1 |
| s-013 | S013 | Mỹ Đình | Nam Từ Liêm | TRANSFER_HUB | BRT-02, BRT-N1, BRT-S1 |
| s-023 | S023 | Hoàn Kiếm | Hoàn Kiếm | TERMINAL | BRT-03, BRT-N1 |

### Loại vé (7 loại)

| ID | Code | Tên | Giá (VNĐ) | Loại | Giảm giá |
|---|---|---|---|---|---|
| tt-001 | SINGLE | Vé lượt đơn | 7.000 | SINGLE_ROUTE | 0% |
| tt-002 | SINGLE_ALL | Vé lượt toàn mạng | 12.000 | ALL_ROUTES | 0% |
| tt-003 | DAY_PASS | Thẻ ngày | 30.000 | DAY_PASS | 0% |
| tt-004 | MONTHLY | Thẻ tháng | 200.000 | MONTHLY | 20% |
| tt-005 | FAMILY | Vé gia đình | 25.000 | FAMILY | 15% |
| tt-006 | STUDENT | Vé ưu đãi - Học sinh | 3.500 | DISCOUNTED | 50% |
| tt-007 | SENIOR | Vé ưu đãi - Người cao tuổi | 0 | DISCOUNTED | 100% |

---

## Mapping TypeScript Interface → Java DTO

Các field names **giữ nguyên** giữa frontend và backend (camelCase). Backend trả JSON với đúng field names này.

Ví dụ `BrtRoute` (TypeScript) → `RouteDto` (Java):

```
TypeScript                          Java
─────────────────────────────────────────────────
id: string                    →     String id
code: string                  →     String code
name: string                  →     String name
description?: string          →     String description       // nullable
routeType: 'MAIN'|'BRANCH'.. →     RouteType routeType      // enum
status: 'ACTIVE'|'INACTIVE'..→     RouteStatus status       // enum
totalLengthKm: number         →     Double totalLengthKm
totalStations?: number        →     Integer totalStations    // nullable
avgTravelTimeMin: number      →     Integer avgTravelTimeMin
stations: RouteStation[]      →     List<RouteStationDto> stations
geometry?: GeoJsonLineString  →     GeoJsonLineString geometry// nullable
serviceZoneId?: string        →     String serviceZoneId     // nullable
color: string                 →     String color
createdAt: Date               →     LocalDateTime createdAt
updatedAt: Date               →     LocalDateTime updatedAt
```

**Quy tắc chung:**
- `string` → `String`
- `number` (integer) → `Integer` hoặc `Long`
- `number` (decimal) → `Double`
- `boolean` → `Boolean`
- `Date` → `LocalDateTime` (ISO 8601 format: `2025-02-20T07:30:00`)
- Union type literals → Java `enum`
- Optional field (`?`) → nullable field (không có `@NotNull`)
- Array → `List<T>`
