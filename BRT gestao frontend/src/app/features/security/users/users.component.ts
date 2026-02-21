import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MOCK_USERS } from '../../../core/mock-data';
import { User } from '../../../core/models';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Quản lý Tài khoản</h1><p class="text-sm text-slate-500 mt-1">UC-AUTH-001 • User Management</p></div>
        <button class="btn-primary" (click)="showForm = true">+ Thêm tài khoản</button>
      </div>

      <div class="flex items-center gap-3">
        <input [(ngModel)]="searchTerm" placeholder="Tìm kiếm..." class="form-input max-w-xs"/>
        <select [(ngModel)]="filterRole" class="form-select max-w-[160px]">
          <option value="">Tất cả vai trò</option>
          <option *ngFor="let r of allRoles" [value]="r">{{ getRoleLabel(r) }}</option>
        </select>
      </div>

      <div class="bg-white rounded-2xl border overflow-hidden">
        <div class="table-container"><table class="data-table">
          <thead><tr><th>Người dùng</th><th>Vai trò</th><th>Phòng ban</th><th>2FA</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            <tr *ngFor="let u of filteredUsers" class="hover:bg-slate-50">
              <td><div class="flex items-center gap-3">
                <img [src]="u.avatar" class="w-9 h-9 rounded-lg"/>
                <div><p class="font-semibold text-sm">{{ u.fullName }}</p><p class="text-xs text-slate-400">{{ u.email }}</p></div>
              </div></td>
              <td><span class="badge badge-info">{{ getRoleLabel(u.role) }}</span></td>
              <td class="text-sm text-slate-600">{{ u.department || '—' }}</td>
              <td><span [ngClass]="u.twoFactorEnabled ? 'text-emerald-600' : 'text-slate-300'" class="text-lg">{{ u.twoFactorEnabled ? '🔒' : '🔓' }}</span></td>
              <td><span class="badge" [ngClass]="u.isActive ? 'badge-success' : 'badge-danger'">{{ u.isActive ? 'Active' : 'Disabled' }}</span></td>
              <td><div class="flex gap-1">
                <button class="btn-secondary text-xs" (click)="editUser(u)">Sửa</button>
                <button class="px-2 py-1 rounded text-xs" [ngClass]="u.isActive ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'" (click)="toggleActive(u)">{{ u.isActive ? 'Khóa' : 'Mở' }}</button>
              </div></td>
            </tr>
          </tbody>
        </table></div>
      </div>

      <!-- Form Modal -->
      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content w-full max-w-lg mx-4" (click)="$event.stopPropagation()">
          <div class="p-6 border-b"><h2 class="text-xl font-bold">{{ editingUser ? 'Sửa tài khoản' : 'Tạo tài khoản mới' }}</h2></div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div><label class="form-label">Họ tên</label><input [(ngModel)]="form.fullName" class="form-input"/></div>
              <div><label class="form-label">Username</label><input [(ngModel)]="form.username" class="form-input"/></div>
              <div><label class="form-label">Email</label><input [(ngModel)]="form.email" class="form-input" type="email"/></div>
              <div><label class="form-label">SĐT</label><input [(ngModel)]="form.phone" class="form-input"/></div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="form-label">Vai trò</label>
                <select [(ngModel)]="form.role" class="form-select">
                  <option *ngFor="let r of allRoles" [value]="r">{{ getRoleLabel(r) }}</option>
                </select></div>
              <div><label class="form-label">Phòng ban</label><input [(ngModel)]="form.department" class="form-input"/></div>
            </div>
            <div *ngIf="!editingUser"><label class="form-label">Mật khẩu</label><input [(ngModel)]="form.password" class="form-input" type="password"/></div>
          </div>
          <div class="p-6 border-t flex justify-end gap-3">
            <button class="btn-secondary" (click)="showForm = false">Hủy</button>
            <button class="btn-primary" (click)="saveUser()">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UsersComponent {
    users: User[] = [...MOCK_USERS];
    searchTerm = ''; filterRole = '';
    showForm = false; editingUser: User | null = null;
    form: any = { fullName: '', username: '', email: '', phone: '', role: 'DISPATCHER', department: '', password: '' };
    allRoles = ['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER', 'MAINTENANCE', 'ANALYST', 'FINANCE'];

    get filteredUsers() {
        return this.users.filter(u =>
            (!this.searchTerm || u.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) || u.email.includes(this.searchTerm)) &&
            (!this.filterRole || u.role === this.filterRole)
        );
    }
    editUser(u: User) { this.editingUser = u; this.form = { ...u }; this.showForm = true; }
    toggleActive(u: User) { u.isActive = !u.isActive; }
    saveUser() { this.showForm = false; this.editingUser = null; }
    getRoleLabel(r: string): string {
        return { ADMIN: 'Admin', OPS_MANAGER: 'Quản lý VH', DISPATCHER: 'Điều phối', DRIVER: 'Tài xế', MAINTENANCE: 'Bảo trì', ANALYST: 'Phân tích', FINANCE: 'Tài chính' }[r] || r;
    }
}
