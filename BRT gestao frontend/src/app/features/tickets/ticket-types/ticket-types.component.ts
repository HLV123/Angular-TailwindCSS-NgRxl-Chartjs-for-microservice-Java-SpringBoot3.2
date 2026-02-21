import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../core/services/data.service';
import { TicketType } from '../../../core/models';

@Component({
    selector: 'app-ticket-types',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Quản lý Loại vé</h1><p class="text-sm text-slate-500 mt-1">UC-TICKET-001 • Fare Configuration</p></div>
        <button class="btn-primary flex items-center gap-2" (click)="showForm = true">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Thêm loại vé
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let tt of ticketTypes" class="bg-white rounded-2xl border p-5 hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-3">
            <span class="badge badge-info text-xs">{{ tt.code }}</span>
            <span class="font-bold text-lg text-blue-600">{{ formatCurrency(tt.price) }}</span>
          </div>
          <h3 class="font-semibold text-slate-800">{{ tt.name }}</h3>
          <p class="text-xs text-slate-500 mt-1">{{ tt.description }}</p>
          <div class="flex items-center gap-2 mt-3 text-xs text-slate-400">
            <span class="badge" [ngClass]="tt.isActive ? 'badge-success' : 'badge-neutral'">{{ tt.isActive ? 'Active' : 'Inactive' }}</span>
            <span>Hạn {{ tt.validityDays }} ngày</span>
            <span *ngIf="tt.maxTrips">Max {{ tt.maxTrips }} lượt</span>
          </div>
          <div class="flex gap-2 mt-3">
            <button class="btn-secondary text-xs flex-1" (click)="editType(tt)">Sửa</button>
            <button class="px-3 py-1.5 rounded-lg text-xs text-red-600 bg-red-50 hover:bg-red-100 transition-colors">Xóa</button>
          </div>
        </div>
      </div>

      <!-- Form Modal -->
      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content w-full max-w-lg mx-4" (click)="$event.stopPropagation()">
          <div class="p-6 border-b"><h2 class="text-xl font-bold">{{ editingType ? 'Sửa loại vé' : 'Thêm loại vé mới' }}</h2></div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div><label class="form-label">Mã loại vé</label><input [(ngModel)]="form.code" class="form-input"/></div>
              <div><label class="form-label">Tên</label><input [(ngModel)]="form.name" class="form-input"/></div>
            </div>
            <div><label class="form-label">Mô tả</label><textarea [(ngModel)]="form.description" class="form-input" rows="2"></textarea></div>
            <div class="grid grid-cols-3 gap-4">
              <div><label class="form-label">Giá (VNĐ)</label><input type="number" [(ngModel)]="form.price" class="form-input"/></div>
              <div><label class="form-label">Hạn (ngày)</label><input type="number" [(ngModel)]="form.validityDays" class="form-input"/></div>
              <div><label class="form-label">Max lượt</label><input type="number" [(ngModel)]="form.maxTrips" class="form-input" placeholder="0=Unlimited"/></div>
            </div>
          </div>
          <div class="p-6 border-t flex justify-end gap-3">
            <button class="btn-secondary" (click)="showForm = false">Hủy</button>
            <button class="btn-primary" (click)="saveType()">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TicketTypesComponent implements OnInit {
    ticketTypes: TicketType[] = [];
    showForm = false;
    editingType: TicketType | null = null;
    form: any = { code: '', name: '', description: '', price: 0, validityDays: 30, maxTrips: 0, isActive: true };

    constructor(private ticketService: TicketService) { }
    ngOnInit() { this.ticketService.getTicketTypes().subscribe(t => this.ticketTypes = t); }

    editType(tt: TicketType) { this.editingType = tt; this.form = { ...tt }; this.showForm = true; }
    saveType() { this.showForm = false; this.editingType = null; }
    formatCurrency(n: number): string {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);
    }
}
