import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/data.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { DashboardStats, VehiclePosition, RoutePerformance, PassengerHourlyData, TripDetail, Incident } from '../../core/models';
import { MOCK_INCIDENTS } from '../../core/mock-data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Command Center</h1>
          <p class="text-sm text-slate-500 mt-1">Giám sát toàn bộ hệ thống BRT theo thời gian thực</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-2 text-sm text-slate-500">
            <span class="live-dot"></span> LIVE
          </span>
          <span class="text-sm text-slate-400">{{ currentTime }}</span>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Xe đang chạy</p>
              <p class="text-2xl font-bold text-slate-800 mt-1">{{ stats.activeVehicles }} <span class="text-sm font-normal text-slate-400">/ {{ stats.totalVehicles }}</span></p>
            </div>
            <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            </div>
          </div>
          <div class="mt-2 flex items-center gap-1 text-xs">
            <span class="text-emerald-600 font-medium">▲ 12%</span>
            <span class="text-slate-400">so với hôm qua</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Hành khách</p>
              <p class="text-2xl font-bold text-slate-800 mt-1">{{ formatNumber(stats.passengersToday) }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
          </div>
          <div class="mt-2 flex items-center gap-1 text-xs">
            <span class="text-blue-600 font-medium">+2,340</span>
            <span class="text-slate-400">so với cùng giờ</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">OTP Trung bình</p>
              <p class="text-2xl font-bold mt-1" [ngClass]="stats.avgOtp >= 95 ? 'text-emerald-600' : stats.avgOtp >= 90 ? 'text-amber-600' : 'text-red-600'">{{ stats.avgOtp }}%</p>
            </div>
            <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <div class="mt-2 text-xs">
            <span class="text-amber-600 font-medium">{{ stats.delayedVehicles }} xe trễ</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Doanh thu</p>
              <p class="text-2xl font-bold text-slate-800 mt-1">{{ formatCurrency(stats.revenueToday) }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <div class="mt-2 flex items-center gap-1 text-xs">
            <span class="text-purple-600 font-medium">▲ {{ stats.revenueChange }}%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Sự cố</p>
              <p class="text-2xl font-bold text-red-600 mt-1">{{ stats.activeIncidents }}</p>
            </div>
            <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
          </div>
          <div class="mt-2 text-xs">
            <a routerLink="/incidents" class="text-red-600 font-medium hover:underline">Xem chi tiết →</a>
          </div>
        </div>
      </div>

      <!-- Map & Alerts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Map Placeholder -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="card-title flex items-center gap-2">
              <span class="live-dot"></span> Bản đồ giám sát thời gian thực
            </h3>
            <div class="flex items-center gap-2">
              <span class="badge badge-success">{{ vehiclePositions.length }} xe</span>
              <span class="text-xs text-slate-400">Cập nhật: {{ lastUpdate }}</span>
            </div>
          </div>
          <div class="h-[420px] bg-gradient-to-br from-slate-100 to-slate-50 relative">
            <!-- Simple map visualization -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="relative w-80 h-80">
                  <!-- Simple route lines -->
                  <svg class="w-full h-full" viewBox="0 0 300 300">
                    <line x1="50" y1="50" x2="250" y2="250" stroke="#1a56db" stroke-width="3" opacity="0.3"/>
                    <line x1="150" y1="30" x2="150" y2="270" stroke="#059669" stroke-width="3" opacity="0.3"/>
                    <line x1="30" y1="150" x2="270" y2="100" stroke="#d97706" stroke-width="3" opacity="0.3"/>
                    <!-- Vehicle dots -->
                    <g *ngFor="let vp of vehiclePositions; let i = index">
                      <circle [attr.cx]="60 + i * 35" [attr.cy]="80 + (i % 3) * 60" r="8"
                        [attr.fill]="vp.status === 'ON_TIME' ? '#059669' : vp.status === 'SLIGHTLY_DELAYED' ? '#d97706' : '#dc2626'"
                        opacity="0.9">
                        <animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite"/>
                      </circle>
                      <circle [attr.cx]="60 + i * 35" [attr.cy]="80 + (i % 3) * 60" r="16"
                        [attr.stroke]="vp.status === 'ON_TIME' ? '#059669' : vp.status === 'SLIGHTLY_DELAYED' ? '#d97706' : '#dc2626'"
                        fill="none" stroke-width="1.5" opacity="0.3">
                        <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
                      </circle>
                    </g>
                    <!-- Station markers -->
                    <rect x="45" y="45" width="10" height="10" rx="2" fill="#1e293b" opacity="0.5"/>
                    <rect x="245" y="245" width="10" height="10" rx="2" fill="#1e293b" opacity="0.5"/>
                    <rect x="145" y="25" width="10" height="10" rx="2" fill="#1e293b" opacity="0.5"/>
                    <rect x="145" y="265" width="10" height="10" rx="2" fill="#1e293b" opacity="0.5"/>
                  </svg>
                </div>
                <p class="text-xs text-slate-400 mt-2">Bản đồ GIS tích hợp PostGIS • Kết nối qua WebSocket</p>
                <div class="flex items-center justify-center gap-4 mt-3">
                  <span class="flex items-center gap-1.5 text-xs"><span class="w-3 h-3 rounded-full bg-emerald-500"></span> Đúng giờ</span>
                  <span class="flex items-center gap-1.5 text-xs"><span class="w-3 h-3 rounded-full bg-amber-500"></span> Trễ nhẹ</span>
                  <span class="flex items-center gap-1.5 text-xs"><span class="w-3 h-3 rounded-full bg-red-500"></span> Trễ nhiều</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Alerts -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div class="p-4 border-b border-slate-100">
            <div class="flex items-center justify-between mb-3">
              <h3 class="card-title">Cảnh báo đang xử lý</h3>
              <a routerLink="/incidents" class="text-xs text-blue-600 hover:underline">Xem tất cả</a>
            </div>
            <!-- Priority Summary -->
            <div class="flex items-center gap-2">
              <span *ngIf="getIncidentsByPriority('P1').length" class="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                P1: {{ getIncidentsByPriority('P1').length }}
              </span>
              <span *ngIf="getIncidentsByPriority('P2').length" class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">
                P2: {{ getIncidentsByPriority('P2').length }}
              </span>
              <span *ngIf="getIncidentsByPriority('P3').length" class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                P3: {{ getIncidentsByPriority('P3').length }}
              </span>
              <span *ngIf="getIncidentsByPriority('P4').length" class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                P4: {{ getIncidentsByPriority('P4').length }}
              </span>
              <span class="text-[10px] text-slate-400 ml-auto">TB xử lý: {{ avgResolutionTime }}</span>
            </div>
          </div>
          <div class="divide-y divide-slate-50 max-h-[380px] overflow-y-auto">
            <div *ngFor="let inc of activeIncidents" class="p-4 hover:bg-slate-50 transition-colors cursor-pointer" routerLink="/incidents">
              <div class="flex items-start gap-3">
                <span class="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  [ngClass]="{'bg-red-500 animate-pulse': inc.severity==='P1', 'bg-red-500': inc.severity==='P2', 'bg-amber-500': inc.severity==='P3', 'bg-slate-400': inc.severity==='P4'}"></span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="badge" [ngClass]="{'badge-danger': inc.severity==='P1' || inc.severity==='P2', 'badge-warning': inc.severity==='P3', 'badge-neutral': inc.severity==='P4'}">{{ inc.severity }}</span>
                    <span class="badge" [ngClass]="{'badge-danger': inc.status==='OPEN', 'badge-warning': inc.status==='ASSIGNED', 'badge-info': inc.status==='IN_PROGRESS'}">{{ getStatusLabel(inc.status) }}</span>
                  </div>
                  <p class="text-sm font-medium text-slate-800 truncate">{{ inc.title }}</p>
                  <p class="text-xs text-slate-400 mt-1">{{ inc.routeName || inc.stationName || '' }} • {{ getTimeAgo(inc.createdAt) }}</p>
                </div>
              </div>
            </div>
            <div *ngIf="activeIncidents.length === 0" class="p-8 text-center text-slate-400 text-sm">
              ✅ Không có sự cố nào đang xử lý
            </div>
          </div>
        </div>
      </div>

      <!-- Trips Timeline Gantt -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="card-title">Biểu đồ chuyến xe hôm nay (Gantt)</h3>
          <div class="flex items-center gap-3 text-xs">
            <span class="flex items-center gap-1.5"><span class="w-3 h-2 rounded bg-emerald-500"></span> Hoàn thành</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-2 rounded bg-blue-500"></span> Đang chạy</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-2 rounded bg-slate-200 border border-slate-300"></span> Kế hoạch</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-2 rounded bg-red-400"></span> Trễ</span>
          </div>
        </div>
        <div class="p-4 overflow-x-auto">
          <!-- Time axis -->
          <div class="flex items-center mb-2 ml-28">
            <div *ngFor="let h of timeAxisHours" class="text-[10px] text-slate-400 text-center" [style.width.%]="100 / timeAxisHours.length">
              {{ h }}:00
            </div>
          </div>
          <!-- Trip rows -->
          <div class="space-y-1.5">
            <div *ngFor="let trip of tripDetails.slice(0, 10)" class="flex items-center gap-2 group">
              <div class="w-28 flex-shrink-0 flex items-center gap-1.5">
                <span class="text-[10px] font-mono text-slate-400">{{ trip.tripNumber }}</span>
                <span class="text-[10px] text-slate-500 truncate">{{ trip.vehiclePlate }}</span>
              </div>
              <div class="flex-1 relative h-6 bg-slate-50 rounded">
                <!-- Planned bar (outline) -->
                <div class="absolute top-0.5 h-5 rounded border-2 border-dashed border-slate-300 opacity-60"
                  [style.left.%]="getGanttLeft(trip.scheduledDeparture)"
                  [style.width.%]="getGanttWidth(trip.scheduledDeparture, trip.scheduledArrival)"></div>
                <!-- Actual bar (filled) -->
                <div class="absolute top-1 h-4 rounded-sm transition-all"
                  [ngClass]="trip.status === 'COMPLETED' ? 'bg-emerald-500' : trip.status === 'IN_PROGRESS' ? 'bg-blue-500 gantt-pulse' : trip.status === 'DELAYED' ? 'bg-red-400' : 'bg-slate-200'"
                  [style.left.%]="getGanttLeft(trip.actualDeparture || trip.scheduledDeparture)"
                  [style.width.%]="getGanttWidth(trip.actualDeparture || trip.scheduledDeparture, trip.actualArrival || trip.scheduledArrival)">
                </div>
                <!-- Status indicator -->
                <div class="absolute right-1 top-1 text-[9px] font-medium"
                  [ngClass]="trip.status === 'COMPLETED' ? 'text-emerald-700' : trip.status === 'IN_PROGRESS' ? 'text-blue-700' : trip.status === 'DELAYED' ? 'text-red-700' : 'text-slate-400'">
                  {{ trip.passengers || 0 }} HK
                </div>
              </div>
              <div class="w-16 text-right">
                <span class="badge text-[9px]" [ngClass]="{'badge-success':trip.status==='COMPLETED','badge-info':trip.status==='IN_PROGRESS','badge-neutral':trip.status==='SCHEDULED','badge-danger':trip.status==='DELAYED'}">{{ trip.status === 'COMPLETED' ? 'Xong' : trip.status === 'IN_PROGRESS' ? 'Chạy' : trip.status === 'DELAYED' ? 'Trễ' : 'KH' }}</span>
              </div>
            </div>
          </div>
          <div *ngIf="tripDetails.length > 10" class="mt-3 text-center">
            <a routerLink="/schedules" class="text-xs text-blue-600 hover:underline">Xem tất cả {{ tripDetails.length }} chuyến →</a>
          </div>
        </div>
      </div>

      <!-- Route Performance & Passenger Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Route Performance Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div class="p-4 border-b border-slate-100">
            <h3 class="card-title">Hiệu suất tuyến hôm nay</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tuyến</th>
                  <th>OTP</th>
                  <th>Hành khách</th>
                  <th>Chuyến</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let rp of routePerformance">
                  <td>
                    <div>
                      <p class="font-semibold text-slate-800">{{ rp.routeCode }}</p>
                      <p class="text-xs text-slate-400">{{ rp.routeName }}</p>
                    </div>
                  </td>
                  <td>
                    <span class="font-semibold" [ngClass]="rp.otp >= 95 ? 'text-emerald-600' : rp.otp >= 90 ? 'text-amber-600' : 'text-red-600'">{{ rp.otp }}%</span>
                  </td>
                  <td class="font-medium">{{ formatNumber(rp.totalPassengers) }}</td>
                  <td>{{ rp.completedTrips }}/{{ rp.totalTrips }}</td>
                  <td class="font-medium">{{ formatCurrency(rp.revenue) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Passenger Hourly Chart (simple bar visualization) -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div class="p-4 border-b border-slate-100">
            <h3 class="card-title">Lưu lượng hành khách theo giờ</h3>
          </div>
          <div class="p-4">
            <div class="flex items-end gap-1 h-48">
              <div *ngFor="let ph of passengerHourly" class="flex-1 flex flex-col items-center gap-1">
                <div class="w-full rounded-t transition-all duration-500"
                  [style.height.px]="(ph.count / maxPassengers) * 160"
                  [ngClass]="ph.count > 2500 ? 'bg-red-400' : ph.count > 1500 ? 'bg-amber-400' : 'bg-blue-400'"
                  [title]="ph.hour + ':00 - ' + ph.count + ' HK'">
                </div>
                <span class="text-[9px] text-slate-400">{{ ph.hour }}h</span>
              </div>
            </div>
            <div class="flex items-center justify-center gap-4 mt-4 text-xs">
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-blue-400"></span> Bình thường</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-amber-400"></span> Cao điểm</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-red-400"></span> Quá tải</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trip Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Chuyến xe hôm nay</p>
          <div class="mt-3 flex items-end gap-2">
            <span class="text-3xl font-bold text-slate-800">{{ stats.completedTrips }}</span>
            <span class="text-sm text-slate-400 mb-1">/ {{ stats.totalTripsToday }} kế hoạch</span>
          </div>
          <div class="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full transition-all" [style.width.%]="(stats.completedTrips / stats.totalTripsToday) * 100"></div>
          </div>
          <p class="text-xs text-slate-400 mt-2">{{ ((stats.completedTrips / stats.totalTripsToday) * 100).toFixed(1) }}% hoàn thành</p>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Tuyến đang hoạt động</p>
          <div class="mt-3 flex items-end gap-2">
            <span class="text-3xl font-bold text-slate-800">{{ stats.activeRoutes }}</span>
            <span class="text-sm text-slate-400 mb-1">tuyến</span>
          </div>
          <div class="mt-3 flex gap-2">
            <span class="badge badge-success">3 chính</span>
            <span class="badge badge-info">1 đêm</span>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <p class="text-xs font-medium text-slate-400 uppercase tracking-wider">Headway trung bình</p>
          <div class="mt-3 flex items-end gap-2">
            <span class="text-3xl font-bold text-emerald-600">6.2</span>
            <span class="text-sm text-slate-400 mb-1">phút</span>
          </div>
          <p class="text-xs text-slate-400 mt-3">Mục tiêu: 5-7 phút (giờ cao điểm)</p>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {} as DashboardStats;
  vehiclePositions: VehiclePosition[] = [];
  routePerformance: RoutePerformance[] = [];
  passengerHourly: PassengerHourlyData[] = [];
  tripDetails: TripDetail[] = [];
  activeIncidents = MOCK_INCIDENTS.filter(i => ['OPEN', 'ASSIGNED', 'IN_PROGRESS'].includes(i.status));
  maxPassengers = 3200;
  currentTime = '';
  lastUpdate = '';
  timeAxisHours = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  private timer: any;

  constructor(
    private dashboardService: DashboardService,
    private vehicleService: VehicleService
  ) { }

  ngOnInit() {
    this.dashboardService.getStats().subscribe(s => this.stats = s);
    this.dashboardService.getRoutePerformance().subscribe(r => this.routePerformance = r);
    this.dashboardService.getPassengerHourly().subscribe(p => this.passengerHourly = p);
    this.dashboardService.getTripDetails().subscribe(t => this.tripDetails = t);
    this.vehicleService.getPositions().subscribe(p => this.vehiclePositions = p);
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleString('vi-VN');
    this.lastUpdate = now.toLocaleTimeString('vi-VN');
  }

  formatNumber(n: number): string { return n?.toLocaleString('vi-VN') || '0'; }
  formatCurrency(n: number): string {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + ' tỷ';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + ' tr';
    return n?.toLocaleString('vi-VN') + ' đ';
  }

  getTimeAgo(d: Date): string {
    const ms = Date.now() - new Date(d).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return mins + ' phút trước';
    return Math.floor(mins / 60) + ' giờ trước';
  }

  getStatusLabel(s: string): string {
    const m: Record<string, string> = { OPEN: 'Mở', ASSIGNED: 'Đã giao', IN_PROGRESS: 'Đang xử lý', RESOLVED: 'Đã giải quyết', CLOSED: 'Đóng' };
    return m[s] || s;
  }

  // Gantt helpers
  private parseTime(t: string): number {
    if (!t) return 5;
    const parts = t.split(':').map(Number);
    return parts[0] + (parts[1] || 0) / 60;
  }
  getGanttLeft(t: string): number {
    const hour = this.parseTime(t);
    return Math.max(0, ((hour - 5) / 17) * 100);
  }
  getGanttWidth(start: string, end: string): number {
    const s = this.parseTime(start);
    const e = this.parseTime(end || start);
    const dur = e > s ? e - s : 0.5;
    return Math.max(2, (dur / 17) * 100);
  }

  getIncidentsByPriority(priority: string) {
    return this.activeIncidents.filter(i => i.severity === priority);
  }

  get avgResolutionTime(): string {
    const resolved = MOCK_INCIDENTS.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED');
    if (!resolved.length) return 'N/A';
    const avgMins = resolved.reduce((sum, i) => {
      const diff = new Date(i.updatedAt).getTime() - new Date(i.createdAt).getTime();
      return sum + diff / 60000;
    }, 0) / resolved.length;
    if (avgMins < 60) return Math.round(avgMins) + 'p';
    return (avgMins / 60).toFixed(1) + 'h';
  }
}
