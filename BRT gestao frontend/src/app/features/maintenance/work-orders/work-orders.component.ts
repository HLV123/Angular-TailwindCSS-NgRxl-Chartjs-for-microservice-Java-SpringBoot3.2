import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from '../../../core/services/data.service';
import { WorkOrder } from '../../../core/models';

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Lệnh sửa chữa (Work Orders)</h1><p class="text-sm text-slate-500 mt-1">UC-MAINT-001 • Maintenance Workflow</p></div>
        <button class="btn-primary" (click)="showForm = true">+ Tạo lệnh mới</button>
      </div>

      <div class="grid grid-cols-5 gap-4">
        <div *ngFor="let s of statuses" class="bg-white rounded-2xl border p-4 text-center cursor-pointer hover:shadow-md transition-all" [ngClass]="filterStatus === s.key ? 'ring-2 ring-blue-500' : ''" (click)="filterStatus = filterStatus === s.key ? '' : s.key">
          <p class="text-2xl font-bold" [ngClass]="s.color">{{ getCountByStatus(s.key) }}</p>
          <p class="text-xs text-slate-500 mt-1">{{ s.label }}</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <input [(ngModel)]="searchTerm" placeholder="Tìm kiếm..." class="form-input max-w-xs"/>
        <select [(ngModel)]="filterPriority" class="form-select max-w-[140px]">
          <option value="">Tất cả ưu tiên</option><option value="CRITICAL">Critical</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option>
        </select>
      </div>

      <div class="space-y-3">
        <div *ngFor="let wo of filteredOrders" class="bg-white rounded-2xl border p-5 hover:shadow-md transition-all">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-mono text-xs text-slate-400">{{ wo.code }}</span>
                <span class="badge" [ngClass]="getPriorityClass(wo.priority)">{{ wo.priority }}</span>
                <span class="badge" [ngClass]="getStatusClass(wo.status)">{{ wo.status }}</span>
              </div>
              <p class="font-semibold text-slate-800">{{ wo.description }}</p>
              <div class="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span>🚌 {{ wo.vehiclePlate }}</span>
                <span>🔧 {{ wo.maintenanceType || '' }}</span>
                <span *ngIf="wo.assignedTechnicianName">👨‍🔧 {{ wo.assignedTechnicianName }}</span>
                <span>📅 {{ wo.scheduledDate | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <button *ngIf="wo.status==='OPEN'" class="btn-primary text-xs" (click)="updateStatus(wo, 'IN_PROGRESS')">Bắt đầu</button>
              <button *ngIf="wo.status==='IN_PROGRESS'" class="btn-primary text-xs" (click)="updateStatus(wo, 'COMPLETED')">Hoàn thành</button>
              <button *ngIf="wo.status==='WAITING_PARTS'" class="btn-secondary text-xs" (click)="updateStatus(wo, 'IN_PROGRESS')">Đã có PT</button>
            </div>
          </div>
          <div *ngIf="wo.estimatedCost" class="mt-3 p-3 bg-slate-50 rounded-lg flex items-center justify-between text-sm">
            <span class="text-slate-500">Chi phí ước tính</span>
            <span class="font-bold text-blue-600">{{ formatCurrency(wo.estimatedCost) }}</span>
          </div>
        </div>
      </div>

      <!-- Create Modal -->
      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content w-full max-w-lg mx-4" (click)="$event.stopPropagation()">
          <div class="p-6 border-b"><h2 class="text-xl font-bold">Tạo lệnh sửa chữa</h2></div>
          <div class="p-6 space-y-4">
            <div><label class="form-label">Mô tả công việc</label><textarea [(ngModel)]="form.description" class="form-input" rows="3"></textarea></div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="form-label">Loại bảo trì</label>
                <select [(ngModel)]="form.maintenanceType" class="form-select">
                  <option value="CORRECTIVE">Sửa chữa</option><option value="PREVENTIVE">Phòng ngừa</option><option value="INSPECTION">Kiểm tra</option>
                </select></div>
              <div><label class="form-label">Ưu tiên</label>
                <select [(ngModel)]="form.priority" class="form-select">
                  <option value="CRITICAL">Critical</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option>
                </select></div>
              <div><label class="form-label">Xe</label><input [(ngModel)]="form.vehiclePlate" class="form-input"/></div>
              <div><label class="form-label">Ngày lên lịch</label><input [(ngModel)]="form.scheduledDate" class="form-input" type="date"/></div>
            </div>
          </div>
          <div class="p-6 border-t flex justify-end gap-3">
            <button class="btn-secondary" (click)="showForm = false">Hủy</button>
            <button class="btn-primary" (click)="createOrder()">Tạo</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WorkOrdersComponent implements OnInit {
  workOrders: WorkOrder[] = [];
  searchTerm = ''; filterStatus = ''; filterPriority = '';
  showForm = false;
  form: any = { description: '', maintenanceType: 'CORRECTIVE', priority: 'MEDIUM', vehiclePlate: '', scheduledDate: '' };
  statuses = [
    { key: 'OPEN', label: 'Mở', color: 'text-blue-600' }, { key: 'IN_PROGRESS', label: 'Đang XL', color: 'text-amber-600' },
    { key: 'WAITING_PARTS', label: 'Chờ PT', color: 'text-purple-600' }, { key: 'COMPLETED', label: 'Xong', color: 'text-emerald-600' },
    { key: 'CLOSED', label: 'Đóng', color: 'text-slate-600' }
  ];

  constructor(private ms: MaintenanceService) { }
  ngOnInit() { this.ms.getWorkOrders().subscribe(w => this.workOrders = w); }

  getCountByStatus(status: string) { return this.workOrders.filter(w => w.status === status).length; }
  get filteredOrders() {
    return this.workOrders.filter(w =>
      (!this.searchTerm || w.description.toLowerCase().includes(this.searchTerm.toLowerCase()) || w.code.includes(this.searchTerm)) &&
      (!this.filterStatus || w.status === this.filterStatus) && (!this.filterPriority || w.priority === this.filterPriority)
    );
  }
  updateStatus(wo: WorkOrder, status: string) { (wo as any).status = status; }
  createOrder() { this.showForm = false; }
  getPriorityClass(p: string) { return { CRITICAL: 'bg-red-600 text-white', HIGH: 'badge-danger', MEDIUM: 'badge-warning', LOW: 'badge-neutral' }[p] || ''; }
  getStatusClass(s: string) { return { OPEN: 'badge-info', IN_PROGRESS: 'badge-warning', WAITING_PARTS: 'bg-purple-100 text-purple-700', COMPLETED: 'badge-success', CLOSED: 'badge-neutral', INSPECTING: 'badge-info' }[s] || ''; }
  formatCurrency(n: number) { return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n); }
}
