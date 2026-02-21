# API Contracts — BRT Gestão Backend

60+ REST endpoints, chuẩn hóa request/response format, pagination, error handling.

---

## 1. Quy ước chung

### Base URL

```
Development:  http://localhost:8080/api
Production:   https://api.brtgestao.com/api
```

Tất cả requests đi qua API Gateway (:8080), gateway forward tới service tương ứng.

### Authentication Header

```
Authorization: Bearer {jwt_token}
```

Mọi endpoint trừ `/api/auth/login` và `/api/auth/refresh` đều yêu cầu JWT token.

### Response format chuẩn

**Thành công:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Tạo tuyến thành công"
}
```

**Thành công (danh sách có pagination):**
```json
{
  "success": true,
  "data": [ ... ],
  "total": 156,
  "page": 1,
  "pageSize": 20,
  "totalPages": 8
}
```

**Lỗi:**
```json
{
  "success": false,
  "message": "Không tìm thấy tuyến với ID r-999",
  "errors": ["routeId: Giá trị không tồn tại"]
}
```

### HTTP Status Codes

| Code | Ý nghĩa | Khi nào |
|---|---|---|
| 200 | OK | GET, PUT thành công |
| 201 | Created | POST tạo mới thành công |
| 204 | No Content | DELETE thành công |
| 400 | Bad Request | Validation lỗi |
| 401 | Unauthorized | Token hết hạn hoặc không có |
| 403 | Forbidden | Không có quyền truy cập |
| 404 | Not Found | Resource không tồn tại |
| 409 | Conflict | Duplicate (ví dụ: trùng mã tuyến) |
| 500 | Internal Server Error | Lỗi hệ thống |

### Pagination Query Params

```
GET /api/routes?page=1&pageSize=20&sort=createdAt&order=desc
```

| Param | Default | Mô tả |
|---|---|---|
| page | 1 | Trang hiện tại (1-indexed) |
| pageSize | 20 | Số items mỗi trang (max 100) |
| sort | createdAt | Field để sort |
| order | desc | asc hoặc desc |

### Filter Query Params

```
GET /api/vehicles?status=ACTIVE&routeId=r-001&vehicleType=ELECTRIC
GET /api/incidents?severity=P1,P2&status=OPEN,IN_PROGRESS&from=2025-02-01&to=2025-02-28
```

---

## 2. Auth Service — `/api/auth`, `/api/users`, `/api/roles`

### POST `/api/auth/login` — Đăng nhập

```
Request:
{
  "username": "admin",
  "password": "admin123"
}

Response 200:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZn...",
    "user": {
      "id": "u-001",
      "username": "admin",
      "email": "admin@brtgestao.com",
      "fullName": "Nguyễn Văn Admin",
      "role": "ADMIN",
      "avatar": "https://...",
      "phone": "0901234001",
      "department": "IT",
      "isActive": true,
      "lastLogin": "2025-02-20T07:00:00",
      "createdAt": "2024-01-01T00:00:00",
      "twoFactorEnabled": true
    },
    "expiresIn": 3600
  }
}

Response 401:
{
  "success": false,
  "message": "Sai tên đăng nhập hoặc mật khẩu"
}
```

### POST `/api/auth/refresh` — Làm mới token

```
Request:
{
  "refreshToken": "dGhpcyBpcyBhIHJlZn..."
}

Response 200: (giống login response)
```

### POST `/api/auth/logout`

```
Response 204: No Content
```

### GET `/api/users` — Danh sách users (ADMIN only)

```
Response 200:
{
  "success": true,
  "data": [
    { "id": "u-001", "username": "admin", "fullName": "...", "role": "ADMIN", ... }
  ],
  "total": 7, "page": 1, "pageSize": 20, "totalPages": 1
}
```

### POST `/api/users` — Tạo user mới

### PUT `/api/users/{id}` — Cập nhật user

### DELETE `/api/users/{id}` — Xóa user

### GET `/api/roles` — Danh sách roles + permissions

---

## 3. Route Service — `/api/routes`, `/api/zones`

### GET `/api/routes` — Danh sách tuyến

```
Query: ?status=ACTIVE&routeType=MAIN
Response 200:
{
  "success": true,
  "data": [
    {
      "id": "r-001",
      "code": "BRT-01",
      "name": "Kim Mã - Yên Nghĩa",
      "description": "Tuyến BRT chính đầu tiên của Hà Nội",
      "routeType": "MAIN",
      "status": "ACTIVE",
      "totalLengthKm": 14.7,
      "totalStations": 11,
      "avgTravelTimeMin": 45,
      "stations": [
        {
          "stationId": "s-001",
          "stationName": "Kim Mã",
          "stationCode": "S001",
          "order": 1,
          "distanceFromStartKm": 0,
          "travelTimeFromPrevMin": 0,
          "lat": 21.0285,
          "lng": 105.8142
        }
      ],
      "geometry": {
        "type": "LineString",
        "coordinates": [[105.8142, 21.0285], [105.8198, 21.0258], ...]
      },
      "color": "#1a56db",
      "createdAt": "2024-01-01T00:00:00",
      "updatedAt": "2025-01-15T00:00:00"
    }
  ]
}
```

### GET `/api/routes/{id}` — Chi tiết tuyến

### POST `/api/routes` — Tạo tuyến mới

```
Request:
{
  "code": "BRT-04",
  "name": "Tuyến mới",
  "routeType": "BRANCH",
  "totalLengthKm": 10.5,
  "avgTravelTimeMin": 35,
  "color": "#0891b2",
  "stations": [
    { "stationId": "s-001", "order": 1, "distanceFromStartKm": 0, "travelTimeFromPrevMin": 0 },
    { "stationId": "s-005", "order": 2, "distanceFromStartKm": 3.8, "travelTimeFromPrevMin": 12 }
  ]
}

Response 201: { "success": true, "data": { ...routeDto } }
```

### PUT `/api/routes/{id}` — Cập nhật tuyến

### DELETE `/api/routes/{id}` — Xóa tuyến

### GET `/api/zones` — Danh sách vùng phục vụ

---

## 4. Vehicle Service — `/api/vehicles`, `/api/vehicle-positions`, `/api/telemetry`

### GET `/api/vehicles` — Danh sách xe

```
Query: ?status=ACTIVE&vehicleType=ELECTRIC&routeId=r-001
```

### GET `/api/vehicles/{id}` — Chi tiết xe

### POST `/api/vehicles` — Thêm xe mới

### PUT `/api/vehicles/{id}` — Cập nhật xe

### DELETE `/api/vehicles/{id}` — Xóa xe

### GET `/api/vehicle-positions` — Vị trí tất cả xe (real-time)

```
Response 200:
{
  "success": true,
  "data": [
    {
      "vehicleId": "v-001",
      "lat": 21.0178,
      "lng": 105.8215,
      "speed": 32,
      "heading": 225,
      "timestamp": "2025-02-20T09:30:15",
      "status": "ON_TIME"
    }
  ]
}
```

### GET `/api/telemetry/{vehicleId}` — Telemetry xe

---

## 5. Station Service — `/api/stations`

### GET `/api/stations` | GET `/api/stations/{id}` | POST | PUT | DELETE

### GET `/api/stations/{id}/passenger-counts` — Lượng khách theo giờ

```
Query: ?date=2025-02-20
Response: StationPassengerCount[] (time-series)
```

---

## 6. Driver Service — `/api/drivers`, `/api/shifts`

### GET `/api/drivers` | GET `/api/drivers/{id}` | POST | PUT | DELETE

### GET `/api/shifts` — Danh sách ca

```
Query: ?driverId=d-001&date=2025-02-20&status=IN_PROGRESS
```

### POST `/api/shifts` — Tạo ca mới

---

## 7. Schedule Service — `/api/schedules`, `/api/trips`, `/api/dispatch`

### CRUD `/api/schedules`

### GET `/api/trips` — Danh sách chuyến

```
Query: ?routeId=r-001&status=IN_PROGRESS&date=2025-02-20
```

### GET `/api/dispatch` — Danh sách yêu cầu điều xe

### POST `/api/dispatch` — Tạo yêu cầu điều xe

```
Request:
{
  "type": "EMERGENCY",
  "routeId": "r-001",
  "reason": "Xe hỏng phanh, cần xe thay thế"
}
```

### PUT `/api/dispatch/{id}` — Cập nhật (assign vehicle/driver)

---

## 8. Ticket Service — `/api/ticket-types`, `/api/tickets`, `/api/refunds`, `/api/wallets`, `/api/revenue`

### GET `/api/ticket-types` | POST | PUT

### GET `/api/tickets` — Giao dịch vé

```
Query: ?paymentMethod=MOMO&status=COMPLETED&from=2025-02-20&to=2025-02-20
```

### POST `/api/tickets/purchase` — Mua vé

### GET `/api/refunds` | POST | PUT `/api/refunds/{id}`

### GET `/api/wallets/{id}` — Thông tin ví điện tử

### GET `/api/revenue` — Báo cáo doanh thu

```
Query: ?from=2025-02-01&to=2025-02-28
Response: RevenueReport[] (aggregate by date, ticket type, route, payment method)
```

---

## 9. Incident Service — `/api/incidents`

### GET `/api/incidents` | GET `/api/incidents/{id}` | POST

### PUT `/api/incidents/{id}/status` — Cập nhật trạng thái

```
Request:
{
  "status": "RESOLVED",
  "resolution": "Đã sửa chữa hệ thống phanh"
}
```

---

## 10. Maintenance Service — `/api/work-orders`, `/api/spare-parts`, `/api/maintenance-schedule`

### CRUD `/api/work-orders`

### GET `/api/spare-parts` | PUT `/api/spare-parts/{id}/stock`

### GET `/api/maintenance-schedule`

---

## 11. Analytics Service — `/api/dashboard`, `/api/analytics`, `/api/reports`

### GET `/api/dashboard/stats` — Dashboard stats

### GET `/api/dashboard/passenger-hourly` — Khách theo giờ

### GET `/api/dashboard/route-performance` — Hiệu suất tuyến

### GET `/api/dashboard/headway` — Headway data

### GET `/api/dashboard/trips` — Chi tiết chuyến

### GET `/api/analytics/network` — Phân tích mạng lưới

### GET `/api/analytics/passengers` — Phân tích hành khách

### GET `/api/analytics/od-matrix` — Ma trận OD

### GET `/api/reports` | POST `/api/reports/export`

---

## 12. Notification & Audit — `/api/notifications`, `/api/audit-logs`

### GET `/api/notifications` | PUT `/api/notifications/{id}/read`

### GET `/api/notifications/unread-count`

### GET `/api/audit-logs`

```
Query: ?userId=u-001&action=LOGIN&entity=AUTH&from=2025-02-20&to=2025-02-20
```

---

## 13. Data Platform — `/api/data-platform`, `/api/data-flows`, `/api/data-catalog`

### GET `/api/data-platform/overview`

### GET `/api/data-flows` — Trạng thái NiFi flows

### GET `/api/data-flows/kafka-topics` — Trạng thái Kafka topics

### GET `/api/data-catalog` — Data catalog entries

---

## 14. Passenger — `/api/passenger-portal`, `/api/feedback`

### GET `/api/feedback` | POST `/api/feedback`

### GET `/api/passenger-portal/info` — Thông tin portal
