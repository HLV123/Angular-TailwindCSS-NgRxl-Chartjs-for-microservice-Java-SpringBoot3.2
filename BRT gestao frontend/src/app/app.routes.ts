import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      // === ROUTES ===
      { path: 'routes', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER', 'ANALYST'])], loadComponent: () => import('./features/routes/route-list/route-list.component').then(m => m.RouteListComponent) },
      { path: 'routes/new', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER'])], loadComponent: () => import('./features/routes/route-form/route-form.component').then(m => m.RouteFormComponent) },
      { path: 'routes/:id', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER', 'ANALYST'])], loadComponent: () => import('./features/routes/route-detail/route-detail.component').then(m => m.RouteDetailComponent) },
      { path: 'routes/:id/edit', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER'])], loadComponent: () => import('./features/routes/route-form/route-form.component').then(m => m.RouteFormComponent) },
      // === VEHICLES ===
      { path: 'vehicles', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'ANALYST', 'MAINTENANCE'])], loadComponent: () => import('./features/vehicles/vehicle-list/vehicle-list.component').then(m => m.VehicleListComponent) },
      { path: 'vehicles/new', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER'])], loadComponent: () => import('./features/vehicles/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent) },
      { path: 'vehicles/:id', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'ANALYST', 'MAINTENANCE'])], loadComponent: () => import('./features/vehicles/vehicle-detail/vehicle-detail.component').then(m => m.VehicleDetailComponent) },
      { path: 'vehicles/:id/edit', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER'])], loadComponent: () => import('./features/vehicles/vehicle-form/vehicle-form.component').then(m => m.VehicleFormComponent) },
      // === STATIONS ===
      { path: 'stations', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'ANALYST'])], loadComponent: () => import('./features/stations/station-list/station-list.component').then(m => m.StationListComponent) },
      { path: 'stations/new', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER'])], loadComponent: () => import('./features/stations/station-form/station-form.component').then(m => m.StationFormComponent) },
      { path: 'stations/:id', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'ANALYST'])], loadComponent: () => import('./features/stations/station-detail/station-detail.component').then(m => m.StationDetailComponent) },
      { path: 'stations/:id/edit', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER'])], loadComponent: () => import('./features/stations/station-form/station-form.component').then(m => m.StationFormComponent) },
      // === DRIVERS ===
      { path: 'drivers', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER'])], loadComponent: () => import('./features/drivers/driver-list/driver-list.component').then(m => m.DriverListComponent) },
      { path: 'drivers/new', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER'])], loadComponent: () => import('./features/drivers/driver-form/driver-form.component').then(m => m.DriverFormComponent) },
      { path: 'drivers/:id', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER'])], loadComponent: () => import('./features/drivers/driver-detail/driver-detail.component').then(m => m.DriverDetailComponent) },
      { path: 'drivers/:id/edit', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER'])], loadComponent: () => import('./features/drivers/driver-form/driver-form.component').then(m => m.DriverFormComponent) },
      // === SCHEDULES ===
      { path: 'schedules', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER'])], loadComponent: () => import('./features/schedules/schedule-list/schedule-list.component').then(m => m.ScheduleListComponent) },
      { path: 'schedules/new', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER'])], loadComponent: () => import('./features/schedules/schedule-form/schedule-form.component').then(m => m.ScheduleFormComponent) },
      { path: 'schedules/:id', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER'])], loadComponent: () => import('./features/schedules/schedule-detail/schedule-detail.component').then(m => m.ScheduleDetailComponent) },
      { path: 'schedules/:id/edit', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER'])], loadComponent: () => import('./features/schedules/schedule-form/schedule-form.component').then(m => m.ScheduleFormComponent) },
      { path: 'dispatch', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER'])], loadComponent: () => import('./features/schedules/dispatch/dispatch.component').then(m => m.DispatchComponent) },
      // === TICKETS ===
      { path: 'tickets', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'ANALYST', 'FINANCE'])], loadComponent: () => import('./features/tickets/ticket-list/ticket-list.component').then(m => m.TicketListComponent) },
      { path: 'ticket-types', canActivate: [roleGuard(['ADMIN', 'FINANCE'])], loadComponent: () => import('./features/tickets/ticket-types/ticket-types.component').then(m => m.TicketTypesComponent) },
      { path: 'revenue', canActivate: [roleGuard(['ADMIN', 'FINANCE', 'OPS_MANAGER'])], loadComponent: () => import('./features/tickets/revenue/revenue.component').then(m => m.RevenueComponent) },
      // === INCIDENTS ===
      { path: 'incidents', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER', 'MAINTENANCE'])], loadComponent: () => import('./features/incidents/incident-list/incident-list.component').then(m => m.IncidentListComponent) },
      { path: 'incidents/new', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER'])], loadComponent: () => import('./features/incidents/incident-form/incident-form.component').then(m => m.IncidentFormComponent) },
      { path: 'incidents/:id', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER', 'MAINTENANCE'])], loadComponent: () => import('./features/incidents/incident-detail/incident-detail.component').then(m => m.IncidentDetailComponent) },
      // === MAINTENANCE ===
      { path: 'maintenance', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'MAINTENANCE'])], loadComponent: () => import('./features/maintenance/maintenance.component').then(m => m.MaintenanceComponent) },
      { path: 'maintenance/work-orders', canActivate: [roleGuard(['ADMIN', 'MAINTENANCE'])], loadComponent: () => import('./features/maintenance/work-orders/work-orders.component').then(m => m.WorkOrdersComponent) },
      { path: 'maintenance/parts', canActivate: [roleGuard(['ADMIN', 'MAINTENANCE'])], loadComponent: () => import('./features/maintenance/parts-inventory/parts-inventory.component').then(m => m.PartsInventoryComponent) },
      { path: 'maintenance/schedule', canActivate: [roleGuard(['ADMIN', 'MAINTENANCE', 'OPS_MANAGER'])], loadComponent: () => import('./features/maintenance/schedule/maintenance-schedule.component').then(m => m.MaintenanceScheduleComponent) },
      // === ANALYTICS ===
      { path: 'analytics', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'ANALYST', 'FINANCE'])], loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent) },
      { path: 'analytics/network', canActivate: [roleGuard(['ADMIN', 'ANALYST'])], loadComponent: () => import('./features/analytics/network-analysis/network-analysis.component').then(m => m.NetworkAnalysisComponent) },
      { path: 'analytics/passengers', canActivate: [roleGuard(['ADMIN', 'ANALYST', 'OPS_MANAGER'])], loadComponent: () => import('./features/analytics/passenger-analysis/passenger-analysis.component').then(m => m.PassengerAnalysisComponent) },
      { path: 'analytics/reports', canActivate: [roleGuard(['ADMIN', 'ANALYST', 'OPS_MANAGER', 'FINANCE'])], loadComponent: () => import('./features/analytics/reports/reports.component').then(m => m.ReportsComponent) },
      // === SECURITY ===
      { path: 'security', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/security/security.component').then(m => m.SecurityComponent) },
      { path: 'security/users', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/security/users/users.component').then(m => m.UsersComponent) },
      { path: 'security/roles', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/security/roles/roles.component').then(m => m.RolesComponent) },
      { path: 'security/audit-log', canActivate: [roleGuard(['ADMIN'])], loadComponent: () => import('./features/security/audit-log/audit-log.component').then(m => m.AuditLogComponent) },
      // === DATA PLATFORM ===
      { path: 'data-platform', canActivate: [roleGuard(['ADMIN', 'ANALYST'])], loadComponent: () => import('./features/data-platform/data-platform.component').then(m => m.DataPlatformComponent) },
      { path: 'data-platform/catalog', canActivate: [roleGuard(['ADMIN', 'ANALYST'])], loadComponent: () => import('./features/data-platform/data-catalog/data-catalog.component').then(m => m.DataCatalogComponent) },
      { path: 'data-platform/flows', canActivate: [roleGuard(['ADMIN', 'ANALYST'])], loadComponent: () => import('./features/data-platform/data-flows/data-flows.component').then(m => m.DataFlowsComponent) },
      // === OTHER ===
      { path: 'notifications', loadComponent: () => import('./features/notifications/notification-center.component').then(m => m.NotificationCenterComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'passenger-portal', canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER', 'ANALYST'])], loadComponent: () => import('./features/passenger-portal/passenger-portal.component').then(m => m.PassengerPortalComponent) },
      { path: 'forbidden', loadComponent: () => import('./features/shared/forbidden/forbidden.component').then(m => m.ForbiddenComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
