import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Station, Driver, Incident, Schedule, TicketType, TicketTransaction,
  WorkOrder, SparePart, AppNotification, AuditLog, RevenueReport,
  DashboardStats, PassengerHourlyData, RoutePerformance, VehicleTelemetry,
  ServiceZone, HeadwayData, TripDetail, DispatchRequest, TicketRefund,
  EWallet, NiFiFlowStatus, KafkaTopicStatus, PassengerFeedback,
  ODMatrixEntry, DriverShift, StationPassengerCount
} from '../models';
import {
  MOCK_STATIONS, MOCK_DRIVERS, MOCK_INCIDENTS, MOCK_SCHEDULES,
  MOCK_TICKET_TYPES, MOCK_WORK_ORDERS, MOCK_SPARE_PARTS,
  MOCK_NOTIFICATIONS, MOCK_AUDIT_LOGS, MOCK_DASHBOARD_STATS,
  MOCK_PASSENGER_HOURLY, MOCK_ROUTE_PERFORMANCE,
  MOCK_TICKET_TRANSACTIONS, MOCK_DRIVER_SHIFTS, MOCK_VEHICLE_TELEMETRY,
  MOCK_SERVICE_ZONES, MOCK_HEADWAY_DATA, MOCK_TRIP_DETAILS,
  MOCK_DISPATCH_REQUESTS, MOCK_TICKET_REFUNDS, MOCK_EWALLET,
  MOCK_NIFI_FLOWS, MOCK_KAFKA_TOPICS, MOCK_PASSENGER_FEEDBACK,
  MOCK_OD_MATRIX, MOCK_REVENUE_REPORTS, MOCK_STATION_PASSENGER_COUNTS
} from '../mock-data';

// ==================== DASHBOARD ====================
@Injectable({ providedIn: 'root' })
export class DashboardService {
  getStats(): Observable<DashboardStats> { return of(MOCK_DASHBOARD_STATS).pipe(delay(300)); }
  getPassengerHourly(): Observable<PassengerHourlyData[]> { return of(MOCK_PASSENGER_HOURLY).pipe(delay(300)); }
  getRoutePerformance(): Observable<RoutePerformance[]> { return of(MOCK_ROUTE_PERFORMANCE).pipe(delay(300)); }
  getHeadwayData(): Observable<HeadwayData[]> { return of(MOCK_HEADWAY_DATA).pipe(delay(200)); }
  getTripDetails(): Observable<TripDetail[]> { return of(MOCK_TRIP_DETAILS).pipe(delay(300)); }
  getRevenueReports(): Observable<RevenueReport[]> { return of(MOCK_REVENUE_REPORTS).pipe(delay(300)); }
}

// ==================== STATION ====================
@Injectable({ providedIn: 'root' })
export class StationService {
  getAll(): Observable<Station[]> { return of(MOCK_STATIONS).pipe(delay(300)); }
  getById(id: string): Observable<Station | undefined> { return of(MOCK_STATIONS.find(s => s.id === id)).pipe(delay(200)); }
  getPassengerCounts(stationId: string): Observable<StationPassengerCount[]> {
    return of(MOCK_STATION_PASSENGER_COUNTS.filter(p => p.stationId === stationId)).pipe(delay(200));
  }
}

// ==================== DRIVER ====================
@Injectable({ providedIn: 'root' })
export class DriverService {
  getAll(): Observable<Driver[]> { return of(MOCK_DRIVERS).pipe(delay(300)); }
  getById(id: string): Observable<Driver | undefined> { return of(MOCK_DRIVERS.find(d => d.id === id)).pipe(delay(200)); }
}

// ==================== INCIDENT ====================
@Injectable({ providedIn: 'root' })
export class IncidentService {
  getAll(): Observable<Incident[]> { return of(MOCK_INCIDENTS).pipe(delay(300)); }
  getById(id: string): Observable<Incident | undefined> { return of(MOCK_INCIDENTS.find(i => i.id === id)).pipe(delay(200)); }
  updateStatus(id: string, status: string): Observable<Incident | undefined> {
    const inc = MOCK_INCIDENTS.find(i => i.id === id);
    if (inc) { (inc as any).status = status; inc.updatedAt = new Date(); }
    return of(inc).pipe(delay(300));
  }
}

// ==================== SCHEDULE ====================
@Injectable({ providedIn: 'root' })
export class ScheduleService {
  getAll(): Observable<Schedule[]> { return of(MOCK_SCHEDULES).pipe(delay(300)); }
  getById(id: string): Observable<Schedule | undefined> { return of(MOCK_SCHEDULES.find(s => s.id === id)).pipe(delay(200)); }
}

// ==================== TICKET ====================
@Injectable({ providedIn: 'root' })
export class TicketService {
  getTicketTypes(): Observable<TicketType[]> { return of(MOCK_TICKET_TYPES).pipe(delay(300)); }
  getTransactions(): Observable<TicketTransaction[]> { return of(MOCK_TICKET_TRANSACTIONS).pipe(delay(300)); }
  getRefunds(): Observable<TicketRefund[]> { return of(MOCK_TICKET_REFUNDS).pipe(delay(200)); }
  getEWallet(): Observable<EWallet> { return of(MOCK_EWALLET).pipe(delay(200)); }
}

// ==================== MAINTENANCE ====================
@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  getWorkOrders(): Observable<WorkOrder[]> { return of(MOCK_WORK_ORDERS).pipe(delay(300)); }
  getSpareParts(): Observable<SparePart[]> { return of(MOCK_SPARE_PARTS).pipe(delay(300)); }
}

// ==================== NOTIFICATION ====================
@Injectable({ providedIn: 'root' })
export class NotificationService {
  getAll(): Observable<AppNotification[]> { return of(MOCK_NOTIFICATIONS).pipe(delay(200)); }
  getUnreadCount(): Observable<number> { return of(MOCK_NOTIFICATIONS.filter(n => !n.isRead).length).pipe(delay(100)); }
  markAsRead(id: string): Observable<void> {
    const n = MOCK_NOTIFICATIONS.find(x => x.id === id);
    if (n) n.isRead = true;
    return of(void 0).pipe(delay(100));
  }
}

// ==================== AUDIT ====================
@Injectable({ providedIn: 'root' })
export class AuditService {
  getAll(): Observable<AuditLog[]> { return of(MOCK_AUDIT_LOGS).pipe(delay(300)); }
}

// ==================== SHIFT ====================
@Injectable({ providedIn: 'root' })
export class ShiftService {
  getAll(): Observable<DriverShift[]> { return of(MOCK_DRIVER_SHIFTS).pipe(delay(300)); }
  getByDriver(driverId: string): Observable<DriverShift[]> {
    return of(MOCK_DRIVER_SHIFTS.filter(s => s.driverId === driverId)).pipe(delay(200));
  }
}

// ==================== TELEMETRY ====================
@Injectable({ providedIn: 'root' })
export class TelemetryService {
  getByVehicle(vehicleId: string): Observable<VehicleTelemetry | undefined> {
    return of(MOCK_VEHICLE_TELEMETRY.find(t => t.vehicleId === vehicleId)).pipe(delay(200));
  }
  getAll(): Observable<VehicleTelemetry[]> { return of(MOCK_VEHICLE_TELEMETRY).pipe(delay(300)); }
}

// ==================== ZONE ====================
@Injectable({ providedIn: 'root' })
export class ZoneService {
  getAll(): Observable<ServiceZone[]> { return of(MOCK_SERVICE_ZONES).pipe(delay(300)); }
}

// ==================== DISPATCH ====================
@Injectable({ providedIn: 'root' })
export class DispatchService {
  getAll(): Observable<DispatchRequest[]> { return of(MOCK_DISPATCH_REQUESTS).pipe(delay(300)); }
}

// ==================== DATA PLATFORM ====================
@Injectable({ providedIn: 'root' })
export class DataPlatformService {
  getNiFiFlows(): Observable<NiFiFlowStatus[]> { return of(MOCK_NIFI_FLOWS).pipe(delay(300)); }
  getKafkaTopics(): Observable<KafkaTopicStatus[]> { return of(MOCK_KAFKA_TOPICS).pipe(delay(300)); }
}

// ==================== PASSENGER / ANALYTICS ====================
@Injectable({ providedIn: 'root' })
export class PassengerService {
  getFeedback(): Observable<PassengerFeedback[]> { return of(MOCK_PASSENGER_FEEDBACK).pipe(delay(300)); }
  getODMatrix(): Observable<ODMatrixEntry[]> { return of(MOCK_OD_MATRIX).pipe(delay(300)); }
}
