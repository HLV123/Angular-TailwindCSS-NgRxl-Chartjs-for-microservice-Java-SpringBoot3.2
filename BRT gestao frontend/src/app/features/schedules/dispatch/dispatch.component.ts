import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DispatchService } from '../../../core/services/data.service';
import { DispatchRequest } from '../../../core/models';
import { MOCK_VEHICLES, MOCK_DRIVERS, MOCK_HEADWAY_DATA } from '../../../core/mock-data';

@Component({
    selector: 'app-dispatch',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Trung tâm Điều phối</h1>
          <p class="text-sm text-slate-500 mt-1">Dynamic Dispatch • Spare Fleet Management</p>
        </div>
        <button class="btn-primary flex items-center gap-2" (click)="showNewRequest = true">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Yêu cầu điều xe
        </button>
      </div>

      <!-- Headway Status -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Trạng thái Headway</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div *ngFor="let h of headwayData" class="p-4 rounded-xl border" [ngClass]="h.status==='NORMAL'?'border-emerald-200 bg-emerald-50':h.status==='BUNCHING'?'border-amber-200 bg-amber-50':'border-red-200 bg-red-50'">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold">{{ h.routeCode }}</span>
              <span class="badge" [ngClass]="h.status==='NORMAL'?'badge-success':h.status==='BUNCHING'?'badge-warning':'badge-danger'">{{ h.status==='NORMAL'?'Bình thường':h.status==='BUNCHING'?'Xe dồn':h.status==='GAPPING'?'Xe thưa':h.status }}</span>
            </div>
            <p class="text-sm">Kế hoạch: <strong>{{ h.plannedHeadwayMin }}p</strong> | Thực tế: <strong>{{ h.actualHeadwayMin }}p</strong></p>
          </div>
        </div>
      </div>

      <!-- Spare Fleet -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Đội xe dự bị ({{ spareVehicles.length }} xe)</h3>
        <div class="flex flex-wrap gap-3">
          <div *ngFor="let v of spareVehicles" class="px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50">
            <p class="font-bold text-sm">{{ v.plateNumber }}</p>
            <p class="text-xs text-slate-500">{{ v.vehicleType }} • {{ v.fuelType }}</p>
          </div>
          <div *ngIf="spareVehicles.length === 0" class="text-slate-400 text-sm">Không có xe dự bị</div>
        </div>
      </div>

      <!-- Available Drivers -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Tài xế sẵn sàng ({{ availableDrivers.length }})</h3>
        <div class="flex flex-wrap gap-3">
          <div *ngFor="let d of availableDrivers" class="px-4 py-2 rounded-xl border border-blue-200 bg-blue-50">
            <p class="font-bold text-sm">{{ d.fullName }}</p>
            <p class="text-xs text-slate-500">{{ d.employeeCode }} • OTP: {{ d.otpScore }}%</p>
          </div>
        </div>
      </div>

      <!-- Dispatch Requests Table -->
      <div class="bg-white rounded-2xl border overflow-hidden">
        <div class="p-4 border-b"><h3 class="card-title">Lịch sử yêu cầu điều xe</h3></div>
        <div class="table-container">
          <table class="data-table">
            <thead><tr><th>Loại</th><th>Tuyến</th><th>Lý do</th><th>Xe phân công</th><th>TX phân công</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let r of requests">
                <td><span class="badge" [ngClass]="r.type==='EMERGENCY'?'badge-danger':r.type==='SUPPLEMENT'?'badge-info':'badge-warning'">{{ r.type==='EMERGENCY'?'Khẩn cấp':r.type==='SUPPLEMENT'?'Bổ sung':'Thay thế' }}</span></td>
                <td class="font-medium">{{ r.routeName }}</td>
                <td class="text-sm">{{ r.reason }}</td>
                <td>{{ r.assignedVehiclePlate || '—' }}</td>
                <td>{{ r.assignedDriverName || '—' }}</td>
                <td><span class="badge" [ngClass]="{'badge-neutral':r.status==='PENDING','badge-info':r.status==='APPROVED','badge-warning':r.status==='DISPATCHED','badge-success':r.status==='COMPLETED'}">{{ r.status }}</span></td>
                <td>
                  <button *ngIf="r.status==='PENDING'" class="btn-primary text-xs" (click)="approve(r)">Duyệt</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- New Request Modal -->
      <div *ngIf="showNewRequest" class="modal-overlay" (click)="showNewRequest = false">
        <div class="modal-content w-full max-w-lg mx-4" (click)="$event.stopPropagation()">
          <div class="p-6 border-b"><h2 class="text-xl font-bold">Yêu cầu điều xe mới</h2></div>
          <div class="p-6 space-y-4">
            <div><label class="form-label">Loại yêu cầu</label>
              <select [(ngModel)]="newRequest.type" class="form-select"><option value="EMERGENCY">Khẩn cấp</option><option value="SUPPLEMENT">Bổ sung</option><option value="REPLACEMENT">Thay thế</option></select>
            </div>
            <div><label class="form-label">Tuyến</label><input [(ngModel)]="newRequest.routeName" class="form-input" placeholder="BRT-01"/></div>
            <div><label class="form-label">Lý do</label><textarea [(ngModel)]="newRequest.reason" class="form-input" rows="2"></textarea></div>
          </div>
          <div class="p-6 border-t flex justify-end gap-3">
            <button class="btn-secondary" (click)="showNewRequest = false">Hủy</button>
            <button class="btn-primary" (click)="submitRequest()">Gửi yêu cầu</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DispatchComponent implements OnInit {
    requests: DispatchRequest[] = [];
    headwayData = MOCK_HEADWAY_DATA;
    spareVehicles = MOCK_VEHICLES.filter(v => v.currentStatus === 'IDLE');
    availableDrivers = MOCK_DRIVERS.filter(d => d.status === 'AVAILABLE');
    showNewRequest = false;
    newRequest: any = { type: 'EMERGENCY', routeName: '', reason: '' };

    constructor(private dispatchService: DispatchService) { }
    ngOnInit() { this.dispatchService.getAll().subscribe(r => this.requests = r); }

    approve(r: DispatchRequest) {
        r.status = 'APPROVED';
        if (this.spareVehicles.length > 0) {
            r.assignedVehiclePlate = this.spareVehicles[0].plateNumber;
            r.assignedVehicleId = this.spareVehicles[0].id;
            r.status = 'DISPATCHED';
        }
    }

    submitRequest() {
        this.requests.unshift({
            id: 'dis-new-' + Date.now(), type: this.newRequest.type, routeId: 'r-001', routeName: this.newRequest.routeName || 'BRT-01',
            reason: this.newRequest.reason, requestedBy: 'Current User', status: 'PENDING', createdAt: new Date()
        });
        this.showNewRequest = false;
    }
}
