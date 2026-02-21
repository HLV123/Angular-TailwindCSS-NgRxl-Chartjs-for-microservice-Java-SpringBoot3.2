// ==================== AUTH ====================
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  twoFactorEnabled: boolean;
}

export type UserRole = 'ADMIN' | 'OPS_MANAGER' | 'DISPATCHER' | 'DRIVER' | 'MAINTENANCE' | 'ANALYST' | 'FINANCE';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

// ==================== ROUTES ====================
export interface BrtRoute {
  id: string;
  code: string;
  name: string;
  description?: string;
  routeType: 'MAIN' | 'BRANCH' | 'NIGHT' | 'SPECIAL';
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'SUSPENDED';
  totalLengthKm: number;
  totalStations?: number;
  avgTravelTimeMin: number;
  stations: RouteStation[];
  geometry?: GeoJsonLineString;
  serviceZoneId?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteStation {
  stationId: string;
  stationName: string;
  stationCode: string;
  order: number;
  distanceFromStartKm: number;
  travelTimeFromPrevMin: number;
  lat: number;
  lng: number;
}

export interface GeoJsonLineString {
  type: 'LineString';
  coordinates: [number, number][];
}

// ==================== VEHICLES ====================
export interface Vehicle {
  id: string;
  plateNumber: string;
  vehicleType: 'ARTICULATED' | 'STANDARD' | 'MINI' | 'ELECTRIC';
  capacitySeated: number;
  capacityStanding: number;
  fuelType: 'DIESEL' | 'CNG' | 'ELECTRIC' | 'HYBRID';
  manufacturer: string;
  model: string;
  manufactureYear: number;
  currentStatus: VehicleStatus;
  currentRouteId?: string;
  currentRouteName?: string;
  currentDriverId?: string;
  currentDriverName?: string;
  totalKm: number;
  lastMaintenanceKm: number;
  lastMaintenanceDate?: Date;
  gpsDeviceId?: string;
  hasCamera: boolean;
  hasTicketScanner: boolean;
  hasInfoDisplay: boolean;
  createdAt: Date;
}

export type VehicleStatus = 'ACTIVE' | 'IDLE' | 'MAINTENANCE_REQUIRED' | 'UNDER_REPAIR' | 'DECOMMISSIONED' | 'REGISTERED';

export interface VehiclePosition {
  vehicleId: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: Date;
  tripId?: string;
  status: 'ON_TIME' | 'SLIGHTLY_DELAYED' | 'HEAVILY_DELAYED';
}

export interface VehicleTelemetry {
  vehicleId: string;
  fuelLevel: number;
  engineTemp: number;
  batteryVoltage: number;
  tirePressureFL: number;
  tirePressureFR: number;
  tirePressureRL: number;
  tirePressureRR: number;
  odometer: number;
  acStatus: boolean;
  timestamp: Date;
}

// ==================== STATIONS ====================
export interface Station {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  lat: number;
  lng: number;
  address: string;
  district: string;
  ward?: string;
  stationType: 'INLINE' | 'SIDE' | 'TERMINAL' | 'TRANSFER_HUB';
  gateCount: number;
  platformLength: number;
  hasCover: boolean;
  hasTicketMachine: boolean;
  hasRealtimeDisplay: boolean;
  hasWifi: boolean;
  hasToilet: boolean;
  hasElevator: boolean;
  bikeParking: boolean;
  taxiStand: boolean;
  metroConnection: boolean;
  status: 'ACTIVE' | 'CLOSED' | 'UNDER_REPAIR';
  capacity: number;
  currentPassengers?: number;
  routeIds: string[];
  createdAt: Date;
}

export interface StationPassengerCount {
  stationId: string;
  time: Date;
  countIn: number;
  countOut: number;
  cumulativeOnPlatform: number;
}

// ==================== DRIVERS ====================
export interface Driver {
  id: string;
  fullName: string;
  employeeCode: string;
  nationalId: string;
  phone: string;
  email?: string;
  address?: string;
  avatar?: string;
  licenseNumber: string;
  licenseClass: string;
  licenseExpiry: Date;
  licenseAuthority: string;
  hireDate: Date;
  department: string;
  rank: string;
  status: 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY' | 'ON_LEAVE' | 'SUSPENDED';
  certifications: string[];
  healthCheckDate?: Date;
  healthCheckResult?: string;
  nextHealthCheckDate?: Date;
  totalTrips: number;
  otpScore: number;
  rating: number;
  violationCount: number;
  ecoScore: number;
  currentVehicleId?: string;
  currentRouteId?: string;
  createdAt: Date;
}

export interface DriverShift {
  id: string;
  driverId: string;
  driverName: string;
  shiftType: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  startTime: Date;
  endTime: Date;
  routeId: string;
  routeName: string;
  vehicleId?: string;
  vehiclePlate?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

// ==================== SCHEDULES & TRIPS ====================
export interface Schedule {
  id: string;
  routeId: string;
  routeName: string;
  routeCode: string;
  operatingHoursStart: string;
  operatingHoursEnd: string;
  peakFrequencyMin: number;
  normalFrequencyMin: number;
  offPeakFrequencyMin: number;
  requiredVehicles: number;
  requiredDrivers: number;
  effectiveDate: Date;
  endDate?: Date;
  scheduleType: 'WEEKDAY' | 'WEEKEND' | 'HOLIDAY' | 'SPECIAL_EVENT';
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'EXPIRED';
  trips: Trip[];
  createdAt: Date;
}

export interface Trip {
  id: string;
  routeId: string;
  vehicleId?: string;
  vehiclePlate?: string;
  driverId?: string;
  driverName?: string;
  scheduledStart: Date;
  actualStart?: Date;
  scheduledEnd: Date;
  actualEnd?: Date;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DELAYED';
  totalPassengers: number;
  direction: 'OUTBOUND' | 'INBOUND';
  delayMinutes: number;
}

// ==================== TICKETS ====================
export interface TicketType {
  id: string;
  name: string;
  code: string;
  description: string;
  price: number;
  validityType: 'SINGLE_ROUTE' | 'ALL_ROUTES' | 'DAY_PASS' | 'MONTHLY' | 'FAMILY' | 'DISCOUNTED';
  validityDuration: string;
  validityDays?: number;
  discount: number;
  isActive: boolean;
  maxUsesPerDay?: number;
  maxTrips?: number;
  createdAt: Date;
}

export interface TicketTransaction {
  id: string;
  transactionId?: string;
  ticketTypeId: string;
  ticketTypeName: string;
  passengerId?: string;
  amount: number;
  paymentMethod: 'MOMO' | 'VNPAY' | 'BANK_CARD' | 'BRT_WALLET' | 'CASH';
  status: 'SUCCESS' | 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED' | string;
  qrCode?: string;
  usedAt?: Date;
  stationId?: string;
  stationName?: string;
  routeId?: string;
  timestamp?: Date;
  createdAt: Date;
}

export interface RevenueReport {
  date: Date;
  routeCode?: string;
  totalRevenue: number;
  totalTransactions: number;
  totalTrips?: number;
  avgOccupancy?: number;
  operatingCost?: number;
  revenueGrowthPercent?: number;
  byTicketType: { type: string; revenue: number; count: number }[];
  byRoute: { routeId: string; routeName: string; revenue: number }[];
  byPaymentMethod: { method: string; revenue: number; count: number }[];
}

// ==================== INCIDENTS ====================
export interface Incident {
  id: string;
  code: string;
  type: IncidentType;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  title: string;
  description: string;
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  reportedBy: string;
  reportedByRole: string;
  assignedTo?: string;
  assignedToName?: string;
  vehicleId?: string;
  vehiclePlate?: string;
  routeId?: string;
  routeName?: string;
  stationId?: string;
  stationName?: string;
  lat?: number;
  lng?: number;
  resolution?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export type IncidentType =
  'ACCIDENT' | 'BREAKDOWN' | 'DELAY' | 'OVERCROWDING' | 'EQUIPMENT_FAILURE' |
  'SPEEDING' | 'OFF_ROUTE' | 'BUNCHING' | 'ABNORMAL_STOP' | 'LOW_BATTERY' |
  'DEVICE_OFFLINE' | 'AC_FAILURE' | 'PASSENGER_COMPLAINT' | 'OTHER';

// ==================== MAINTENANCE ====================
export interface WorkOrder {
  id: string;
  code: string;
  vehicleId: string;
  vehiclePlate: string;
  type: 'SCHEDULED' | 'EMERGENCY' | 'PREDICTIVE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_PARTS' | 'COMPLETED' | 'INSPECTING' | 'CLOSED';
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  estimatedCost?: number;
  laborCost?: number;
  partsCost: number;
  downtimeHours: number;
  maintenanceType?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SparePart {
  id: string;
  code: string;
  name: string;
  category: string;
  supplier: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
  lastRestockDate?: Date;
}

// ==================== NOTIFICATIONS ====================
export interface AppNotification {
  id: string;
  type: 'ALERT' | 'INFO' | 'WARNING' | 'SUCCESS';
  title: string;
  message: string;
  channel: 'PUSH' | 'SMS' | 'DISPLAY' | 'WEB';
  targetAudience: 'ALL' | 'PASSENGERS' | 'DRIVERS' | 'OPERATORS';
  isRead: boolean;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt: Date;
}

// ==================== ANALYTICS ====================
export interface DashboardStats {
  activeVehicles: number;
  totalVehicles: number;
  passengersToday: number;
  passengersChange: number;
  avgOtp: number;
  delayedVehicles: number;
  revenueToday: number;
  revenueChange: number;
  activeIncidents: number;
  totalTripsToday: number;
  completedTrips: number;
  activeRoutes: number;
}

export interface PassengerHourlyData {
  hour: number;
  count: number;
  boardingCount?: number;
}

export interface RoutePerformance {
  routeId: string;
  routeName: string;
  routeCode: string;
  otp: number;
  onTimePercentage?: number;
  totalPassengers: number;
  avgPassengers?: number;
  avgHeadwayMin?: number;
  totalTrips: number;
  completedTrips: number;
  incidents: number;
  revenue: number;
}

// ==================== AUDIT LOG ====================
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole?: string;
  action: string;
  module?: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: Date;
}

// ==================== COMMON ====================
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// ==================== SERVICE ZONES ====================
export interface ServiceZone {
  id: string;
  name: string;
  type: 'CENTER' | 'SUBURB' | 'INDUSTRIAL' | 'RESIDENTIAL';
  population: number;
  areaSqKm: number;
  coveragePercent: number;
  routeIds: string[];
  stationCount: number;
}

// ==================== TICKET EXTENSIONS ====================
export interface TicketPurchaseRequest {
  id: string;
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: 'MOMO' | 'VNPAY' | 'BANK_CARD' | 'BRT_WALLET';
  passengerName?: string;
  passengerPhone?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  qrCodes: string[];
  createdAt: Date;
}

export interface TicketRefund {
  id: string;
  transactionId: string;
  ticketTypeName: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: string;
}

export interface EWallet {
  id: string;
  passengerName: string;
  phone: string;
  balance: number;
  autoTopUp: boolean;
  autoTopUpThreshold: number;
  autoTopUpAmount: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 'TOP_UP' | 'PURCHASE' | 'REFUND' | 'TRANSFER';
  amount: number;
  description: string;
  createdAt: Date;
}

// ==================== HEADWAY & DISPATCH ====================
export interface HeadwayData {
  routeId: string;
  routeCode: string;
  plannedHeadwayMin: number;
  actualHeadwayMin: number;
  status: 'NORMAL' | 'BUNCHING' | 'GAPPING';
  vehiclePairs: { v1: string; v2: string; distanceKm: number }[];
  timestamp: Date;
}

export interface DispatchRequest {
  id: string;
  type: 'EMERGENCY' | 'SUPPLEMENT' | 'REPLACEMENT';
  routeId: string;
  routeName: string;
  reason: string;
  requestedBy: string;
  status: 'PENDING' | 'APPROVED' | 'DISPATCHED' | 'COMPLETED';
  assignedVehicleId?: string;
  assignedVehiclePlate?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  createdAt: Date;
}

// ==================== TRIP DETAILS ====================
export interface TripDetail {
  id: string;
  tripNumber: string;
  routeId: string;
  routeCode: string;
  vehiclePlate: string;
  driverName: string;
  direction: 'OUTBOUND' | 'INBOUND';
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture?: string;
  actualArrival?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DELAYED';
  passengers: number;
  delayMinutes: number;
}

// ==================== DATA PLATFORM ====================
export interface NiFiFlowStatus {
  id: string;
  name: string;
  description: string;
  status: 'RUNNING' | 'STOPPED' | 'ERROR' | 'DISABLED';
  inputCount?: number;
  outputCount?: number;
  inputRecords: number;
  outputRecords: number;
  errorCount: number;
  lastUpdated: Date;
}

export interface KafkaTopicStatus {
  name?: string;
  topicName: string;
  partitions: number;
  replicas: number;
  messageRate?: number;
  messagesPerSecond: number;
  consumerGroups: number;
  consumerLag: number;
  status: 'ACTIVE' | 'INACTIVE';
}

// ==================== PASSENGER ====================
export interface PassengerFeedback {
  id: string;
  tripId?: string;
  routeId: string;
  routeCode?: string;
  routeName: string;
  rating: number;
  category?: string;
  categories: string[];
  comment?: string;
  passengerName?: string;
  status: 'NEW' | 'REVIEWED' | 'RESPONDED';
  timestamp?: Date;
  createdAt: Date;
}

export interface ODMatrixEntry {
  originStationId: string;
  originStationCode?: string;
  originStationName: string;
  destStationId: string;
  destStationCode?: string;
  destStationName: string;
  tripCount?: number;
  count: number;
  avgTravelTimeMin: number;
}
