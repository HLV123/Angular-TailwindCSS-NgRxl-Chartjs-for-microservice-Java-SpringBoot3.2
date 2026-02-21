import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentService } from '../../../core/services/data.service';
import { Incident } from '../../../core/models';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6" *ngIf="incident">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="font-mono text-sm text-slate-400">{{ incident.code }}</span>
            <span class="badge" [ngClass]="getSeverityClass(incident.severity)">{{ incident.severity }}</span>
            <span class="badge" [ngClass]="getStatusClass(incident.status)">{{ getStatusLabel(incident.status) }}</span>
          </div>
          <h1 class="page-title">{{ incident.title }}</h1>
        </div>
        <button class="btn-secondary" (click)="goBack()">← Quay lại</button>
      </div>

      <!-- Workflow -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Workflow xử lý sự cố</h3>
        <div class="flex items-center gap-1">
          <div *ngFor="let step of workflowSteps; let i = index" class="flex items-center gap-1">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                [ngClass]="isStepDone(i) ? 'bg-emerald-500 text-white' : isCurrentStep(i) ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400'">
                {{ isStepDone(i) ? '✓' : i+1 }}
              </div>
              <span class="text-[10px] text-slate-500 mt-1 whitespace-nowrap">{{ step.label }}</span>
            </div>
            <div *ngIf="i < workflowSteps.length-1" class="w-12 h-0.5 -mt-4"
              [ngClass]="isStepDone(i+1) ? 'bg-emerald-500' : 'bg-slate-200'"></div>
          </div>
        </div>
      </div>

      <!-- SLA Timer -->
      <div class="bg-white rounded-2xl border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="card-title">SLA & Thời gian xử lý</h3>
          <span class="badge text-xs" [ngClass]="isSLABreached() ? 'badge-danger' : 'badge-success'">
            {{ isSLABreached() ? '⚠ SLA Vi phạm' : '✅ Trong SLA' }}
          </span>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div class="p-4 rounded-xl" [ngClass]="isSLABreached() ? 'bg-red-50' : 'bg-emerald-50'">
            <p class="text-xs text-slate-500 mb-1">Thời gian đã qua</p>
            <p class="text-2xl font-bold" [ngClass]="isSLABreached() ? 'text-red-600' : 'text-emerald-600'">{{ getElapsedTime() }}</p>
          </div>
          <div class="p-4 rounded-xl bg-blue-50">
            <p class="text-xs text-slate-500 mb-1">SLA mục tiêu ({{ incident.severity }})</p>
            <p class="text-2xl font-bold text-blue-600">{{ getSLATarget() }}</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-50">
            <p class="text-xs text-slate-500 mb-1">Tiến trình SLA</p>
            <div class="mt-2">
              <div class="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all" [style.width.%]="getSLAProgressCapped()"
                  [ngClass]="getSLAProgress() >= 100 ? 'bg-red-500' : getSLAProgress() >= 80 ? 'bg-amber-500' : 'bg-emerald-500'"></div>
              </div>
              <p class="text-xs text-right mt-1 font-mono" [ngClass]="getSLAProgress() >= 100 ? 'text-red-600' : 'text-slate-500'">{{ getSLAProgress().toFixed(0) }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl border p-6 space-y-4">
          <h3 class="card-title">Chi tiết sự cố</h3>
          <p class="text-sm text-slate-600">{{ incident.description }}</p>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-slate-50 rounded-xl"><p class="text-xs text-slate-500">Loại</p><p class="font-medium text-sm">{{ getTypeLabel(incident.type) }}</p></div>
            <div class="p-3 bg-slate-50 rounded-xl"><p class="text-xs text-slate-500">Mức độ</p><p class="font-medium text-sm">{{ incident.severity }}</p></div>
            <div class="p-3 bg-slate-50 rounded-xl"><p class="text-xs text-slate-500">Báo cáo bởi</p><p class="font-medium text-sm">{{ incident.reportedBy }}</p></div>
            <div class="p-3 bg-slate-50 rounded-xl"><p class="text-xs text-slate-500">Vai trò</p><p class="font-medium text-sm">{{ incident.reportedByRole }}</p></div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border p-6 space-y-4">
          <h3 class="card-title">Liên quan</h3>
          <div class="space-y-3">
            <div *ngIf="incident.vehiclePlate" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <span class="text-lg">🚌</span><div><p class="text-xs text-slate-500">Xe</p><p class="font-medium text-sm">{{ incident.vehiclePlate }}</p></div>
            </div>
            <div *ngIf="incident.routeName" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <span class="text-lg">📍</span><div><p class="text-xs text-slate-500">Tuyến</p><p class="font-medium text-sm">{{ incident.routeName }}</p></div>
            </div>
            <div *ngIf="incident.stationName" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <span class="text-lg">🏢</span><div><p class="text-xs text-slate-500">Trạm</p><p class="font-medium text-sm">{{ incident.stationName }}</p></div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <span class="text-lg">👤</span><div><p class="text-xs text-slate-500">Phân công cho</p><p class="font-medium text-sm">{{ incident.assignedToName || 'Chưa phân công' }}</p></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resolution -->
      <div *ngIf="incident.resolution" class="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
        <h3 class="text-sm font-semibold text-emerald-700 mb-2">✅ Giải pháp</h3>
        <p class="text-sm text-emerald-800">{{ incident.resolution }}</p>
        <p *ngIf="incident.resolvedAt" class="text-xs text-emerald-500 mt-2">Giải quyết lúc: {{ incident.resolvedAt | date:'HH:mm dd/MM/yyyy' }}</p>
      </div>

      <!-- Actions -->
      <div class="bg-white rounded-2xl border p-6 flex gap-3">
        <button *ngIf="incident.status==='OPEN'" class="btn-primary" (click)="updateStatus('ASSIGNED')">Giao việc</button>
        <button *ngIf="incident.status==='ASSIGNED'" class="btn-primary" (click)="updateStatus('IN_PROGRESS')">Bắt đầu xử lý</button>
        <button *ngIf="incident.status==='IN_PROGRESS'" class="btn-primary" (click)="updateStatus('RESOLVED')">Đánh dấu đã giải quyết</button>
        <button *ngIf="incident.status==='RESOLVED'" class="btn-primary" (click)="updateStatus('CLOSED')">Đóng sự cố</button>
      </div>

      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-3">Dòng thời gian</h3>
        <div class="space-y-3 text-sm">
          <div class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-blue-500"></span><span class="text-slate-500">{{ incident.createdAt | date:'HH:mm dd/MM/yyyy' }}</span><span>Tạo sự cố</span></div>
          <div *ngIf="incident.assignedToName" class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-amber-500"></span><span class="text-slate-500">{{ incident.updatedAt | date:'HH:mm dd/MM/yyyy' }}</span><span>Giao cho {{ incident.assignedToName }}</span></div>
          <div *ngIf="incident.resolvedAt" class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-emerald-500"></span><span class="text-slate-500">{{ incident.resolvedAt | date:'HH:mm dd/MM/yyyy' }}</span><span>Đã giải quyết</span></div>
        </div>
      </div>
    </div>
  `
})
export class IncidentDetailComponent implements OnInit {
  incident: Incident | null = null;
  workflowSteps = [
    { key: 'OPEN', label: 'Mở' }, { key: 'ASSIGNED', label: 'Giao việc' },
    { key: 'IN_PROGRESS', label: 'Xử lý' }, { key: 'RESOLVED', label: 'Giải quyết' }, { key: 'CLOSED', label: 'Đóng' }
  ];

  constructor(private incidentService: IncidentService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.incidentService.getById(id).subscribe(i => this.incident = i || null);
  }

  isStepDone(index: number): boolean {
    if (!this.incident) return false;
    const statusOrder = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    return index <= statusOrder.indexOf(this.incident.status);
  }

  updateStatus(status: string) {
    if (this.incident) {
      this.incidentService.updateStatus(this.incident.id, status).subscribe(i => { if (i) this.incident = i; });
    }
  }

  goBack() { this.router.navigate(['/incidents']); }

  getSeverityClass(s: string): string { return { P1: 'bg-red-600 text-white', P2: 'badge-danger', P3: 'badge-warning', P4: 'badge-info' }[s] || ''; }
  getStatusClass(s: string): string { return { OPEN: 'badge-neutral', ASSIGNED: 'badge-info', IN_PROGRESS: 'badge-warning', RESOLVED: 'badge-success', CLOSED: 'bg-slate-600 text-white' }[s] || ''; }
  getStatusLabel(s: string): string { return { OPEN: 'Mở', ASSIGNED: 'Đã giao', IN_PROGRESS: 'Đang XL', RESOLVED: 'Đã GQ', CLOSED: 'Đóng' }[s] || s; }
  getTypeLabel(t: string): string {
    return { ACCIDENT: 'Tai nạn', BREAKDOWN: 'Hỏng xe', DELAY: 'Trễ giờ', OVERCROWDING: 'Quá tải', EQUIPMENT_FAILURE: 'Thiết bị', SPEEDING: 'Tốc độ', OFF_ROUTE: 'Lệch tuyến', BUNCHING: 'Xe dồn', AC_FAILURE: 'Điều hòa', PASSENGER_COMPLAINT: 'Khiếu nại', OTHER: 'Khác' }[t] || t;
  }

  isCurrentStep(index: number): boolean {
    if (!this.incident) return false;
    const statusOrder = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    return index === statusOrder.indexOf(this.incident.status);
  }

  private getSLAMinutes(): number {
    if (!this.incident) return 1440;
    return { P1: 15, P2: 60, P3: 240, P4: 1440 }[this.incident.severity] || 1440;
  }

  private getElapsedMinutes(): number {
    if (!this.incident) return 0;
    const end = this.incident.resolvedAt ? new Date(this.incident.resolvedAt) : new Date();
    return (end.getTime() - new Date(this.incident.createdAt).getTime()) / 60000;
  }

  getElapsedTime(): string {
    const mins = this.getElapsedMinutes();
    if (mins < 60) return Math.round(mins) + ' phút';
    if (mins < 1440) return (mins / 60).toFixed(1) + ' giờ';
    return (mins / 1440).toFixed(1) + ' ngày';
  }

  getSLATarget(): string {
    const mins = this.getSLAMinutes();
    if (mins < 60) return mins + ' phút';
    if (mins < 1440) return (mins / 60) + ' giờ';
    return (mins / 1440) + ' ngày';
  }

  getSLAProgress(): number {
    return (this.getElapsedMinutes() / this.getSLAMinutes()) * 100;
  }

  getSLAProgressCapped(): number {
    return Math.min(this.getSLAProgress(), 100);
  }

  isSLABreached(): boolean {
    return this.getSLAProgress() >= 100;
  }
}
