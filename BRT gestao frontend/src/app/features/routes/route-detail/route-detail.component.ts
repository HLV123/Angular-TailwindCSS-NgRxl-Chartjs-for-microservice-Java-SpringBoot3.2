import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RouteService } from '../../../core/services/route.service';
import { DashboardService } from '../../../core/services/data.service';
import { BrtRoute, TripDetail } from '../../../core/models';
import { MOCK_SCHEDULES } from '../../../core/mock-data';

@Component({
    selector: 'app-route-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="space-y-6" *ngIf="route">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <button class="btn-secondary p-2" routerLink="/routes">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <div class="w-4 h-4 rounded-full" [style.backgroundColor]="route.color"></div>
            <h1 class="page-title">{{ route.code }} — {{ route.name }}</h1>
            <span class="badge" [ngClass]="{'badge-success': route.status==='ACTIVE', 'badge-neutral': route.status==='INACTIVE', 'badge-info': route.status==='DRAFT'}">
              {{ route.status === 'ACTIVE' ? 'Hoạt động' : route.status === 'INACTIVE' ? 'Ngừng' : 'Nháp' }}
            </span>
          </div>
          <p class="text-sm text-slate-500 mt-1">{{ route.description }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 border-b border-slate-200">
        <button *ngFor="let tab of tabs" (click)="activeTab = tab.key"
          class="px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors"
          [ngClass]="activeTab === tab.key ? 'bg-white text-blue-600 border border-b-white border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700'">
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab: Overview -->
      <div *ngIf="activeTab === 'overview'" class="space-y-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-2xl border p-5">
            <p class="text-3xl font-bold text-blue-600">{{ route.totalLengthKm }} km</p>
            <p class="text-sm text-slate-500 mt-1">Tổng chiều dài</p>
          </div>
          <div class="bg-white rounded-2xl border p-5">
            <p class="text-3xl font-bold text-emerald-600">{{ route.stations.length }}</p>
            <p class="text-sm text-slate-500 mt-1">Trạm dừng</p>
          </div>
          <div class="bg-white rounded-2xl border p-5">
            <p class="text-3xl font-bold text-amber-600">{{ route.avgTravelTimeMin }} phút</p>
            <p class="text-sm text-slate-500 mt-1">Thời gian TB</p>
          </div>
          <div class="bg-white rounded-2xl border p-5">
            <p class="text-3xl font-bold text-purple-600">{{ getScheduleInfo() }}</p>
            <p class="text-sm text-slate-500 mt-1">Tần suất giờ cao điểm</p>
          </div>
        </div>

        <!-- Route SVG Map -->
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Bản đồ tuyến</h3>
          <div class="relative bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-8 overflow-x-auto">
            <svg [attr.width]="route.stations.length * 120 + 40" height="120" class="mx-auto">
              <!-- Route Line -->
              <line x1="40" [attr.y1]="60" [attr.x2]="route.stations.length * 120 - 40" [attr.y2]="60"
                [attr.stroke]="route.color" stroke-width="4" stroke-linecap="round"/>
              <!-- Station Dots -->
              <g *ngFor="let station of route.stations; let i = index">
                <circle [attr.cx]="i * 120 + 40" cy="60" r="10" [attr.fill]="route.color" stroke="white" stroke-width="3"/>
                <text [attr.x]="i * 120 + 40" y="95" text-anchor="middle" class="text-[10px] fill-slate-600 font-medium">
                  {{ station.stationCode }}
                </text>
                <text [attr.x]="i * 120 + 40" y="35" text-anchor="middle" class="text-[9px] fill-slate-400">
                  {{ station.distanceFromStartKm }}km
                </text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Graph Analysis -->
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Phân tích đồ thị mạng lưới (Neo4j)</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-semibold text-slate-700 mb-3">Station Centrality Ranking</h4>
              <div class="space-y-2">
                <div *ngFor="let s of stationCentrality" class="flex items-center gap-3">
                  <span class="w-8 text-center text-sm font-bold" [ngClass]="s.rank<=3 ? 'text-amber-500' : 'text-slate-400'">#{{ s.rank }}</span>
                  <span class="flex-1 text-sm font-medium">{{ s.name }}</span>
                  <div class="w-24 h-2 bg-slate-100 rounded-full"><div class="h-full rounded-full bg-blue-500" [style.width.%]="s.score"></div></div>
                  <span class="text-xs text-slate-500 w-10 text-right">{{ s.score }}%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-slate-700 mb-3">Shortest Path Finder</h4>
              <div class="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                <p class="font-semibold mb-2">{{ route.stations[0]?.stationName }} → {{ route.stations[route.stations.length-1]?.stationName }}</p>
                <p>Khoảng cách: <strong>{{ route.totalLengthKm }} km</strong></p>
                <p>Thời gian: <strong>{{ route.avgTravelTimeMin }} phút</strong></p>
                <p>Số trạm: <strong>{{ route.stations.length }}</strong></p>
                <p class="mt-2 text-xs text-blue-500">Thuật toán: Dijkstra trên Neo4j Graph Database</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Stations -->
      <div *ngIf="activeTab === 'stations'">
        <div class="bg-white rounded-2xl border overflow-hidden">
          <div class="table-container">
            <table class="data-table">
              <thead><tr>
                <th>STT</th><th>Mã</th><th>Tên trạm</th><th>Khoảng cách</th><th>Thời gian</th><th>Tọa độ</th>
              </tr></thead>
              <tbody>
                <tr *ngFor="let s of route.stations">
                  <td class="font-bold">{{ s.order }}</td>
                  <td class="font-mono text-xs">{{ s.stationCode }}</td>
                  <td>
                    <a [routerLink]="'/stations/' + s.stationId" class="text-blue-600 hover:underline font-medium">{{ s.stationName }}</a>
                  </td>
                  <td>{{ s.distanceFromStartKm }} km</td>
                  <td>{{ s.travelTimeFromPrevMin > 0 ? s.travelTimeFromPrevMin + ' phút' : '—' }}</td>
                  <td class="text-xs text-slate-400">{{ s.lat.toFixed(4) }}, {{ s.lng.toFixed(4) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab: Trips -->
      <div *ngIf="activeTab === 'trips'">
        <div class="bg-white rounded-2xl border overflow-hidden">
          <div class="p-4 border-b flex items-center justify-between">
            <h3 class="card-title">Bảng chuyến hôm nay</h3>
            <span class="text-sm text-slate-500">{{ routeTrips.length }} chuyến</span>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead><tr>
                <th>Mã chuyến</th><th>Hướng</th><th>Xe</th><th>Tài xế</th><th>Giờ khởi hành</th><th>Giờ đến</th><th>HK</th><th>Trạng thái</th>
              </tr></thead>
              <tbody>
                <tr *ngFor="let t of routeTrips">
                  <td class="font-mono text-xs">{{ t.tripNumber }}</td>
                  <td><span class="badge" [ngClass]="t.direction==='OUTBOUND'?'badge-info':'badge-warning'">{{ t.direction==='OUTBOUND'?'Đi':'Về' }}</span></td>
                  <td>{{ t.vehiclePlate }}</td>
                  <td>{{ t.driverName }}</td>
                  <td>
                    <span>{{ t.scheduledDeparture }}</span>
                    <span *ngIf="t.actualDeparture" class="text-xs ml-1" [ngClass]="t.actualDeparture > t.scheduledDeparture ? 'text-red-500' : 'text-emerald-500'">
                      ({{ t.actualDeparture }})
                    </span>
                  </td>
                  <td>
                    <span>{{ t.scheduledArrival }}</span>
                    <span *ngIf="t.actualArrival" class="text-xs ml-1" [ngClass]="t.delayMinutes > 3 ? 'text-red-500' : 'text-emerald-500'">
                      ({{ t.actualArrival }})
                    </span>
                  </td>
                  <td class="font-bold">{{ t.passengers }}</td>
                  <td><span class="badge" [ngClass]="getTripStatusClass(t.status)">{{ getTripStatusLabel(t.status) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab: Performance -->
      <div *ngIf="activeTab === 'performance'" class="space-y-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-2xl border p-5 text-center">
            <p class="text-3xl font-bold text-emerald-600">{{ perfData?.otp || 0 }}%</p>
            <p class="text-sm text-slate-500 mt-1">OTP</p>
          </div>
          <div class="bg-white rounded-2xl border p-5 text-center">
            <p class="text-3xl font-bold text-blue-600">{{ (perfData?.totalPassengers || 0).toLocaleString() }}</p>
            <p class="text-sm text-slate-500 mt-1">Hành khách</p>
          </div>
          <div class="bg-white rounded-2xl border p-5 text-center">
            <p class="text-3xl font-bold text-purple-600">{{ perfData?.totalTrips || 0 }}</p>
            <p class="text-sm text-slate-500 mt-1">Tổng chuyến</p>
          </div>
          <div class="bg-white rounded-2xl border p-5 text-center">
            <p class="text-3xl font-bold text-amber-600">{{ ((perfData?.revenue || 0) / 1000000).toFixed(1) }}M</p>
            <p class="text-sm text-slate-500 mt-1">Doanh thu (VNĐ)</p>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!route" class="text-center py-20">
      <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      <p class="text-slate-500 mt-4">Đang tải...</p>
    </div>
  `
})
export class RouteDetailComponent implements OnInit {
    route: BrtRoute | null = null;
    activeTab = 'overview';
    routeTrips: TripDetail[] = [];
    perfData: any = null;
    tabs = [
        { key: 'overview', label: 'Tổng quan' },
        { key: 'stations', label: 'Trạm dừng' },
        { key: 'trips', label: 'Chuyến xe' },
        { key: 'performance', label: 'Hiệu suất' }
    ];

    stationCentrality: any[] = [];

    constructor(
        private routeService: RouteService,
        private dashboardService: DashboardService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        const id = this.activatedRoute.snapshot.paramMap.get('id') || '';
        this.routeService.getById(id).subscribe(r => {
            if (r) {
                this.route = r;
                this.stationCentrality = r.stations.map((s, i) => ({
                    rank: i + 1, name: s.stationName,
                    score: Math.max(100 - i * (100 / r.stations.length), 10)
                })).sort((a, b) => b.score - a.score).map((s, i) => ({ ...s, rank: i + 1 }));
            }
        });
        this.dashboardService.getTripDetails().subscribe(trips => {
            this.routeTrips = trips.filter(t => t.routeId === id);
        });
        this.dashboardService.getRoutePerformance().subscribe(perf => {
            this.perfData = perf.find(p => p.routeId === id);
        });
    }

    getScheduleInfo(): string {
        const sch = MOCK_SCHEDULES.find(s => s.routeId === this.route?.id);
        return sch ? sch.peakFrequencyMin + ' phút' : '—';
    }

    getTripStatusClass(s: string): string {
        return { COMPLETED: 'badge-success', IN_PROGRESS: 'badge-info', SCHEDULED: 'badge-neutral', DELAYED: 'badge-danger', CANCELLED: 'badge-danger' }[s] || 'badge-neutral';
    }
    getTripStatusLabel(s: string): string {
        return { COMPLETED: 'Hoàn thành', IN_PROGRESS: 'Đang chạy', SCHEDULED: 'Chờ', DELAYED: 'Trễ', CANCELLED: 'Hủy' }[s] || s;
    }
}
