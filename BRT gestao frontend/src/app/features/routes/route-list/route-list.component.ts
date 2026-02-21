import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouteService } from '../../../core/services/route.service';
import { BrtRoute } from '../../../core/models';

@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Quản lý Tuyến BRT</h1>
          <p class="text-sm text-slate-500 mt-1">Quản lý tuyến đường, trạm dừng và hành trình • Tích hợp PostGIS + Neo4j</p>
        </div>
        <button class="btn-primary flex items-center gap-2" (click)="showForm = true">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Tạo tuyến mới
        </button>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-3">
        <input [(ngModel)]="searchTerm" placeholder="Tìm kiếm tuyến..." class="form-input max-w-xs" />
        <select [(ngModel)]="filterType" class="form-select max-w-[160px]">
          <option value="">Tất cả loại</option>
          <option value="MAIN">Tuyến chính</option>
          <option value="BRANCH">Tuyến nhánh</option>
          <option value="NIGHT">Tuyến đêm</option>
          <option value="SPECIAL">Đặc biệt</option>
        </select>
        <select [(ngModel)]="filterStatus" class="form-select max-w-[160px]">
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="INACTIVE">Ngừng hoạt động</option>
          <option value="DRAFT">Nháp</option>
        </select>
      </div>

      <!-- Routes Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div *ngFor="let route of filteredRoutes" class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group">
          <div class="h-2" [style.backgroundColor]="route.color"></div>
          <div class="p-5">
            <div class="flex items-start justify-between mb-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-slate-800">{{ route.code }}</span>
                  <span class="badge" [ngClass]="{'badge-success': route.status==='ACTIVE', 'badge-neutral': route.status==='INACTIVE', 'badge-info': route.status==='DRAFT'}">
                    {{ getStatusLabel(route.status) }}
                  </span>
                </div>
                <p class="text-sm text-slate-500 mt-1">{{ route.name }}</p>
              </div>
              <span class="badge" [ngClass]="{'badge-info': route.routeType==='MAIN', 'badge-warning': route.routeType==='BRANCH', 'bg-purple-100 text-purple-700': route.routeType==='NIGHT', 'badge-danger': route.routeType==='SPECIAL'}">
                {{ getTypeLabel(route.routeType) }}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-3 mb-4">
              <div class="text-center p-2 bg-slate-50 rounded-lg">
                <p class="text-lg font-bold text-slate-800">{{ route.totalLengthKm }}</p>
                <p class="text-[10px] text-slate-400 uppercase">km</p>
              </div>
              <div class="text-center p-2 bg-slate-50 rounded-lg">
                <p class="text-lg font-bold text-slate-800">{{ route.stations.length }}</p>
                <p class="text-[10px] text-slate-400 uppercase">Trạm</p>
              </div>
              <div class="text-center p-2 bg-slate-50 rounded-lg">
                <p class="text-lg font-bold text-slate-800">{{ route.avgTravelTimeMin }}</p>
                <p class="text-[10px] text-slate-400 uppercase">Phút</p>
              </div>
            </div>

            <!-- Stations preview -->
            <div class="flex items-center gap-1 mb-4">
              <span class="text-xs font-medium text-slate-500">{{ route.stations[0]?.stationName }}</span>
              <div class="flex-1 border-t-2 border-dashed mx-1" [style.borderColor]="route.color"></div>
              <span class="text-xs font-medium text-slate-500">{{ route.stations[route.stations.length-1]?.stationName }}</span>
            </div>

            <div class="flex items-center gap-2">
              <button class="btn-secondary text-xs flex-1" routerLink="/routes/{{route.id}}">Chi tiết</button>
              <button class="btn-secondary text-xs" (click)="editRoute(route)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content w-full max-w-2xl mx-4" (click)="$event.stopPropagation()">
          <div class="p-6 border-b border-slate-100">
            <h2 class="text-xl font-bold text-slate-800">{{ editingRoute ? 'Chỉnh sửa tuyến' : 'Tạo tuyến BRT mới' }}</h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div><label class="form-label">Mã tuyến</label><input [(ngModel)]="formData.code" class="form-input" placeholder="VD: BRT-04" /></div>
              <div><label class="form-label">Loại tuyến</label>
                <select [(ngModel)]="formData.routeType" class="form-select">
                  <option value="MAIN">Tuyến chính</option><option value="BRANCH">Tuyến nhánh</option><option value="NIGHT">Tuyến đêm</option><option value="SPECIAL">Đặc biệt</option>
                </select>
              </div>
            </div>
            <div><label class="form-label">Tên tuyến</label><input [(ngModel)]="formData.name" class="form-input" placeholder="VD: Cầu Giấy - Hà Đông" /></div>
            <div><label class="form-label">Mô tả</label><textarea [(ngModel)]="formData.description" class="form-input" rows="2" placeholder="Mô tả tuyến..."></textarea></div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="form-label">Tổng chiều dài (km)</label><input type="number" [(ngModel)]="formData.totalLengthKm" class="form-input" /></div>
              <div><label class="form-label">Thời gian trung bình (phút)</label><input type="number" [(ngModel)]="formData.avgTravelTimeMin" class="form-input" /></div>
            </div>
            <div class="p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
              <p class="font-semibold">💡 Tích hợp Backend</p>
              <p class="text-xs mt-1">Khi kết nối backend: Vẽ hành trình trên bản đồ GIS (PostGIS linestring), đồng bộ Neo4j graph, và WebSocket broadcast cập nhật.</p>
            </div>
          </div>
          <div class="p-6 border-t border-slate-100 flex justify-end gap-3">
            <button class="btn-secondary" (click)="showForm = false">Hủy</button>
            <button class="btn-primary" (click)="saveRoute()">{{ editingRoute ? 'Cập nhật' : 'Tạo tuyến' }}</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RouteListComponent implements OnInit {
  routes: BrtRoute[] = [];
  searchTerm = '';
  filterType = '';
  filterStatus = '';
  showForm = false;
  editingRoute: BrtRoute | null = null;
  formData: any = { code: '', name: '', routeType: 'MAIN', description: '', totalLengthKm: 0, avgTravelTimeMin: 0, color: '#1a56db' };

  constructor(private routeService: RouteService) {}
  ngOnInit() { this.routeService.getAll().subscribe(r => this.routes = r); }

  get filteredRoutes() {
    return this.routes.filter(r =>
      (!this.searchTerm || r.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || r.code.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (!this.filterType || r.routeType === this.filterType) &&
      (!this.filterStatus || r.status === this.filterStatus)
    );
  }

  getStatusLabel(s: string) { return { ACTIVE: 'Hoạt động', INACTIVE: 'Ngừng', DRAFT: 'Nháp', SUSPENDED: 'Tạm ngừng' }[s] || s; }
  getTypeLabel(t: string) { return { MAIN: 'Chính', BRANCH: 'Nhánh', NIGHT: 'Đêm', SPECIAL: 'Đặc biệt' }[t] || t; }
  editRoute(r: BrtRoute) { this.editingRoute = r; this.formData = { ...r }; this.showForm = true; }

  saveRoute() {
    if (this.editingRoute) {
      this.routeService.update(this.editingRoute.id, this.formData).subscribe(r => {
        const idx = this.routes.findIndex(x => x.id === r.id);
        if (idx >= 0) this.routes[idx] = r;
        this.showForm = false; this.editingRoute = null;
      });
    } else {
      this.routeService.create({ ...this.formData, status: 'DRAFT', stations: [] }).subscribe(r => {
        this.routes.push(r); this.showForm = false;
      });
    }
  }
}
