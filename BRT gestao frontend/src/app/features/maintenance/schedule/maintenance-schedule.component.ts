import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceService } from '../../../core/services/data.service';
import { WorkOrder, Vehicle } from '../../../core/models';
import { MOCK_VEHICLES } from '../../../core/mock-data';

@Component({
  selector: 'app-maintenance-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Lịch bảo dưỡng</h1><p class="text-sm text-slate-500 mt-1">UC-MAINT-002 • Preventive Maintenance Calendar</p></div>
        <div class="flex gap-2">
          <button *ngFor="let v of views" class="px-3 py-1.5 rounded-lg text-sm" [ngClass]="currentView === v.key ? 'bg-blue-600 text-white' : 'bg-white border text-slate-600 hover:bg-slate-50'" (click)="currentView = v.key">{{ v.label }}</button>
        </div>
      </div>

      <!-- Predictive Maintenance Alert -->
      <div *ngIf="vehiclesNeedingMaintenance.length > 0" class="bg-amber-50 rounded-2xl border border-amber-200 p-5">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-lg">⚠️</span>
          <h3 class="font-bold text-amber-800">Xe cần bảo dưỡng sớm ({{ vehiclesNeedingMaintenance.length }})</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div *ngFor="let vm of vehiclesNeedingMaintenance" class="bg-white rounded-xl p-4 border" [ngClass]="vm.urgency === 'overdue' ? 'border-red-300' : 'border-amber-200'">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-sm">{{ vm.vehicle.plateNumber }}</span>
              <span class="badge text-[9px]" [ngClass]="vm.urgency === 'overdue' ? 'badge-danger' : 'badge-warning'">
                {{ vm.urgency === 'overdue' ? 'Quá hạn!' : 'Sắp đến hạn' }}
              </span>
            </div>
            <p class="text-xs text-slate-500 mb-2">{{ vm.vehicle.vehicleType }} • {{ vm.milestone }}</p>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
              <div class="h-full rounded-full transition-all" [style.width.%]="vm.progressCapped"
                [ngClass]="vm.urgency === 'overdue' ? 'bg-red-500' : 'bg-amber-500'"></div>
            </div>
            <div class="flex justify-between text-[10px]">
              <span class="text-slate-400">{{ vm.vehicle.totalKm.toLocaleString() }} km đã chạy</span>
              <span class="font-bold" [ngClass]="vm.urgency === 'overdue' ? 'text-red-600' : 'text-amber-600'">{{ vm.progress.toFixed(0) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Week View -->
      <div class="bg-white rounded-2xl border overflow-hidden">
        <div class="p-4 border-b flex items-center justify-between">
          <button class="btn-secondary text-xs" (click)="prevWeek()">← Tuần trước</button>
          <h3 class="card-title">{{ weekLabel }}</h3>
          <button class="btn-secondary text-xs" (click)="nextWeek()">Tuần sau →</button>
        </div>
        <div class="grid grid-cols-7 divide-x">
          <div *ngFor="let day of weekDays" class="min-h-[200px]">
            <div class="p-2 bg-slate-50 border-b text-center">
              <p class="text-xs text-slate-500">{{ day.dayName }}</p>
              <p class="text-lg font-bold" [ngClass]="isToday(day.date) ? 'text-blue-600' : 'text-slate-800'">{{ day.date.getDate() }}</p>
            </div>
            <div class="p-2 space-y-1">
              <div *ngFor="let wo of getOrdersForDate(day.date)" class="p-2 rounded-lg text-xs cursor-pointer hover:opacity-80"
                [ngClass]="{'bg-red-50 border-l-2 border-red-500': wo.priority==='CRITICAL', 'bg-amber-50 border-l-2 border-amber-500': wo.priority==='HIGH', 'bg-blue-50 border-l-2 border-blue-500': wo.priority==='MEDIUM', 'bg-slate-50 border-l-2 border-slate-300': wo.priority==='LOW'}">
                <p class="font-medium truncate">{{ wo.vehiclePlate }}</p>
                <p class="text-slate-500 truncate">{{ wo.maintenanceType || '' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Sắp tới (7 ngày)</h3>
        <div class="space-y-3">
          <div *ngFor="let wo of upcomingOrders" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" [ngClass]="{'bg-red-100 text-red-600': wo.priority==='CRITICAL', 'bg-amber-100 text-amber-600': wo.priority==='HIGH', 'bg-blue-100 text-blue-600': wo.priority==='MEDIUM', 'bg-slate-100 text-slate-600': wo.priority==='LOW'}">
                🔧
              </div>
              <div>
                <p class="font-medium text-sm">{{ wo.vehiclePlate }} — {{ wo.description }}</p>
                <p class="text-xs text-slate-400">{{ wo.maintenanceType || '' }} • {{ wo.assignedTechnicianName || 'Chưa phân công' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium">{{ wo.scheduledDate | date:'dd/MM' }}</p>
              <span class="badge text-[10px]" [ngClass]="{'badge-danger': wo.priority==='CRITICAL', 'badge-warning': wo.priority==='HIGH', 'badge-info': wo.priority==='MEDIUM', 'badge-neutral': wo.priority==='LOW'}">{{ wo.priority }}</span>
            </div>
          </div>
          <p *ngIf="upcomingOrders.length === 0" class="text-sm text-slate-400 text-center py-4">Không có lịch bảo dưỡng sắp tới</p>
        </div>
      </div>
    </div>
  `
})
export class MaintenanceScheduleComponent implements OnInit {
  workOrders: WorkOrder[] = [];
  currentView = 'week';
  weekOffset = 0;
  views = [{ key: 'week', label: 'Tuần' }, { key: 'month', label: 'Tháng' }];

  constructor(private ms: MaintenanceService) { }
  ngOnInit() { this.ms.getWorkOrders().subscribe(w => this.workOrders = w); }

  get weekStart(): Date {
    const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1 + this.weekOffset * 7); d.setHours(0, 0, 0, 0); return d;
  }
  get weekLabel(): string {
    const s = this.weekStart; const e = new Date(s); e.setDate(e.getDate() + 6);
    return `${s.getDate()}/${s.getMonth() + 1} — ${e.getDate()}/${e.getMonth() + 1}/${e.getFullYear()}`;
  }
  get weekDays() {
    const days = []; const start = this.weekStart;
    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    for (let i = 0; i < 7; i++) { const d = new Date(start); d.setDate(d.getDate() + i); days.push({ date: d, dayName: dayNames[i] }); }
    return days;
  }
  get upcomingOrders() {
    const now = new Date(); const next7 = new Date(); next7.setDate(now.getDate() + 7);
    return this.workOrders.filter(w => {
      if (!w.scheduledDate) return false;
      const d = new Date(w.scheduledDate);
      return d >= now && d <= next7 && w.status !== 'COMPLETED' && w.status !== 'CLOSED';
    }).sort((a, b) => new Date(a.scheduledDate || 0).getTime() - new Date(b.scheduledDate || 0).getTime());
  }

  getOrdersForDate(date: Date): WorkOrder[] {
    return this.workOrders.filter(w => {
      if (!w.scheduledDate) return false;
      const d = new Date(w.scheduledDate);
      return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate();
    });
  }
  isToday(d: Date): boolean { const t = new Date(); return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear(); }
  prevWeek() { this.weekOffset--; }
  nextWeek() { this.weekOffset++; }

  get vehiclesNeedingMaintenance() {
    const milestones = [
      { km: 5000, label: 'Thay nhớt (5.000 km)' },
      { km: 15000, label: 'BD định kỳ (15.000 km)' },
      { km: 50000, label: 'BD tổng thể (50.000 km)' }
    ];
    const results: { vehicle: Vehicle; milestone: string; progress: number; progressCapped: number; urgency: string }[] = [];
    for (const v of MOCK_VEHICLES) {
      for (const m of milestones) {
        const progress = (v.totalKm % m.km) / m.km * 100;
        if (progress >= 80) {
          results.push({
            vehicle: v,
            milestone: m.label,
            progress,
            progressCapped: Math.min(progress, 100),
            urgency: progress >= 100 ? 'overdue' : 'approaching'
          });
        }
      }
    }
    return results.sort((a, b) => b.progress - a.progress);
  }
}
