import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ScheduleService, DashboardService } from '../../../core/services/data.service';
import { Schedule, TripDetail, HeadwayData } from '../../../core/models';

@Component({
  selector: 'app-schedule-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6" *ngIf="schedule">
      <div class="flex items-center gap-4">
        <button class="btn-secondary p-2" routerLink="/schedules">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="flex-1">
          <h1 class="page-title">Lịch trình {{ schedule.routeCode }}</h1>
          <p class="text-sm text-slate-500 mt-1">{{ schedule.routeName }} • {{ schedule.scheduleType }}</p>
        </div>
        <span class="badge" [ngClass]="schedule.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'">{{ schedule.status }}</span>
      </div>

      <!-- Schedule Info -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-2xl font-bold text-blue-600">{{ schedule.operatingHoursStart }} - {{ schedule.operatingHoursEnd }}</p>
          <p class="text-xs text-slate-500 mt-1">Giờ hoạt động</p>
        </div>
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-emerald-600">{{ schedule.peakFrequencyMin }}<span class="text-lg">p</span></p>
          <p class="text-xs text-slate-500 mt-1">Tần suất cao điểm</p>
        </div>
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-amber-600">{{ schedule.requiredVehicles }}</p>
          <p class="text-xs text-slate-500 mt-1">Xe cần thiết</p>
        </div>
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-purple-600">{{ schedule.requiredDrivers }}</p>
          <p class="text-xs text-slate-500 mt-1">Tài xế cần thiết</p>
        </div>
      </div>

      <!-- Frequency Detail -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Tần suất theo khung giờ</h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-red-50 text-center">
            <p class="text-xs text-red-500 font-medium mb-1">Giờ cao điểm</p>
            <p class="text-3xl font-bold text-red-600">{{ schedule.peakFrequencyMin }} phút</p>
            <p class="text-xs text-red-400 mt-1">6:30-8:30 & 16:30-18:30</p>
          </div>
          <div class="p-4 rounded-xl bg-blue-50 text-center">
            <p class="text-xs text-blue-500 font-medium mb-1">Giờ bình thường</p>
            <p class="text-3xl font-bold text-blue-600">{{ schedule.normalFrequencyMin }} phút</p>
            <p class="text-xs text-blue-400 mt-1">8:30-16:30 & 18:30-21:00</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-50 text-center">
            <p class="text-xs text-slate-500 font-medium mb-1">Giờ thấp điểm</p>
            <p class="text-3xl font-bold text-slate-600">{{ schedule.offPeakFrequencyMin }} phút</p>
            <p class="text-xs text-slate-400 mt-1">5:00-6:30 & 21:00-23:00</p>
          </div>
        </div>
      </div>

      <!-- Headway Monitor -->
      <div class="bg-white rounded-2xl border p-6" *ngIf="headway">
        <h3 class="card-title mb-4">Headway Monitor (Real-time)</h3>
        <div class="flex items-center gap-4 mb-4">
          <span class="text-sm text-slate-500">Planned: <strong>{{ headway.plannedHeadwayMin }} phút</strong></span>
          <span class="text-sm text-slate-500">Actual: <strong [ngClass]="headway.status==='NORMAL'?'text-emerald-600':headway.status==='BUNCHING'?'text-amber-600':'text-red-600'">{{ headway.actualHeadwayMin }} phút</strong></span>
          <span class="badge" [ngClass]="headway.status==='NORMAL'?'badge-success':headway.status==='BUNCHING'?'badge-warning':'badge-danger'">{{ headway.status }}</span>
        </div>
        <div class="space-y-2">
          <div *ngFor="let pair of headway.vehiclePairs" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <span class="font-mono text-sm font-bold">{{ pair.v1 }}</span>
            <div class="flex-1 h-2 bg-slate-200 rounded-full relative">
              <div class="absolute h-2 rounded-full" [ngClass]="pair.distanceKm < 1 ? 'bg-amber-500' : pair.distanceKm > 5 ? 'bg-red-500' : 'bg-emerald-500'"
                [style.width.%]="Math.min(pair.distanceKm / 10 * 100, 100)"></div>
            </div>
            <span class="font-mono text-sm font-bold">{{ pair.v2 }}</span>
            <span class="text-xs text-slate-500 w-16 text-right">{{ pair.distanceKm }} km</span>
          </div>
        </div>
      </div>

      <!-- Trips Timeline Gantt -->
      <div class="bg-white rounded-2xl border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="card-title">Timeline chuyến xe (Gantt)</h3>
          <div class="flex items-center gap-3 text-xs">
            <span class="flex items-center gap-1.5"><span class="w-3 h-2 rounded bg-emerald-500"></span> Hoàn thành</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-2 rounded bg-blue-500"></span> Đang chạy</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-2 rounded border-2 border-dashed border-slate-300"></span> Kế hoạch</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-2 rounded bg-red-400"></span> Trễ</span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <!-- Time axis -->
          <div class="flex items-center mb-2 ml-32">
            <div *ngFor="let h of timeAxisHours" class="text-[10px] text-slate-400 text-center" [style.width.%]="100 / timeAxisHours.length">
              {{ h }}:00
            </div>
          </div>
          <!-- Trip rows -->
          <div class="space-y-1">
            <div *ngFor="let trip of trips" class="flex items-center gap-2 group hover:bg-slate-50 rounded py-0.5 px-1 transition-colors">
              <div class="w-32 flex-shrink-0">
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] font-mono text-slate-400">{{ trip.tripNumber }}</span>
                  <span class="badge text-[8px]" [ngClass]="trip.direction==='OUTBOUND'?'badge-info':'badge-warning'">{{ trip.direction==='OUTBOUND'?'→':'←' }}</span>
                </div>
                <p class="text-[9px] text-slate-500 truncate">{{ trip.vehiclePlate }} • {{ trip.driverName }}</p>
              </div>
              <div class="flex-1 relative h-7 bg-slate-50 rounded">
                <!-- Planned bar (outline) -->
                <div class="absolute top-0.5 h-6 rounded border-2 border-dashed border-slate-300 opacity-50"
                  [style.left.%]="getGanttLeft(trip.scheduledDeparture)"
                  [style.width.%]="getGanttWidth(trip.scheduledDeparture, trip.scheduledArrival)"></div>
                <!-- Actual bar -->
                <div class="absolute top-1 h-5 rounded-sm transition-all"
                  [ngClass]="trip.status === 'COMPLETED' ? 'bg-emerald-500' : trip.status === 'IN_PROGRESS' ? 'bg-blue-500 animate-pulse' : trip.status === 'DELAYED' ? 'bg-red-400' : 'bg-slate-200'"
                  [style.left.%]="getGanttLeft(trip.actualDeparture || trip.scheduledDeparture)"
                  [style.width.%]="getGanttWidth(trip.actualDeparture || trip.scheduledDeparture, trip.actualArrival || trip.scheduledArrival)">
                </div>
                <!-- Delay marker -->
                <div *ngIf="trip.delayMinutes && trip.delayMinutes > 0" class="absolute top-0 right-1 text-[8px] font-bold text-red-600">
                  +{{ trip.delayMinutes }}p
                </div>
                <!-- Passenger count -->
                <div class="absolute right-1 bottom-0 text-[8px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ trip.passengers || 0 }} HK
                </div>
              </div>
              <div class="w-14 text-right">
                <span class="badge text-[8px]" [ngClass]="{'badge-success':trip.status==='COMPLETED','badge-info':trip.status==='IN_PROGRESS','badge-neutral':trip.status==='SCHEDULED','badge-danger':trip.status==='DELAYED'}">{{ getStatusLabel(trip.status) }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Summary -->
        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500">
          <span>Tổng: <strong class="text-slate-700">{{ trips.length }}</strong> chuyến</span>
          <span>Hoàn thành: <strong class="text-emerald-600">{{ getCountByStatus('COMPLETED') }}</strong></span>
          <span>Đang chạy: <strong class="text-blue-600">{{ getCountByStatus('IN_PROGRESS') }}</strong></span>
          <span>Trễ: <strong class="text-red-600">{{ getCountByStatus('DELAYED') }}</strong></span>
          <span>TB trễ: <strong [ngClass]="avgDelay > 5 ? 'text-red-600' : 'text-slate-700'">{{ avgDelay.toFixed(1) }} phút</strong></span>
        </div>
      </div>

      <!-- Headway Recommendations -->
      <div *ngIf="headway" class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-3">Đề xuất điều chỉnh Headway</h3>
        <div class="space-y-2">
          <div *ngFor="let rec of headwayRecommendations" class="flex items-start gap-3 p-3 rounded-xl" [ngClass]="rec.type === 'warning' ? 'bg-amber-50' : rec.type === 'danger' ? 'bg-red-50' : 'bg-emerald-50'">
            <span class="text-base">{{ rec.icon }}</span>
            <div>
              <p class="text-sm font-medium" [ngClass]="rec.type === 'warning' ? 'text-amber-800' : rec.type === 'danger' ? 'text-red-800' : 'text-emerald-800'">{{ rec.title }}</p>
              <p class="text-xs mt-0.5" [ngClass]="rec.type === 'warning' ? 'text-amber-600' : rec.type === 'danger' ? 'text-red-600' : 'text-emerald-600'">{{ rec.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Trip Timetable -->
      <div class="bg-white rounded-2xl border overflow-hidden">
        <div class="p-4 border-b"><h3 class="card-title">Bảng chuyến hôm nay</h3></div>
        <div class="table-container">
          <table class="data-table">
            <thead><tr><th>Mã</th><th>Hướng</th><th>Xe</th><th>TX</th><th>Khởi hành</th><th>HK</th><th>Trạng thái</th></tr></thead>
            <tbody>
              <tr *ngFor="let t of trips">
                <td class="font-mono text-xs">{{ t.tripNumber }}</td>
                <td><span class="badge" [ngClass]="t.direction==='OUTBOUND'?'badge-info':'badge-warning'">{{ t.direction==='OUTBOUND'?'Đi':'Về' }}</span></td>
                <td>{{ t.vehiclePlate }}</td>
                <td>{{ t.driverName }}</td>
                <td>{{ t.scheduledDeparture }}</td>
                <td>{{ t.passengers }}</td>
                <td><span class="badge" [ngClass]="{'badge-success':t.status==='COMPLETED','badge-info':t.status==='IN_PROGRESS','badge-neutral':t.status==='SCHEDULED'}">{{ t.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ScheduleDetailComponent implements OnInit {
  schedule: Schedule | null = null;
  trips: TripDetail[] = [];
  headway: HeadwayData | null = null;
  Math = Math;
  timeAxisHours = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  constructor(private scheduleService: ScheduleService, private dashboardService: DashboardService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.scheduleService.getById(id).subscribe(s => {
      if (s) {
        this.schedule = s;
        this.dashboardService.getTripDetails().subscribe(t => this.trips = t.filter(x => x.routeId === s.routeId));
        this.dashboardService.getHeadwayData().subscribe(h => this.headway = h.find(x => x.routeId === s.routeId) || null);
      }
    });
  }

  // Gantt helpers
  private parseTime(t: string): number {
    if (!t) return 5;
    const parts = t.split(':').map(Number);
    return parts[0] + (parts[1] || 0) / 60;
  }
  getGanttLeft(t: string): number {
    return Math.max(0, ((this.parseTime(t) - 5) / 17) * 100);
  }
  getGanttWidth(start: string, end: string): number {
    const s = this.parseTime(start);
    const e = this.parseTime(end || start);
    const dur = e > s ? e - s : 0.5;
    return Math.max(2, (dur / 17) * 100);
  }
  getStatusLabel(s: string): string {
    return { COMPLETED: 'Xong', IN_PROGRESS: 'Chạy', SCHEDULED: 'KH', DELAYED: 'Trễ' }[s] || s;
  }
  getCountByStatus(status: string): number {
    return this.trips.filter(t => t.status === status).length;
  }
  get avgDelay(): number {
    const delayed = this.trips.filter(t => t.delayMinutes && t.delayMinutes > 0);
    if (!delayed.length) return 0;
    return delayed.reduce((sum, t) => sum + (t.delayMinutes || 0), 0) / delayed.length;
  }
  get headwayRecommendations() {
    const recs: { icon: string; title: string; description: string; type: string }[] = [];
    if (!this.headway) return recs;
    const deviation = this.headway.actualHeadwayMin - this.headway.plannedHeadwayMin;
    if (this.headway.status === 'BUNCHING') {
      recs.push({ icon: '🚧', title: 'Phát hiện xe dồn (Bunching)', description: `Headway thực tế ${this.headway.actualHeadwayMin}p < kế hoạch ${this.headway.plannedHeadwayMin}p. Đề xuất giãn tần suất hoặc điều phối lại.`, type: 'warning' });
    }
    if (this.headway.status === 'GAPPING') {
      recs.push({ icon: '⚠️', title: 'Khoảng cách lớn (Gap)', description: `Headway ${this.headway.actualHeadwayMin}p vượt kế hoạch ${this.headway.plannedHeadwayMin}p. Cần bổ sung xe dự phòng.`, type: 'danger' });
    }
    if (this.headway.status === 'NORMAL') {
      recs.push({ icon: '✅', title: 'Headway ổn định', description: `Headway thực tế ${this.headway.actualHeadwayMin}p phù hợp kế hoạch ${this.headway.plannedHeadwayMin}p.`, type: 'success' });
    }
    if (this.avgDelay > 5) {
      recs.push({ icon: '⏰', title: 'Trễ trung bình cao', description: `TB trễ ${this.avgDelay.toFixed(1)} phút. Xem xét tăng thời gian dừng đỗ hoặc giảm số trạm.`, type: 'warning' });
    }
    return recs;
  }
}
