import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DriverService, ShiftService } from '../../../core/services/data.service';
import { Driver, DriverShift } from '../../../core/models';

@Component({
    selector: 'app-driver-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="space-y-6" *ngIf="driver">
      <div class="flex items-center gap-4">
        <button class="btn-secondary p-2" routerLink="/drivers">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white">
          {{ driver.fullName.charAt(0) }}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <h1 class="page-title">{{ driver.fullName }}</h1>
            <span class="badge" [ngClass]="getStatusClass(driver.status)">{{ getStatusLabel(driver.status) }}</span>
          </div>
          <p class="text-sm text-slate-500 mt-1">{{ driver.employeeCode }} • {{ driver.department }} • {{ driver.rank }}</p>
        </div>
      </div>

      <div class="flex gap-1 border-b border-slate-200">
        <button *ngFor="let tab of tabs" (click)="activeTab = tab.key"
          class="px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors"
          [ngClass]="activeTab === tab.key ? 'bg-white text-blue-600 border border-b-white border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700'">
          {{ tab.label }}
        </button>
      </div>

      <!-- Profile Tab -->
      <div *ngIf="activeTab === 'profile'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl border p-6">
            <h3 class="card-title mb-4">Thông tin cá nhân</h3>
            <div class="space-y-3">
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Họ tên</span><span class="font-medium">{{ driver.fullName }}</span></div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">CCCD</span><span class="font-mono text-sm">{{ driver.nationalId }}</span></div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Điện thoại</span><span class="font-medium">{{ driver.phone }}</span></div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Email</span><span class="font-medium">{{ driver.email || '—' }}</span></div>
              <div class="flex justify-between py-2"><span class="text-sm text-slate-500">Ngày vào</span><span class="font-medium">{{ driver.hireDate | date:'dd/MM/yyyy' }}</span></div>
            </div>
          </div>
          <div class="bg-white rounded-2xl border p-6">
            <h3 class="card-title mb-4">Giấy phép lái xe</h3>
            <div class="space-y-3">
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Số GPLX</span><span class="font-mono">{{ driver.licenseNumber }}</span></div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Hạng</span><span class="font-bold text-lg">{{ driver.licenseClass }}</span></div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Hết hạn</span>
                <span class="font-medium" [ngClass]="isLicenseExpiring() ? 'text-red-600' : 'text-slate-700'">{{ driver.licenseExpiry | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Cơ quan cấp</span><span>{{ driver.licenseAuthority }}</span></div>
              <div class="flex justify-between py-2"><span class="text-sm text-slate-500">Chứng chỉ</span>
                <div class="flex flex-wrap gap-1 justify-end"><span *ngFor="let c of driver.certifications" class="badge badge-info text-[10px]">{{ c }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- KPIs -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="bg-white rounded-2xl border p-5 text-center">
            <p class="text-3xl font-bold text-blue-600">{{ driver.totalTrips.toLocaleString() }}</p>
            <p class="text-xs text-slate-500 mt-1">Tổng chuyến</p>
          </div>
          <div class="bg-white rounded-2xl border p-5 text-center">
            <p class="text-3xl font-bold" [ngClass]="driver.otpScore >= 95 ? 'text-emerald-600' : driver.otpScore >= 90 ? 'text-amber-600' : 'text-red-600'">{{ driver.otpScore }}%</p>
            <p class="text-xs text-slate-500 mt-1">OTP Score</p>
          </div>
          <div class="bg-white rounded-2xl border p-5 text-center">
            <p class="text-3xl font-bold text-amber-500">{{ driver.rating }}</p>
            <p class="text-xs text-slate-500 mt-1">Đánh giá ★</p>
          </div>
          <div class="bg-white rounded-2xl border p-5 text-center">
            <p class="text-3xl font-bold" [ngClass]="driver.violationCount === 0 ? 'text-emerald-600' : 'text-red-600'">{{ driver.violationCount }}</p>
            <p class="text-xs text-slate-500 mt-1">Vi phạm</p>
          </div>
          <div class="bg-white rounded-2xl border p-5 text-center">
            <p class="text-3xl font-bold text-emerald-600">{{ driver.ecoScore }}</p>
            <p class="text-xs text-slate-500 mt-1">Eco Score</p>
          </div>
        </div>

        <!-- Health Check -->
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Sức khỏe</h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="p-4 rounded-xl bg-emerald-50">
              <p class="text-xs text-emerald-600 font-medium">Khám gần nhất</p>
              <p class="text-lg font-bold text-emerald-700">{{ driver.healthCheckDate ? (driver.healthCheckDate | date:'dd/MM/yyyy') : '—' }}</p>
            </div>
            <div class="p-4 rounded-xl bg-blue-50">
              <p class="text-xs text-blue-600 font-medium">Kết quả</p>
              <p class="text-lg font-bold text-blue-700">{{ driver.healthCheckResult || '—' }}</p>
            </div>
            <div class="p-4 rounded-xl bg-amber-50">
              <p class="text-xs text-amber-600 font-medium">Khám tiếp theo</p>
              <p class="text-lg font-bold text-amber-700">{{ driver.nextHealthCheckDate ? (driver.nextHealthCheckDate | date:'dd/MM/yyyy') : 'Chưa lên lịch' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Shifts Tab -->
      <div *ngIf="activeTab === 'shifts'">
        <div class="bg-white rounded-2xl border overflow-hidden">
          <div class="p-4 border-b"><h3 class="card-title">Lịch ca làm việc</h3></div>
          <div class="table-container">
            <table class="data-table">
              <thead><tr><th>Ca</th><th>Tuyến</th><th>Xe</th><th>Bắt đầu</th><th>Kết thúc</th><th>Trạng thái</th></tr></thead>
              <tbody>
                <tr *ngFor="let s of shifts">
                  <td><span class="badge" [ngClass]="{'badge-warning': s.shiftType==='MORNING', 'badge-info': s.shiftType==='AFTERNOON', 'bg-purple-100 text-purple-700': s.shiftType==='EVENING', 'bg-slate-700 text-white': s.shiftType==='NIGHT'}">{{ getShiftLabel(s.shiftType) }}</span></td>
                  <td class="font-medium">{{ s.routeName }}</td>
                  <td>{{ s.vehiclePlate || '—' }}</td>
                  <td>{{ s.startTime | date:'dd/MM HH:mm' }}</td>
                  <td>{{ s.endTime | date:'dd/MM HH:mm' }}</td>
                  <td><span class="badge" [ngClass]="{'badge-success': s.status==='COMPLETED', 'badge-info': s.status==='IN_PROGRESS', 'badge-neutral': s.status==='SCHEDULED', 'badge-danger': s.status==='CANCELLED'}">{{ getShiftStatusLabel(s.status) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Driver App Simulator Tab -->
      <div *ngIf="activeTab === 'app'" class="max-w-md mx-auto">
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white">
          <div class="text-center mb-6">
            <div class="w-16 h-16 rounded-full bg-blue-500 mx-auto flex items-center justify-center text-2xl font-bold mb-2">{{ driver.fullName.charAt(0) }}</div>
            <p class="font-bold text-lg">{{ driver.fullName }}</p>
            <p class="text-slate-400 text-sm">{{ driver.employeeCode }}</p>
          </div>
          <div class="bg-slate-700/50 rounded-2xl p-4 mb-4">
            <p class="text-xs text-slate-400 mb-1">Ca hiện tại</p>
            <p class="font-bold">{{ currentShift?.routeName || 'Không có ca' }}</p>
            <p class="text-sm text-slate-300">{{ currentShift?.vehiclePlate || '' }}</p>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <button class="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-3 text-center transition-colors">
              <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <p class="text-xs font-medium">Nhận lệnh</p>
            </button>
            <button class="bg-red-500 hover:bg-red-600 text-white rounded-xl p-3 text-center transition-colors">
              <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
              <p class="text-xs font-medium">Báo sự cố</p>
            </button>
            <button class="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-3 text-center transition-colors">
              <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <p class="text-xs font-medium">Liên lạc</p>
            </button>
            <button class="bg-amber-500 hover:bg-amber-600 text-white rounded-xl p-3 text-center transition-colors">
              <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              <p class="text-xs font-medium">Check-in</p>
            </button>
          </div>
          <div class="bg-slate-700/50 rounded-2xl p-4">
            <p class="text-xs text-slate-400 mb-2">Thông báo mới</p>
            <div class="space-y-2">
              <div class="bg-slate-600/50 rounded-lg p-2 text-xs"><span class="text-emerald-400 font-bold">Điều phối:</span> Chuyến BRT01-005 sẵn sàng khởi hành</div>
              <div class="bg-slate-600/50 rounded-lg p-2 text-xs"><span class="text-amber-400 font-bold">Hệ thống:</span> Cập nhật lịch trình mới</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DriverDetailComponent implements OnInit {
    driver: Driver | null = null;
    shifts: DriverShift[] = [];
    currentShift: DriverShift | null = null;
    activeTab = 'profile';
    tabs = [
        { key: 'profile', label: 'Hồ sơ' },
        { key: 'shifts', label: 'Ca làm' },
        { key: 'app', label: 'App TX' }
    ];

    constructor(private driverService: DriverService, private shiftService: ShiftService, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        const id = this.activatedRoute.snapshot.paramMap.get('id') || '';
        this.driverService.getById(id).subscribe(d => this.driver = d || null);
        this.shiftService.getByDriver(id).subscribe(s => {
            this.shifts = s;
            this.currentShift = s.find(sh => sh.status === 'IN_PROGRESS') || null;
        });
    }

    isLicenseExpiring(): boolean { return this.driver ? new Date(this.driver.licenseExpiry).getTime() - Date.now() < 90 * 86400000 : false; }
    getStatusClass(s: string): string { return { AVAILABLE: 'badge-success', ON_DUTY: 'badge-info', OFF_DUTY: 'badge-neutral', ON_LEAVE: 'badge-warning', SUSPENDED: 'badge-danger' }[s] || 'badge-neutral'; }
    getStatusLabel(s: string): string { return { AVAILABLE: 'Sẵn sàng', ON_DUTY: 'Đang ca', OFF_DUTY: 'Nghỉ', ON_LEAVE: 'Nghỉ phép', SUSPENDED: 'Đình chỉ' }[s] || s; }
    getShiftLabel(s: string): string { return { MORNING: 'Sáng', AFTERNOON: 'Chiều', EVENING: 'Tối', NIGHT: 'Đêm' }[s] || s; }
    getShiftStatusLabel(s: string): string { return { SCHEDULED: 'Chờ', IN_PROGRESS: 'Đang ca', COMPLETED: 'Xong', CANCELLED: 'Hủy' }[s] || s; }
}
