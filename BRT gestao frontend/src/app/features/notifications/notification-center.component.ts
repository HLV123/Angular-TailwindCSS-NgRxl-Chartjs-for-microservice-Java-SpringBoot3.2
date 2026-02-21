import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/data.service';
import { AppNotification } from '../../core/models';

@Component({
    selector: 'app-notification-center',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Trung tâm Thông báo</h1>
          <p class="text-sm text-slate-500 mt-1">{{ unreadCount }} thông báo chưa đọc</p>
        </div>
        <button class="btn-secondary" (click)="markAllRead()">Đánh dấu tất cả đã đọc</button>
      </div>
      <div class="space-y-3">
        <div *ngFor="let n of notifications" class="bg-white rounded-2xl border p-5 flex items-start gap-4 transition-all hover:shadow-md cursor-pointer"
          [ngClass]="n.isRead ? 'opacity-60' : ''" (click)="markRead(n)">
          <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            [ngClass]="{'bg-red-100 text-red-600': n.type==='ALERT', 'bg-amber-100 text-amber-600': n.type==='WARNING', 'bg-blue-100 text-blue-600': n.type==='INFO', 'bg-emerald-100 text-emerald-600': n.type==='SUCCESS'}">
            <svg *ngIf="n.type==='ALERT'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            <svg *ngIf="n.type==='WARNING'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <svg *ngIf="n.type==='INFO'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <svg *ngIf="n.type==='SUCCESS'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h4 class="font-semibold text-slate-800">{{ n.title }}</h4>
              <span *ngIf="!n.isRead" class="w-2 h-2 rounded-full bg-blue-500"></span>
            </div>
            <p class="text-sm text-slate-500 mt-1">{{ n.message }}</p>
            <div class="flex items-center gap-3 mt-2">
              <span class="text-xs text-slate-400">{{ n.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
              <span class="badge badge-neutral text-[10px]">{{ n.channel }}</span>
              <span class="badge badge-info text-[10px]">{{ n.targetAudience }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotificationCenterComponent implements OnInit {
    notifications: AppNotification[] = [];
    unreadCount = 0;
    constructor(private notificationService: NotificationService) { }
    ngOnInit() {
        this.notificationService.getAll().subscribe(n => { this.notifications = n; this.updateUnread(); });
    }
    markRead(n: AppNotification) { n.isRead = true; this.updateUnread(); }
    markAllRead() { this.notifications.forEach(n => n.isRead = true); this.updateUnread(); }
    updateUnread() { this.unreadCount = this.notifications.filter(n => !n.isRead).length; }
}
