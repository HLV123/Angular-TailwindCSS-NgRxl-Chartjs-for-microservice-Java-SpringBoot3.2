import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { StationService } from '../../../core/services/data.service';
import { Station, StationPassengerCount } from '../../../core/models';
import { MOCK_VEHICLE_POSITIONS, MOCK_ROUTES } from '../../../core/mock-data';

@Component({
  selector: 'app-station-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6" *ngIf="station">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <button class="btn-secondary p-2" routerLink="/stations">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <h1 class="page-title">{{ station.code }} — {{ station.name }}</h1>
            <span class="badge" [ngClass]="station.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'">
              {{ station.status === 'ACTIVE' ? 'Hoạt động' : station.status === 'CLOSED' ? 'Đóng' : 'Đang sửa' }}
            </span>
            <span class="badge badge-info">{{ getTypeLabel(station.stationType) }}</span>
          </div>
          <p class="text-sm text-slate-500 mt-1">{{ station.address }} • {{ station.district }}</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-blue-600">{{ currentPassengers }}</p>
          <p class="text-sm text-slate-500 mt-1">Hành khách hiện tại</p>
        </div>
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-emerald-600">{{ station.capacity }}</p>
          <p class="text-sm text-slate-500 mt-1">Sức chứa</p>
        </div>
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-amber-600">{{ station.gateCount }}</p>
          <p class="text-sm text-slate-500 mt-1">Cổng soát vé</p>
        </div>
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-purple-600">{{ station.routeIds.length }}</p>
          <p class="text-sm text-slate-500 mt-1">Tuyến phục vụ</p>
        </div>
      </div>

      <!-- Capacity Bar -->
      <div class="bg-white rounded-2xl border p-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="card-title">Mức độ đông đúc</h3>
          <span class="text-sm font-bold" [ngClass]="occupancyPercent > 80 ? 'text-red-600' : occupancyPercent > 50 ? 'text-amber-600' : 'text-emerald-600'">
            {{ occupancyPercent }}%
          </span>
        </div>
        <div class="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-1000"
            [ngClass]="occupancyPercent > 80 ? 'bg-red-500' : occupancyPercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'"
            [style.width.%]="occupancyPercent"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- ETA Board -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Bảng ETA - Xe sắp đến
          </h3>
          <div class="space-y-3">
            <div *ngFor="let eta of etaBoard" class="flex items-center justify-between py-2 border-b border-slate-700">
              <div class="flex items-center gap-3">
                <span class="px-2 py-0.5 rounded text-xs font-bold" [style.backgroundColor]="eta.color">{{ eta.routeCode }}</span>
                <span class="text-sm">{{ eta.destination }}</span>
              </div>
              <div class="text-right">
                <p class="text-lg font-mono font-bold" [ngClass]="eta.minutes <= 2 ? 'text-emerald-400' : eta.minutes <= 5 ? 'text-amber-400' : 'text-white'">
                  {{ eta.minutes <= 1 ? 'Đang đến' : eta.minutes + ' phút' }}
                </p>
                <p class="text-[10px] text-slate-400">{{ eta.plate }}</p>
              </div>
            </div>
            <div *ngIf="etaBoard.length === 0" class="text-center py-4 text-slate-500">Không có xe sắp đến</div>
          </div>
        </div>

        <!-- Station Features -->
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Tiện ích trạm</h3>
          <div class="grid grid-cols-2 gap-3">
            <div *ngFor="let f of features" class="flex items-center gap-2 p-2 rounded-lg" [ngClass]="f.available ? 'bg-emerald-50' : 'bg-slate-50'">
              <span class="w-6 h-6 flex items-center justify-center rounded-full text-xs" [ngClass]="f.available ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'">
                {{ f.available ? '✓' : '✗' }}
              </span>
              <span class="text-sm" [ngClass]="f.available ? 'text-slate-700 font-medium' : 'text-slate-400'">{{ f.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Routes Serving -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Tuyến đi qua trạm này</h3>
        <div class="flex flex-wrap gap-3">
          <a *ngFor="let r of servingRoutes" [routerLink]="'/routes/' + r.id"
            class="flex items-center gap-2 px-4 py-2 rounded-xl border hover:shadow-md transition-all cursor-pointer">
            <div class="w-3 h-3 rounded-full" [style.backgroundColor]="r.color"></div>
            <span class="font-bold">{{ r.code }}</span>
            <span class="text-sm text-slate-500">{{ r.name }}</span>
          </a>
        </div>
      </div>

      <!-- Real-time Monitoring Panel -->
      <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
        <div class="flex items-center gap-2 mb-4">
          <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          <h3 class="font-bold text-slate-800">Giám sát thời gian thực</h3>
          <span class="ml-auto text-xs text-slate-400">UC-STATION-002/003</span>
        </div>

        <!-- Passenger Flow Chart -->
        <div class="bg-white/80 rounded-xl p-4 mb-4">
          <h4 class="text-sm font-semibold text-slate-700 mb-3">📊 Lưu lượng hành khách theo giờ</h4>
          <div class="flex items-end gap-1 h-32" *ngIf="passengerChartData.length > 0">
            <div *ngFor="let d of passengerChartData" class="flex-1 flex flex-col items-center gap-0.5">
              <div class="w-full flex flex-col items-center justify-end" style="height: 100px">
                <div class="w-full rounded-t bg-blue-400 transition-all" [style.height.px]="d.inHeight" title="Vào: {{d.countIn}}"></div>
                <div class="w-full rounded-b bg-emerald-400 transition-all" [style.height.px]="d.outHeight" title="Ra: {{d.countOut}}"></div>
              </div>
              <span class="text-[9px] text-slate-400">{{d.hour}}</span>
            </div>
          </div>
          <div *ngIf="passengerChartData.length === 0" class="text-center py-6 text-slate-400 text-sm">Chưa có dữ liệu cho trạm này</div>
          <div class="flex items-center gap-4 mt-2 text-xs text-slate-500" *ngIf="passengerChartData.length > 0">
            <span class="flex items-center gap-1"><span class="w-3 h-2 bg-blue-400 rounded"></span> Vào</span>
            <span class="flex items-center gap-1"><span class="w-3 h-2 bg-emerald-400 rounded"></span> Ra</span>
            <span class="ml-auto">Peak: {{ peakHour }} ({{ peakCount }} HK)</span>
          </div>
        </div>

        <!-- Device Status -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div *ngFor="let dev of deviceStatuses" class="bg-white/80 rounded-xl p-3 flex items-center gap-2">
            <span class="text-lg">{{ dev.icon }}</span>
            <div class="flex-1">
              <p class="text-xs font-medium text-slate-700">{{ dev.name }}</p>
              <p class="text-[10px]" [ngClass]="dev.status === 'Online' ? 'text-emerald-600' : dev.status === 'Offline' ? 'text-red-600' : 'text-amber-600'">{{ dev.status }}</p>
            </div>
            <span class="w-2 h-2 rounded-full" [ngClass]="dev.status === 'Online' ? 'bg-emerald-500' : dev.status === 'Offline' ? 'bg-red-500' : 'bg-amber-500'"></span>
          </div>
        </div>

        <!-- Crowd Alert -->
        <div *ngIf="occupancyPercent > 70" class="p-3 rounded-xl flex items-center gap-2"
          [ngClass]="occupancyPercent > 90 ? 'bg-red-100 border border-red-200' : 'bg-amber-100 border border-amber-200'">
          <span>{{ occupancyPercent > 90 ? '🚨' : '⚠️' }}</span>
          <div>
            <p class="text-xs font-bold" [ngClass]="occupancyPercent > 90 ? 'text-red-700' : 'text-amber-700'">
              {{ occupancyPercent > 90 ? 'CẢN BÁO: Trạm quá tải!' : 'Chú ý: Đông người bất thường' }}
            </p>
            <p class="text-[10px] text-slate-500">{{ currentPassengers }}/{{ station.capacity }} • {{ occupancyPercent }}% sức chứa</p>
          </div>
        </div>
      </div>

      <!-- Camera Placeholder -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Camera giám sát (CCTV)</h3>
        <div class="grid grid-cols-2 gap-4">
          <div *ngFor="let cam of [1,2,3,4]" class="bg-slate-900 rounded-xl aspect-video flex items-center justify-center">
            <div class="text-center">
              <svg class="w-10 h-10 text-slate-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              <p class="text-slate-500 text-xs mt-1">Camera {{ cam }} • {{ station.code }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StationDetailComponent implements OnInit, OnDestroy {
  station: Station | null = null;
  currentPassengers = 0;
  occupancyPercent = 0;
  etaBoard: any[] = [];
  servingRoutes: any[] = [];
  features: any[] = [];
  passengerCounts: StationPassengerCount[] = [];
  passengerChartData: { hour: string; countIn: number; countOut: number; inHeight: number; outHeight: number }[] = [];
  deviceStatuses: { icon: string; name: string; status: string }[] = [];
  peakHour = '';
  peakCount = 0;
  private interval: any;

  constructor(private stationService: StationService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.stationService.getById(id).subscribe(s => {
      if (s) {
        this.station = s;
        this.currentPassengers = s.currentPassengers || Math.floor(Math.random() * s.capacity);
        this.occupancyPercent = Math.round((this.currentPassengers / s.capacity) * 100);

        this.features = [
          { label: 'Mái che', available: s.hasCover },
          { label: 'Máy bán vé', available: s.hasTicketMachine },
          { label: 'Bảng LED', available: s.hasRealtimeDisplay },
          { label: 'Wi-Fi', available: s.hasWifi },
          { label: 'Toilet', available: s.hasToilet },
          { label: 'Thang máy', available: s.hasElevator },
          { label: 'Bãi xe đạp', available: s.bikeParking },
          { label: 'Taxi', available: s.taxiStand },
          { label: 'Kết nối Metro', available: s.metroConnection },
        ];

        this.servingRoutes = MOCK_ROUTES.filter(r => s.routeIds.includes(r.id));
        this.buildEtaBoard();
        this.buildDeviceStatuses();

        // Load passenger counts
        this.stationService.getPassengerCounts(id).subscribe(counts => {
          this.passengerCounts = counts;
          this.buildPassengerChart();
        });

        // Simulate real-time passenger updates
        this.interval = setInterval(() => {
          const delta = Math.floor(Math.random() * 11) - 5;
          this.currentPassengers = Math.max(0, Math.min(s.capacity, this.currentPassengers + delta));
          this.occupancyPercent = Math.round((this.currentPassengers / s.capacity) * 100);
        }, 5000);
      }
    });
  }

  ngOnDestroy() { if (this.interval) clearInterval(this.interval); }

  buildPassengerChart() {
    if (!this.passengerCounts.length) return;
    const maxVal = Math.max(...this.passengerCounts.map(p => Math.max(p.countIn, p.countOut)));
    let peakIdx = 0;
    let peakVal = 0;
    this.passengerChartData = this.passengerCounts.map((p, i) => {
      const h = new Date(p.time).getHours();
      if (p.countIn > peakVal) { peakVal = p.countIn; peakIdx = i; }
      return {
        hour: h + 'h',
        countIn: p.countIn,
        countOut: p.countOut,
        inHeight: maxVal > 0 ? Math.round((p.countIn / maxVal) * 50) : 0,
        outHeight: maxVal > 0 ? Math.round((p.countOut / maxVal) * 50) : 0,
      };
    });
    const peakItem = this.passengerCounts[peakIdx];
    this.peakHour = new Date(peakItem.time).getHours() + ':00';
    this.peakCount = peakItem.countIn;
  }

  buildDeviceStatuses() {
    if (!this.station) return;
    this.deviceStatuses = [
      { icon: '🎫', name: 'Máy soát vé', status: this.station.hasTicketMachine ? 'Online' : 'Offline' },
      { icon: '📺', name: 'Bảng LED', status: this.station.hasRealtimeDisplay ? 'Online' : 'Offline' },
      { icon: '📷', name: 'Camera CCTV', status: 'Online' },
      { icon: '📶', name: 'Wi-Fi', status: this.station.hasWifi ? 'Online' : 'Offline' },
    ];
  }

  buildEtaBoard() {
    if (!this.station) return;
    const routes = MOCK_ROUTES.filter(r => this.station!.routeIds.includes(r.id));
    this.etaBoard = routes.map((r, i) => ({
      routeCode: r.code,
      color: r.color,
      destination: r.stations[r.stations.length - 1]?.stationName || '',
      plate: MOCK_VEHICLE_POSITIONS[i]?.vehicleId ? '29B-001.0' + (i + 1) : '—',
      minutes: Math.floor(Math.random() * 10) + 1,
    }));
  }

  getTypeLabel(t: string): string {
    return { INLINE: 'Trạm dọc', SIDE: 'Trạm bên', TERMINAL: 'Bến xe', TRANSFER_HUB: 'Trung chuyển' }[t] || t;
  }
}
