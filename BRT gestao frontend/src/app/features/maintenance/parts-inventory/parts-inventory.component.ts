import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from '../../../core/services/data.service';
import { SparePart } from '../../../core/models';

@Component({
    selector: 'app-parts-inventory',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Kho phụ tùng</h1><p class="text-sm text-slate-500 mt-1">Spare Parts Inventory Management</p></div>
        <button class="btn-primary" (click)="showForm = true">+ Thêm phụ tùng</button>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border p-5 text-center"><p class="text-3xl font-bold text-blue-600">{{ parts.length }}</p><p class="text-xs text-slate-500 mt-1">Loại phụ tùng</p></div>
        <div class="bg-white rounded-2xl border p-5 text-center"><p class="text-3xl font-bold text-emerald-600">{{ totalStock }}</p><p class="text-xs text-slate-500 mt-1">Tổng tồn kho</p></div>
        <div class="bg-white rounded-2xl border p-5 text-center"><p class="text-3xl font-bold text-red-600">{{ lowStockCount }}</p><p class="text-xs text-slate-500 mt-1">Dưới mức tối thiểu</p></div>
        <div class="bg-white rounded-2xl border p-5 text-center"><p class="text-3xl font-bold text-purple-600">{{ formatCurrency(totalValue) }}</p><p class="text-xs text-slate-500 mt-1">Tổng giá trị</p></div>
      </div>

      <div class="flex items-center gap-3">
        <input [(ngModel)]="searchTerm" placeholder="Tìm phụ tùng..." class="form-input max-w-xs"/>
        <select [(ngModel)]="filterCategory" class="form-select max-w-[160px]">
          <option value="">Tất cả nhóm</option>
          <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
        </select>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="showLowOnly" class="rounded"/> Chỉ hiện tồn thấp</label>
      </div>

      <div class="bg-white rounded-2xl border overflow-hidden">
        <div class="table-container"><table class="data-table">
          <thead><tr><th>Mã</th><th>Phụ tùng</th><th>Nhóm</th><th>Tồn kho</th><th>Tối thiểu</th><th>NCC</th><th>Trạng thái</th></tr></thead>
          <tbody>
            <tr *ngFor="let sp of filteredParts" class="hover:bg-slate-50">
              <td class="font-mono text-xs">{{ sp.code }}</td>
              <td><p class="font-medium text-sm">{{ sp.name }}</p></td>
              <td><span class="badge badge-info text-[10px]">{{ sp.category }}</span></td>
              <td class="font-bold text-lg" [ngClass]="sp.currentStock <= sp.minStock ? 'text-red-600' : 'text-slate-800'">{{ sp.currentStock }}</td>
              <td class="text-slate-400">{{ sp.minStock }}</td>
              <td class="text-sm text-slate-600">{{ sp.supplier }}</td>
              <td>
                <span class="badge" [ngClass]="sp.currentStock <= sp.minStock ? 'badge-danger' : sp.currentStock <= sp.minStock * 1.5 ? 'badge-warning' : 'badge-success'">
                  {{ sp.currentStock <= sp.minStock ? '⚠️ Cần đặt' : sp.currentStock <= sp.minStock * 1.5 ? 'Sắp hết' : '✓ Đủ' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table></div>
      </div>

      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content w-full max-w-lg mx-4" (click)="$event.stopPropagation()">
          <div class="p-6 border-b"><h2 class="text-xl font-bold">Thêm phụ tùng</h2></div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div><label class="form-label">Mã</label><input [(ngModel)]="form.code" class="form-input"/></div>
              <div><label class="form-label">Tên</label><input [(ngModel)]="form.name" class="form-input"/></div>
              <div><label class="form-label">Nhóm</label><input [(ngModel)]="form.category" class="form-input"/></div>
              <div><label class="form-label">NCC</label><input [(ngModel)]="form.supplier" class="form-input"/></div>
              <div><label class="form-label">Tồn kho</label><input type="number" [(ngModel)]="form.currentStock" class="form-input"/></div>
              <div><label class="form-label">Mức tối thiểu</label><input type="number" [(ngModel)]="form.minStock" class="form-input"/></div>
              <div><label class="form-label">Giá/đơn vị</label><input type="number" [(ngModel)]="form.unitPrice" class="form-input"/></div>
            </div>
          </div>
          <div class="p-6 border-t flex justify-end gap-3">
            <button class="btn-secondary" (click)="showForm = false">Hủy</button>
            <button class="btn-primary" (click)="showForm = false">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PartsInventoryComponent implements OnInit {
    parts: SparePart[] = [];
    searchTerm = ''; filterCategory = ''; showLowOnly = false;
    showForm = false;
    form: any = { code: '', name: '', category: '', supplier: '', currentStock: 0, minStock: 5, unitPrice: 0 };

    constructor(private ms: MaintenanceService) { }
    ngOnInit() { this.ms.getSpareParts().subscribe(s => this.parts = s); }

    get totalStock() { return this.parts.reduce((a, p) => a + p.currentStock, 0); }
    get lowStockCount() { return this.parts.filter(p => p.currentStock <= p.minStock).length; }
    get totalValue() { return this.parts.reduce((a, p) => a + p.currentStock * p.unitPrice, 0); }
    get categories() { return [...new Set(this.parts.map(p => p.category))]; }

    get filteredParts() {
        return this.parts.filter(p =>
            (!this.searchTerm || p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || p.code.includes(this.searchTerm)) &&
            (!this.filterCategory || p.category === this.filterCategory) &&
            (!this.showLowOnly || p.currentStock <= p.minStock)
        );
    }
    formatCurrency(n: number) { return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n); }
}
