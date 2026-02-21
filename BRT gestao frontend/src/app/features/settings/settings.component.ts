import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <h1 class="page-title">Cài đặt hệ thống</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Profile -->
        <div class="md:col-span-2 bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Thông tin cá nhân</h3>
          <div class="space-y-4">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                {{ currentUser?.fullName?.charAt(0) || 'U' }}
              </div>
              <div>
                <p class="font-bold text-lg">{{ currentUser?.fullName }}</p>
                <p class="text-sm text-slate-500">{{ currentUser?.role }} • {{ currentUser?.department }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="form-label">Họ tên</label><input [value]="currentUser?.fullName" class="form-input" readonly/></div>
              <div><label class="form-label">Username</label><input [value]="currentUser?.username" class="form-input" readonly/></div>
              <div><label class="form-label">Email</label><input [value]="currentUser?.email" class="form-input" readonly/></div>
              <div><label class="form-label">Điện thoại</label><input [value]="currentUser?.phone" class="form-input" readonly/></div>
            </div>
            <div class="p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
              <p class="font-semibold">Kết nối Backend</p>
              <p class="text-xs mt-1">Khi kết nối Spring Security backend, profile sẽ được quản lý qua OAuth2/JWT token.</p>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div class="space-y-6">
          <div class="bg-white rounded-2xl border p-6">
            <h3 class="card-title mb-4">Bảo mật</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between py-2">
                <span class="text-sm">Xác thực 2 lớp (2FA)</span>
                <div class="w-12 h-6 rounded-full transition-colors cursor-pointer" [ngClass]="twoFA ? 'bg-blue-500' : 'bg-slate-200'" (click)="twoFA = !twoFA">
                  <div class="w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5" [ngClass]="twoFA ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'"></div>
                </div>
              </div>
              <button class="btn-secondary w-full">Đổi mật khẩu</button>
              <button class="btn-secondary w-full">Quản lý phiên đăng nhập</button>
            </div>
          </div>

          <div class="bg-white rounded-2xl border p-6">
            <h3 class="card-title mb-4">Giao diện</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2">
                <span class="text-sm">Dark mode</span>
                <div class="w-12 h-6 rounded-full bg-slate-200 cursor-pointer">
                  <div class="w-5 h-5 bg-white rounded-full shadow-sm translate-x-0.5 mt-0.5"></div>
                </div>
              </div>
              <div><label class="form-label">Ngôn ngữ</label>
                <select class="form-select"><option>Tiếng Việt</option><option>English</option></select>
              </div>
              <div><label class="form-label">Múi giờ</label>
                <select class="form-select"><option>Asia/Ho_Chi_Minh (GMT+7)</option></select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Config -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Cấu hình hệ thống</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-slate-50">
            <p class="text-xs text-slate-500 font-medium">API Server</p>
            <p class="font-mono text-sm mt-1">https://api.brtgestao.vn</p>
            <span class="badge badge-success mt-2 text-[10px]">Connected</span>
          </div>
          <div class="p-4 rounded-xl bg-slate-50">
            <p class="text-xs text-slate-500 font-medium">WebSocket</p>
            <p class="font-mono text-sm mt-1">wss://ws.brtgestao.vn</p>
            <span class="badge badge-success mt-2 text-[10px]">Connected</span>
          </div>
          <div class="p-4 rounded-xl bg-slate-50">
            <p class="text-xs text-slate-500 font-medium">Kafka Brokers</p>
            <p class="font-mono text-sm mt-1">kafka-1:9092, kafka-2:9092</p>
            <span class="badge badge-success mt-2 text-[10px]">3 brokers online</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  currentUser: any;
  twoFA = true;
  constructor(private authService: AuthService) { this.currentUser = this.authService.currentUser; }
}
