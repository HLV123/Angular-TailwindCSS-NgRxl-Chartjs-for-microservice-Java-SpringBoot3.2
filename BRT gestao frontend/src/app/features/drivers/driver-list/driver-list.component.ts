import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../../../core/services/data.service';
import { Driver } from '../../../core/models';
@Component({
  selector: 'app-driver-list', standalone: true, imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Quản lý Tài xế</h1><p class="text-sm text-slate-500 mt-1">Driver Management • Hồ sơ, phân công và hiệu suất</p></div>
        <button class="btn-primary flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg> Thêm tài xế</button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div *ngFor="let st of statusCards" class="bg-white rounded-xl p-4 border text-center">
          <p class="text-2xl font-bold" [ngClass]="st.color">{{ countByStatus(st.key) }}</p><p class="text-xs text-slate-500">{{ st.label }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3"><input [(ngModel)]="search" placeholder="Tìm tài xế..." class="form-input max-w-xs" />
        <select [(ngModel)]="filterStatus" class="form-select max-w-[180px]"><option value="">Tất cả</option><option *ngFor="let st of statusCards" [value]="st.key">{{ st.label }}</option></select>
      </div>
      <div class="bg-white rounded-2xl shadow-sm border overflow-hidden"><div class="table-container"><table class="data-table"><thead><tr><th>Tài xế</th><th>Mã NV</th><th>Trạng thái</th><th>OTP</th><th>Đánh giá</th><th>Chuyến</th><th>Eco Score</th></tr></thead>
        <tbody><tr *ngFor="let d of filtered">
          <td><div class="flex items-center gap-3"><img [src]="'https://ui-avatars.com/api/?name='+d.fullName+'&background=random&size=40'" class="w-10 h-10 rounded-xl"/><div><p class="font-semibold text-slate-800">{{ d.fullName }}</p><p class="text-xs text-slate-400">{{ d.phone }}</p></div></div></td>
          <td class="font-mono text-xs">{{ d.employeeCode }}</td>
          <td><span class="badge" [ngClass]="getStatusClass(d.status)">{{ getStatusLabel(d.status) }}</span></td>
          <td><span class="font-bold" [ngClass]="d.otpScore>=95?'text-emerald-600':d.otpScore>=90?'text-amber-600':'text-red-600'">{{ d.otpScore }}%</span></td>
          <td><div class="flex items-center gap-1"><span class="text-amber-500">★</span><span class="font-medium">{{ d.rating }}</span></div></td>
          <td>{{ d.totalTrips.toLocaleString() }}</td>
          <td><div class="flex items-center gap-2"><div class="flex-1 h-2 bg-slate-100 rounded-full max-w-[60px]"><div class="h-full rounded-full" [ngClass]="d.ecoScore>=90?'bg-emerald-500':d.ecoScore>=80?'bg-amber-500':'bg-red-500'" [style.width.%]="d.ecoScore"></div></div><span class="text-xs font-medium">{{ d.ecoScore }}</span></div></td>
        </tr></tbody></table></div></div>
    </div>`
})
export class DriverListComponent implements OnInit {
  drivers: Driver[] = []; search = ''; filterStatus = '';
  statusCards = [
    { key: 'ON_DUTY', label: 'Đang ca', color: 'text-emerald-600' },
    { key: 'AVAILABLE', label: 'Sẵn sàng', color: 'text-blue-600' },
    { key: 'OFF_DUTY', label: 'Hết ca', color: 'text-slate-400' },
    { key: 'ON_LEAVE', label: 'Nghỉ phép', color: 'text-amber-600' },
    { key: 'SUSPENDED', label: 'Đình chỉ', color: 'text-red-600' }
  ];
  constructor(private ds: DriverService) {}
  ngOnInit() { this.ds.getAll().subscribe(d => this.drivers = d); }
  get filtered() { return this.drivers.filter(d => (!this.search || d.fullName.toLowerCase().includes(this.search.toLowerCase())) && (!this.filterStatus || d.status === this.filterStatus)); }
  countByStatus(s: string) { return this.drivers.filter(d => d.status === s).length; }
  getStatusLabel(s: string) { return { ON_DUTY: 'Đang ca', AVAILABLE: 'Sẵn sàng', OFF_DUTY: 'Hết ca', ON_LEAVE: 'Nghỉ phép', SUSPENDED: 'Đình chỉ' }[s] || s; }
  getStatusClass(s: string) { return { ON_DUTY: 'badge-success', AVAILABLE: 'badge-info', OFF_DUTY: 'badge-neutral', ON_LEAVE: 'badge-warning', SUSPENDED: 'badge-danger' }[s] || 'badge-neutral'; }
}
