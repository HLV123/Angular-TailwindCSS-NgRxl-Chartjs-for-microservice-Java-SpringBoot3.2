import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Quản lý Đội xe BRT</h1>
          <p class="text-sm text-slate-500 mt-1">Fleet Management • Theo dõi trạng thái và phân công phương tiện</p>
        </div>
        <button class="btn-primary flex items-center gap-2" (click)="showForm = true">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Đăng ký xe mới
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div class="bg-white rounded-xl p-4 border border-slate-100 text-center">
          <p class="text-2xl font-bold text-emerald-600">{{ getCountByStatus('ACTIVE') }}</p>
          <p class="text-xs text-slate-500 mt-1">Đang hoạt động</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-100 text-center">
          <p class="text-2xl font-bold text-blue-600">{{ getCountByStatus('IDLE') }}</p>
          <p class="text-xs text-slate-500 mt-1">Chờ phân công</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-100 text-center">
          <p class="text-2xl font-bold text-amber-600">{{ getCountByStatus('MAINTENANCE_REQUIRED') }}</p>
          <p class="text-xs text-slate-500 mt-1">Cần bảo dưỡng</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-100 text-center">
          <p class="text-2xl font-bold text-red-600">{{ getCountByStatus('UNDER_REPAIR') }}</p>
          <p class="text-xs text-slate-500 mt-1">Đang sửa chữa</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-slate-100 text-center">
          <p class="text-2xl font-bold text-slate-400">{{ getCountByStatus('DECOMMISSIONED') }}</p>
          <p class="text-xs text-slate-500 mt-1">Đã thanh lý</p>
        </div>
      </div>

      <!-- Fleet Overview KPI -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-lg">📊</span>
          <h3 class="font-bold text-slate-800">Fleet Overview KPI</h3>
          <span class="ml-auto text-xs text-slate-400">UC-FLEET-005</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white/80 backdrop-blur rounded-xl p-3 text-center">
            <p class="text-2xl font-bold text-indigo-600">{{ vehicles.length }}</p>
            <p class="text-xs text-slate-500 mt-1">Tổng đội xe</p>
          </div>
          <div class="bg-white/80 backdrop-blur rounded-xl p-3 text-center">
            <p class="text-2xl font-bold text-emerald-600">{{ fleetUtilization }}%</p>
            <p class="text-xs text-slate-500 mt-1">Tỷ lệ vận hành</p>
            <div class="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div class="bg-emerald-500 h-1.5 rounded-full transition-all" [style.width.%]="fleetUtilization"></div>
            </div>
          </div>
          <div class="bg-white/80 backdrop-blur rounded-xl p-3 text-center">
            <p class="text-2xl font-bold text-blue-600">{{ avgKm }}</p>
            <p class="text-xs text-slate-500 mt-1">TB km/xe</p>
          </div>
          <div class="bg-white/80 backdrop-blur rounded-xl p-3 text-center">
            <p class="text-2xl font-bold text-amber-600">{{ avgAge }}</p>
            <p class="text-xs text-slate-500 mt-1">TB tuổi xe (năm)</p>
          </div>
        </div>

        <!-- Fuel Distribution -->
        <div class="mt-4 grid grid-cols-4 gap-2">
          <div *ngFor="let f of fuelDistribution" class="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
            <span class="text-sm">{{ f.icon }}</span>
            <div class="flex-1">
              <p class="text-xs font-medium text-slate-700">{{ f.label }}</p>
              <div class="w-full bg-slate-200 rounded-full h-1 mt-1">
                <div class="h-1 rounded-full transition-all" [ngClass]="f.colorClass" [style.width.%]="f.pct"></div>
              </div>
            </div>
            <span class="text-xs font-bold text-slate-600">{{ f.count }}</span>
          </div>
        </div>

        <!-- Top Concerns -->
        <div class="mt-3 flex flex-wrap gap-2" *ngIf="topConcerns.length > 0">
          <span *ngFor="let c of topConcerns" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            [ngClass]="{'bg-red-100 text-red-700': c.type==='danger', 'bg-amber-100 text-amber-700': c.type==='warning'}">
            {{ c.icon }} {{ c.label }}
          </span>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3 flex-wrap">
        <input [(ngModel)]="searchTerm" placeholder="Tìm biển số, model..." class="form-input max-w-xs" />
        <select [(ngModel)]="filterStatus" class="form-select max-w-[180px]">
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option><option value="IDLE">Chờ phân công</option>
          <option value="MAINTENANCE_REQUIRED">Cần bảo dưỡng</option><option value="UNDER_REPAIR">Đang sửa</option>
          <option value="DECOMMISSIONED">Đã thanh lý</option>
        </select>
        <select [(ngModel)]="filterType" class="form-select max-w-[160px]">
          <option value="">Tất cả loại</option>
          <option value="ARTICULATED">Khớp nối</option><option value="STANDARD">Tiêu chuẩn</option><option value="MINI">Mini</option>
        </select>
        <select [(ngModel)]="filterFuel" class="form-select max-w-[160px]">
          <option value="">Tất cả nhiên liệu</option>
          <option value="CNG">CNG</option><option value="DIESEL">Diesel</option><option value="ELECTRIC">Điện</option><option value="HYBRID">Hybrid</option>
        </select>
      </div>

      <!-- Vehicle Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Biển số</th><th>Loại xe</th><th>Nhiên liệu</th><th>Sức chứa</th><th>Tuyến hiện tại</th><th>Tổng km</th><th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of filteredVehicles">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4"/></svg>
                    </div>
                    <div>
                      <p class="font-semibold text-slate-800">{{ v.plateNumber }}</p>
                      <p class="text-xs text-slate-400">{{ v.manufacturer }} {{ v.model }}</p>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-neutral">{{ getTypeLabel(v.vehicleType) }}</span></td>
                <td><span class="badge" [ngClass]="{'badge-success': v.fuelType==='ELECTRIC', 'badge-info': v.fuelType==='CNG', 'badge-neutral': v.fuelType==='DIESEL', 'badge-warning': v.fuelType==='HYBRID'}">{{ v.fuelType }}</span></td>
                <td>{{ v.capacitySeated + v.capacityStanding }}</td>
                <td>{{ v.currentRouteName || '—' }}</td>
                <td>{{ v.totalKm.toLocaleString() }}</td>
                <td><span class="badge" [ngClass]="getStatusClass(v.currentStatus)">{{ getStatusLabel(v.currentStatus) }}</span></td>
                <td>
                  <div class="flex items-center gap-1">
                    <button class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600" title="Chi tiết">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                    <button class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-600" title="Chỉnh sửa">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Modal -->
      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content w-full max-w-2xl mx-4" (click)="$event.stopPropagation()">
          <div class="p-6 border-b border-slate-100"><h2 class="text-xl font-bold">Đăng ký phương tiện mới</h2></div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div><label class="form-label">Biển số xe</label><input class="form-input" placeholder="29B-XXX.XX" /></div>
              <div><label class="form-label">Loại xe</label><select class="form-select"><option>Articulated (Khớp nối)</option><option>Standard</option><option>Mini BRT</option></select></div>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div><label class="form-label">Hãng sản xuất</label><input class="form-input" /></div>
              <div><label class="form-label">Model</label><input class="form-input" /></div>
              <div><label class="form-label">Năm SX</label><input type="number" class="form-input" /></div>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div><label class="form-label">Ghế ngồi</label><input type="number" class="form-input" /></div>
              <div><label class="form-label">Chỗ đứng</label><input type="number" class="form-input" /></div>
              <div><label class="form-label">Nhiên liệu</label><select class="form-select"><option>CNG</option><option>Diesel</option><option>Điện</option><option>Hybrid</option></select></div>
            </div>
            <div class="p-4 bg-amber-50 rounded-xl text-sm text-amber-700">
              <p class="font-semibold">⚡ Tích hợp IoT</p>
              <p class="text-xs mt-1">Backend tích hợp: GPS Tracker, Camera CCTV, cảm biến TPMS, máy quẹt thẻ → Kafka → TimescaleDB</p>
            </div>
          </div>
          <div class="p-6 border-t border-slate-100 flex justify-end gap-3">
            <button class="btn-secondary" (click)="showForm = false">Hủy</button>
            <button class="btn-primary" (click)="showForm = false">Đăng ký</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  searchTerm = ''; filterStatus = ''; filterType = ''; filterFuel = '';
  showForm = false;
  constructor(private vs: VehicleService) { }
  ngOnInit() { this.vs.getAll().subscribe(v => this.vehicles = v); }
  get filteredVehicles() {
    return this.vehicles.filter(v =>
      (!this.searchTerm || v.plateNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) || v.model.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (!this.filterStatus || v.currentStatus === this.filterStatus) &&
      (!this.filterType || v.vehicleType === this.filterType) &&
      (!this.filterFuel || v.fuelType === this.filterFuel)
    );
  }
  getCountByStatus(s: string) { return this.vehicles.filter(v => v.currentStatus === s).length; }
  getTypeLabel(t: string) { return { ARTICULATED: 'Khớp nối', STANDARD: 'Tiêu chuẩn', MINI: 'Mini' }[t] || t; }
  getStatusLabel(s: string) { return { ACTIVE: 'Hoạt động', IDLE: 'Chờ', MAINTENANCE_REQUIRED: 'Cần BD', UNDER_REPAIR: 'Đang sửa', DECOMMISSIONED: 'Thanh lý', REGISTERED: 'Đã đăng ký' }[s] || s; }
  getStatusClass(s: string) { return { ACTIVE: 'badge-success', IDLE: 'badge-info', MAINTENANCE_REQUIRED: 'badge-warning', UNDER_REPAIR: 'badge-danger', DECOMMISSIONED: 'badge-neutral', REGISTERED: 'badge-neutral' }[s] || 'badge-neutral'; }

  // Fleet KPI getters
  get fleetUtilization(): number {
    if (!this.vehicles.length) return 0;
    const active = this.vehicles.filter(v => v.currentStatus === 'ACTIVE' || v.currentStatus === 'IDLE').length;
    return Math.round((active / this.vehicles.length) * 100);
  }
  get avgKm(): string {
    if (!this.vehicles.length) return '0';
    const avg = this.vehicles.reduce((s, v) => s + v.totalKm, 0) / this.vehicles.length;
    return (avg / 1000).toFixed(0) + 'k';
  }
  get avgAge(): string {
    if (!this.vehicles.length) return '0';
    const currentYear = new Date().getFullYear();
    const avg = this.vehicles.reduce((s, v) => s + (currentYear - v.manufactureYear), 0) / this.vehicles.length;
    return avg.toFixed(1);
  }
  get fuelDistribution() {
    const fuels = ['CNG', 'DIESEL', 'ELECTRIC', 'HYBRID'];
    const icons: Record<string, string> = { CNG: '⛽', DIESEL: '🛢️', ELECTRIC: '⚡', HYBRID: '🔋' };
    const labels: Record<string, string> = { CNG: 'CNG', DIESEL: 'Diesel', ELECTRIC: 'Điện', HYBRID: 'Hybrid' };
    const colors: Record<string, string> = { CNG: 'bg-blue-500', DIESEL: 'bg-slate-500', ELECTRIC: 'bg-emerald-500', HYBRID: 'bg-amber-500' };
    return fuels.map(f => {
      const count = this.vehicles.filter(v => v.fuelType === f).length;
      return { label: labels[f], icon: icons[f], count, pct: this.vehicles.length ? Math.round(count / this.vehicles.length * 100) : 0, colorClass: colors[f] };
    });
  }
  get topConcerns() {
    const concerns: { icon: string; label: string; type: string }[] = [];
    const highKm = this.vehicles.filter(v => v.totalKm > 45000);
    if (highKm.length) concerns.push({ icon: '⚠️', label: `${highKm.length} xe vượt 45.000km`, type: 'warning' });
    const needsMaint = this.getCountByStatus('MAINTENANCE_REQUIRED');
    if (needsMaint > 0) concerns.push({ icon: '🔧', label: `${needsMaint} xe cần bảo dưỡng`, type: 'danger' });
    const oldVehicles = this.vehicles.filter(v => (new Date().getFullYear() - v.manufactureYear) >= 5);
    if (oldVehicles.length) concerns.push({ icon: '📅', label: `${oldVehicles.length} xe ≥ 5 năm tuổi`, type: 'warning' });
    return concerns;
  }
}
