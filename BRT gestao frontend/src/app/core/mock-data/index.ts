import {
  User, BrtRoute, Vehicle, Station, Driver, Schedule, Trip,
  TicketType, TicketTransaction, Incident, WorkOrder, SparePart,
  VehiclePosition, DashboardStats, PassengerHourlyData, RoutePerformance,
  DriverShift, AppNotification, AuditLog, RevenueReport,
  VehicleTelemetry, ServiceZone, HeadwayData, TripDetail, DispatchRequest,
  TicketRefund, EWallet, NiFiFlowStatus, KafkaTopicStatus, PassengerFeedback,
  ODMatrixEntry, StationPassengerCount
} from '../models';

// ==================== USERS ====================
export const MOCK_USERS: User[] = [
  {
    id: 'u-001', username: 'admin', email: 'admin@brtgestao.com',
    fullName: 'Nguyễn Văn Admin', role: 'ADMIN', phone: '0901234001',
    department: 'IT', isActive: true, createdAt: new Date('2024-01-01'), twoFactorEnabled: true,
    avatar: 'https://ui-avatars.com/api/?name=NV+Admin&background=1a56db&color=fff'
  },
  {
    id: 'u-002', username: 'opsmanager', email: 'ops@brtgestao.com',
    fullName: 'Trần Thị Ops Manager', role: 'OPS_MANAGER', phone: '0901234002',
    department: 'Vận hành', isActive: true, createdAt: new Date('2024-01-15'), twoFactorEnabled: true,
    avatar: 'https://ui-avatars.com/api/?name=TT+Ops&background=059669&color=fff'
  },
  {
    id: 'u-003', username: 'dispatcher1', email: 'dispatch1@brtgestao.com',
    fullName: 'Lê Văn Dispatcher', role: 'DISPATCHER', phone: '0901234003',
    department: 'Điều phối', isActive: true, createdAt: new Date('2024-02-01'), twoFactorEnabled: false,
    avatar: 'https://ui-avatars.com/api/?name=LV+Dis&background=d97706&color=fff'
  },
  {
    id: 'u-004', username: 'driver01', email: 'driver01@brtgestao.com',
    fullName: 'Phạm Minh Tài Xế', role: 'DRIVER', phone: '0901234004',
    department: 'Lái xe', isActive: true, createdAt: new Date('2024-03-01'), twoFactorEnabled: false,
    avatar: 'https://ui-avatars.com/api/?name=PM+TX&background=dc2626&color=fff'
  },
  {
    id: 'u-005', username: 'analyst1', email: 'analyst@brtgestao.com',
    fullName: 'Võ Thị Analyst', role: 'ANALYST', phone: '0901234005',
    department: 'Phân tích', isActive: true, createdAt: new Date('2024-02-15'), twoFactorEnabled: false,
    avatar: 'https://ui-avatars.com/api/?name=VT+An&background=7c3aed&color=fff'
  },
  {
    id: 'u-006', username: 'finance1', email: 'finance@brtgestao.com',
    fullName: 'Hoàng Văn Finance', role: 'FINANCE', phone: '0901234006',
    department: 'Tài chính', isActive: true, createdAt: new Date('2024-03-15'), twoFactorEnabled: true,
    avatar: 'https://ui-avatars.com/api/?name=HV+Fin&background=0891b2&color=fff'
  },
  {
    id: 'u-007', username: 'maint1', email: 'maint@brtgestao.com',
    fullName: 'Đỗ Văn Bảo Trì', role: 'MAINTENANCE', phone: '0901234007',
    department: 'Bảo trì', isActive: true, createdAt: new Date('2024-04-01'), twoFactorEnabled: false,
    avatar: 'https://ui-avatars.com/api/?name=DV+BT&background=65a30d&color=fff'
  }
];

// ==================== ROUTES ====================
export const MOCK_ROUTES: BrtRoute[] = [
  {
    id: 'r-001', code: 'BRT-01', name: 'Kim Mã - Yên Nghĩa', description: 'Tuyến BRT chính đầu tiên của Hà Nội',
    routeType: 'MAIN', status: 'ACTIVE', totalLengthKm: 14.7, avgTravelTimeMin: 45,
    color: '#1a56db',
    stations: [
      { stationId: 's-001', stationName: 'Kim Mã', stationCode: 'S001', order: 1, distanceFromStartKm: 0, travelTimeFromPrevMin: 0, lat: 21.0285, lng: 105.8142 },
      { stationId: 's-002', stationName: 'Giảng Võ', stationCode: 'S002', order: 2, distanceFromStartKm: 0.8, travelTimeFromPrevMin: 3, lat: 21.0258, lng: 105.8198 },
      { stationId: 's-003', stationName: 'Láng Hạ', stationCode: 'S003', order: 3, distanceFromStartKm: 1.5, travelTimeFromPrevMin: 3, lat: 21.0178, lng: 105.8215 },
      { stationId: 's-004', stationName: 'Thái Hà', stationCode: 'S004', order: 4, distanceFromStartKm: 2.5, travelTimeFromPrevMin: 4, lat: 21.0115, lng: 105.8192 },
      { stationId: 's-005', stationName: 'Ngã Tư Sở', stationCode: 'S005', order: 5, distanceFromStartKm: 3.8, travelTimeFromPrevMin: 4, lat: 21.0038, lng: 105.8181 },
      { stationId: 's-006', stationName: 'Khuất Duy Tiến', stationCode: 'S006', order: 6, distanceFromStartKm: 5.2, travelTimeFromPrevMin: 4, lat: 20.9952, lng: 105.8008 },
      { stationId: 's-007', stationName: 'Lê Văn Lương', stationCode: 'S007', order: 7, distanceFromStartKm: 6.8, travelTimeFromPrevMin: 4, lat: 20.9885, lng: 105.7918 },
      { stationId: 's-008', stationName: 'Tố Hữu', stationCode: 'S008', order: 8, distanceFromStartKm: 8.5, travelTimeFromPrevMin: 5, lat: 20.9782, lng: 105.7795 },
      { stationId: 's-009', stationName: 'Lê Trọng Tấn', stationCode: 'S009', order: 9, distanceFromStartKm: 10.2, travelTimeFromPrevMin: 5, lat: 20.9712, lng: 105.7625 },
      { stationId: 's-010', stationName: 'Ba La', stationCode: 'S010', order: 10, distanceFromStartKm: 12.0, travelTimeFromPrevMin: 5, lat: 20.9625, lng: 105.7498 },
      { stationId: 's-011', stationName: 'Yên Nghĩa', stationCode: 'S011', order: 11, distanceFromStartKm: 14.7, travelTimeFromPrevMin: 5, lat: 20.9585, lng: 105.7328 },
    ],
    createdAt: new Date('2024-01-01'), updatedAt: new Date('2025-01-15')
  },
  {
    id: 'r-002', code: 'BRT-02', name: 'Cầu Giấy - Hà Đông', description: 'Tuyến BRT nhánh qua khu đô thị mới',
    routeType: 'MAIN', status: 'ACTIVE', totalLengthKm: 12.3, avgTravelTimeMin: 38,
    color: '#059669',
    stations: [
      { stationId: 's-012', stationName: 'Cầu Giấy', stationCode: 'S012', order: 1, distanceFromStartKm: 0, travelTimeFromPrevMin: 0, lat: 21.0368, lng: 105.7985 },
      { stationId: 's-013', stationName: 'Mỹ Đình', stationCode: 'S013', order: 2, distanceFromStartKm: 1.8, travelTimeFromPrevMin: 4, lat: 21.0285, lng: 105.7822 },
      { stationId: 's-014', stationName: 'Keangnam', stationCode: 'S014', order: 3, distanceFromStartKm: 3.2, travelTimeFromPrevMin: 4, lat: 21.0178, lng: 105.7798 },
      { stationId: 's-015', stationName: 'Trung Hòa', stationCode: 'S015', order: 4, distanceFromStartKm: 5.0, travelTimeFromPrevMin: 5, lat: 21.0085, lng: 105.7888 },
      { stationId: 's-016', stationName: 'Đại lộ Thăng Long', stationCode: 'S016', order: 5, distanceFromStartKm: 7.5, travelTimeFromPrevMin: 6, lat: 20.9952, lng: 105.7685 },
      { stationId: 's-017', stationName: 'Văn Quán', stationCode: 'S017', order: 6, distanceFromStartKm: 10.0, travelTimeFromPrevMin: 6, lat: 20.9745, lng: 105.7558 },
      { stationId: 's-018', stationName: 'Hà Đông', stationCode: 'S018', order: 7, distanceFromStartKm: 12.3, travelTimeFromPrevMin: 5, lat: 20.9625, lng: 105.7465 },
    ],
    createdAt: new Date('2024-03-01'), updatedAt: new Date('2025-02-01')
  },
  {
    id: 'r-003', code: 'BRT-03', name: 'Đông Anh - Hoàn Kiếm', description: 'Tuyến BRT kết nối phía Bắc',
    routeType: 'BRANCH', status: 'ACTIVE', totalLengthKm: 16.5, avgTravelTimeMin: 52,
    color: '#d97706',
    stations: [
      { stationId: 's-019', stationName: 'Đông Anh', stationCode: 'S019', order: 1, distanceFromStartKm: 0, travelTimeFromPrevMin: 0, lat: 21.1392, lng: 105.8488 },
      { stationId: 's-020', stationName: 'Cổ Loa', stationCode: 'S020', order: 2, distanceFromStartKm: 2.8, travelTimeFromPrevMin: 6, lat: 21.1185, lng: 105.8612 },
      { stationId: 's-021', stationName: 'Cầu Đuống', stationCode: 'S021', order: 3, distanceFromStartKm: 5.5, travelTimeFromPrevMin: 7, lat: 21.0928, lng: 105.8585 },
      { stationId: 's-022', stationName: 'Long Biên', stationCode: 'S022', order: 4, distanceFromStartKm: 9.2, travelTimeFromPrevMin: 8, lat: 21.0465, lng: 105.8545 },
      { stationId: 's-023', stationName: 'Hoàn Kiếm', stationCode: 'S023', order: 5, distanceFromStartKm: 16.5, travelTimeFromPrevMin: 10, lat: 21.0285, lng: 105.8542 },
    ],
    createdAt: new Date('2024-06-01'), updatedAt: new Date('2025-01-20')
  },
  {
    id: 'r-004', code: 'BRT-N1', name: 'Tuyến đêm Trung tâm', description: 'Tuyến BRT phục vụ ban đêm khu vực trung tâm',
    routeType: 'NIGHT', status: 'ACTIVE', totalLengthKm: 8.2, avgTravelTimeMin: 28,
    color: '#7c3aed',
    stations: [
      { stationId: 's-023', stationName: 'Hoàn Kiếm', stationCode: 'S023', order: 1, distanceFromStartKm: 0, travelTimeFromPrevMin: 0, lat: 21.0285, lng: 105.8542 },
      { stationId: 's-001', stationName: 'Kim Mã', stationCode: 'S001', order: 2, distanceFromStartKm: 2.5, travelTimeFromPrevMin: 7, lat: 21.0285, lng: 105.8142 },
      { stationId: 's-012', stationName: 'Cầu Giấy', stationCode: 'S012', order: 3, distanceFromStartKm: 5.8, travelTimeFromPrevMin: 10, lat: 21.0368, lng: 105.7985 },
      { stationId: 's-013', stationName: 'Mỹ Đình', stationCode: 'S013', order: 4, distanceFromStartKm: 8.2, travelTimeFromPrevMin: 11, lat: 21.0285, lng: 105.7822 },
    ],
    createdAt: new Date('2024-09-01'), updatedAt: new Date('2025-01-10')
  },
  {
    id: 'r-005', code: 'BRT-S1', name: 'Tuyến đặc biệt Sân vận động', description: 'Tuyến phục vụ sự kiện thể thao lớn',
    routeType: 'SPECIAL', status: 'INACTIVE', totalLengthKm: 5.5, avgTravelTimeMin: 18,
    color: '#dc2626',
    stations: [
      { stationId: 's-013', stationName: 'Mỹ Đình', stationCode: 'S013', order: 1, distanceFromStartKm: 0, travelTimeFromPrevMin: 0, lat: 21.0285, lng: 105.7822 },
      { stationId: 's-014', stationName: 'Keangnam', stationCode: 'S014', order: 2, distanceFromStartKm: 2.0, travelTimeFromPrevMin: 5, lat: 21.0178, lng: 105.7798 },
      { stationId: 's-015', stationName: 'Trung Hòa', stationCode: 'S015', order: 3, distanceFromStartKm: 5.5, travelTimeFromPrevMin: 8, lat: 21.0085, lng: 105.7888 },
    ],
    createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-02-01')
  }
];

// ==================== VEHICLES ====================
export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v-001', plateNumber: '29B-001.01', vehicleType: 'ARTICULATED', capacitySeated: 45, capacityStanding: 80, fuelType: 'CNG', manufacturer: 'Daewoo', model: 'BS120CN', manufactureYear: 2023, currentStatus: 'ACTIVE', currentRouteId: 'r-001', currentRouteName: 'BRT-01', currentDriverId: 'd-001', currentDriverName: 'Phạm Minh Tuấn', totalKm: 45200, lastMaintenanceKm: 42000, lastMaintenanceDate: new Date('2025-01-20'), hasCamera: true, hasTicketScanner: true, hasInfoDisplay: true, gpsDeviceId: 'GPS-001', createdAt: new Date('2023-06-01') },
  { id: 'v-002', plateNumber: '29B-001.02', vehicleType: 'ARTICULATED', capacitySeated: 45, capacityStanding: 80, fuelType: 'CNG', manufacturer: 'Daewoo', model: 'BS120CN', manufactureYear: 2023, currentStatus: 'ACTIVE', currentRouteId: 'r-001', currentRouteName: 'BRT-01', currentDriverId: 'd-002', currentDriverName: 'Nguyễn Văn Hùng', totalKm: 38500, lastMaintenanceKm: 35000, hasCamera: true, hasTicketScanner: true, hasInfoDisplay: true, gpsDeviceId: 'GPS-002', createdAt: new Date('2023-06-01') },
  { id: 'v-003', plateNumber: '29B-001.03', vehicleType: 'STANDARD', capacitySeated: 35, capacityStanding: 50, fuelType: 'DIESEL', manufacturer: 'Thaco', model: 'City Bus 120', manufactureYear: 2022, currentStatus: 'ACTIVE', currentRouteId: 'r-002', currentRouteName: 'BRT-02', currentDriverId: 'd-003', currentDriverName: 'Trần Quốc Bảo', totalKm: 62300, lastMaintenanceKm: 60000, hasCamera: true, hasTicketScanner: true, hasInfoDisplay: true, gpsDeviceId: 'GPS-003', createdAt: new Date('2022-12-01') },
  { id: 'v-004', plateNumber: '29B-001.04', vehicleType: 'STANDARD', capacitySeated: 35, capacityStanding: 50, fuelType: 'DIESEL', manufacturer: 'Thaco', model: 'City Bus 120', manufactureYear: 2022, currentStatus: 'ACTIVE', currentRouteId: 'r-002', currentRouteName: 'BRT-02', totalKm: 58100, lastMaintenanceKm: 55000, hasCamera: true, hasTicketScanner: true, hasInfoDisplay: false, gpsDeviceId: 'GPS-004', createdAt: new Date('2022-12-01') },
  { id: 'v-005', plateNumber: '29B-001.05', vehicleType: 'ELECTRIC', capacitySeated: 40, capacityStanding: 60, fuelType: 'ELECTRIC', manufacturer: 'Vinbus', model: 'VB-E120', manufactureYear: 2024, currentStatus: 'ACTIVE', currentRouteId: 'r-001', currentRouteName: 'BRT-01', totalKm: 12500, lastMaintenanceKm: 10000, hasCamera: true, hasTicketScanner: true, hasInfoDisplay: true, gpsDeviceId: 'GPS-005', createdAt: new Date('2024-03-01') },
  { id: 'v-006', plateNumber: '29B-001.06', vehicleType: 'ELECTRIC', capacitySeated: 40, capacityStanding: 60, fuelType: 'ELECTRIC', manufacturer: 'Vinbus', model: 'VB-E120', manufactureYear: 2024, currentStatus: 'IDLE', totalKm: 8200, lastMaintenanceKm: 5000, hasCamera: true, hasTicketScanner: true, hasInfoDisplay: true, gpsDeviceId: 'GPS-006', createdAt: new Date('2024-03-01') },
  { id: 'v-007', plateNumber: '29B-001.07', vehicleType: 'ARTICULATED', capacitySeated: 45, capacityStanding: 80, fuelType: 'CNG', manufacturer: 'Daewoo', model: 'BS120CN', manufactureYear: 2023, currentStatus: 'MAINTENANCE_REQUIRED', totalKm: 49800, lastMaintenanceKm: 45000, hasCamera: true, hasTicketScanner: true, hasInfoDisplay: true, gpsDeviceId: 'GPS-007', createdAt: new Date('2023-06-01') },
  { id: 'v-008', plateNumber: '29B-001.08', vehicleType: 'STANDARD', capacitySeated: 35, capacityStanding: 50, fuelType: 'HYBRID', manufacturer: 'Thaco', model: 'Hybrid 110', manufactureYear: 2024, currentStatus: 'UNDER_REPAIR', totalKm: 15300, lastMaintenanceKm: 15000, hasCamera: true, hasTicketScanner: true, hasInfoDisplay: true, gpsDeviceId: 'GPS-008', createdAt: new Date('2024-01-15') },
  { id: 'v-009', plateNumber: '29B-001.09', vehicleType: 'MINI', capacitySeated: 20, capacityStanding: 25, fuelType: 'ELECTRIC', manufacturer: 'Vinbus', model: 'VB-Mini', manufactureYear: 2024, currentStatus: 'ACTIVE', currentRouteId: 'r-003', currentRouteName: 'BRT-03', totalKm: 6800, lastMaintenanceKm: 5000, hasCamera: true, hasTicketScanner: true, hasInfoDisplay: true, gpsDeviceId: 'GPS-009', createdAt: new Date('2024-06-01') },
  { id: 'v-010', plateNumber: '29B-001.10', vehicleType: 'STANDARD', capacitySeated: 35, capacityStanding: 50, fuelType: 'CNG', manufacturer: 'Daewoo', model: 'BS106', manufactureYear: 2021, currentStatus: 'DECOMMISSIONED', totalKm: 120000, lastMaintenanceKm: 118000, hasCamera: false, hasTicketScanner: true, hasInfoDisplay: false, gpsDeviceId: 'GPS-010', createdAt: new Date('2021-06-01') },
  { id: 'v-011', plateNumber: '29B-001.11', vehicleType: 'ARTICULATED', capacitySeated: 45, capacityStanding: 80, fuelType: 'CNG', manufacturer: 'Daewoo', model: 'BS120CN', manufactureYear: 2023, currentStatus: 'ACTIVE', currentRouteId: 'r-003', currentRouteName: 'BRT-03', totalKm: 32100, lastMaintenanceKm: 30000, hasCamera: true, hasTicketScanner: true, hasInfoDisplay: true, gpsDeviceId: 'GPS-011', createdAt: new Date('2023-09-01') },
  { id: 'v-012', plateNumber: '29B-001.12', vehicleType: 'STANDARD', capacitySeated: 35, capacityStanding: 50, fuelType: 'DIESEL', manufacturer: 'Thaco', model: 'City Bus 120', manufactureYear: 2023, currentStatus: 'IDLE', totalKm: 28500, lastMaintenanceKm: 25000, hasCamera: true, hasTicketScanner: true, hasInfoDisplay: true, gpsDeviceId: 'GPS-012', createdAt: new Date('2023-08-01') },
];

// ==================== VEHICLE POSITIONS (for real-time map) ====================
export const MOCK_VEHICLE_POSITIONS: VehiclePosition[] = [
  { vehicleId: 'v-001', lat: 21.0178, lng: 105.8215, speed: 32, heading: 225, timestamp: new Date(), status: 'ON_TIME' },
  { vehicleId: 'v-002', lat: 21.0038, lng: 105.8181, speed: 28, heading: 225, timestamp: new Date(), status: 'ON_TIME' },
  { vehicleId: 'v-003', lat: 21.0285, lng: 105.7822, speed: 35, heading: 180, timestamp: new Date(), status: 'SLIGHTLY_DELAYED' },
  { vehicleId: 'v-004', lat: 20.9952, lng: 105.7685, speed: 0, heading: 180, timestamp: new Date(), status: 'SLIGHTLY_DELAYED' },
  { vehicleId: 'v-005', lat: 20.9712, lng: 105.7625, speed: 42, heading: 225, timestamp: new Date(), status: 'ON_TIME' },
  { vehicleId: 'v-009', lat: 21.0928, lng: 105.8585, speed: 38, heading: 200, timestamp: new Date(), status: 'ON_TIME' },
  { vehicleId: 'v-011', lat: 21.0465, lng: 105.8545, speed: 25, heading: 200, timestamp: new Date(), status: 'HEAVILY_DELAYED' },
];

// ==================== STATIONS ====================
export const MOCK_STATIONS: Station[] = [
  { id: 's-001', code: 'S001', name: 'Kim Mã', nameEn: 'Kim Ma', lat: 21.0285, lng: 105.8142, address: 'Số 1 Kim Mã, Ba Đình', district: 'Ba Đình', stationType: 'TERMINAL', gateCount: 4, platformLength: 25, hasCover: true, hasTicketMachine: true, hasRealtimeDisplay: true, hasWifi: true, hasToilet: true, hasElevator: true, bikeParking: true, taxiStand: true, metroConnection: false, status: 'ACTIVE', capacity: 200, currentPassengers: 45, routeIds: ['r-001', 'r-004'], createdAt: new Date('2023-01-01') },
  { id: 's-002', code: 'S002', name: 'Giảng Võ', nameEn: 'Giang Vo', lat: 21.0258, lng: 105.8198, address: '12 Giảng Võ, Đống Đa', district: 'Đống Đa', stationType: 'INLINE', gateCount: 2, platformLength: 18, hasCover: true, hasTicketMachine: true, hasRealtimeDisplay: true, hasWifi: false, hasToilet: false, hasElevator: false, bikeParking: false, taxiStand: false, metroConnection: false, status: 'ACTIVE', capacity: 100, currentPassengers: 22, routeIds: ['r-001'], createdAt: new Date('2023-01-01') },
  { id: 's-003', code: 'S003', name: 'Láng Hạ', nameEn: 'Lang Ha', lat: 21.0178, lng: 105.8215, address: '55 Láng Hạ, Đống Đa', district: 'Đống Đa', stationType: 'INLINE', gateCount: 2, platformLength: 18, hasCover: true, hasTicketMachine: true, hasRealtimeDisplay: true, hasWifi: false, hasToilet: false, hasElevator: false, bikeParking: true, taxiStand: false, metroConnection: false, status: 'ACTIVE', capacity: 120, currentPassengers: 38, routeIds: ['r-001'], createdAt: new Date('2023-01-01') },
  { id: 's-005', code: 'S005', name: 'Ngã Tư Sở', nameEn: 'Nga Tu So', lat: 21.0038, lng: 105.8181, address: 'Ngã Tư Sở, Đống Đa', district: 'Đống Đa', stationType: 'TRANSFER_HUB', gateCount: 6, platformLength: 30, hasCover: true, hasTicketMachine: true, hasRealtimeDisplay: true, hasWifi: true, hasToilet: true, hasElevator: true, bikeParking: true, taxiStand: true, metroConnection: true, status: 'ACTIVE', capacity: 300, currentPassengers: 85, routeIds: ['r-001', 'r-002'], createdAt: new Date('2023-01-01') },
  { id: 's-011', code: 'S011', name: 'Yên Nghĩa', nameEn: 'Yen Nghia', lat: 20.9585, lng: 105.7328, address: 'Bến xe Yên Nghĩa, Hà Đông', district: 'Hà Đông', stationType: 'TERMINAL', gateCount: 6, platformLength: 30, hasCover: true, hasTicketMachine: true, hasRealtimeDisplay: true, hasWifi: true, hasToilet: true, hasElevator: true, bikeParking: true, taxiStand: true, metroConnection: true, status: 'ACTIVE', capacity: 350, currentPassengers: 120, routeIds: ['r-001'], createdAt: new Date('2023-01-01') },
  { id: 's-012', code: 'S012', name: 'Cầu Giấy', nameEn: 'Cau Giay', lat: 21.0368, lng: 105.7985, address: 'Cầu Giấy', district: 'Cầu Giấy', stationType: 'TRANSFER_HUB', gateCount: 4, platformLength: 25, hasCover: true, hasTicketMachine: true, hasRealtimeDisplay: true, hasWifi: true, hasToilet: true, hasElevator: false, bikeParking: true, taxiStand: true, metroConnection: false, status: 'ACTIVE', capacity: 250, currentPassengers: 62, routeIds: ['r-002', 'r-004'], createdAt: new Date('2024-03-01') },
  { id: 's-013', code: 'S013', name: 'Mỹ Đình', nameEn: 'My Dinh', lat: 21.0285, lng: 105.7822, address: 'Khu vực Mỹ Đình, Nam Từ Liêm', district: 'Nam Từ Liêm', stationType: 'TRANSFER_HUB', gateCount: 6, platformLength: 30, hasCover: true, hasTicketMachine: true, hasRealtimeDisplay: true, hasWifi: true, hasToilet: true, hasElevator: true, bikeParking: true, taxiStand: true, metroConnection: false, status: 'ACTIVE', capacity: 400, currentPassengers: 156, routeIds: ['r-002', 'r-004', 'r-005'], createdAt: new Date('2024-03-01') },
  { id: 's-023', code: 'S023', name: 'Hoàn Kiếm', nameEn: 'Hoan Kiem', lat: 21.0285, lng: 105.8542, address: 'Quận Hoàn Kiếm', district: 'Hoàn Kiếm', stationType: 'TERMINAL', gateCount: 4, platformLength: 25, hasCover: true, hasTicketMachine: true, hasRealtimeDisplay: true, hasWifi: true, hasToilet: true, hasElevator: true, bikeParking: true, taxiStand: true, metroConnection: true, status: 'ACTIVE', capacity: 300, currentPassengers: 92, routeIds: ['r-003', 'r-004'], createdAt: new Date('2024-06-01') },
];

// ==================== DRIVERS ====================
export const MOCK_DRIVERS: Driver[] = [
  { id: 'd-001', fullName: 'Phạm Minh Tuấn', employeeCode: 'DRV-001', nationalId: '001234567890', phone: '0912345001', email: 'tuan.pm@brt.com', licenseNumber: 'B2-123456', licenseClass: 'D', licenseExpiry: new Date('2027-06-15'), licenseAuthority: 'Sở GTVT Hà Nội', hireDate: new Date('2023-01-15'), department: 'Đội xe 1', rank: 'Tài xế chính', status: 'ON_DUTY', certifications: ['BRT Certified', 'Defensive Driving'], healthCheckDate: new Date('2025-01-10'), healthCheckResult: 'Đạt', totalTrips: 2450, otpScore: 96.5, rating: 4.8, violationCount: 0, ecoScore: 92, currentVehicleId: 'v-001', currentRouteId: 'r-001', createdAt: new Date('2023-01-15') },
  { id: 'd-002', fullName: 'Nguyễn Văn Hùng', employeeCode: 'DRV-002', nationalId: '001234567891', phone: '0912345002', licenseNumber: 'B2-234567', licenseClass: 'D', licenseExpiry: new Date('2026-12-20'), licenseAuthority: 'Sở GTVT Hà Nội', hireDate: new Date('2023-03-01'), department: 'Đội xe 1', rank: 'Tài xế', status: 'ON_DUTY', certifications: ['BRT Certified'], totalTrips: 2100, otpScore: 93.2, rating: 4.6, violationCount: 1, ecoScore: 88, currentVehicleId: 'v-002', currentRouteId: 'r-001', createdAt: new Date('2023-03-01') },
  { id: 'd-003', fullName: 'Trần Quốc Bảo', employeeCode: 'DRV-003', nationalId: '001234567892', phone: '0912345003', licenseNumber: 'B2-345678', licenseClass: 'D', licenseExpiry: new Date('2028-03-10'), licenseAuthority: 'Sở GTVT Hà Nội', hireDate: new Date('2023-06-01'), department: 'Đội xe 2', rank: 'Tài xế', status: 'ON_DUTY', certifications: ['BRT Certified', 'First Aid'], totalTrips: 1850, otpScore: 91.8, rating: 4.5, violationCount: 2, ecoScore: 85, currentVehicleId: 'v-003', currentRouteId: 'r-002', createdAt: new Date('2023-06-01') },
  { id: 'd-004', fullName: 'Lê Hoàng Nam', employeeCode: 'DRV-004', nationalId: '001234567893', phone: '0912345004', licenseNumber: 'B2-456789', licenseClass: 'D', licenseExpiry: new Date('2026-08-22'), licenseAuthority: 'Sở GTVT Hà Nội', hireDate: new Date('2024-01-10'), department: 'Đội xe 2', rank: 'Tài xế mới', status: 'AVAILABLE', certifications: ['BRT Certified'], totalTrips: 680, otpScore: 89.5, rating: 4.3, violationCount: 0, ecoScore: 90, createdAt: new Date('2024-01-10') },
  { id: 'd-005', fullName: 'Vũ Đức Thắng', employeeCode: 'DRV-005', nationalId: '001234567894', phone: '0912345005', licenseNumber: 'B2-567890', licenseClass: 'D', licenseExpiry: new Date('2025-04-15'), licenseAuthority: 'Sở GTVT Hà Nội', hireDate: new Date('2022-06-01'), department: 'Đội xe 1', rank: 'Tài xế chính', status: 'ON_LEAVE', certifications: ['BRT Certified', 'Defensive Driving', 'First Aid'], totalTrips: 3200, otpScore: 97.1, rating: 4.9, violationCount: 0, ecoScore: 95, createdAt: new Date('2022-06-01') },
  { id: 'd-006', fullName: 'Đặng Văn Phú', employeeCode: 'DRV-006', nationalId: '001234567895', phone: '0912345006', licenseNumber: 'B2-678901', licenseClass: 'D', licenseExpiry: new Date('2027-11-30'), licenseAuthority: 'Sở GTVT Hà Nội', hireDate: new Date('2024-06-01'), department: 'Đội xe 3', rank: 'Tài xế', status: 'ON_DUTY', certifications: ['BRT Certified'], totalTrips: 420, otpScore: 88.2, rating: 4.2, violationCount: 1, ecoScore: 82, currentVehicleId: 'v-009', currentRouteId: 'r-003', createdAt: new Date('2024-06-01') },
  { id: 'd-007', fullName: 'Bùi Thanh Sơn', employeeCode: 'DRV-007', nationalId: '001234567896', phone: '0912345007', licenseNumber: 'B2-789012', licenseClass: 'D', licenseExpiry: new Date('2026-05-18'), licenseAuthority: 'Sở GTVT Hà Nội', hireDate: new Date('2023-09-15'), department: 'Đội xe 1', rank: 'Tài xế', status: 'OFF_DUTY', certifications: ['BRT Certified'], totalTrips: 1520, otpScore: 94.0, rating: 4.7, violationCount: 0, ecoScore: 91, createdAt: new Date('2023-09-15') },
  { id: 'd-008', fullName: 'Hoàng Minh Đức', employeeCode: 'DRV-008', nationalId: '001234567897', phone: '0912345008', licenseNumber: 'B2-890123', licenseClass: 'D', licenseExpiry: new Date('2027-02-28'), licenseAuthority: 'Sở GTVT HCM', hireDate: new Date('2024-03-01'), department: 'Đội xe 2', rank: 'Tài xế', status: 'SUSPENDED', certifications: ['BRT Certified'], totalTrips: 580, otpScore: 78.5, rating: 3.8, violationCount: 5, ecoScore: 72, createdAt: new Date('2024-03-01') },
];

// ==================== TICKET TYPES ====================
export const MOCK_TICKET_TYPES: TicketType[] = [
  { id: 'tt-001', name: 'Vé lượt đơn', code: 'SINGLE', description: '1 chuyến một tuyến', price: 7000, validityType: 'SINGLE_ROUTE', validityDuration: 'Trong ngày', discount: 0, isActive: true, createdAt: new Date('2023-01-01') },
  { id: 'tt-002', name: 'Vé lượt toàn mạng', code: 'SINGLE_ALL', description: '1 chuyến mọi tuyến', price: 12000, validityType: 'ALL_ROUTES', validityDuration: 'Trong ngày', discount: 0, isActive: true, createdAt: new Date('2023-01-01') },
  { id: 'tt-003', name: 'Thẻ ngày', code: 'DAY_PASS', description: 'Không giới hạn chuyến', price: 30000, validityType: 'DAY_PASS', validityDuration: '24 giờ', discount: 0, isActive: true, createdAt: new Date('2023-01-01') },
  { id: 'tt-004', name: 'Thẻ tháng', code: 'MONTHLY', description: 'Không giới hạn chuyến trong tháng', price: 200000, validityType: 'MONTHLY', validityDuration: '30 ngày', discount: 20, isActive: true, createdAt: new Date('2023-01-01') },
  { id: 'tt-005', name: 'Vé gia đình', code: 'FAMILY', description: 'Nhóm tối đa 5 người', price: 25000, validityType: 'FAMILY', validityDuration: 'Theo lượt', discount: 15, isActive: true, maxUsesPerDay: 5, createdAt: new Date('2023-06-01') },
  { id: 'tt-006', name: 'Vé ưu đãi - Học sinh', code: 'STUDENT', description: 'Dành cho học sinh, sinh viên', price: 3500, validityType: 'DISCOUNTED', validityDuration: 'Trong ngày', discount: 50, isActive: true, createdAt: new Date('2023-01-01') },
  { id: 'tt-007', name: 'Vé ưu đãi - Người cao tuổi', code: 'SENIOR', description: 'Dành cho người trên 60 tuổi', price: 0, validityType: 'DISCOUNTED', validityDuration: 'Trong ngày', discount: 100, isActive: true, createdAt: new Date('2023-01-01') },
];

// ==================== INCIDENTS ====================
export const MOCK_INCIDENTS: Incident[] = [
  { id: 'inc-001', code: 'INC-20250220-001', type: 'BREAKDOWN', severity: 'P2', title: 'Xe BRT-01 bị hỏng hệ thống phanh', description: 'Xe 29B-001.08 phát hiện hệ thống phanh có tiếng kêu bất thường tại trạm Lê Văn Lương', status: 'IN_PROGRESS', reportedBy: 'Phạm Minh Tuấn', reportedByRole: 'DRIVER', assignedTo: 'u-003', assignedToName: 'Lê Văn Dispatcher', vehicleId: 'v-008', vehiclePlate: '29B-001.08', routeId: 'r-001', routeName: 'BRT-01', lat: 20.9885, lng: 105.7918, createdAt: new Date('2025-02-20T07:30:00'), updatedAt: new Date('2025-02-20T07:45:00') },
  { id: 'inc-002', code: 'INC-20250220-002', type: 'DELAY', severity: 'P3', title: 'Tắc đường khu vực Ngã Tư Sở', description: 'Ùn tắc giao thông nghiêm trọng tại khu vực Ngã Tư Sở, ảnh hưởng tuyến BRT-01', status: 'ASSIGNED', reportedBy: 'Hệ thống', reportedByRole: 'SYSTEM', assignedTo: 'u-003', assignedToName: 'Lê Văn Dispatcher', routeId: 'r-001', routeName: 'BRT-01', lat: 21.0038, lng: 105.8181, createdAt: new Date('2025-02-20T08:15:00'), updatedAt: new Date('2025-02-20T08:20:00') },
  { id: 'inc-003', code: 'INC-20250220-003', type: 'EQUIPMENT_FAILURE', severity: 'P4', title: 'Máy soát vé trạm Mỹ Đình hỏng', description: 'Cổng soát vé số 3 tại trạm Mỹ Đình không hoạt động', status: 'OPEN', reportedBy: 'Nhân viên trạm', reportedByRole: 'STAFF', stationId: 's-013', stationName: 'Mỹ Đình', createdAt: new Date('2025-02-20T09:00:00'), updatedAt: new Date('2025-02-20T09:00:00') },
  { id: 'inc-004', code: 'INC-20250219-001', type: 'SPEEDING', severity: 'P3', title: 'Vi phạm tốc độ trên tuyến BRT-02', description: 'Xe 29B-001.03 vượt quá tốc độ 60km/h tại đoạn Đại lộ Thăng Long', status: 'RESOLVED', reportedBy: 'Hệ thống', reportedByRole: 'SYSTEM', vehicleId: 'v-003', vehiclePlate: '29B-001.03', routeId: 'r-002', routeName: 'BRT-02', resolution: 'Đã nhắc nhở tài xế và ghi nhận vi phạm', createdAt: new Date('2025-02-19T14:30:00'), updatedAt: new Date('2025-02-19T15:00:00'), resolvedAt: new Date('2025-02-19T15:00:00') },
  { id: 'inc-005', code: 'INC-20250219-002', type: 'AC_FAILURE', severity: 'P4', title: 'Điều hòa xe 29B-001.04 không hoạt động', description: 'Hành khách phản ánh điều hòa trên xe 29B-001.04 không mát', status: 'CLOSED', reportedBy: 'Hành khách', reportedByRole: 'PASSENGER', vehicleId: 'v-004', vehiclePlate: '29B-001.04', routeId: 'r-002', routeName: 'BRT-02', resolution: 'Đã sửa chữa và kiểm tra lại hệ thống điều hòa', createdAt: new Date('2025-02-19T10:00:00'), updatedAt: new Date('2025-02-19T16:00:00'), resolvedAt: new Date('2025-02-19T16:00:00') },
];

// ==================== WORK ORDERS ====================
export const MOCK_WORK_ORDERS: WorkOrder[] = [
  { id: 'wo-001', code: 'WO-20250220-001', vehicleId: 'v-008', vehiclePlate: '29B-001.08', type: 'EMERGENCY', priority: 'HIGH', description: 'Sửa chữa hệ thống phanh', status: 'IN_PROGRESS', assignedTechnicianId: 'tech-001', assignedTechnicianName: 'Nguyễn Kỹ Thuật', laborCost: 500000, partsCost: 2500000, downtimeHours: 8, createdAt: new Date('2025-02-20T08:00:00'), updatedAt: new Date('2025-02-20T09:00:00') },
  { id: 'wo-002', code: 'WO-20250220-002', vehicleId: 'v-007', vehiclePlate: '29B-001.07', type: 'SCHEDULED', priority: 'MEDIUM', description: 'Bảo dưỡng định kỳ 50.000km', status: 'OPEN', laborCost: 0, partsCost: 0, downtimeHours: 0, scheduledDate: new Date('2025-02-22'), maintenanceType: '50000km Service', createdAt: new Date('2025-02-20T07:00:00'), updatedAt: new Date('2025-02-20T07:00:00') },
  { id: 'wo-003', code: 'WO-20250218-001', vehicleId: 'v-004', vehiclePlate: '29B-001.04', type: 'EMERGENCY', priority: 'MEDIUM', description: 'Sửa chữa hệ thống điều hòa', status: 'COMPLETED', assignedTechnicianId: 'tech-002', assignedTechnicianName: 'Trần Bảo Trì', laborCost: 300000, partsCost: 1200000, downtimeHours: 4, completedDate: new Date('2025-02-19'), createdAt: new Date('2025-02-18T10:00:00'), updatedAt: new Date('2025-02-19T16:00:00') },
  { id: 'wo-004', code: 'WO-20250221-001', vehicleId: 'v-001', vehiclePlate: '29B-001.01', type: 'SCHEDULED', priority: 'LOW', description: 'Thay dầu động cơ định kỳ 5.000km', status: 'OPEN', laborCost: 0, partsCost: 0, downtimeHours: 0, scheduledDate: new Date('2025-02-25'), maintenanceType: '5000km Oil Change', createdAt: new Date('2025-02-21T07:00:00'), updatedAt: new Date('2025-02-21T07:00:00') },
  { id: 'wo-005', code: 'WO-20250221-002', vehicleId: 'v-003', vehiclePlate: '29B-001.03', type: 'PREDICTIVE', priority: 'HIGH', description: 'Kiểm tra hệ thống truyền động - cảnh báo rung động bất thường', status: 'WAITING_PARTS', assignedTechnicianId: 'tech-001', assignedTechnicianName: 'Nguyễn Kỹ Thuật', laborCost: 800000, partsCost: 4500000, downtimeHours: 12, scheduledDate: new Date('2025-02-23'), maintenanceType: 'Predictive - Drivetrain', createdAt: new Date('2025-02-21T06:30:00'), updatedAt: new Date('2025-02-21T08:00:00') },
  { id: 'wo-006', code: 'WO-20250215-001', vehicleId: 'v-002', vehiclePlate: '29B-001.02', type: 'SCHEDULED', priority: 'MEDIUM', description: 'Kiểm tra và thay lốp xe trước', status: 'CLOSED', assignedTechnicianId: 'tech-002', assignedTechnicianName: 'Trần Bảo Trì', laborCost: 200000, partsCost: 9000000, downtimeHours: 3, completedDate: new Date('2025-02-16'), maintenanceType: 'Tire Replacement', createdAt: new Date('2025-02-15T08:00:00'), updatedAt: new Date('2025-02-16T14:00:00') },
];

// ==================== SPARE PARTS ====================
export const MOCK_SPARE_PARTS: SparePart[] = [
  { id: 'sp-001', code: 'SP-BRK-001', name: 'Má phanh đĩa trước', category: 'Phanh', supplier: 'Daewoo Parts VN', currentStock: 24, minStock: 10, unitPrice: 850000, lastRestockDate: new Date('2025-02-10') },
  { id: 'sp-002', code: 'SP-BRK-002', name: 'Đĩa phanh', category: 'Phanh', supplier: 'Daewoo Parts VN', currentStock: 8, minStock: 6, unitPrice: 2200000, lastRestockDate: new Date('2025-01-25') },
  { id: 'sp-003', code: 'SP-ENG-001', name: 'Dầu động cơ 15W-40 (20L)', category: 'Động cơ', supplier: 'Shell VN', currentStock: 30, minStock: 15, unitPrice: 1500000 },
  { id: 'sp-004', code: 'SP-TIR-001', name: 'Lốp xe 275/70R22.5', category: 'Lốp', supplier: 'Bridgestone VN', currentStock: 12, minStock: 8, unitPrice: 4500000 },
  { id: 'sp-005', code: 'SP-AC-001', name: 'Gas điều hòa R134a', category: 'Điều hòa', supplier: 'Daikin VN', currentStock: 3, minStock: 5, unitPrice: 180000 },
  { id: 'sp-006', code: 'SP-ELE-001', name: 'Ắc quy 12V 150Ah', category: 'Điện', supplier: 'GS Battery', currentStock: 6, minStock: 4, unitPrice: 3200000 },
];

// ==================== SCHEDULES ====================
export const MOCK_SCHEDULES: Schedule[] = [
  {
    id: 'sch-001', routeId: 'r-001', routeName: 'Kim Mã - Yên Nghĩa', routeCode: 'BRT-01',
    operatingHoursStart: '05:00', operatingHoursEnd: '23:00',
    peakFrequencyMin: 5, normalFrequencyMin: 10, offPeakFrequencyMin: 15,
    requiredVehicles: 8, requiredDrivers: 12,
    effectiveDate: new Date('2025-01-01'), scheduleType: 'WEEKDAY', status: 'ACTIVE',
    trips: [], createdAt: new Date('2024-12-20')
  },
  {
    id: 'sch-002', routeId: 'r-002', routeName: 'Cầu Giấy - Hà Đông', routeCode: 'BRT-02',
    operatingHoursStart: '05:30', operatingHoursEnd: '22:30',
    peakFrequencyMin: 7, normalFrequencyMin: 12, offPeakFrequencyMin: 18,
    requiredVehicles: 5, requiredDrivers: 8,
    effectiveDate: new Date('2025-01-01'), scheduleType: 'WEEKDAY', status: 'ACTIVE',
    trips: [], createdAt: new Date('2024-12-20')
  },
  {
    id: 'sch-003', routeId: 'r-003', routeName: 'Đông Anh - Hoàn Kiếm', routeCode: 'BRT-03',
    operatingHoursStart: '05:15', operatingHoursEnd: '22:00',
    peakFrequencyMin: 8, normalFrequencyMin: 15, offPeakFrequencyMin: 20,
    requiredVehicles: 4, requiredDrivers: 6,
    effectiveDate: new Date('2025-01-01'), scheduleType: 'WEEKDAY', status: 'ACTIVE',
    trips: [], createdAt: new Date('2024-12-20')
  }
];

// ==================== NOTIFICATIONS ====================
export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n-001', type: 'ALERT', title: 'Xe BRT hỏng phanh', message: 'Xe 29B-001.08 bị hỏng phanh tại Lê Văn Lương', channel: 'WEB', targetAudience: 'OPERATORS', isRead: false, relatedEntityId: 'inc-001', relatedEntityType: 'INCIDENT', createdAt: new Date('2025-02-20T07:30:00') },
  { id: 'n-002', type: 'WARNING', title: 'Tắc đường Ngã Tư Sở', message: 'Ùn tắc giao thông ảnh hưởng tuyến BRT-01', channel: 'WEB', targetAudience: 'ALL', isRead: false, relatedEntityId: 'inc-002', relatedEntityType: 'INCIDENT', createdAt: new Date('2025-02-20T08:15:00') },
  { id: 'n-003', type: 'INFO', title: 'Bảo dưỡng xe lên lịch', message: 'Xe 29B-001.07 cần bảo dưỡng 50.000km vào 22/02', channel: 'WEB', targetAudience: 'OPERATORS', isRead: false, relatedEntityId: 'wo-002', relatedEntityType: 'WORK_ORDER', createdAt: new Date('2025-02-20T07:00:00') },
  { id: 'n-004', type: 'WARNING', title: 'Phụ tùng sắp hết', message: 'Gas điều hòa R134a còn 3 đơn vị, dưới mức tối thiểu', channel: 'WEB', targetAudience: 'OPERATORS', isRead: true, createdAt: new Date('2025-02-19T16:00:00') },
  { id: 'n-005', type: 'SUCCESS', title: 'Sửa chữa hoàn thành', message: 'Xe 29B-001.04 đã sửa xong hệ thống điều hòa', channel: 'WEB', targetAudience: 'OPERATORS', isRead: true, relatedEntityId: 'wo-003', relatedEntityType: 'WORK_ORDER', createdAt: new Date('2025-02-19T16:00:00') },
];

// ==================== DASHBOARD STATS ====================
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  activeVehicles: 7,
  totalVehicles: 12,
  passengersToday: 12845,
  passengersChange: 12.5,
  avgOtp: 94.2,
  delayedVehicles: 2,
  revenueToday: 185600000,
  revenueChange: 8.3,
  activeIncidents: 3,
  totalTripsToday: 156,
  completedTrips: 89,
  activeRoutes: 4,
};

export const MOCK_PASSENGER_HOURLY: PassengerHourlyData[] = [
  { hour: 5, count: 120 }, { hour: 6, count: 890 }, { hour: 7, count: 2450 },
  { hour: 8, count: 3200 }, { hour: 9, count: 1850 }, { hour: 10, count: 1200 },
  { hour: 11, count: 980 }, { hour: 12, count: 1450 }, { hour: 13, count: 1100 },
  { hour: 14, count: 950 }, { hour: 15, count: 1050 }, { hour: 16, count: 1680 },
  { hour: 17, count: 2800 }, { hour: 18, count: 3100 }, { hour: 19, count: 1950 },
  { hour: 20, count: 1200 }, { hour: 21, count: 680 }, { hour: 22, count: 320 },
];

export const MOCK_ROUTE_PERFORMANCE: RoutePerformance[] = [
  { routeId: 'r-001', routeName: 'Kim Mã - Yên Nghĩa', routeCode: 'BRT-01', otp: 94.5, totalPassengers: 5280, totalTrips: 68, completedTrips: 42, incidents: 2, revenue: 78500000 },
  { routeId: 'r-002', routeName: 'Cầu Giấy - Hà Đông', routeCode: 'BRT-02', otp: 91.8, totalPassengers: 3650, totalTrips: 48, completedTrips: 28, incidents: 1, revenue: 52300000 },
  { routeId: 'r-003', routeName: 'Đông Anh - Hoàn Kiếm', routeCode: 'BRT-03', otp: 96.2, totalPassengers: 2815, totalTrips: 32, completedTrips: 18, incidents: 0, revenue: 38200000 },
  { routeId: 'r-004', routeName: 'Tuyến đêm Trung tâm', routeCode: 'BRT-N1', otp: 98.0, totalPassengers: 1100, totalTrips: 8, completedTrips: 5, incidents: 0, revenue: 16600000 },
];

// ==================== AUDIT LOGS ====================
export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'al-001', userId: 'u-001', userName: 'Nguyễn Văn Admin', action: 'LOGIN', entity: 'AUTH', entityId: 'u-001', details: 'Đăng nhập thành công', ipAddress: '192.168.1.100', timestamp: new Date('2025-02-20T07:00:00') },
  { id: 'al-002', userId: 'u-002', userName: 'Trần Thị Ops Manager', action: 'UPDATE', entity: 'SCHEDULE', entityId: 'sch-001', details: 'Cập nhật lịch trình BRT-01', ipAddress: '192.168.1.101', timestamp: new Date('2025-02-20T07:15:00') },
  { id: 'al-003', userId: 'u-003', userName: 'Lê Văn Dispatcher', action: 'CREATE', entity: 'INCIDENT', entityId: 'inc-001', details: 'Tạo sự cố xe hỏng phanh', ipAddress: '192.168.1.102', timestamp: new Date('2025-02-20T07:45:00') },
  { id: 'al-004', userId: 'u-001', userName: 'Nguyễn Văn Admin', action: 'UPDATE', entity: 'USER', entityId: 'u-008', details: 'Tạm khóa tài khoản DRV-008', ipAddress: '192.168.1.100', timestamp: new Date('2025-02-19T16:30:00') },
  { id: 'al-005', userId: 'u-006', userName: 'Hoàng Văn Finance', action: 'EXPORT', entity: 'REPORT', entityId: 'rpt-daily-0219', details: 'Xuất báo cáo doanh thu ngày 19/02', ipAddress: '192.168.1.105', timestamp: new Date('2025-02-19T23:30:00') },
];

// Login credentials for testing
export const MOCK_CREDENTIALS = [
  { username: 'admin', password: 'admin123', userId: 'u-001' },
  { username: 'opsmanager', password: 'ops123', userId: 'u-002' },
  { username: 'dispatcher1', password: 'disp123', userId: 'u-003' },
  { username: 'driver01', password: 'drv123', userId: 'u-004' },
  { username: 'analyst1', password: 'ana123', userId: 'u-005' },
  { username: 'finance1', password: 'fin123', userId: 'u-006' },
  { username: 'maint1', password: 'mnt123', userId: 'u-007' },
];

// ==================== TICKET TRANSACTIONS ====================
export const MOCK_TICKET_TRANSACTIONS: TicketTransaction[] = [
  { id: 'tx-001', ticketTypeId: 'tt-001', ticketTypeName: 'Vé lượt đơn', amount: 7000, paymentMethod: 'MOMO', status: 'COMPLETED', stationId: 's-001', stationName: 'Kim Mã', routeId: 'r-001', createdAt: new Date('2025-02-20T06:15:00') },
  { id: 'tx-002', ticketTypeId: 'tt-004', ticketTypeName: 'Thẻ tháng', amount: 200000, paymentMethod: 'VNPAY', status: 'COMPLETED', createdAt: new Date('2025-02-20T06:30:00') },
  { id: 'tx-003', ticketTypeId: 'tt-002', ticketTypeName: 'Vé lượt toàn mạng', amount: 12000, paymentMethod: 'BRT_WALLET', status: 'COMPLETED', stationId: 's-005', stationName: 'Ngã Tư Sở', createdAt: new Date('2025-02-20T07:00:00') },
  { id: 'tx-004', ticketTypeId: 'tt-003', ticketTypeName: 'Thẻ ngày', amount: 30000, paymentMethod: 'BANK_CARD', status: 'COMPLETED', createdAt: new Date('2025-02-20T07:15:00') },
  { id: 'tx-005', ticketTypeId: 'tt-001', ticketTypeName: 'Vé lượt đơn', amount: 7000, paymentMethod: 'MOMO', status: 'FAILED', createdAt: new Date('2025-02-20T07:20:00') },
  { id: 'tx-006', ticketTypeId: 'tt-005', ticketTypeName: 'Vé gia đình', amount: 25000, paymentMethod: 'VNPAY', status: 'COMPLETED', stationId: 's-012', stationName: 'Cầu Giấy', createdAt: new Date('2025-02-20T07:45:00') },
  { id: 'tx-007', ticketTypeId: 'tt-006', ticketTypeName: 'Vé ưu đãi - Học sinh', amount: 3500, paymentMethod: 'BRT_WALLET', status: 'COMPLETED', stationId: 's-013', stationName: 'Mỹ Đình', createdAt: new Date('2025-02-20T08:00:00') },
  { id: 'tx-008', ticketTypeId: 'tt-001', ticketTypeName: 'Vé lượt đơn', amount: 7000, paymentMethod: 'CASH', status: 'COMPLETED', stationId: 's-023', stationName: 'Hoàn Kiếm', createdAt: new Date('2025-02-20T08:30:00') },
  { id: 'tx-009', ticketTypeId: 'tt-002', ticketTypeName: 'Vé lượt toàn mạng', amount: 12000, paymentMethod: 'MOMO', status: 'PENDING', createdAt: new Date('2025-02-20T09:00:00') },
  { id: 'tx-010', ticketTypeId: 'tt-007', ticketTypeName: 'Vé ưu đãi - Người cao tuổi', amount: 0, paymentMethod: 'BRT_WALLET', status: 'COMPLETED', stationId: 's-011', stationName: 'Yên Nghĩa', createdAt: new Date('2025-02-20T09:15:00') },
];

// ==================== DRIVER SHIFTS ====================
export const MOCK_DRIVER_SHIFTS: DriverShift[] = [
  { id: 'sh-001', driverId: 'd-001', driverName: 'Phạm Minh Tuấn', shiftType: 'MORNING', startTime: new Date('2025-02-20T05:00:00'), endTime: new Date('2025-02-20T13:00:00'), routeId: 'r-001', routeName: 'BRT-01', vehicleId: 'v-001', vehiclePlate: '29B-001.01', status: 'IN_PROGRESS' },
  { id: 'sh-002', driverId: 'd-002', driverName: 'Nguyễn Văn Hùng', shiftType: 'MORNING', startTime: new Date('2025-02-20T05:30:00'), endTime: new Date('2025-02-20T13:30:00'), routeId: 'r-001', routeName: 'BRT-01', vehicleId: 'v-002', vehiclePlate: '29B-001.02', status: 'IN_PROGRESS' },
  { id: 'sh-003', driverId: 'd-003', driverName: 'Trần Quốc Bảo', shiftType: 'MORNING', startTime: new Date('2025-02-20T05:30:00'), endTime: new Date('2025-02-20T13:30:00'), routeId: 'r-002', routeName: 'BRT-02', vehicleId: 'v-003', vehiclePlate: '29B-001.03', status: 'IN_PROGRESS' },
  { id: 'sh-004', driverId: 'd-006', driverName: 'Đặng Văn Phú', shiftType: 'MORNING', startTime: new Date('2025-02-20T05:15:00'), endTime: new Date('2025-02-20T13:15:00'), routeId: 'r-003', routeName: 'BRT-03', vehicleId: 'v-009', vehiclePlate: '29B-001.09', status: 'IN_PROGRESS' },
  { id: 'sh-005', driverId: 'd-004', driverName: 'Lê Hoàng Nam', shiftType: 'AFTERNOON', startTime: new Date('2025-02-20T13:00:00'), endTime: new Date('2025-02-20T21:00:00'), routeId: 'r-001', routeName: 'BRT-01', status: 'SCHEDULED' },
  { id: 'sh-006', driverId: 'd-007', driverName: 'Bùi Thanh Sơn', shiftType: 'AFTERNOON', startTime: new Date('2025-02-20T13:30:00'), endTime: new Date('2025-02-20T21:30:00'), routeId: 'r-002', routeName: 'BRT-02', status: 'SCHEDULED' },
  { id: 'sh-007', driverId: 'd-001', driverName: 'Phạm Minh Tuấn', shiftType: 'MORNING', startTime: new Date('2025-02-21T05:00:00'), endTime: new Date('2025-02-21T13:00:00'), routeId: 'r-001', routeName: 'BRT-01', status: 'SCHEDULED' },
  { id: 'sh-008', driverId: 'd-003', driverName: 'Trần Quốc Bảo', shiftType: 'EVENING', startTime: new Date('2025-02-20T21:00:00'), endTime: new Date('2025-02-21T05:00:00'), routeId: 'r-004', routeName: 'BRT-N1', status: 'SCHEDULED' },
];

// ==================== VEHICLE TELEMETRY ====================
export const MOCK_VEHICLE_TELEMETRY: VehicleTelemetry[] = [
  { vehicleId: 'v-001', fuelLevel: 72, engineTemp: 88, batteryVoltage: 24.5, tirePressureFL: 8.2, tirePressureFR: 8.1, tirePressureRL: 8.3, tirePressureRR: 8.2, odometer: 45200, acStatus: true, timestamp: new Date() },
  { vehicleId: 'v-002', fuelLevel: 55, engineTemp: 92, batteryVoltage: 24.1, tirePressureFL: 8.0, tirePressureFR: 7.9, tirePressureRL: 8.1, tirePressureRR: 8.0, odometer: 38500, acStatus: true, timestamp: new Date() },
  { vehicleId: 'v-003', fuelLevel: 38, engineTemp: 95, batteryVoltage: 23.8, tirePressureFL: 7.8, tirePressureFR: 7.7, tirePressureRL: 7.9, tirePressureRR: 7.8, odometer: 62300, acStatus: true, timestamp: new Date() },
  { vehicleId: 'v-005', fuelLevel: 85, engineTemp: 42, batteryVoltage: 380, tirePressureFL: 8.5, tirePressureFR: 8.5, tirePressureRL: 8.6, tirePressureRR: 8.5, odometer: 12500, acStatus: true, timestamp: new Date() },
  { vehicleId: 'v-009', fuelLevel: 92, engineTemp: 38, batteryVoltage: 395, tirePressureFL: 8.8, tirePressureFR: 8.7, tirePressureRL: 8.8, tirePressureRR: 8.8, odometer: 6800, acStatus: true, timestamp: new Date() },
];

// ==================== SERVICE ZONES ====================
export const MOCK_SERVICE_ZONES: ServiceZone[] = [
  { id: 'z-001', name: 'Trung tâm Hà Nội', type: 'CENTER', population: 520000, areaSqKm: 12.5, coveragePercent: 85, routeIds: ['r-001', 'r-003', 'r-004'], stationCount: 12 },
  { id: 'z-002', name: 'Hà Đông - Thanh Xuân', type: 'RESIDENTIAL', population: 380000, areaSqKm: 18.2, coveragePercent: 62, routeIds: ['r-001', 'r-002'], stationCount: 8 },
  { id: 'z-003', name: 'Cầu Giấy - Nam Từ Liêm', type: 'RESIDENTIAL', population: 450000, areaSqKm: 15.8, coveragePercent: 71, routeIds: ['r-002', 'r-004', 'r-005'], stationCount: 7 },
  { id: 'z-004', name: 'Đông Anh', type: 'SUBURB', population: 280000, areaSqKm: 45.3, coveragePercent: 28, routeIds: ['r-003'], stationCount: 3 },
  { id: 'z-005', name: 'KCN Thăng Long', type: 'INDUSTRIAL', population: 15000, areaSqKm: 8.5, coveragePercent: 45, routeIds: ['r-002'], stationCount: 2 },
];

// ==================== HEADWAY DATA ====================
export const MOCK_HEADWAY_DATA: HeadwayData[] = [
  { routeId: 'r-001', routeCode: 'BRT-01', plannedHeadwayMin: 5, actualHeadwayMin: 6.2, status: 'NORMAL', vehiclePairs: [{ v1: '29B-001.01', v2: '29B-001.02', distanceKm: 2.8 }, { v1: '29B-001.02', v2: '29B-001.05', distanceKm: 3.5 }], timestamp: new Date() },
  { routeId: 'r-002', routeCode: 'BRT-02', plannedHeadwayMin: 7, actualHeadwayMin: 4.5, status: 'BUNCHING', vehiclePairs: [{ v1: '29B-001.03', v2: '29B-001.04', distanceKm: 0.8 }], timestamp: new Date() },
  { routeId: 'r-003', routeCode: 'BRT-03', plannedHeadwayMin: 8, actualHeadwayMin: 12.5, status: 'GAPPING', vehiclePairs: [{ v1: '29B-001.09', v2: '29B-001.11', distanceKm: 8.2 }], timestamp: new Date() },
];

// ==================== TRIP DETAILS ====================
export const MOCK_TRIP_DETAILS: TripDetail[] = [
  { id: 'trip-001', tripNumber: 'BRT01-001', routeId: 'r-001', routeCode: 'BRT-01', vehiclePlate: '29B-001.01', driverName: 'Phạm Minh Tuấn', direction: 'OUTBOUND', scheduledDeparture: '05:00', scheduledArrival: '05:45', actualDeparture: '05:02', actualArrival: '05:48', status: 'COMPLETED', passengers: 42, delayMinutes: 3 },
  { id: 'trip-002', tripNumber: 'BRT01-002', routeId: 'r-001', routeCode: 'BRT-01', vehiclePlate: '29B-001.02', driverName: 'Nguyễn Văn Hùng', direction: 'OUTBOUND', scheduledDeparture: '05:05', scheduledArrival: '05:50', actualDeparture: '05:05', actualArrival: '05:52', status: 'COMPLETED', passengers: 38, delayMinutes: 2 },
  { id: 'trip-003', tripNumber: 'BRT01-003', routeId: 'r-001', routeCode: 'BRT-01', vehiclePlate: '29B-001.01', driverName: 'Phạm Minh Tuấn', direction: 'INBOUND', scheduledDeparture: '05:55', scheduledArrival: '06:40', actualDeparture: '05:58', actualArrival: '06:48', status: 'COMPLETED', passengers: 65, delayMinutes: 8 },
  { id: 'trip-004', tripNumber: 'BRT01-004', routeId: 'r-001', routeCode: 'BRT-01', vehiclePlate: '29B-001.05', driverName: 'Lê Hoàng Nam', direction: 'OUTBOUND', scheduledDeparture: '06:00', scheduledArrival: '06:45', actualDeparture: '06:01', status: 'IN_PROGRESS', passengers: 78, delayMinutes: 0 },
  { id: 'trip-005', tripNumber: 'BRT02-001', routeId: 'r-002', routeCode: 'BRT-02', vehiclePlate: '29B-001.03', driverName: 'Trần Quốc Bảo', direction: 'OUTBOUND', scheduledDeparture: '05:30', scheduledArrival: '06:08', actualDeparture: '05:32', actualArrival: '06:15', status: 'COMPLETED', passengers: 35, delayMinutes: 7 },
  { id: 'trip-006', tripNumber: 'BRT02-002', routeId: 'r-002', routeCode: 'BRT-02', vehiclePlate: '29B-001.04', driverName: 'Bùi Thanh Sơn', direction: 'OUTBOUND', scheduledDeparture: '05:37', scheduledArrival: '06:15', actualDeparture: '05:38', status: 'IN_PROGRESS', passengers: 52, delayMinutes: 0 },
  { id: 'trip-007', tripNumber: 'BRT03-001', routeId: 'r-003', routeCode: 'BRT-03', vehiclePlate: '29B-001.09', driverName: 'Đặng Văn Phú', direction: 'OUTBOUND', scheduledDeparture: '05:15', scheduledArrival: '06:07', actualDeparture: '05:15', actualArrival: '06:05', status: 'COMPLETED', passengers: 28, delayMinutes: 0 },
  { id: 'trip-008', tripNumber: 'BRT01-005', routeId: 'r-001', routeCode: 'BRT-01', vehiclePlate: '29B-001.02', driverName: 'Nguyễn Văn Hùng', direction: 'INBOUND', scheduledDeparture: '06:30', scheduledArrival: '07:15', status: 'SCHEDULED', passengers: 0, delayMinutes: 0 },
  { id: 'trip-009', tripNumber: 'BRT01-006', routeId: 'r-001', routeCode: 'BRT-01', vehiclePlate: '29B-001.01', driverName: 'Phạm Minh Tuấn', direction: 'OUTBOUND', scheduledDeparture: '07:00', scheduledArrival: '07:45', status: 'SCHEDULED', passengers: 0, delayMinutes: 0 },
  { id: 'trip-010', tripNumber: 'BRT02-003', routeId: 'r-002', routeCode: 'BRT-02', vehiclePlate: '29B-001.03', driverName: 'Trần Quốc Bảo', direction: 'INBOUND', scheduledDeparture: '06:30', scheduledArrival: '07:08', status: 'SCHEDULED', passengers: 0, delayMinutes: 0 },
];

// ==================== DISPATCH REQUESTS ====================
export const MOCK_DISPATCH_REQUESTS: DispatchRequest[] = [
  { id: 'dis-001', type: 'EMERGENCY', routeId: 'r-001', routeName: 'BRT-01', reason: 'Xe 29B-001.08 hỏng phanh, cần xe thay thế', requestedBy: 'Lê Văn Dispatcher', status: 'DISPATCHED', assignedVehicleId: 'v-006', assignedVehiclePlate: '29B-001.06', assignedDriverId: 'd-004', assignedDriverName: 'Lê Hoàng Nam', createdAt: new Date('2025-02-20T07:35:00') },
  { id: 'dis-002', type: 'SUPPLEMENT', routeId: 'r-001', routeName: 'BRT-01', reason: 'Giờ cao điểm sáng, cần bổ sung xe', requestedBy: 'Trần Thị Ops', status: 'COMPLETED', assignedVehicleId: 'v-012', assignedVehiclePlate: '29B-001.12', createdAt: new Date('2025-02-20T06:45:00') },
  { id: 'dis-003', type: 'REPLACEMENT', routeId: 'r-002', routeName: 'BRT-02', reason: 'Tài xế báo bệnh, cần tài xế thay thế', requestedBy: 'Lê Văn Dispatcher', status: 'PENDING', createdAt: new Date('2025-02-20T09:00:00') },
];

// ==================== TICKET REFUNDS ====================
export const MOCK_TICKET_REFUNDS: TicketRefund[] = [
  { id: 'ref-001', transactionId: 'tx-005', ticketTypeName: 'Vé lượt đơn', amount: 7000, reason: 'Giao dịch thất bại nhưng đã trừ tiền', status: 'APPROVED', requestedAt: new Date('2025-02-20T07:25:00'), processedAt: new Date('2025-02-20T08:00:00'), processedBy: 'Hoàng Văn Finance' },
  { id: 'ref-002', transactionId: 'tx-011', ticketTypeName: 'Thẻ ngày', amount: 30000, reason: 'Mua nhầm loại vé', status: 'PENDING', requestedAt: new Date('2025-02-20T08:45:00') },
  { id: 'ref-003', transactionId: 'tx-012', ticketTypeName: 'Thẻ tháng', amount: 200000, reason: 'Hành khách chuyển nơi sinh sống', status: 'REJECTED', requestedAt: new Date('2025-02-19T14:00:00'), processedAt: new Date('2025-02-19T16:00:00'), processedBy: 'Hoàng Văn Finance' },
];

// ==================== E-WALLET ====================
export const MOCK_EWALLET: EWallet = {
  id: 'ew-001', passengerName: 'Nguyễn Hành Khách', phone: '0987654321', balance: 245000, autoTopUp: true, autoTopUpThreshold: 50000, autoTopUpAmount: 200000,
  transactions: [
    { id: 'wt-001', type: 'TOP_UP', amount: 200000, description: 'Nạp tiền qua MoMo', createdAt: new Date('2025-02-18T10:00:00') },
    { id: 'wt-002', type: 'PURCHASE', amount: -7000, description: 'Mua vé lượt đơn - BRT-01', createdAt: new Date('2025-02-19T07:15:00') },
    { id: 'wt-003', type: 'PURCHASE', amount: -12000, description: 'Mua vé toàn mạng', createdAt: new Date('2025-02-19T17:30:00') },
    { id: 'wt-004', type: 'PURCHASE', amount: -7000, description: 'Mua vé lượt đơn - BRT-02', createdAt: new Date('2025-02-20T06:45:00') },
    { id: 'wt-005', type: 'REFUND', amount: 7000, description: 'Hoàn vé do giao dịch lỗi', createdAt: new Date('2025-02-20T08:00:00') },
  ]
};

// ==================== NIFI FLOWS ====================
export const MOCK_NIFI_FLOWS: NiFiFlowStatus[] = [
  { id: 'nf-001', name: 'GPS Data Collection Pipeline', description: 'Thu thập dữ liệu GPS từ tất cả xe BRT', status: 'RUNNING', inputRecords: 1250, outputRecords: 1248, errorCount: 0, lastUpdated: new Date() },
  { id: 'nf-002', name: 'Ticket Event Processing', description: 'Xử lý sự kiện mua/quét vé', status: 'RUNNING', inputRecords: 85, outputRecords: 85, errorCount: 0, lastUpdated: new Date() },
  { id: 'nf-003', name: 'Vehicle Telemetry Ingestion', description: 'Nhận dữ liệu cảm biến từ xe', status: 'RUNNING', inputRecords: 600, outputRecords: 598, errorCount: 2, lastUpdated: new Date() },
  { id: 'nf-004', name: 'Station Passenger Count', description: 'Đếm hành khách tại trạm', status: 'RUNNING', inputRecords: 200, outputRecords: 200, errorCount: 0, lastUpdated: new Date() },
  { id: 'nf-005', name: 'HDFS Batch Export (5min)', description: 'Xuất batch dữ liệu ra HDFS', status: 'STOPPED', inputRecords: 0, outputRecords: 0, errorCount: 0, lastUpdated: new Date() },
  { id: 'nf-006', name: 'Alert Detection Pipeline', description: 'Phát hiện cảnh báo tự động (AI)', status: 'RUNNING', inputRecords: 420, outputRecords: 418, errorCount: 5, lastUpdated: new Date(Date.now() - 300000) },
];

// ==================== KAFKA TOPICS ====================
export const MOCK_KAFKA_TOPICS: KafkaTopicStatus[] = [
  { topicName: 'brt.gps.raw', partitions: 12, replicas: 3, messagesPerSecond: 1250, consumerGroups: 3, consumerLag: 45, status: 'ACTIVE' },
  { topicName: 'brt.gps.processed', partitions: 12, replicas: 3, messagesPerSecond: 1248, consumerGroups: 4, consumerLag: 120, status: 'ACTIVE' },
  { topicName: 'brt.ticket.events', partitions: 6, replicas: 3, messagesPerSecond: 85, consumerGroups: 2, consumerLag: 8, status: 'ACTIVE' },
  { topicName: 'brt.incident.alerts', partitions: 3, replicas: 3, messagesPerSecond: 2, consumerGroups: 3, consumerLag: 0, status: 'ACTIVE' },
  { topicName: 'brt.vehicle.status', partitions: 6, replicas: 3, messagesPerSecond: 120, consumerGroups: 2, consumerLag: 350, status: 'ACTIVE' },
  { topicName: 'brt.passenger.count', partitions: 6, replicas: 3, messagesPerSecond: 200, consumerGroups: 2, consumerLag: 15, status: 'ACTIVE' },
  { topicName: 'brt.schedule.updates', partitions: 3, replicas: 3, messagesPerSecond: 1, consumerGroups: 4, consumerLag: 0, status: 'ACTIVE' },
];

// ==================== PASSENGER FEEDBACK ====================
export const MOCK_PASSENGER_FEEDBACK: PassengerFeedback[] = [
  { id: 'fb-001', routeId: 'r-001', routeName: 'BRT-01', rating: 5, categories: ['Đúng giờ', 'Sạch sẽ'], comment: 'Dịch vụ rất tốt, xe mới và sạch sẽ', passengerName: 'Nguyễn A', status: 'NEW', createdAt: new Date('2025-02-20T08:30:00') },
  { id: 'fb-002', routeId: 'r-001', routeName: 'BRT-01', rating: 3, categories: ['Quá đông'], comment: 'Giờ cao điểm rất đông, không có chỗ ngồi', status: 'REVIEWED', createdAt: new Date('2025-02-20T08:15:00') },
  { id: 'fb-003', routeId: 'r-002', routeName: 'BRT-02', rating: 4, categories: ['Đúng giờ', 'Thân thiện'], passengerName: 'Trần B', status: 'NEW', createdAt: new Date('2025-02-20T07:45:00') },
  { id: 'fb-004', routeId: 'r-002', routeName: 'BRT-02', rating: 2, categories: ['Điều hòa hỏng'], comment: 'Điều hòa không hoạt động, rất nóng', status: 'RESPONDED', createdAt: new Date('2025-02-19T16:30:00') },
  { id: 'fb-005', routeId: 'r-003', routeName: 'BRT-03', rating: 5, categories: ['Đúng giờ', 'Sạch sẽ', 'Thân thiện'], comment: 'Tuyệt vời! Tài xế rất lịch sự', passengerName: 'Lê C', status: 'REVIEWED', createdAt: new Date('2025-02-19T14:00:00') },
];

// ==================== OD MATRIX ====================
export const MOCK_OD_MATRIX: ODMatrixEntry[] = [
  { originStationId: 's-001', originStationName: 'Kim Mã', destStationId: 's-005', destStationName: 'Ngã Tư Sở', count: 1250, avgTravelTimeMin: 12 },
  { originStationId: 's-001', originStationName: 'Kim Mã', destStationId: 's-011', destStationName: 'Yên Nghĩa', count: 890, avgTravelTimeMin: 42 },
  { originStationId: 's-005', originStationName: 'Ngã Tư Sở', destStationId: 's-001', destStationName: 'Kim Mã', count: 1180, avgTravelTimeMin: 13 },
  { originStationId: 's-005', originStationName: 'Ngã Tư Sở', destStationId: 's-011', destStationName: 'Yên Nghĩa', count: 720, avgTravelTimeMin: 28 },
  { originStationId: 's-011', originStationName: 'Yên Nghĩa', destStationId: 's-001', destStationName: 'Kim Mã', count: 950, avgTravelTimeMin: 45 },
  { originStationId: 's-012', originStationName: 'Cầu Giấy', destStationId: 's-013', destStationName: 'Mỹ Đình', count: 680, avgTravelTimeMin: 8 },
  { originStationId: 's-013', originStationName: 'Mỹ Đình', destStationId: 's-018', destStationName: 'Hà Đông', count: 560, avgTravelTimeMin: 25 },
  { originStationId: 's-023', originStationName: 'Hoàn Kiếm', destStationId: 's-019', destStationName: 'Đông Anh', count: 420, avgTravelTimeMin: 48 },
];

// ==================== REVENUE REPORTS ====================
export const MOCK_REVENUE_REPORTS: RevenueReport[] = [
  {
    date: new Date('2025-02-20'), totalRevenue: 185600000, totalTransactions: 12845,
    byTicketType: [
      { type: 'Vé lượt đơn', revenue: 65800000, count: 9400 },
      { type: 'Thẻ tháng', revenue: 48000000, count: 240 },
      { type: 'Vé toàn mạng', revenue: 32400000, count: 2700 },
      { type: 'Thẻ ngày', revenue: 21000000, count: 700 },
      { type: 'Vé gia đình', revenue: 12500000, count: 500 },
      { type: 'Vé ưu đãi', revenue: 5900000, count: 1305 },
    ],
    byRoute: [
      { routeId: 'r-001', routeName: 'BRT-01', revenue: 78500000 },
      { routeId: 'r-002', routeName: 'BRT-02', revenue: 52300000 },
      { routeId: 'r-003', routeName: 'BRT-03', revenue: 38200000 },
      { routeId: 'r-004', routeName: 'BRT-N1', revenue: 16600000 },
    ],
    byPaymentMethod: [
      { method: 'MoMo', revenue: 70528000, count: 4884 },
      { method: 'VNPay', revenue: 51968000, count: 3597 },
      { method: 'Thẻ NH', revenue: 37120000, count: 2569 },
      { method: 'Ví BRT', revenue: 25984000, count: 1795 },
    ]
  }
];

// ==================== STATION PASSENGER COUNTS (Time-series) ====================
export const MOCK_STATION_PASSENGER_COUNTS: StationPassengerCount[] = [
  // Kim Mã (Terminal) - full day
  { stationId: 's-001', time: new Date('2025-02-20T05:00:00'), countIn: 15, countOut: 3, cumulativeOnPlatform: 12 },
  { stationId: 's-001', time: new Date('2025-02-20T06:00:00'), countIn: 85, countOut: 42, cumulativeOnPlatform: 55 },
  { stationId: 's-001', time: new Date('2025-02-20T07:00:00'), countIn: 210, countOut: 120, cumulativeOnPlatform: 145 },
  { stationId: 's-001', time: new Date('2025-02-20T08:00:00'), countIn: 280, countOut: 185, cumulativeOnPlatform: 240 },
  { stationId: 's-001', time: new Date('2025-02-20T09:00:00'), countIn: 150, countOut: 130, cumulativeOnPlatform: 165 },
  { stationId: 's-001', time: new Date('2025-02-20T10:00:00'), countIn: 95, countOut: 88, cumulativeOnPlatform: 102 },
  { stationId: 's-001', time: new Date('2025-02-20T11:00:00'), countIn: 72, countOut: 65, cumulativeOnPlatform: 79 },
  { stationId: 's-001', time: new Date('2025-02-20T12:00:00'), countIn: 110, countOut: 95, cumulativeOnPlatform: 94 },
  { stationId: 's-001', time: new Date('2025-02-20T13:00:00'), countIn: 88, countOut: 78, cumulativeOnPlatform: 98 },
  { stationId: 's-001', time: new Date('2025-02-20T14:00:00'), countIn: 75, countOut: 70, cumulativeOnPlatform: 80 },
  { stationId: 's-001', time: new Date('2025-02-20T15:00:00'), countIn: 92, countOut: 85, cumulativeOnPlatform: 87 },
  { stationId: 's-001', time: new Date('2025-02-20T16:00:00'), countIn: 165, countOut: 105, cumulativeOnPlatform: 147 },
  { stationId: 's-001', time: new Date('2025-02-20T17:00:00'), countIn: 245, countOut: 180, cumulativeOnPlatform: 212 },
  { stationId: 's-001', time: new Date('2025-02-20T18:00:00'), countIn: 260, countOut: 210, cumulativeOnPlatform: 262 },
  { stationId: 's-001', time: new Date('2025-02-20T19:00:00'), countIn: 130, countOut: 150, cumulativeOnPlatform: 142 },
  { stationId: 's-001', time: new Date('2025-02-20T20:00:00'), countIn: 65, countOut: 88, cumulativeOnPlatform: 82 },
  { stationId: 's-001', time: new Date('2025-02-20T21:00:00'), countIn: 30, countOut: 55, cumulativeOnPlatform: 38 },
  { stationId: 's-001', time: new Date('2025-02-20T22:00:00'), countIn: 12, countOut: 32, cumulativeOnPlatform: 18 },
  // Ngã Tư Sở (Transfer Hub)
  { stationId: 's-005', time: new Date('2025-02-20T05:00:00'), countIn: 22, countOut: 5, cumulativeOnPlatform: 17 },
  { stationId: 's-005', time: new Date('2025-02-20T06:00:00'), countIn: 120, countOut: 55, cumulativeOnPlatform: 82 },
  { stationId: 's-005', time: new Date('2025-02-20T07:00:00'), countIn: 320, countOut: 180, cumulativeOnPlatform: 222 },
  { stationId: 's-005', time: new Date('2025-02-20T08:00:00'), countIn: 380, countOut: 250, cumulativeOnPlatform: 352 },
  { stationId: 's-005', time: new Date('2025-02-20T09:00:00'), countIn: 185, countOut: 160, cumulativeOnPlatform: 210 },
  { stationId: 's-005', time: new Date('2025-02-20T10:00:00'), countIn: 110, countOut: 105, cumulativeOnPlatform: 118 },
  { stationId: 's-005', time: new Date('2025-02-20T17:00:00'), countIn: 350, countOut: 220, cumulativeOnPlatform: 295 },
  { stationId: 's-005', time: new Date('2025-02-20T18:00:00'), countIn: 340, countOut: 280, cumulativeOnPlatform: 355 },
  // Mỹ Đình (Transfer Hub)
  { stationId: 's-013', time: new Date('2025-02-20T06:00:00'), countIn: 140, countOut: 65, cumulativeOnPlatform: 98 },
  { stationId: 's-013', time: new Date('2025-02-20T07:00:00'), countIn: 290, countOut: 160, cumulativeOnPlatform: 228 },
  { stationId: 's-013', time: new Date('2025-02-20T08:00:00'), countIn: 340, countOut: 220, cumulativeOnPlatform: 348 },
  { stationId: 's-013', time: new Date('2025-02-20T17:00:00'), countIn: 310, countOut: 200, cumulativeOnPlatform: 280 },
  { stationId: 's-013', time: new Date('2025-02-20T18:00:00'), countIn: 300, countOut: 260, cumulativeOnPlatform: 320 },
];
