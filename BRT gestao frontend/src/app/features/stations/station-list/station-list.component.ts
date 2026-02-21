import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StationService } from '../../../core/services/data.service';
import { Station } from '../../../core/models';

@Component({
  selector: 'app-station-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Quản lý Trạm dừng BRT</h1>
          <p class="text-sm text-slate-500 mt-1">Station Management - Tích hợp PostGIS + IoT</p>
        </div>
        <button class="btn-primary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg> Thêm trạm
        </button>
      </div>
      <div class="flex items-center gap-3">
        <input [(ngModel)]="search" placeholder="Tìm trạm..." class="form-input max-w-xs" />
        <select [(ngModel)]="filterType" class="form-select max-w-[180px]">
          <option value="">Tất cả loại</option>
          <option value="TERMINAL">Bến đầu cuối</option>
          <option value="TRANSFER_HUB">Hub trung chuyển</option>
          <option value="INLINE">Trạm tuyến</option>
        </select>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div *ngFor="let s of filtered" class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-lg transition-all">
          <div class="flex items-start justify-between mb-3">
            <div>
              <span class="text-lg font-bold text-slate-800">{{ s.code }}</span>
              <span class="badge ml-2" [ngClass]="s.status==='ACTIVE'?'badge-success':s.status==='CLOSED'?'badge-danger':'badge-warning'">
                {{ s.status==='ACTIVE'?'Hoạt động':s.status==='CLOSED'?'Đóng':'Sửa chữa' }}
              </span>
              <p class="text-sm text-slate-500 mt-1">{{ s.name }}</p>
            </div>
            <span class="badge badge-info">{{ getTypeLabel(s.stationType) }}</span>
          </div>
          <p class="text-xs text-slate-400 mb-3">{{ s.address }} - {{ s.district }}</p>
          <div class="grid grid-cols-3 gap-2 mb-3">
            <div class="text-center p-2 bg-slate-50 rounded-lg">
              <p class="text-sm font-bold">{{ s.capacity }}</p>
              <p class="text-[9px] text-slate-400">Sức chứa</p>
            </div>
            <div class="text-center p-2 bg-slate-50 rounded-lg">
              <p class="text-sm font-bold">{{ s.gateCount }}</p>
              <p class="text-[9px] text-slate-400">Cổng</p>
            </div>
            <div class="text-center p-2 bg-slate-50 rounded-lg">
              <p class="text-sm font-bold" [ngClass]="s.currentPassengers && s.currentPassengers > s.capacity*0.8 ? 'text-red-600' : 'text-emerald-600'">{{ s.currentPassengers || 0 }}</p>
              <p class="text-[9px] text-slate-400">HK hiện tại</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span *ngIf="s.hasTicketMachine" class="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">Máy vé</span>
            <span *ngIf="s.hasRealtimeDisplay" class="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">Bảng tin</span>
            <span *ngIf="s.hasWifi" class="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">Wifi</span>
            <span *ngIf="s.metroConnection" class="text-[10px] px-2 py-0.5 bg-red-50 text-red-600 rounded-full">Metro</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StationListComponent implements OnInit {
  stations: Station[] = [];
  search = '';
  filterType = '';
  constructor(private ss: StationService) {}
  ngOnInit() { this.ss.getAll().subscribe(s => this.stations = s); }
  get filtered() {
    return this.stations.filter(s =>
      (!this.search || s.name.toLowerCase().includes(this.search.toLowerCase()) || s.code.toLowerCase().includes(this.search.toLowerCase())) &&
      (!this.filterType || s.stationType === this.filterType)
    );
  }
  getTypeLabel(t: string) { return ({ TERMINAL: 'Bến', TRANSFER_HUB: 'Hub', INLINE: 'Tuyến', SIDE: 'Bên' } as any)[t] || t; }
}
