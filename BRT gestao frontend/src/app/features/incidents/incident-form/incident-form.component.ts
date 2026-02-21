import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MOCK_ROUTES, MOCK_VEHICLES, MOCK_STATIONS } from '../../../core/mock-data';

@Component({
    selector: 'app-incident-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Báo cáo Sự cố mới</h1>
        <p class="text-sm text-slate-500 mt-1">UC-INCIDENT-001 • Event Detection & Resolution</p></div>
        <button class="btn-secondary" (click)="goBack()">← Quay lại</button>
      </div>

      <div class="bg-white rounded-2xl border p-6 space-y-6">
        <div><label class="form-label">Tiêu đề sự cố *</label><input [(ngModel)]="form.title" class="form-input" placeholder="Mô tả ngắn gọn sự cố"/></div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="form-label">Loại sự cố *</label>
            <select [(ngModel)]="form.type" class="form-select">
              <option value="ACCIDENT">Tai nạn</option><option value="BREAKDOWN">Hỏng xe</option>
              <option value="DELAY">Trễ giờ</option><option value="OVERCROWDING">Quá tải</option>
              <option value="EQUIPMENT_FAILURE">Thiết bị hỏng</option><option value="SPEEDING">Vi phạm tốc độ</option>
              <option value="OFF_ROUTE">Lệch tuyến</option><option value="AC_FAILURE">Điều hòa hỏng</option>
              <option value="PASSENGER_COMPLAINT">Khiếu nại HK</option><option value="OTHER">Khác</option>
            </select></div>
          <div><label class="form-label">Mức độ nghiêm trọng *</label>
            <select [(ngModel)]="form.severity" class="form-select">
              <option value="P1">P1 - Khẩn cấp (xử lý ngay)</option>
              <option value="P2">P2 - Cao (&lt; 15 phút)</option>
              <option value="P3">P3 - Trung bình (&lt; 1 giờ)</option>
              <option value="P4">P4 - Thấp (&lt; 24 giờ)</option>
            </select></div>
        </div>

        <div><label class="form-label">Mô tả chi tiết *</label>
          <textarea [(ngModel)]="form.description" class="form-input" rows="4" placeholder="Mô tả chi tiết sự cố, hoàn cảnh xảy ra, mức độ ảnh hưởng..."></textarea></div>

        <h3 class="card-title">Liên quan đến</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label class="form-label">Xe BRT</label>
            <select [(ngModel)]="form.vehicleId" class="form-select">
              <option value="">-- Không --</option>
              <option *ngFor="let v of vehicles" [value]="v.id">{{ v.plateNumber }} ({{ v.vehicleType }})</option>
            </select></div>
          <div><label class="form-label">Tuyến</label>
            <select [(ngModel)]="form.routeId" class="form-select">
              <option value="">-- Không --</option>
              <option *ngFor="let r of routes" [value]="r.id">{{ r.code }} - {{ r.name }}</option>
            </select></div>
          <div><label class="form-label">Trạm</label>
            <select [(ngModel)]="form.stationId" class="form-select">
              <option value="">-- Không --</option>
              <option *ngFor="let s of stations" [value]="s.id">{{ s.code }} - {{ s.name }}</option>
            </select></div>
        </div>

        <div class="p-4 bg-blue-50 rounded-xl">
          <p class="text-xs text-blue-600">📍 Vị trí có thể tự động phát hiện từ GPS thiết bị. Trong production sẽ tích hợp Geolocation API.</p>
        </div>

        <div class="border-t pt-6 flex justify-end gap-3">
          <button class="btn-secondary" (click)="goBack()">Hủy</button>
          <button class="btn-primary" (click)="submit()">Gửi báo cáo sự cố</button>
        </div>
      </div>
    </div>
  `
})
export class IncidentFormComponent {
    routes = MOCK_ROUTES;
    vehicles = MOCK_VEHICLES.filter(v => v.currentStatus !== 'DECOMMISSIONED');
    stations = MOCK_STATIONS;
    form: any = { title: '', type: 'BREAKDOWN', severity: 'P3', description: '', vehicleId: '', routeId: '', stationId: '' };

    constructor(private router: Router) { }
    submit() { this.router.navigate(['/incidents']); }
    goBack() { this.router.navigate(['/incidents']); }
}
