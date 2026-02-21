import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

export interface Toast {
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toasts$ = new BehaviorSubject<Toast[]>([]);
    private counter = 0;
    get toasts() { return this.toasts$.asObservable(); }

    show(type: Toast['type'], title: string, message?: string, duration = 4000) {
        const id = ++this.counter;
        const toast: Toast = { id, type, title, message, duration };
        this.toasts$.next([...this.toasts$.value, toast]);
        if (duration > 0) setTimeout(() => this.remove(id), duration);
    }

    success(title: string, message?: string) { this.show('success', title, message); }
    error(title: string, message?: string) { this.show('error', title, message, 6000); }
    warning(title: string, message?: string) { this.show('warning', title, message); }
    info(title: string, message?: string) { this.show('info', title, message); }

    remove(id: number) {
        this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
    }
}

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-4 right-4 z-[100] space-y-2 max-w-sm">
      <div *ngFor="let toast of toasts"
        class="flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm animate-slide-in"
        [ngClass]="getClass(toast.type)">
        <span class="text-lg mt-0.5">{{ getIcon(toast.type) }}</span>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm">{{ toast.title }}</p>
          <p *ngIf="toast.message" class="text-xs opacity-80 mt-0.5">{{ toast.message }}</p>
        </div>
        <button (click)="remove(toast.id)" class="text-current opacity-50 hover:opacity-100 text-lg leading-none">&times;</button>
      </div>
    </div>
  `,
    styles: [`
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .animate-slide-in { animation: slideIn 0.3s ease-out; }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
    toasts: Toast[] = [];
    private sub!: Subscription;
    constructor(private toastService: ToastService) { }
    ngOnInit() { this.sub = this.toastService.toasts.subscribe(t => this.toasts = t); }
    ngOnDestroy() { this.sub?.unsubscribe(); }
    remove(id: number) { this.toastService.remove(id); }
    getIcon(type: string): string { return { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }[type] || ''; }
    getClass(type: string): string {
        return {
            success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
            error: 'bg-red-50 border-red-200 text-red-800',
            warning: 'bg-amber-50 border-amber-200 text-amber-800',
            info: 'bg-blue-50 border-blue-200 text-blue-800'
        }[type] || '';
    }
}
