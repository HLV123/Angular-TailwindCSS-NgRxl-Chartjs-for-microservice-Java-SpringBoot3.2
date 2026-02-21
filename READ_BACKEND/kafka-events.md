# Kafka Events — BRT Gestão

10 topics, JSON payload schema, partition strategy, publisher/subscriber mapping.

---

## Tổng quan

| # | Topic | Publisher | Subscribers | Msg/sec | Partitions |
|---|---|---|---|:---:|:---:|
| 1 | `brt.vehicle.position.updated` | vehicle-service | analytics, notification, data-platform | ~250 | 12 |
| 2 | `brt.vehicle.telemetry.received` | vehicle-service | analytics, maintenance, data-platform | ~40 | 6 |
| 3 | `brt.trip.status.changed` | schedule-service | notification, analytics | ~5 | 6 |
| 4 | `brt.incident.created` | incident-service | notification, maintenance | ~0.5 | 3 |
| 5 | `brt.incident.status.changed` | incident-service | notification | ~1 | 3 |
| 6 | `brt.ticket.purchased` | ticket-service | analytics, data-platform | ~15 | 6 |
| 7 | `brt.maintenance.alert` | maintenance-service | notification | ~0.2 | 3 |
| 8 | `brt.dispatch.requested` | schedule-service | notification | ~0.3 | 3 |
| 9 | `brt.passenger.count.updated` | station-service | analytics, data-platform | ~30 | 6 |
| 10 | `brt.audit.event.logged` | notification-service | (log storage) | ~2 | 3 |

Tất cả topics: `replicas = 3`, `retention = 7 days`, `cleanup.policy = delete`.

---

## Payload JSON Schema

### 1. `brt.vehicle.position.updated`

**Partition key:** `vehicleId`

```json
{
  "eventId": "evt-uuid-1234",
  "eventType": "VEHICLE_POSITION_UPDATED",
  "timestamp": "2025-02-20T09:30:15.123Z",
  "payload": {
    "vehicleId": "v-001",
    "plateNumber": "29B-001.01",
    "lat": 21.0178,
    "lng": 105.8215,
    "speed": 32.5,
    "heading": 225,
    "tripId": "trip-004",
    "routeId": "r-001",
    "status": "ON_TIME"
  }
}
```

### 2. `brt.vehicle.telemetry.received`

**Partition key:** `vehicleId`

```json
{
  "eventId": "evt-uuid-2345",
  "eventType": "VEHICLE_TELEMETRY_RECEIVED",
  "timestamp": "2025-02-20T09:30:00.000Z",
  "payload": {
    "vehicleId": "v-001",
    "fuelLevel": 72.0,
    "engineTemp": 88.0,
    "batteryVoltage": 24.5,
    "tirePressureFL": 8.2,
    "tirePressureFR": 8.1,
    "tirePressureRL": 8.3,
    "tirePressureRR": 8.2,
    "odometer": 45200.0,
    "acStatus": true
  }
}
```

### 3. `brt.trip.status.changed`

**Partition key:** `routeId`

```json
{
  "eventId": "evt-uuid-3456",
  "eventType": "TRIP_STATUS_CHANGED",
  "timestamp": "2025-02-20T06:01:00.000Z",
  "payload": {
    "tripId": "trip-004",
    "routeId": "r-001",
    "routeCode": "BRT-01",
    "vehicleId": "v-005",
    "vehiclePlate": "29B-001.05",
    "driverId": "d-004",
    "previousStatus": "SCHEDULED",
    "newStatus": "IN_PROGRESS",
    "direction": "OUTBOUND",
    "delayMinutes": 0
  }
}
```

### 4. `brt.incident.created`

**Partition key:** `routeId` (hoặc `"no-route"` nếu null)

```json
{
  "eventId": "evt-uuid-4567",
  "eventType": "INCIDENT_CREATED",
  "timestamp": "2025-02-20T07:30:00.000Z",
  "payload": {
    "incidentId": "inc-001",
    "code": "INC-20250220-001",
    "type": "BREAKDOWN",
    "severity": "P2",
    "title": "Xe BRT-01 bị hỏng hệ thống phanh",
    "vehicleId": "v-008",
    "vehiclePlate": "29B-001.08",
    "routeId": "r-001",
    "routeName": "BRT-01",
    "stationId": null,
    "lat": 20.9885,
    "lng": 105.7918,
    "reportedBy": "Phạm Minh Tuấn",
    "reportedByRole": "DRIVER"
  }
}
```

**Auto-action trigger:**
- `type = BREAKDOWN` → maintenance-service tạo WorkOrder EMERGENCY
- `severity = P1` → notification-service gửi SMS cho OPS_MANAGER

### 5. `brt.incident.status.changed`

**Partition key:** `incidentId`

```json
{
  "eventId": "evt-uuid-5678",
  "eventType": "INCIDENT_STATUS_CHANGED",
  "timestamp": "2025-02-20T07:45:00.000Z",
  "payload": {
    "incidentId": "inc-001",
    "previousStatus": "OPEN",
    "newStatus": "IN_PROGRESS",
    "assignedTo": "u-003",
    "assignedToName": "Lê Văn Dispatcher"
  }
}
```

### 6. `brt.ticket.purchased`

**Partition key:** `ticketTypeId`

```json
{
  "eventId": "evt-uuid-6789",
  "eventType": "TICKET_PURCHASED",
  "timestamp": "2025-02-20T06:15:00.000Z",
  "payload": {
    "transactionId": "tx-001",
    "ticketTypeId": "tt-001",
    "ticketTypeName": "Vé lượt đơn",
    "amount": 7000,
    "paymentMethod": "MOMO",
    "stationId": "s-001",
    "stationName": "Kim Mã",
    "routeId": "r-001"
  }
}
```

### 7. `brt.maintenance.alert`

**Partition key:** `vehicleId`

```json
{
  "eventId": "evt-uuid-7890",
  "eventType": "MAINTENANCE_ALERT",
  "timestamp": "2025-02-21T06:30:00.000Z",
  "payload": {
    "vehicleId": "v-003",
    "vehiclePlate": "29B-001.03",
    "alertType": "ABNORMAL_VIBRATION",
    "description": "Cảnh báo rung động bất thường hệ thống truyền động",
    "severity": "HIGH",
    "telemetrySnapshot": {
      "engineTemp": 95,
      "odometer": 62300
    },
    "autoWorkOrderId": "wo-005"
  }
}
```

### 8. `brt.dispatch.requested`

**Partition key:** `routeId`

```json
{
  "eventId": "evt-uuid-8901",
  "eventType": "DISPATCH_REQUESTED",
  "timestamp": "2025-02-20T07:35:00.000Z",
  "payload": {
    "dispatchId": "dis-001",
    "type": "EMERGENCY",
    "routeId": "r-001",
    "routeName": "BRT-01",
    "reason": "Xe 29B-001.08 hỏng phanh, cần xe thay thế",
    "requestedBy": "Lê Văn Dispatcher",
    "assignedVehiclePlate": "29B-001.06",
    "assignedDriverName": "Lê Hoàng Nam"
  }
}
```

### 9. `brt.passenger.count.updated`

**Partition key:** `stationId`

```json
{
  "eventId": "evt-uuid-9012",
  "eventType": "PASSENGER_COUNT_UPDATED",
  "timestamp": "2025-02-20T08:00:00.000Z",
  "payload": {
    "stationId": "s-001",
    "stationName": "Kim Mã",
    "countIn": 280,
    "countOut": 185,
    "cumulativeOnPlatform": 240
  }
}
```

### 10. `brt.audit.event.logged`

**Partition key:** `userId`

```json
{
  "eventId": "evt-uuid-0123",
  "eventType": "AUDIT_EVENT_LOGGED",
  "timestamp": "2025-02-20T07:15:00.000Z",
  "payload": {
    "auditId": "al-002",
    "userId": "u-002",
    "userName": "Trần Thị Ops Manager",
    "userRole": "OPS_MANAGER",
    "action": "UPDATE",
    "entity": "SCHEDULE",
    "entityId": "sch-001",
    "details": "Cập nhật lịch trình BRT-01",
    "ipAddress": "192.168.1.101"
  }
}
```

---

## Event envelope chuẩn

Tất cả events đều có envelope giống nhau:

```json
{
  "eventId": "string (UUID)",
  "eventType": "string (SCREAMING_SNAKE_CASE)",
  "timestamp": "string (ISO 8601 UTC)",
  "payload": { ... }
}
```

---

## Partition Strategy

| Partition key | Lý do |
|---|---|
| `vehicleId` | GPS data và telemetry cần ordered per vehicle |
| `routeId` | Trip events và dispatch cần ordered per route |
| `stationId` | Passenger count cần ordered per station |
| `ticketTypeId` | Distribute đều ticket events |
| `userId` | Audit events ordered per user |
| `incidentId` | Incident status changes ordered per incident |

---

## Dead Letter Queue (DLQ)

Mỗi topic có DLQ tương ứng:

```
brt.vehicle.position.updated.dlq
brt.incident.created.dlq
...
```

DLQ config: `retention = 30 days`, alert nếu message count > 100.

---

## Consumer Groups

| Consumer Group | Topics subscribed | Service |
|---|---|---|
| `analytics-consumer` | position, telemetry, trip, ticket, passenger-count | analytics-service |
| `notification-consumer` | trip, incident, incident-status, maintenance, dispatch | notification-service |
| `maintenance-consumer` | telemetry, incident | maintenance-service |
| `data-platform-consumer` | position, telemetry, ticket, passenger-count | data-platform-service |
