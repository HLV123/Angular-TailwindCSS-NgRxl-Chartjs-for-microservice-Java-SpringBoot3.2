import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
    selector: 'app-vehicle-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">{{ isEdit ? 'Chỉnh sửa Phương tiện' : 'Đăng ký Phương tiện BRT mới' }}</h1>
        <p class="text-sm text-slate-500 mt-1">UC-FLEET-001 • Fleet Management</p></div>
        <button class="btn-secondary" (click)="goBack()">← Quay lại</button>
      </div>

      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Thông tin cơ bản</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label class="form-label">Biển số xe *</label><input [(ngModel)]="form.plateNumber" class="form-input" placeholder="29B-001.XX"/></div>
          <div><label class="form-label">Loại xe *</label>
            <select [(ngModel)]="form.vehicleType" class="form-select">
              <option value="ARTICULATED">Xe khớp nối (Articulated)</option><option value="STANDARD">Tiêu chuẩn</option>
              <option value="MINI">Mini BRT</option><option value="ELECTRIC">Xe điện</option>
            </select></div>
          <div><label class="form-label">Nhiên liệu *</label>
            <select [(ngModel)]="form.fuelType" class="form-select">
              <option value="DIESEL">Diesel</option><option value="CNG">CNG</option>
              <option value="ELECTRIC">Điện</option><option value="HYBRID">Hybrid</option>
            </select></div>
          <div><label class="form-label">Hãng SX</label><input [(ngModel)]="form.manufacturer" class="form-input"/></div>
          <div><label class="form-label">Model</label><input [(ngModel)]="form.model" class="form-input"/></div>
          <div><label class="form-label">Năm SX</label><input type="number" [(ngModel)]="form.manufactureYear" class="form-input"/></div>
        </div>

        <h3 class="card-title mb-4 mt-6">Sức chứa</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label class="form-label">Ghế ngồi</label><input type="number" [(ngModel)]="form.capacitySeated" class="form-input"/></div>
          <div><label class="form-label">Chỗ đứng</label><input type="number" [(ngModel)]="form.capacityStanding" class="form-input"/></div>
          <div><label class="form-label">GPS Device ID</label><input [(ngModel)]="form.gpsDeviceId" class="form-input"/></div>
        </div>

        <h3 class="card-title mb-4 mt-6">Thiết bị trên xe</h3>
        <div class="flex flex-wrap gap-4">
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form.hasCamera" class="rounded"/> Camera CCTV</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form.hasTicketScanner" class="rounded"/> Máy quẹt vé</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form.hasInfoDisplay" class="rounded"/> Màn hình thông tin</label>
        </div>

        <div class="border-t pt-6 mt-6 flex justify-end gap-3">
          <button class="btn-secondary" (click)="goBack()">Hủy</button>
          <button class="btn-primary" (click)="save()">{{ isEdit ? 'Cập nhật' : 'Đăng ký xe' }}</button>
        </div>
      </div>
    </div>
  `
})
export class VehicleFormComponent implements OnInit {
    isEdit = false;
    form: any = {
        plateNumber: '', vehicleType: 'STANDARD', fuelType: 'DIESEL', manufacturer: '', model: '',
        manufactureYear: new Date().getFullYear(), capacitySeated: 35, capacityStanding: 50,
        gpsDeviceId: '', hasCamera: true, hasTicketScanner: true, hasInfoDisplay: true
    };

    constructor(private vehicleService: VehicleService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEdit = true;
            this.vehicleService.getById(id).subscribe(v => { if (v) this.form = { ...v }; });
        }
    }
    save() { this.router.navigate(['/vehicles']); }
    goBack() { this.router.navigate(['/vehicles']); }
}
