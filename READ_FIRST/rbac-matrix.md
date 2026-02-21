# Ma trận phân quyền RBAC — BRT Gestão

3 lớp phân quyền: UI Sidebar → API Endpoint → Data Row/Column.

---

## 7 Roles trong hệ thống

| Role | Mô tả | Phạm vi |
|---|---|---|
| ADMIN | Quản trị viên hệ thống | Toàn quyền tất cả modules |
| OPS_MANAGER | Quản lý vận hành | Quản lý tuyến, xe, tài xế, lịch, sự cố, bảo trì, doanh thu |
| DISPATCHER | Điều phối viên | Theo dõi xe, điều phối, xử lý sự cố |
| DRIVER | Tài xế | Xem tuyến, lịch, báo sự cố |
| MAINTENANCE | Nhân viên bảo trì | Quản lý bảo trì xe, phụ tùng, sự cố kỹ thuật |
| ANALYST | Phân tích viên | Xem dữ liệu, analytics, data platform, báo cáo |
| FINANCE | Tài chính | Quản lý vé, doanh thu, báo cáo tài chính |

---

## Lớp 1 — UI Sidebar (Angular `roleGuard`)

`✅` = Hiển thị trên sidebar và được truy cập. `—` = Ẩn và redirect `/forbidden`.

| Module / Trang | ADMIN | OPS_MGR | DISPATCH | DRIVER | MAINT | ANALYST | FINANCE |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Dashboard** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Routes — Danh sách** | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |
| Routes — Chi tiết | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |
| Routes — Tạo mới | ✅ | ✅ | — | — | — | — | — |
| Routes — Chỉnh sửa | ✅ | ✅ | — | — | — | — | — |
| **Vehicles — Danh sách** | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| Vehicles — Chi tiết | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| Vehicles — Tạo/Sửa | ✅ | ✅ | — | — | — | — | — |
| **Stations — Danh sách** | ✅ | ✅ | ✅ | — | — | ✅ | — |
| Stations — Chi tiết | ✅ | ✅ | ✅ | — | — | ✅ | — |
| Stations — Tạo/Sửa | ✅ | ✅ | — | — | — | — | — |
| **Drivers — Danh sách** | ✅ | ✅ | ✅ | — | — | — | — |
| Drivers — Chi tiết | ✅ | ✅ | ✅ | — | — | — | — |
| Drivers — Tạo/Sửa | ✅ | ✅ | — | — | — | — | — |
| **Schedules — Danh sách** | ✅ | ✅ | ✅ | ✅ | — | — | — |
| Schedules — Chi tiết | ✅ | ✅ | ✅ | ✅ | — | — | — |
| Schedules — Tạo/Sửa | ✅ | ✅ | — | — | — | — | — |
| **Dispatch** | ✅ | ✅ | ✅ | — | — | — | — |
| **Tickets — Giao dịch** | ✅ | ✅ | — | — | — | ✅ | ✅ |
| Ticket Types | ✅ | — | — | — | — | — | ✅ |
| Revenue | ✅ | ✅ | — | — | — | — | ✅ |
| **Incidents — Danh sách** | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Incidents — Tạo mới | ✅ | ✅ | ✅ | ✅ | — | — | — |
| Incidents — Chi tiết | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| **Maintenance — Tổng quan** | ✅ | ✅ | — | — | ✅ | — | — |
| Work Orders | ✅ | — | — | — | ✅ | — | — |
| Parts Inventory | ✅ | — | — | — | ✅ | — | — |
| Maintenance Schedule | ✅ | ✅ | — | — | ✅ | — | — |
| **Analytics — Tổng quan** | ✅ | ✅ | — | — | — | ✅ | ✅ |
| Network Analysis | ✅ | — | — | — | — | ✅ | — |
| Passenger Analysis | ✅ | ✅ | — | — | — | ✅ | — |
| Reports | ✅ | ✅ | — | — | — | ✅ | ✅ |
| **Security — Tổng quan** | ✅ | — | — | — | — | — | — |
| Users | ✅ | — | — | — | — | — | — |
| Roles | ✅ | — | — | — | — | — | — |
| Audit Log | ✅ | — | — | — | — | — | — |
| **Data Platform** | ✅ | — | — | — | — | ✅ | — |
| Data Catalog | ✅ | — | — | — | — | ✅ | — |
| Data Flows | ✅ | — | — | — | — | ✅ | — |
| **Passenger Portal** | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |
| **Notifications** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Settings** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Lớp 2 — API Endpoint (Spring Security `@PreAuthorize`)

### auth-service

| Method | Endpoint | ADMIN | OPS_MGR | DISPATCH | DRIVER | MAINT | ANALYST | FINANCE |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| POST | `/api/auth/login` | ★ | ★ | ★ | ★ | ★ | ★ | ★ |
| POST | `/api/auth/refresh` | ★ | ★ | ★ | ★ | ★ | ★ | ★ |
| POST | `/api/auth/logout` | ★ | ★ | ★ | ★ | ★ | ★ | ★ |
| GET | `/api/users` | ✅ | — | — | — | — | — | — |
| POST | `/api/users` | ✅ | — | — | — | — | — | — |
| PUT | `/api/users/{id}` | ✅ | — | — | — | — | — | — |
| DELETE | `/api/users/{id}` | ✅ | — | — | — | — | — | — |
| GET | `/api/roles` | ✅ | — | — | — | — | — | — |

`★` = Public (không cần auth) | `✅` = Allowed | `—` = 403 Forbidden

### route-service

| Method | Endpoint | ADMIN | OPS_MGR | DISPATCH | DRIVER | MAINT | ANALYST | FINANCE |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GET | `/api/routes` | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |
| GET | `/api/routes/{id}` | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |
| POST | `/api/routes` | ✅ | ✅ | — | — | — | — | — |
| PUT | `/api/routes/{id}` | ✅ | ✅ | — | — | — | — | — |
| DELETE | `/api/routes/{id}` | ✅ | — | — | — | — | — | — |
| GET | `/api/zones` | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |

### vehicle-service

| Method | Endpoint | ADMIN | OPS_MGR | DISPATCH | DRIVER | MAINT | ANALYST | FINANCE |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GET | `/api/vehicles` | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| GET | `/api/vehicles/{id}` | ✅ | ✅ | ✅ | — | ✅ | ✅ | — |
| POST | `/api/vehicles` | ✅ | ✅ | — | — | — | — | — |
| PUT | `/api/vehicles/{id}` | ✅ | ✅ | — | — | — | — | — |
| DELETE | `/api/vehicles/{id}` | ✅ | — | — | — | — | — | — |
| GET | `/api/vehicle-positions` | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |
| GET | `/api/telemetry/{vehicleId}` | ✅ | ✅ | — | — | ✅ | ✅ | — |

### station-service

| Method | Endpoint | ADMIN | OPS_MGR | DISPATCH | DRIVER | MAINT | ANALYST | FINANCE |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GET | `/api/stations` | ✅ | ✅ | ✅ | — | — | ✅ | — |
| GET | `/api/stations/{id}` | ✅ | ✅ | ✅ | — | — | ✅ | — |
| POST | `/api/stations` | ✅ | ✅ | — | — | — | — | — |
| PUT | `/api/stations/{id}` | ✅ | ✅ | — | — | — | — | — |
| DELETE | `/api/stations/{id}` | ✅ | — | — | — | — | — | — |
| GET | `/api/stations/{id}/passenger-counts` | ✅ | ✅ | ✅ | — | — | ✅ | — |

### schedule-service

| Method | Endpoint | ADMIN | OPS_MGR | DISPATCH | DRIVER | MAINT | ANALYST | FINANCE |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GET | `/api/schedules` | ✅ | ✅ | ✅ | ✅ | — | — | — |
| GET | `/api/schedules/{id}` | ✅ | ✅ | ✅ | ✅ | — | — | — |
| POST | `/api/schedules` | ✅ | ✅ | — | — | — | — | — |
| PUT | `/api/schedules/{id}` | ✅ | ✅ | — | — | — | — | — |
| GET | `/api/trips` | ✅ | ✅ | ✅ | ✅ | — | — | — |
| GET | `/api/dispatch` | ✅ | ✅ | ✅ | — | — | — | — |
| POST | `/api/dispatch` | ✅ | ✅ | ✅ | — | — | — | — |
| PUT | `/api/dispatch/{id}` | ✅ | ✅ | ✅ | — | — | — | — |

### ticket-service

| Method | Endpoint | ADMIN | OPS_MGR | DISPATCH | DRIVER | MAINT | ANALYST | FINANCE |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GET | `/api/tickets` | ✅ | ✅ | — | — | — | ✅ | ✅ |
| GET | `/api/ticket-types` | ✅ | ✅ | — | — | — | ✅ | ✅ |
| POST | `/api/ticket-types` | ✅ | — | — | — | — | — | ✅ |
| PUT | `/api/ticket-types/{id}` | ✅ | — | — | — | — | — | ✅ |
| GET | `/api/revenue` | ✅ | ✅ | — | — | — | — | ✅ |
| GET | `/api/refunds` | ✅ | — | — | — | — | — | ✅ |
| POST | `/api/refunds` | ✅ | — | — | — | — | — | ✅ |
| PUT | `/api/refunds/{id}` | ✅ | — | — | — | — | — | ✅ |

### incident-service

| Method | Endpoint | ADMIN | OPS_MGR | DISPATCH | DRIVER | MAINT | ANALYST | FINANCE |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GET | `/api/incidents` | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| GET | `/api/incidents/{id}` | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| POST | `/api/incidents` | ✅ | ✅ | ✅ | ✅ | — | — | — |
| PUT | `/api/incidents/{id}/status` | ✅ | ✅ | ✅ | — | — | — | — |

### maintenance-service

| Method | Endpoint | ADMIN | OPS_MGR | DISPATCH | DRIVER | MAINT | ANALYST | FINANCE |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GET | `/api/work-orders` | ✅ | ✅ | — | — | ✅ | — | — |
| POST | `/api/work-orders` | ✅ | — | — | — | ✅ | — | — |
| PUT | `/api/work-orders/{id}` | ✅ | — | — | — | ✅ | — | — |
| GET | `/api/spare-parts` | ✅ | — | — | — | ✅ | — | — |
| PUT | `/api/spare-parts/{id}/stock` | ✅ | — | — | — | ✅ | — | — |
| GET | `/api/maintenance-schedule` | ✅ | ✅ | — | — | ✅ | — | — |

### analytics-service

| Method | Endpoint | ADMIN | OPS_MGR | DISPATCH | DRIVER | MAINT | ANALYST | FINANCE |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GET | `/api/dashboard/stats` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET | `/api/dashboard/passenger-hourly` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET | `/api/dashboard/route-performance` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET | `/api/analytics/network` | ✅ | — | — | — | — | ✅ | — |
| GET | `/api/analytics/passengers` | ✅ | ✅ | — | — | — | ✅ | — |
| GET | `/api/analytics/od-matrix` | ✅ | ✅ | — | — | — | ✅ | — |
| GET | `/api/reports` | ✅ | ✅ | — | — | — | ✅ | ✅ |
| POST | `/api/reports/export` | ✅ | ✅ | — | — | — | ✅ | ✅ |

### notification-service & data-platform-service

| Method | Endpoint | ADMIN | OPS_MGR | DISPATCH | DRIVER | MAINT | ANALYST | FINANCE |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| GET | `/api/notifications` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| PUT | `/api/notifications/{id}/read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET | `/api/audit-logs` | ✅ | — | — | — | — | — | — |
| GET | `/api/data-platform/overview` | ✅ | — | — | — | — | ✅ | — |
| GET | `/api/data-flows` | ✅ | — | — | — | — | ✅ | — |
| GET | `/api/data-catalog` | ✅ | — | — | — | — | ✅ | — |

---

## Lớp 3 — Data Row/Column Filtering

Ngoài việc cho phép / từ chối truy cập endpoint, một số role bị giới hạn dữ liệu được trả về.

### Row-level filtering

| Role | Rule | Ví dụ |
|---|---|---|
| DRIVER | Chỉ thấy shifts/trips **của mình** | `GET /api/shifts` → `WHERE driver_id = {currentUserId}` |
| DRIVER | Chỉ thấy incidents **mình tạo** hoặc **liên quan xe mình đang lái** | `WHERE reported_by = {userId} OR vehicle_id = {currentVehicleId}` |
| MAINTENANCE | Chỉ thấy work orders **assigned cho mình** hoặc **unassigned** | `WHERE assigned_technician_id = {userId} OR assigned_technician_id IS NULL` |
| DISPATCHER | Chỉ thấy dispatch requests **của khu vực mình quản lý** | `WHERE route_id IN ({assignedRouteIds})` |

### Column-level filtering

| Role | Hidden columns | Lý do |
|---|---|---|
| FINANCE | `driver.nationalId`, `driver.phone`, `driver.address` | Không cần thông tin cá nhân tài xế |
| ANALYST | `user.password`, `user.twoFactorEnabled` | Không cần thông tin bảo mật |
| DRIVER | `vehicle.lastMaintenanceKm`, `vehicle.totalKm` (sensitive) | Chỉ cần biết xe đang ở đâu |
| DISPATCHER | `ticket.amount`, `revenue.*` | Không liên quan tài chính |

### Ranger policies (Big Data layer)

| Policy | Subject | Resource | Permission |
|---|---|---|---|
| GPS Raw Data | ANALYST, ADMIN | `/data/brt/gps/*` | READ |
| GPS Raw Data | DATA_ENGINEER | `/data/brt/gps/*` | READ, WRITE |
| Ticket Data | FINANCE, ADMIN | `/data/brt/tickets/*` | READ |
| Ticket Data | ANALYST | `/data/brt/tickets/*` | READ (masked: no passenger PII) |
| Hive Tables | ANALYST | `brt_warehouse.*` | SELECT |
| Hive Tables | ADMIN | `brt_warehouse.*` | ALL |

---

## Tài khoản test và trải nghiệm phân quyền

| Username | Password | Role | Đăng nhập sẽ thấy |
|---|---|---|---|
| `admin` | `admin123` | ADMIN | Tất cả 17 modules trên sidebar |
| `opsmanager` | `ops123` | OPS_MANAGER | 14 modules (không có Security, Data Platform chi tiết) |
| `dispatcher1` | `disp123` | DISPATCHER | 8 modules (routes, vehicles, drivers, schedules, dispatch, incidents) |
| `driver01` | `drv123` | DRIVER | 5 modules (dashboard, routes, schedules, incidents, passenger-portal) |
| `maint1` | `mnt123` | MAINTENANCE | 6 modules (dashboard, vehicles, incidents, maintenance) |
| `analyst1` | `ana123` | ANALYST | 10 modules (dashboard, routes, vehicles, stations, tickets, analytics, data-platform) |
| `finance1` | `fin123` | FINANCE | 6 modules (dashboard, tickets, ticket-types, revenue, analytics, reports) |
