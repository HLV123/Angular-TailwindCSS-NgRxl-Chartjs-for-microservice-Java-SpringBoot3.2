import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-forbidden',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
        </svg>
      </div>
      <h1 class="text-4xl font-bold text-slate-800 mb-2">403</h1>
      <h2 class="text-xl font-semibold text-slate-600 mb-3">Không có quyền truy cập</h2>
      <p class="text-slate-500 mb-8 max-w-md">Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cần quyền truy cập.</p>
      <a routerLink="/dashboard" class="btn-primary inline-flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        Về Dashboard
      </a>
    </div>
  `
})
export class ForbiddenComponent { }
