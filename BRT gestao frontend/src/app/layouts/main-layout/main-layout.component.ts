import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/data.service';
import { User, AppNotification } from '../../core/models';
import { filter } from 'rxjs/operators';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
  badgeType?: string;
  roles?: string[];
  children?: MenuItem[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-30 transition-all duration-300"
      [class.w-[280px]]="!sidebarCollapsed" [class.w-[72px]]="sidebarCollapsed">

      <!-- Logo -->
      <div class="h-16 flex items-center px-4 border-b border-slate-100">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <img src="assets/logo.png" alt="BRT" class="w-8 h-8 rounded-lg" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'" />
            <svg style="display:none" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg>
          </div>
          <div *ngIf="!sidebarCollapsed" class="min-w-0">
            <h1 class="text-lg font-bold text-slate-800 truncate" style="font-family:'Poppins',sans-serif">BRT Gestão</h1>
            <p class="text-[10px] text-slate-400 uppercase tracking-wider">Management System</p>
          </div>
        </div>
      </div>

      <!-- Menu -->
      <nav class="p-3 space-y-1 overflow-y-auto" style="height: calc(100vh - 64px - 70px)">
        <ng-container *ngFor="let item of menuItems">
          <div *ngIf="!item.roles || hasAnyRole(item.roles)"
            (click)="navigateTo(item.route)"
            class="sidebar-item"
            [class.active]="isActive(item.route)"
            [title]="sidebarCollapsed ? item.label : ''">
            <span [innerHTML]="item.icon" class="w-5 h-5 flex-shrink-0 flex items-center justify-center"></span>
            <span *ngIf="!sidebarCollapsed" class="text-sm truncate flex-1">{{ item.label }}</span>
            <span *ngIf="!sidebarCollapsed && item.badge"
              class="text-[10px] px-2 py-0.5 rounded-full ml-auto"
              [ngClass]="{
                'bg-red-100 text-red-600': item.badgeType === 'danger',
                'bg-blue-100 text-blue-600': item.badgeType === 'info',
                'bg-emerald-100 text-emerald-600': item.badgeType === 'success',
                'bg-amber-100 text-amber-600': item.badgeType === 'warning',
                'bg-slate-100 text-slate-600': !item.badgeType
              }">{{ item.badge }}</span>
          </div>
        </ng-container>

        <!-- Separator -->
        <div class="pt-3 mt-3 border-t border-slate-100">
          <p *ngIf="!sidebarCollapsed" class="px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Big Data</p>
          <ng-container *ngFor="let item of dataMenuItems">
            <div *ngIf="!item.roles || hasAnyRole(item.roles)"
              (click)="navigateTo(item.route)"
              class="sidebar-item"
              [class.active]="isActive(item.route)"
              [title]="sidebarCollapsed ? item.label : ''">
              <span [innerHTML]="item.icon" class="w-5 h-5 flex-shrink-0 flex items-center justify-center"></span>
              <span *ngIf="!sidebarCollapsed" class="text-sm truncate flex-1">{{ item.label }}</span>
              <span *ngIf="!sidebarCollapsed && item.badge" class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 ml-auto">{{ item.badge }}</span>
            </div>
          </ng-container>
        </div>
      </nav>

      <!-- Sidebar toggle -->
      <div class="absolute bottom-0 w-full p-3 border-t border-slate-100">
        <button (click)="sidebarCollapsed = !sidebarCollapsed"
          class="w-full flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors">
          <svg class="w-5 h-5 transition-transform" [class.rotate-180]="sidebarCollapsed" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
          <span *ngIf="!sidebarCollapsed" class="text-xs">Thu gọn</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="transition-all duration-300" [class.ml-[280px]]="!sidebarCollapsed" [class.ml-[72px]]="sidebarCollapsed">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-slate-500">Hệ thống đang hoạt động</span>
          </div>
          <div class="hidden md:flex items-center gap-3 text-xs text-slate-400">
            <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg> PostgreSQL</span>
            <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg> Neo4j</span>
            <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg> Kafka</span>
            <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg> TimescaleDB</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Notifications -->
          <div class="relative">
            <button (click)="showNotifications = !showNotifications"
              class="p-2 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors relative">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span *ngIf="unreadCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{{ unreadCount }}</span>
            </button>
            <!-- Notification dropdown -->
            <div *ngIf="showNotifications" class="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50">
              <div class="p-4 border-b border-slate-100">
                <h3 class="font-semibold text-slate-800">Thông báo</h3>
              </div>
              <div class="max-h-80 overflow-y-auto">
                <div *ngFor="let n of notifications" class="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer"
                  [class.bg-blue-50]="!n.isRead">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      [ngClass]="{'bg-red-100': n.type==='ALERT', 'bg-amber-100': n.type==='WARNING', 'bg-blue-100': n.type==='INFO', 'bg-emerald-100': n.type==='SUCCESS'}">
                      <svg *ngIf="n.type==='ALERT'" class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                      <svg *ngIf="n.type==='WARNING'" class="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" clip-rule="evenodd"/></svg>
                      <svg *ngIf="n.type==='INFO'" class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                      <svg *ngIf="n.type==='SUCCESS'" class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-slate-800 truncate">{{ n.title }}</p>
                      <p class="text-xs text-slate-500 line-clamp-2 mt-0.5">{{ n.message }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div class="relative">
            <button (click)="showUserMenu = !showUserMenu" class="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-semibold text-slate-700">{{ user?.fullName }}</p>
                <p class="text-xs text-slate-400">{{ getRoleLabel(user?.role) }}</p>
              </div>
              <img [src]="user?.avatar" [alt]="user?.fullName" class="w-9 h-9 rounded-xl" />
            </button>
            <div *ngIf="showUserMenu" class="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 py-2">
              <div class="px-4 py-3 border-b border-slate-100">
                <p class="font-semibold text-slate-800">{{ user?.fullName }}</p>
                <p class="text-xs text-slate-400">{{ user?.email }}</p>
              </div>
              <button (click)="navigateTo('/settings')" class="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Cài đặt
              </button>
              <button (click)="logout()" class="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6 bg-slate-50 min-h-[calc(100vh-64px)]">
        <router-outlet></router-outlet>
      </main>
    </div>

    <!-- Click outside to close -->
    <div *ngIf="showNotifications || showUserMenu" (click)="showNotifications = false; showUserMenu = false" class="fixed inset-0 z-10"></div>
  `
})
export class MainLayoutComponent implements OnInit {
  user: User | null = null;
  sidebarCollapsed = false;
  showNotifications = false;
  showUserMenu = false;
  notifications: AppNotification[] = [];
  unreadCount = 0;
  currentRoute = '';

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>', route: '/dashboard' },
    { label: 'Quản lý tuyến', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>', route: '/routes', badge: 'Neo4j', badgeType: 'info', roles: ['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER', 'ANALYST'] },
    { label: 'Đội xe', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>', route: '/vehicles', badge: '12', badgeType: 'success', roles: ['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'ANALYST', 'MAINTENANCE'] },
    { label: 'Trạm dừng', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>', route: '/stations', badge: 'PostGIS', badgeType: 'info', roles: ['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'ANALYST'] },
    { label: 'Lịch trình', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>', route: '/schedules', roles: ['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER'] },
    { label: 'Tài xế', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>', route: '/drivers', roles: ['ADMIN', 'OPS_MANAGER', 'DISPATCHER'] },
    { label: 'Vé điện tử', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>', route: '/tickets', roles: ['ADMIN', 'OPS_MANAGER', 'ANALYST', 'FINANCE'] },
    { label: 'Sự cố', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>', route: '/incidents', badge: '3', badgeType: 'danger', roles: ['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER', 'MAINTENANCE'] },
    { label: 'Báo cáo & Phân tích', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>', route: '/analytics', badge: 'Hive', badgeType: 'info', roles: ['ADMIN', 'OPS_MANAGER', 'ANALYST', 'FINANCE'] },
    { label: 'Bảo trì', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>', route: '/maintenance', roles: ['ADMIN', 'OPS_MANAGER', 'MAINTENANCE'] },
    { label: 'Bảo mật', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>', route: '/security', badge: 'Ranger', badgeType: 'warning', roles: ['ADMIN'] },
    { label: 'Điều phối', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>', route: '/dispatch', badge: 'RT', badgeType: 'warning', roles: ['ADMIN', 'OPS_MANAGER', 'DISPATCHER'] },
    { label: 'Thông báo', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>', route: '/notifications', badge: '5', badgeType: 'danger' },
    { label: 'Hành khách', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>', route: '/passenger-portal', roles: ['ADMIN', 'OPS_MANAGER', 'DISPATCHER', 'DRIVER', 'ANALYST'] },
    { label: 'Cài đặt', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>', route: '/settings' },
  ];

  dataMenuItems: MenuItem[] = [
    { label: 'Data Flow', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>', route: '/data-platform', badge: 'NiFi', roles: ['ADMIN', 'ANALYST'] },
  ];

  constructor(
    private authService: AuthService,
    private notifService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => this.user = u);
    this.notifService.getAll().subscribe(n => {
      this.notifications = n;
      this.unreadCount = n.filter(x => !x.isRead).length;
    });
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentRoute = e.urlAfterRedirects;
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.showUserMenu = false;
    this.showNotifications = false;
  }

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  hasAnyRole(roles: string[]): boolean {
    return !roles || this.authService.hasRole(roles);
  }

  getRoleLabel(role?: string): string {
    const map: Record<string, string> = {
      'ADMIN': 'Quản trị viên', 'OPS_MANAGER': 'Quản lý vận hành',
      'DISPATCHER': 'Điều phối viên', 'DRIVER': 'Tài xế',
      'MAINTENANCE': 'Bảo trì', 'ANALYST': 'Phân tích', 'FINANCE': 'Tài chính'
    };
    return map[role || ''] || role || '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
