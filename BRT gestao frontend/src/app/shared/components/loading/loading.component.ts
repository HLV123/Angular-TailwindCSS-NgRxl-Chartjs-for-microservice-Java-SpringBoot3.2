import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="show" class="flex items-center justify-center" [ngClass]="overlay ? 'fixed inset-0 bg-black/30 z-50' : 'py-12'">
      <div class="flex flex-col items-center gap-3" [ngClass]="overlay ? 'bg-white rounded-2xl p-8 shadow-xl' : ''">
        <div class="relative">
          <div class="w-10 h-10 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
        </div>
        <p *ngIf="message" class="text-sm text-slate-600 font-medium">{{ message }}</p>
      </div>
    </div>
  `
})
export class LoadingComponent {
    @Input() show = true;
    @Input() message = 'Đang tải...';
    @Input() overlay = false;
}
