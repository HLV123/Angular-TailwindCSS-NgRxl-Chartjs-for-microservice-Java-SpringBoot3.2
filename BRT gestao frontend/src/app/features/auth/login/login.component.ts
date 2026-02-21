import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      <!-- Background elements -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <!-- Grid pattern overlay -->
      <div class="absolute inset-0" style="background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px;"></div>

      <div class="relative z-10 w-full max-w-md px-6">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl mb-4 border border-white/10">
            <img src="assets/logo.png" alt="BRT" class="w-16 h-16 rounded-xl" onerror="this.style.display='none'; this.parentElement.innerHTML='<svg class=\\'w-10 h-10 text-blue-400\\' fill=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path d=\\'M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z\\'/></svg>'" />
          </div>
          <h1 class="text-3xl font-bold text-white mb-1" style="font-family: 'Poppins', sans-serif">BRT Gestão</h1>
          <p class="text-blue-200/70 text-sm">Hệ thống Quản lý & Giám sát Xe buýt Nhanh</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <h2 class="text-xl font-semibold text-white mb-6">Đăng nhập hệ thống</h2>

          <div *ngIf="error" class="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            {{ error }}
          </div>

          <form (ngSubmit)="onLogin()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-blue-100/80 mb-1.5">Tên đăng nhập</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/50">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </span>
                <input [(ngModel)]="username" name="username" type="text" placeholder="Nhập tên đăng nhập"
                  class="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 outline-none transition-all" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-blue-100/80 mb-1.5">Mật khẩu</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/50">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </span>
                <input [(ngModel)]="password" name="password" type="password" placeholder="Nhập mật khẩu"
                  class="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 outline-none transition-all" />
              </div>
            </div>

            <button type="submit" [disabled]="loading"
              class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50">
              <svg *ngIf="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              <span>{{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}</span>
            </button>
          </form>
        </div>

        <!-- Demo accounts -->
        <div class="mt-6 bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
          <p class="text-xs font-semibold text-blue-200/60 uppercase tracking-wider mb-3">Tài khoản demo</p>
          <div class="grid grid-cols-2 gap-2">
            <button *ngFor="let acc of demoAccounts" (click)="fillDemo(acc.user, acc.pass)"
              class="text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all group">
              <span class="text-sm text-white font-medium block">{{ acc.user }}</span>
              <span class="text-xs text-blue-200/40 group-hover:text-blue-200/60">{{ acc.role }}</span>
            </button>
          </div>
        </div>

        <!-- Tech stack badges -->
        <div class="mt-4 flex flex-wrap justify-center gap-2">
          <span *ngFor="let tech of techs" class="text-[10px] px-2 py-1 bg-white/5 rounded-full text-blue-200/40 border border-white/5">{{ tech }}</span>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  demoAccounts = [
    { user: 'admin', pass: 'admin123', role: 'System Admin' },
    { user: 'opsmanager', pass: 'ops123', role: 'Ops Manager' },
    { user: 'dispatcher1', pass: 'disp123', role: 'Dispatcher' },
    { user: 'driver01', pass: 'drv123', role: 'Driver' },
    { user: 'analyst1', pass: 'ana123', role: 'Analyst' },
    { user: 'finance1', pass: 'fin123', role: 'Finance' },
    { user: 'maint1', pass: 'mnt123', role: 'Maintenance' },
  ];

  techs = ['Angular 17', 'Tailwind', 'NgRx', 'Spring Boot', 'PostgreSQL/PostGIS', 'Neo4j', 'TimescaleDB', 'Kafka', 'NiFi', 'Hadoop'];

  constructor(private authService: AuthService, private router: Router) {
    if (authService.isLoggedIn) this.router.navigate(['/dashboard']);
  }

  fillDemo(user: string, pass: string) {
    this.username = user;
    this.password = pass;
    this.error = '';
  }

  onLogin() {
    if (!this.username || !this.password) { this.error = 'Vui lòng nhập đầy đủ thông tin'; return; }
    this.loading = true;
    this.error = '';
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => { this.router.navigate(['/dashboard']); },
      error: (err) => { this.error = err.message; this.loading = false; }
    });
  }
}
