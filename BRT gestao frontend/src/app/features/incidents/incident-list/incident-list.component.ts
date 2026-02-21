import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../../core/services/data.service';
import { Incident } from '../../../core/models';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Quản lý Sự cố</h1>
          <p class="text-sm text-slate-500 mt-1">Event Detection & Resolution • Auto-alerts AI</p>
        </div>
        <button class="btn-primary flex items-center gap-2" (click)="showForm = true">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Báo cáo sự cố
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-red-600">{{ openCount }}</p>
          <p class="text-xs text-slate-500 mt-1">Đang mở</p>
        </div>
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-amber-600">{{ inProgressCount }}</p>
          <p class="text-xs text-slate-500 mt-1">Đang xử lý</p>
        </div>
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-emerald-600">{{ resolvedCount }}</p>
          <p class="text-xs text-slate-500 mt-1">Đã giải quyết</p>
        </div>
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-blue-600">{{ incidents.length }}</p>
          <p class="text-xs text-slate-500 mt-1">Tổng cộng</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3">
        <input [(ngModel)]="searchTerm" placeholder="Tìm kiếm..." class="form-input max-w-xs"/>
        <select [(ngModel)]="filterSeverity" class="form-select max-w-[140px]">
          <option value="">Tất cả mức</option><option value="P1">P1 - Nghiêm trọng</option><option value="P2">P2 - Cao</option><option value="P3">P3 - Trung bình</option><option value="P4">P4 - Thấp</option>
        </select>
        <select [(ngModel)]="filterStatus" class="form-select max-w-[140px]">
          <option value="">Tất cả TT</option><option value="OPEN">Mở</option><option value="ASSIGNED">Đã giao</option><option value="IN_PROGRESS">Đang xử lý</option><option value="RESOLVED">Đã giải quyết</option><option value="CLOSED">Đóng</option>
        </select>
      </div>

      <!-- Incident List -->
      <div class="space-y-3">
        <div *ngFor="let inc of filteredIncidents" class="bg-white rounded-2xl border p-5 hover:shadow-md transition-all cursor-pointer" (click)="selectIncident(inc)">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-mono text-xs text-slate-400">{{ inc.code }}</span>
                <span class="badge" [ngClass]="getSeverityClass(inc.severity)">{{ inc.severity }}</span>
                <span class="badge" [ngClass]="getTypeClass(inc.type)">{{ getTypeLabel(inc.type) }}</span>
                <span class="badge" [ngClass]="getStatusClass(inc.status)">{{ getStatusLabel(inc.status) }}</span>
              </div>
              <h4 class="font-semibold text-slate-800">{{ inc.title }}</h4>
              <p class="text-sm text-slate-500 mt-1">{{ inc.description }}</p>
              <div class="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span *ngIf="inc.vehiclePlate">🚌 {{ inc.vehiclePlate }}</span>
                <span *ngIf="inc.routeName">📍 {{ inc.routeName }}</span>
                <span *ngIf="inc.stationName">🏢 {{ inc.stationName }}</span>
                <span>👤 {{ inc.reportedBy }}</span>
                <span>⏱ {{ inc.createdAt | date:'HH:mm dd/MM' }}</span>
              </div>
            </div>
            <div *ngIf="inc.assignedToName" class="text-right ml-4">
              <p class="text-xs text-slate-400">Phân công cho</p>
              <p class="text-sm font-medium">{{ inc.assignedToName }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Incident Detail Modal -->
      <div *ngIf="selectedIncident" class="modal-overlay" (click)="selectedIncident = null">
        <div class="modal-content w-full max-w-2xl mx-4" (click)="$event.stopPropagation()">
          <div class="p-6 border-b">
            <div class="flex items-center gap-2">
              <span class="badge" [ngClass]="getSeverityClass(selectedIncident.severity)">{{ selectedIncident.severity }}</span>
              <h2 class="text-xl font-bold text-slate-800">{{ selectedIncident.title }}</h2>
            </div>
            <p class="text-sm text-slate-500 mt-1">{{ selectedIncident.code }}</p>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-sm text-slate-600">{{ selectedIncident.description }}</p>

            <!-- Workflow Timeline -->
            <div>
              <h4 class="text-sm font-semibold text-slate-700 mb-3">Workflow</h4>
              <div class="flex items-center gap-2">
                <div *ngFor="let step of workflowSteps; let i = index" class="flex items-center gap-2">
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      [ngClass]="getStepClass(step, selectedIncident.status)">
                      {{ isStepDone(step, selectedIncident.status) ? '✓' : i+1 }}
                    </div>
                    <span class="text-[10px] text-slate-500 mt-1">{{ step }}</span>
                  </div>
                  <div *ngIf="i < workflowSteps.length-1" class="w-8 h-0.5 -mt-4" [ngClass]="isStepDone(workflowSteps[i+1], selectedIncident.status) ? 'bg-emerald-500' : 'bg-slate-200'"></div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="p-3 bg-slate-50 rounded-xl"><p class="text-xs text-slate-500">Loại</p><p class="font-medium">{{ getTypeLabel(selectedIncident.type) }}</p></div>
              <div class="p-3 bg-slate-50 rounded-xl"><p class="text-xs text-slate-500">Phân công</p><p class="font-medium">{{ selectedIncident.assignedToName || 'Chưa phân công' }}</p></div>
            </div>

            <div *ngIf="selectedIncident.resolution" class="p-4 bg-emerald-50 rounded-xl">
              <p class="text-xs text-emerald-600 font-medium">Giải pháp</p>
              <p class="text-sm text-emerald-700 mt-1">{{ selectedIncident.resolution }}</p>
            </div>
          </div>
          <div class="p-6 border-t flex justify-between">
            <div class="flex gap-2">
              <button *ngIf="selectedIncident.status==='OPEN'" class="btn-primary text-xs" (click)="updateStatus('ASSIGNED')">Giao việc</button>
              <button *ngIf="selectedIncident.status==='ASSIGNED'" class="btn-primary text-xs" (click)="updateStatus('IN_PROGRESS')">Bắt đầu</button>
              <button *ngIf="selectedIncident.status==='IN_PROGRESS'" class="btn-primary text-xs" (click)="updateStatus('RESOLVED')">Giải quyết</button>
              <button *ngIf="selectedIncident.status==='RESOLVED'" class="btn-primary text-xs" (click)="updateStatus('CLOSED')">Đóng</button>
            </div>
            <button class="btn-secondary" (click)="selectedIncident = null">Đóng</button>
          </div>
        </div>
      </div>

      <!-- Create Modal -->
      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content w-full max-w-lg mx-4" (click)="$event.stopPropagation()">
          <div class="p-6 border-b"><h2 class="text-xl font-bold">Báo cáo sự cố mới</h2></div>
          <div class="p-6 space-y-4">
            <div><label class="form-label">Tiêu đề</label><input [(ngModel)]="newIncident.title" class="form-input" placeholder="Mô tả ngắn gọn sự cố"/></div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="form-label">Loại</label><select [(ngModel)]="newIncident.type" class="form-select">
                <option value="BREAKDOWN">Hỏng xe</option><option value="DELAY">Trễ giờ</option><option value="ACCIDENT">Tai nạn</option>
                <option value="EQUIPMENT_FAILURE">Thiết bị hỏng</option><option value="PASSENGER_COMPLAINT">Khiếu nại HK</option>
              </select></div>
              <div><label class="form-label">Mức độ</label><select [(ngModel)]="newIncident.severity" class="form-select">
                <option value="P1">P1 - Nghiêm trọng</option><option value="P2">P2 - Cao</option><option value="P3">P3 - Trung bình</option><option value="P4">P4 - Thấp</option>
              </select></div>
            </div>
            <div><label class="form-label">Mô tả chi tiết</label><textarea [(ngModel)]="newIncident.description" class="form-input" rows="3"></textarea></div>
          </div>
          <div class="p-6 border-t flex justify-end gap-3">
            <button class="btn-secondary" (click)="showForm = false">Hủy</button>
            <button class="btn-primary" (click)="createIncident()">Tạo sự cố</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class IncidentListComponent implements OnInit {
  incidents: Incident[] = [];
  selectedIncident: Incident | null = null;
  searchTerm = '';
  filterSeverity = '';
  filterStatus = '';
  showForm = false;
  newIncident: any = { title: '', type: 'BREAKDOWN', severity: 'P3', description: '' };
  workflowSteps = ['Mở', 'Giao', 'Xử lý', 'Giải quyết', 'Đóng'];

  get openCount(): number { return this.incidents.filter(i => i.status !== 'CLOSED' && i.status !== 'RESOLVED').length; }
  get inProgressCount(): number { return this.incidents.filter(i => i.status === 'IN_PROGRESS').length; }
  get resolvedCount(): number { return this.incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length; }

  constructor(private incidentService: IncidentService) { }
  ngOnInit() { this.incidentService.getAll().subscribe(i => this.incidents = i); }

  get filteredIncidents() {
    return this.incidents.filter(i =>
      (!this.searchTerm || i.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || i.code.includes(this.searchTerm)) &&
      (!this.filterSeverity || i.severity === this.filterSeverity) &&
      (!this.filterStatus || i.status === this.filterStatus)
    );
  }

  selectIncident(inc: Incident) { this.selectedIncident = inc; }

  updateStatus(status: string) {
    if (this.selectedIncident) {
      (this.selectedIncident as any).status = status;
      this.selectedIncident.updatedAt = new Date();
      if (status === 'RESOLVED') this.selectedIncident.resolvedAt = new Date();
    }
  }

  createIncident() {
    const inc: any = {
      id: 'inc-new-' + Date.now(), code: 'INC-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-NEW',
      ...this.newIncident, status: 'OPEN', reportedBy: 'Current User', reportedByRole: 'OPERATOR',
      createdAt: new Date(), updatedAt: new Date()
    };
    this.incidents.unshift(inc);
    this.showForm = false;
  }

  getSeverityClass(s: string): string { return { P1: 'bg-red-600 text-white', P2: 'badge-danger', P3: 'badge-warning', P4: 'badge-info' }[s] || ''; }
  getStatusClass(s: string): string { return { OPEN: 'badge-neutral', ASSIGNED: 'badge-info', IN_PROGRESS: 'badge-warning', RESOLVED: 'badge-success', CLOSED: 'bg-slate-600 text-white' }[s] || ''; }
  getStatusLabel(s: string): string { return { OPEN: 'Mở', ASSIGNED: 'Đã giao', IN_PROGRESS: 'Đang XL', RESOLVED: 'Đã GQ', CLOSED: 'Đóng' }[s] || s; }
  getTypeLabel(t: string): string {
    return { ACCIDENT: 'Tai nạn', BREAKDOWN: 'Hỏng xe', DELAY: 'Trễ giờ', OVERCROWDING: 'Quá tải', EQUIPMENT_FAILURE: 'Thiết bị', SPEEDING: 'Tốc độ', OFF_ROUTE: 'Lệch tuyến', BUNCHING: 'Xe dồn', AC_FAILURE: 'Điều hòa', PASSENGER_COMPLAINT: 'Khiếu nại', OTHER: 'Khác' }[t] || t;
  }
  getTypeClass(t: string): string { return { ACCIDENT: 'badge-danger', BREAKDOWN: 'badge-danger', DELAY: 'badge-warning', SPEEDING: 'badge-warning' }[t] || 'badge-info'; }

  isStepDone(step: string, status: string): boolean {
    const order = ['Mở', 'Giao', 'Xử lý', 'Giải quyết', 'Đóng'];
    const statusMap: any = { OPEN: 0, ASSIGNED: 1, IN_PROGRESS: 2, RESOLVED: 3, CLOSED: 4 };
    return order.indexOf(step) <= (statusMap[status] ?? -1);
  }
  getStepClass(step: string, status: string): string {
    return this.isStepDone(step, status) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400';
  }
}
