import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RolePermission { module: string; admin: string; ops: string; dispatch: string; driver: string; analyst: string; finance: string; maintenance: string; }

@Component({
    selector: 'app-roles',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Quản lý Vai trò & Phân quyền</h1><p class="text-sm text-slate-500 mt-1">UC-AUTH-002 • RBAC Matrix</p></div>
      </div>

      <!-- Role Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div *ngFor="let role of roles" class="bg-white rounded-2xl border p-5 hover:shadow-md transition-all cursor-pointer" [ngClass]="selectedRole === role.key ? 'ring-2 ring-blue-500' : ''" (click)="selectedRole = role.key">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-2xl">{{ role.icon }}</span>
            <div><p class="font-bold text-sm">{{ role.label }}</p><p class="text-xs text-slate-400">{{ role.count }} người dùng</p></div>
          </div>
          <p class="text-xs text-slate-500">{{ role.description }}</p>
        </div>
      </div>

      <!-- Permission Matrix -->
      <div class="bg-white rounded-2xl border overflow-hidden">
        <div class="p-4 border-b"><h3 class="card-title">Ma trận phân quyền chi tiết</h3></div>
        <div class="overflow-x-auto p-4"><table class="data-table text-xs">
          <thead><tr>
            <th class="w-40">Module</th>
            <th *ngFor="let r of roles" class="text-center" [ngClass]="selectedRole === r.key ? 'bg-blue-50' : ''">
              <span class="text-sm">{{ r.icon }}</span><br/>{{ r.shortLabel }}
            </th>
          </tr></thead>
          <tbody>
            <tr *ngFor="let p of permissions">
              <td class="font-medium text-slate-700">{{ p.module }}</td>
              <td class="text-center" [ngClass]="getPermClass(p.admin)">{{ p.admin }}</td>
              <td class="text-center" [ngClass]="getPermClass(p.ops)">{{ p.ops }}</td>
              <td class="text-center" [ngClass]="getPermClass(p.dispatch)">{{ p.dispatch }}</td>
              <td class="text-center" [ngClass]="getPermClass(p.driver)">{{ p.driver }}</td>
              <td class="text-center" [ngClass]="getPermClass(p.analyst)">{{ p.analyst }}</td>
              <td class="text-center" [ngClass]="getPermClass(p.finance)">{{ p.finance }}</td>
              <td class="text-center" [ngClass]="getPermClass(p.maintenance)">{{ p.maintenance }}</td>
            </tr>
          </tbody>
        </table></div>
        <div class="p-4 border-t bg-slate-50 flex items-center gap-4 text-xs text-slate-500">
          <span><span class="text-emerald-600 font-bold">CRUD</span> = Full</span>
          <span><span class="text-blue-600">R</span> = Read</span>
          <span><span class="text-amber-600">CR</span> = Create/Read</span>
          <span>— = No access</span>
        </div>
      </div>
    </div>
  `
})
export class RolesComponent {
    selectedRole = '';
    roles = [
        { key: 'ADMIN', label: 'Administrator', shortLabel: 'Admin', icon: '👑', count: 1, description: 'Toàn quyền hệ thống' },
        { key: 'OPS_MANAGER', label: 'Quản lý Vận hành', shortLabel: 'Ops Mgr', icon: '📊', count: 1, description: 'Quản lý vận hành hàng ngày' },
        { key: 'DISPATCHER', label: 'Điều phối viên', shortLabel: 'Dispatch', icon: '🎯', count: 2, description: 'Điều phối xe & tài xế' },
        { key: 'DRIVER', label: 'Tài xế BRT', shortLabel: 'Driver', icon: '🚌', count: 10, description: 'Lái xe, báo cáo sự cố' },
        { key: 'ANALYST', label: 'Phân tích viên', shortLabel: 'Analyst', icon: '📈', count: 1, description: 'Xem báo cáo & analytics' },
        { key: 'FINANCE', label: 'Tài chính', shortLabel: 'Finance', icon: '💰', count: 1, description: 'Doanh thu & đối soát' },
        { key: 'MAINTENANCE', label: 'Bảo trì', shortLabel: 'Maint.', icon: '🔧', count: 1, description: 'Bảo dưỡng phương tiện' },
    ];

    permissions: RolePermission[] = [
        { module: 'Quản lý tuyến', admin: 'CRUD', ops: 'CRUD', dispatch: 'R', driver: '—', analyst: 'R', finance: '—', maintenance: '—' },
        { module: 'Phương tiện', admin: 'CRUD', ops: 'CRUD', dispatch: 'R', driver: 'R', analyst: 'R', finance: '—', maintenance: 'CR' },
        { module: 'Trạm dừng', admin: 'CRUD', ops: 'CRUD', dispatch: 'R', driver: 'R', analyst: 'R', finance: '—', maintenance: '—' },
        { module: 'Tài xế', admin: 'CRUD', ops: 'CRUD', dispatch: 'R', driver: 'R', analyst: 'R', finance: '—', maintenance: '—' },
        { module: 'Lịch trình', admin: 'CRUD', ops: 'CRUD', dispatch: 'CRUD', driver: 'R', analyst: 'R', finance: '—', maintenance: '—' },
        { module: 'Điều phối', admin: 'CRUD', ops: 'CRUD', dispatch: 'CRUD', driver: 'R', analyst: 'R', finance: '—', maintenance: '—' },
        { module: 'Sự cố', admin: 'CRUD', ops: 'CRUD', dispatch: 'CR', driver: 'CR', analyst: 'R', finance: '—', maintenance: 'R' },
        { module: 'Vé & doanh thu', admin: 'CRUD', ops: 'R', dispatch: '—', driver: '—', analyst: 'R', finance: 'CRUD', maintenance: '—' },
        { module: 'Bảo trì', admin: 'CRUD', ops: 'R', dispatch: '—', driver: '—', analyst: '—', finance: '—', maintenance: 'CRUD' },
        { module: 'Báo cáo', admin: 'CRUD', ops: 'R', dispatch: '—', driver: '—', analyst: 'CRUD', finance: 'R', maintenance: '—' },
        { module: 'Bảo mật', admin: 'CRUD', ops: '—', dispatch: '—', driver: '—', analyst: '—', finance: '—', maintenance: '—' },
        { module: 'Data Platform', admin: 'CRUD', ops: 'R', dispatch: '—', driver: '—', analyst: 'CR', finance: '—', maintenance: '—' },
    ];

    getPermClass(perm: string): string {
        if (perm === 'CRUD') return 'text-emerald-600 font-bold bg-emerald-50';
        if (perm === 'R') return 'text-blue-600 bg-blue-50';
        if (perm === 'CR') return 'text-amber-600 bg-amber-50';
        return 'text-slate-300';
    }
}
