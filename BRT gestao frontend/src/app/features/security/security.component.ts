import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../core/services/data.service';
import { AuditLog } from '../../core/models';
import { MOCK_USERS } from '../../core/mock-data';
@Component({ selector: 'app-security', standalone: true, imports: [CommonModule], template: `
<div class="space-y-6">
  <div><h1 class="page-title">Phân quyền & Bảo mật</h1><p class="text-sm text-slate-500 mt-1">Security • Spring Security + JWT + Apache Ranger</p></div>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-white rounded-2xl border overflow-hidden">
      <div class="p-4 border-b flex items-center justify-between"><h3 class="card-title">Tài khoản hệ thống</h3><button class="btn-primary text-xs">+ Thêm tài khoản</button></div>
      <div class="table-container"><table class="data-table"><thead><tr><th>Người dùng</th><th>Vai trò</th><th>2FA</th><th>Trạng thái</th></tr></thead>
        <tbody><tr *ngFor="let u of users">
          <td><div class="flex items-center gap-3"><img [src]="u.avatar" class="w-8 h-8 rounded-lg"/><div><p class="font-semibold text-sm">{{ u.fullName }}</p><p class="text-xs text-slate-400">{{ u.email }}</p></div></div></td>
          <td><span class="badge badge-info">{{ u.role }}</span></td>
          <td><span [ngClass]="u.twoFactorEnabled?'text-emerald-600':'text-slate-300'">{{ u.twoFactorEnabled?'✓':'✗' }}</span></td>
          <td><span class="badge" [ngClass]="u.isActive?'badge-success':'badge-danger'">{{ u.isActive?'Active':'Disabled' }}</span></td>
        </tr></tbody></table></div>
    </div>
    <div class="bg-white rounded-2xl border overflow-hidden">
      <div class="p-4 border-b"><h3 class="card-title">Audit Log</h3></div>
      <div class="divide-y max-h-96 overflow-y-auto">
        <div *ngFor="let log of auditLogs" class="px-4 py-3">
          <div class="flex items-center gap-2 text-xs"><span class="badge" [ngClass]="{'badge-success':log.action==='LOGIN','badge-info':log.action==='CREATE','badge-warning':log.action==='UPDATE','badge-neutral':log.action==='EXPORT'}">{{ log.action }}</span><span class="text-slate-400">{{ log.timestamp | date:'dd/MM HH:mm' }}</span></div>
          <p class="text-sm mt-1"><span class="font-medium">{{ log.userName }}</span> <span class="text-slate-500">{{ log.details }}</span></p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-white rounded-2xl border p-6">
    <h3 class="card-title mb-3">Ma trận phân quyền (RBAC)</h3>
    <div class="overflow-x-auto"><table class="data-table text-xs"><thead><tr><th>Chức năng</th><th>Admin</th><th>Ops Mgr</th><th>Dispatcher</th><th>Driver</th><th>Analyst</th><th>Finance</th></tr></thead>
      <tbody>
        <tr><td class="font-medium">Quản lý tuyến</td><td class="text-emerald-600 font-bold">CRUD</td><td class="text-emerald-600">CRUD</td><td class="text-blue-600">View</td><td>—</td><td class="text-blue-600">View</td><td>—</td></tr>
        <tr><td class="font-medium">Giám sát real-time</td><td class="text-emerald-600 font-bold">Full</td><td class="text-emerald-600">Full</td><td class="text-emerald-600">Full</td><td class="text-blue-600">Own</td><td class="text-blue-600">View</td><td>—</td></tr>
        <tr><td class="font-medium">Quản lý sự cố</td><td class="text-emerald-600 font-bold">Full</td><td class="text-emerald-600">Full</td><td class="text-amber-600">C/U</td><td class="text-amber-600">Create</td><td class="text-blue-600">View</td><td>—</td></tr>
        <tr><td class="font-medium">Báo cáo tài chính</td><td class="text-emerald-600 font-bold">Full</td><td class="text-blue-600">View</td><td>—</td><td>—</td><td class="text-blue-600">View</td><td class="text-emerald-600 font-bold">Full</td></tr>
        <tr><td class="font-medium">Cấu hình hệ thống</td><td class="text-emerald-600 font-bold">Full</td><td class="text-amber-600">Limited</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
      </tbody></table></div>
    <p class="text-xs text-slate-400 mt-3">Tích hợp Apache Ranger cho phân quyền truy cập dữ liệu Hive/HDFS</p>
  </div>
</div>` })
export class SecurityComponent implements OnInit {
  users = MOCK_USERS; auditLogs: AuditLog[] = [];
  constructor(private as: AuditService) {}
  ngOnInit() { this.as.getAll().subscribe(l => this.auditLogs = l); }
}
