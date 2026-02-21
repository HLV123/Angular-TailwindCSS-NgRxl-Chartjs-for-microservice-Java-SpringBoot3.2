import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceService } from '../../core/services/data.service';
import { WorkOrder, SparePart } from '../../core/models';
@Component({ selector: 'app-maintenance', standalone: true, imports: [CommonModule], template: `
<div class="space-y-6">
  <div><h1 class="page-title">Bảo trì & Bảo dưỡng</h1><p class="text-sm text-slate-500 mt-1">Maintenance Management • Lệnh sửa chữa, phụ tùng, predictive maintenance</p></div>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white rounded-2xl border overflow-hidden">
      <div class="p-4 border-b flex items-center justify-between"><h3 class="card-title">Lệnh sửa chữa (Work Orders)</h3><button class="btn-primary text-xs">+ Tạo mới</button></div>
      <div class="divide-y">
        <div *ngFor="let wo of workOrders" class="p-4 hover:bg-slate-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-mono text-xs text-slate-400">{{ wo.code }}</span>
            <span class="badge" [ngClass]="{'badge-danger': wo.status==='OPEN'||wo.priority==='CRITICAL', 'badge-warning': wo.status==='IN_PROGRESS'||wo.status==='WAITING_PARTS', 'badge-success': wo.status==='COMPLETED'||wo.status==='CLOSED', 'badge-neutral': wo.status==='INSPECTING'}">{{ wo.status }}</span>
          </div>
          <p class="font-semibold text-slate-800 text-sm">{{ wo.description }}</p>
          <div class="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span>🚌 {{ wo.vehiclePlate }}</span>
            <span class="badge" [ngClass]="{'badge-danger': wo.priority==='CRITICAL'||wo.priority==='HIGH', 'badge-warning': wo.priority==='MEDIUM', 'badge-neutral': wo.priority==='LOW'}">{{ wo.priority }}</span>
            <span *ngIf="wo.assignedTechnicianName">👨‍🔧 {{ wo.assignedTechnicianName }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-2xl border overflow-hidden">
      <div class="p-4 border-b"><h3 class="card-title">Kho phụ tùng</h3></div>
      <div class="table-container"><table class="data-table"><thead><tr><th>Mã</th><th>Tên</th><th>Tồn kho</th><th>Tối thiểu</th><th>Trạng thái</th></tr></thead>
        <tbody><tr *ngFor="let sp of spareParts">
          <td class="font-mono text-xs">{{ sp.code }}</td>
          <td><p class="font-medium text-sm">{{ sp.name }}</p><p class="text-xs text-slate-400">{{ sp.category }} • {{ sp.supplier }}</p></td>
          <td class="font-bold">{{ sp.currentStock }}</td>
          <td class="text-slate-400">{{ sp.minStock }}</td>
          <td><span class="badge" [ngClass]="sp.currentStock<=sp.minStock?'badge-danger':'badge-success'">{{ sp.currentStock<=sp.minStock?'⚠️ Thấp':'OK' }}</span></td>
        </tr></tbody></table></div>
    </div>
  </div>
  <div class="bg-white rounded-2xl border p-6">
    <h3 class="card-title mb-3">Predictive Maintenance (ML)</h3>
    <div class="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
      <p class="text-sm text-slate-600">Hệ thống sử dụng dữ liệu cảm biến IoT (nhiệt độ động cơ, rung động, áp suất) được thu thập qua <span class="font-bold">Kafka</span>, lưu trữ trên <span class="font-bold">Hadoop/HDFS</span>, và chạy ML model để dự báo khả năng hỏng hóc trong 7-14 ngày tới.</p>
      <p class="text-xs text-slate-500 mt-2">Giao thức: gRPC → Prediction Microservice → Kafka → Alert Service</p>
    </div>
  </div>
</div>` })
export class MaintenanceComponent implements OnInit {
  workOrders: WorkOrder[] = []; spareParts: SparePart[] = [];
  constructor(private ms: MaintenanceService) {}
  ngOnInit() { this.ms.getWorkOrders().subscribe(w => this.workOrders = w); this.ms.getSpareParts().subscribe(s => this.spareParts = s); }
}
