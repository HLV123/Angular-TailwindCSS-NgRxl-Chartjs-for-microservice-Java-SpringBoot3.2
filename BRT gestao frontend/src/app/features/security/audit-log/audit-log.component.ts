import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../../core/services/data.service';
import { AuditLog } from '../../../core/models';

@Component({
    selector: 'app-audit-log',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Audit Log</h1><p class="text-sm text-slate-500 mt-1">UC-SECURITY-002 • Activity Tracking</p></div>
        <button class="btn-primary text-sm">📥 Xuất CSV</button>
      </div>

      <div class="flex items-center gap-3">
        <input [(ngModel)]="searchTerm" placeholder="Tìm kiếm..." class="form-input max-w-xs"/>
        <select [(ngModel)]="filterAction" class="form-select max-w-[140px]">
          <option value="">Tất cả action</option>
          <option value="LOGIN">LOGIN</option><option value="LOGOUT">LOGOUT</option><option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option><option value="DELETE">DELETE</option><option value="EXPORT">EXPORT</option>
        </select>
      </div>

      <div class="bg-white rounded-2xl border overflow-hidden">
        <div class="table-container"><table class="data-table">
          <thead><tr><th>Thời gian</th><th>Người dùng</th><th>Vai trò</th><th>Action</th><th>Module</th><th>Chi tiết</th><th>IP</th></tr></thead>
          <tbody>
            <tr *ngFor="let log of filteredLogs" class="hover:bg-slate-50">
              <td class="font-mono text-xs text-slate-500 whitespace-nowrap">{{ log.timestamp | date:'HH:mm:ss dd/MM' }}</td>
              <td class="font-medium text-sm">{{ log.userName }}</td>
              <td><span class="badge badge-info text-[10px]">{{ log.userRole }}</span></td>
              <td><span class="badge" [ngClass]="getActionClass(log.action)">{{ log.action }}</span></td>
              <td class="text-sm">{{ log.module }}</td>
              <td class="text-sm text-slate-600 max-w-xs truncate">{{ log.details }}</td>
              <td class="font-mono text-xs text-slate-400">{{ log.ipAddress }}</td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>
  `
})
export class AuditLogComponent implements OnInit {
    auditLogs: AuditLog[] = [];
    searchTerm = ''; filterAction = '';

    constructor(private auditService: AuditService) { }
    ngOnInit() { this.auditService.getAll().subscribe(l => this.auditLogs = l); }

    get filteredLogs() {
        return this.auditLogs.filter(l =>
            (!this.searchTerm || l.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) || l.details.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
            (!this.filterAction || l.action === this.filterAction)
        );
    }
    getActionClass(a: string): string {
        return { LOGIN: 'badge-success', LOGOUT: 'badge-neutral', CREATE: 'badge-info', UPDATE: 'badge-warning', DELETE: 'badge-danger', EXPORT: 'bg-purple-100 text-purple-700' }[a] || 'badge-neutral';
    }
}
