import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../../core/services/vehicle.service';
import { TelemetryService, MaintenanceService } from '../../../core/services/data.service';
import { Vehicle, VehicleTelemetry, WorkOrder } from '../../../core/models';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6" *ngIf="vehicle">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <button class="btn-secondary p-2" routerLink="/vehicles">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <h1 class="page-title">{{ vehicle.plateNumber }}</h1>
            <span class="badge" [ngClass]="getStatusClass(vehicle.currentStatus)">{{ getStatusLabel(vehicle.currentStatus) }}</span>
          </div>
          <p class="text-sm text-slate-500 mt-1">{{ vehicle.manufacturer }} {{ vehicle.model }} • {{ vehicle.manufactureYear }} • {{ getTypeLabel(vehicle.vehicleType) }}</p>
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

      <!-- Tab: Info -->
      <div *ngIf="activeTab === 'info'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl border p-6">
            <h3 class="card-title mb-4">Thông tin xe</h3>
            <div class="space-y-3">
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Biển số</span><span class="font-medium">{{ vehicle.plateNumber }}</span></div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Loại xe</span><span class="font-medium">{{ getTypeLabel(vehicle.vehicleType) }}</span></div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Nhiên liệu</span><span class="font-medium">{{ vehicle.fuelType }}</span></div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Chỗ ngồi / Đứng</span><span class="font-medium">{{ vehicle.capacitySeated }} / {{ vehicle.capacityStanding }}</span></div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Tổng km đã chạy</span><span class="font-medium">{{ vehicle.totalKm.toLocaleString() }} km</span></div>
              <div class="flex justify-between py-2"><span class="text-sm text-slate-500">GPS Device</span><span class="font-mono text-xs">{{ vehicle.gpsDeviceId || 'N/A' }}</span></div>
            </div>
          </div>
          <div class="bg-white rounded-2xl border p-6">
            <h3 class="card-title mb-4">Trạng thái hiện tại</h3>
            <div class="space-y-3">
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Tuyến hiện tại</span><span class="font-medium">{{ vehicle.currentRouteName || '— Chưa phân công' }}</span></div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Tài xế hiện tại</span><span class="font-medium">{{ vehicle.currentDriverName || '— Chưa phân công' }}</span></div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Camera</span><span class="font-medium">{{ vehicle.hasCamera ? 'Có' : 'Không' }}</span></div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Máy soát vé</span><span class="font-medium">{{ vehicle.hasTicketScanner ? 'Có' : 'Không' }}</span></div>
              <div class="flex justify-between py-2"><span class="text-sm text-slate-500">Bảng thông tin</span><span class="font-medium">{{ vehicle.hasInfoDisplay ? 'Có' : 'Không' }}</span></div>
            </div>
          </div>
        </div>

        <!-- Equipment Cards -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white rounded-2xl border p-5 text-center" [ngClass]="vehicle.hasCamera ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'">
            <svg class="w-8 h-8 mx-auto mb-2" [ngClass]="vehicle.hasCamera ? 'text-emerald-500' : 'text-red-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            <p class="text-sm font-semibold">Camera CCTV</p>
          </div>
          <div class="bg-white rounded-2xl border p-5 text-center" [ngClass]="vehicle.hasTicketScanner ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'">
            <svg class="w-8 h-8 mx-auto mb-2" [ngClass]="vehicle.hasTicketScanner ? 'text-emerald-500' : 'text-red-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
            <p class="text-sm font-semibold">Soát vé NFC/QR</p>
          </div>
          <div class="bg-white rounded-2xl border p-5 text-center" [ngClass]="vehicle.hasInfoDisplay ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'">
            <svg class="w-8 h-8 mx-auto mb-2" [ngClass]="vehicle.hasInfoDisplay ? 'text-emerald-500' : 'text-red-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <p class="text-sm font-semibold">Bảng LED</p>
          </div>
        </div>

        <!-- Vehicle Lifecycle Diagram -->
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Vòng đời xe (Lifecycle)</h3>
          <div class="flex items-center justify-between gap-2">
            <div *ngFor="let state of lifecycleStates; let last = last" class="flex items-center gap-2 flex-1">
              <div class="flex-shrink-0 text-center">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  [ngClass]="vehicle.currentStatus === state.key ? 'ring-4 ring-offset-2 ' + state.activeRing + ' ' + state.activeBg + ' text-white scale-110' : isPassedState(state.key) ? state.passedBg + ' text-white opacity-70' : 'bg-slate-100 text-slate-400'">
                  {{ state.icon }}
                </div>
                <p class="text-[9px] mt-1 font-medium" [ngClass]="vehicle.currentStatus === state.key ? 'text-slate-800' : 'text-slate-400'">{{ state.label }}</p>
              </div>
              <div *ngIf="!last" class="flex-1 h-0.5 rounded" [ngClass]="isPassedState(state.key) ? 'bg-blue-300' : 'bg-slate-200'"></div>
            </div>
          </div>
        </div>

        <!-- Maintenance Km Progress -->
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Tiến trình bảo dưỡng định kỳ</h3>
          <div class="space-y-4">
            <div *ngFor="let milestone of maintenanceMilestones" class="flex items-center gap-4">
              <div class="w-28 flex-shrink-0">
                <p class="text-xs font-bold" [ngClass]="getMilestoneProgress(milestone.km) >= 100 ? 'text-red-600' : getMilestoneProgress(milestone.km) >= 80 ? 'text-amber-600' : 'text-slate-600'">{{ milestone.label }}</p>
                <p class="text-[10px] text-slate-400">{{ milestone.km.toLocaleString() }} km</p>
              </div>
              <div class="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all" [style.width.%]="getMilestoneProgressCapped(milestone.km)"
                  [ngClass]="getMilestoneProgress(milestone.km) >= 100 ? 'bg-red-500' : getMilestoneProgress(milestone.km) >= 80 ? 'bg-amber-500' : 'bg-emerald-500'">
                </div>
              </div>
              <span class="text-xs font-mono w-16 text-right" [ngClass]="getMilestoneProgress(milestone.km) >= 100 ? 'text-red-600 font-bold' : 'text-slate-500'">{{ getMilestoneProgress(milestone.km).toFixed(0) }}%</span>
              <span *ngIf="getMilestoneProgress(milestone.km) >= 100" class="badge badge-danger text-[9px]">Quá hạn!</span>
              <span *ngIf="getMilestoneProgress(milestone.km) >= 80 && getMilestoneProgress(milestone.km) < 100" class="badge badge-warning text-[9px]">Sắp đến</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Telemetry -->
      <div *ngIf="activeTab === 'telemetry'" class="space-y-6">
        <div *ngIf="telemetry; else noTelemetry">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- Fuel -->
            <div class="bg-white rounded-2xl border p-5">
              <p class="text-xs text-slate-400 uppercase mb-2">Nhiên liệu</p>
              <div class="relative w-20 h-20 mx-auto mb-2">
                <svg viewBox="0 0 36 36" class="w-20 h-20 transform -rotate-90">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                    [attr.stroke]="telemetry.fuelLevel > 30 ? '#10b981' : '#ef4444'" stroke-width="3"
                    [attr.stroke-dasharray]="telemetry.fuelLevel + ', 100'"/>
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-lg font-bold">{{ telemetry.fuelLevel }}%</span>
              </div>
            </div>
            <!-- Engine Temp -->
            <div class="bg-white rounded-2xl border p-5">
              <p class="text-xs text-slate-400 uppercase mb-2">Nhiệt độ ĐC</p>
              <p class="text-3xl font-bold text-center" [ngClass]="telemetry.engineTemp > 100 ? 'text-red-500' : 'text-emerald-600'">
                {{ telemetry.engineTemp }}°C
              </p>
              <div class="mt-2 h-2 bg-slate-100 rounded-full"><div class="h-full rounded-full" [ngClass]="telemetry.engineTemp > 100 ? 'bg-red-500' : 'bg-emerald-500'" [style.width.%]="telemetry.engineTemp"></div></div>
            </div>
            <!-- Battery -->
            <div class="bg-white rounded-2xl border p-5">
              <p class="text-xs text-slate-400 uppercase mb-2">Điện áp ắc quy</p>
              <p class="text-3xl font-bold text-center text-blue-600">{{ telemetry.batteryVoltage }}V</p>
              <p class="text-xs text-center text-slate-400 mt-1">{{ telemetry.batteryVoltage > 100 ? 'EV Battery' : 'Normal' }}</p>
            </div>
            <!-- Odometer -->
            <div class="bg-white rounded-2xl border p-5">
              <p class="text-xs text-slate-400 uppercase mb-2">Odometer</p>
              <p class="text-3xl font-bold text-center text-slate-700">{{ telemetry.odometer.toLocaleString() }}</p>
              <p class="text-xs text-center text-slate-400 mt-1">km</p>
            </div>
          </div>

          <!-- Tire Pressure -->
          <div class="bg-white rounded-2xl border p-6">
            <h3 class="card-title mb-4">Áp suất lốp (bar)</h3>
            <div class="grid grid-cols-2 gap-8 max-w-md mx-auto">
              <div class="text-center p-4 rounded-xl" [ngClass]="telemetry.tirePressureFL >= 8 ? 'bg-emerald-50' : 'bg-amber-50'">
                <p class="text-xs text-slate-500">Trước trái</p>
                <p class="text-2xl font-bold" [ngClass]="telemetry.tirePressureFL >= 8 ? 'text-emerald-600' : 'text-amber-600'">{{ telemetry.tirePressureFL }}</p>
              </div>
              <div class="text-center p-4 rounded-xl" [ngClass]="telemetry.tirePressureFR >= 8 ? 'bg-emerald-50' : 'bg-amber-50'">
                <p class="text-xs text-slate-500">Trước phải</p>
                <p class="text-2xl font-bold" [ngClass]="telemetry.tirePressureFR >= 8 ? 'text-emerald-600' : 'text-amber-600'">{{ telemetry.tirePressureFR }}</p>
              </div>
              <div class="text-center p-4 rounded-xl" [ngClass]="telemetry.tirePressureRL >= 8 ? 'bg-emerald-50' : 'bg-amber-50'">
                <p class="text-xs text-slate-500">Sau trái</p>
                <p class="text-2xl font-bold" [ngClass]="telemetry.tirePressureRL >= 8 ? 'text-emerald-600' : 'text-amber-600'">{{ telemetry.tirePressureRL }}</p>
              </div>
              <div class="text-center p-4 rounded-xl" [ngClass]="telemetry.tirePressureRR >= 8 ? 'bg-emerald-50' : 'bg-amber-50'">
                <p class="text-xs text-slate-500">Sau phải</p>
                <p class="text-2xl font-bold" [ngClass]="telemetry.tirePressureRR >= 8 ? 'text-emerald-600' : 'text-amber-600'">{{ telemetry.tirePressureRR }}</p>
              </div>
            </div>
          </div>
        </div>
        <ng-template #noTelemetry>
          <div class="bg-white rounded-2xl border p-12 text-center">
            <p class="text-slate-400">Không có dữ liệu telemetry cho xe này</p>
          </div>
        </ng-template>
      </div>

      <!-- Tab: Maintenance -->
      <div *ngIf="activeTab === 'maintenance'">
        <div class="bg-white rounded-2xl border overflow-hidden">
          <div class="p-4 border-b"><h3 class="card-title">Lịch sử bảo dưỡng</h3></div>
          <div *ngIf="vehicleWorkOrders.length > 0" class="table-container">
            <table class="data-table">
              <thead><tr><th>Mã</th><th>Loại</th><th>Mô tả</th><th>Trạng thái</th><th>Chi phí</th></tr></thead>
              <tbody>
                <tr *ngFor="let wo of vehicleWorkOrders">
                  <td class="font-mono text-xs">{{ wo.code }}</td>
                  <td><span class="badge" [ngClass]="wo.type==='EMERGENCY'?'badge-danger':'badge-info'">{{ wo.type }}</span></td>
                  <td>{{ wo.description }}</td>
                  <td><span class="badge" [ngClass]="{'badge-success':wo.status==='COMPLETED','badge-info':wo.status==='IN_PROGRESS','badge-neutral':wo.status==='OPEN'}">{{ wo.status }}</span></td>
                  <td class="font-bold">{{ ((wo.laborCost || 0) + wo.partsCost).toLocaleString() }}đ</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="vehicleWorkOrders.length === 0" class="p-12 text-center text-slate-400">Chưa có lệnh sửa chữa</div>
        </div>
      </div>
    </div>
  `
})
export class VehicleDetailComponent implements OnInit {
  vehicle: Vehicle | null = null;
  telemetry: VehicleTelemetry | null = null;
  vehicleWorkOrders: WorkOrder[] = [];
  activeTab = 'info';
  Math = Math;
  tabs = [
    { key: 'info', label: 'Thông tin' },
    { key: 'telemetry', label: 'Telemetry' },
    { key: 'maintenance', label: 'Bảo dưỡng' }
  ];
  lifecycleStates = [
    { key: 'REGISTERED', label: 'Đăng ký', icon: '📝', activeBg: 'bg-blue-500', activeRing: 'ring-blue-200', passedBg: 'bg-blue-400' },
    { key: 'IDLE', label: 'Sẵn sàng', icon: '⏸', activeBg: 'bg-cyan-500', activeRing: 'ring-cyan-200', passedBg: 'bg-cyan-400' },
    { key: 'ACTIVE', label: 'Hoạt động', icon: '🚌', activeBg: 'bg-emerald-500', activeRing: 'ring-emerald-200', passedBg: 'bg-emerald-400' },
    { key: 'MAINTENANCE_REQUIRED', label: 'Cần BD', icon: '⚠', activeBg: 'bg-amber-500', activeRing: 'ring-amber-200', passedBg: 'bg-amber-400' },
    { key: 'UNDER_REPAIR', label: 'Sửa chữa', icon: '🔧', activeBg: 'bg-orange-500', activeRing: 'ring-orange-200', passedBg: 'bg-orange-400' },
    { key: 'DECOMMISSIONED', label: 'Thanh lý', icon: '🚫', activeBg: 'bg-slate-500', activeRing: 'ring-slate-200', passedBg: 'bg-slate-400' }
  ];
  maintenanceMilestones = [
    { km: 5000, label: 'Thay nhớt' },
    { km: 15000, label: 'BD định kỳ' },
    { km: 50000, label: 'BD tổng thể' },
    { km: 100000, label: 'Đại tu' }
  ];

  constructor(
    private vehicleService: VehicleService,
    private telemetryService: TelemetryService,
    private maintenanceService: MaintenanceService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.vehicleService.getById(id).subscribe(v => this.vehicle = v || null);
    this.telemetryService.getByVehicle(id).subscribe(t => this.telemetry = t || null);
    this.maintenanceService.getWorkOrders().subscribe(wos => {
      this.vehicleWorkOrders = wos.filter(w => w.vehicleId === id);
    });
  }

  getStatusClass(s: string): string {
    return { ACTIVE: 'badge-success', IDLE: 'badge-info', MAINTENANCE_REQUIRED: 'badge-warning', UNDER_REPAIR: 'badge-danger', DECOMMISSIONED: 'badge-neutral', REGISTERED: 'badge-info' }[s] || 'badge-neutral';
  }
  getStatusLabel(s: string): string {
    return { ACTIVE: 'Hoạt động', IDLE: 'Rỗi', MAINTENANCE_REQUIRED: 'Cần bảo dưỡng', UNDER_REPAIR: 'Đang sửa', DECOMMISSIONED: 'Thanh lý', REGISTERED: 'Đã đăng ký' }[s] || s;
  }
  getTypeLabel(t: string): string {
    return { ARTICULATED: 'Xe buýt nối', STANDARD: 'Tiêu chuẩn', MINI: 'Mini', ELECTRIC: 'Điện' }[t] || t;
  }

  isPassedState(key: string): boolean {
    if (!this.vehicle) return false;
    const order = this.lifecycleStates.map(s => s.key);
    const currentIdx = order.indexOf(this.vehicle.currentStatus);
    const stateIdx = order.indexOf(key);
    return stateIdx < currentIdx;
  }

  getMilestoneProgress(km: number): number {
    if (!this.vehicle) return 0;
    return (this.vehicle.totalKm % km) / km * 100;
  }

  getMilestoneProgressCapped(km: number): number {
    return Math.min(this.getMilestoneProgress(km), 100);
  }
}
