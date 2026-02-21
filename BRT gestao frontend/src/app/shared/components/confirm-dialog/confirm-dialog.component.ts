import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="show" class="modal-overlay" (click)="onCancel()">
      <div class="modal-content w-full max-w-md mx-4" (click)="$event.stopPropagation()">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" [ngClass]="typeClass">
              <span class="text-lg">{{ typeIcon }}</span>
            </div>
            <h3 class="text-lg font-bold text-slate-800">{{ title }}</h3>
          </div>
          <p class="text-sm text-slate-600 ml-13">{{ message }}</p>
        </div>
        <div class="p-4 border-t bg-slate-50 rounded-b-2xl flex justify-end gap-3">
          <button class="btn-secondary" (click)="onCancel()">{{ cancelText }}</button>
          <button [ngClass]="confirmClass" (click)="onConfirm()">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
    @Input() show = false;
    @Input() title = 'Xác nhận';
    @Input() message = 'Bạn có chắc chắn muốn thực hiện?';
    @Input() confirmText = 'Xác nhận';
    @Input() cancelText = 'Hủy';
    @Input() type: 'danger' | 'warning' | 'info' = 'warning';
    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    get typeClass(): string {
        return { danger: 'bg-red-100 text-red-600', warning: 'bg-amber-100 text-amber-600', info: 'bg-blue-100 text-blue-600' }[this.type];
    }
    get typeIcon(): string {
        return { danger: '⚠️', warning: '❓', info: 'ℹ️' }[this.type];
    }
    get confirmClass(): string {
        return this.type === 'danger' ? 'px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors' : 'btn-primary';
    }
    onConfirm() { this.confirmed.emit(); }
    onCancel() { this.cancelled.emit(); }
}
