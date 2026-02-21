import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../../core/services/data.service';
import { Schedule } from '../../../core/models';
@Component({ selector: 'app-schedule-list', standalone: true, imports: [CommonModule, FormsModule], template: `
<div class="space-y-6">
  <div class="flex items-center justify-between"><div><h1 class="page-title">Lịch trình & Biểu đồ chạy xe</h1><p class="text-sm text-slate-500 mt-1">Schedule Management • Lịch trình, tần suất và headway</p></div>
    <button class="btn-primary flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg> Tạo lịch trình</button>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div *ngFor="let s of schedules" class="bg-white rounded-2xl shadow-sm border p-5">
      <div class="flex items-center justify-between mb-3">
        <span class="text-lg font-bold">{{ s.routeCode }}</span>
        <span class="badge" [ngClass]="s.status==='ACTIVE'?'badge-success':'badge-neutral'">{{ s.status }}</span>
      </div>
      <p class="text-sm text-slate-600 mb-3">{{ s.routeName }}</p>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between"><span class="text-slate-400">Giờ hoạt động:</span><span class="font-medium">{{ s.operatingHoursStart }} - {{ s.operatingHoursEnd }}</span></div>
        <div class="flex justify-between"><span class="text-slate-400">Tần suất cao điểm:</span><span class="font-bold text-red-600">{{ s.peakFrequencyMin }} phút</span></div>
        <div class="flex justify-between"><span class="text-slate-400">Tần suất bình thường:</span><span class="font-medium">{{ s.normalFrequencyMin }} phút</span></div>
        <div class="flex justify-between"><span class="text-slate-400">Tần suất thấp điểm:</span><span class="font-medium text-slate-500">{{ s.offPeakFrequencyMin }} phút</span></div>
        <div class="flex justify-between"><span class="text-slate-400">Xe cần thiết:</span><span class="font-medium">{{ s.requiredVehicles }}</span></div>
        <div class="flex justify-between"><span class="text-slate-400">Tài xế cần:</span><span class="font-medium">{{ s.requiredDrivers }}</span></div>
      </div>
      <div class="mt-4 pt-3 border-t flex gap-2"><button class="btn-secondary text-xs flex-1">Chỉnh sửa</button><button class="btn-secondary text-xs flex-1">Xem biểu đồ</button></div>
    </div>
  </div>
  <div class="bg-white rounded-2xl shadow-sm border p-6">
    <h3 class="card-title mb-4">Headway Monitoring (WebSocket real-time)</h3>
    <div class="p-8 bg-slate-50 rounded-xl text-center text-slate-400">
      <p class="text-sm">Biểu đồ headway sẽ hiển thị real-time khi kết nối WebSocket từ backend</p>
      <p class="text-xs mt-2">Kafka Streams → Spring Boot → WebSocket → NgRx Store → Component</p>
    </div>
  </div>
</div>` })
export class ScheduleListComponent implements OnInit {
  schedules: Schedule[] = [];
  constructor(private ss: ScheduleService) {}
  ngOnInit() { this.ss.getAll().subscribe(s => this.schedules = s); }
}
