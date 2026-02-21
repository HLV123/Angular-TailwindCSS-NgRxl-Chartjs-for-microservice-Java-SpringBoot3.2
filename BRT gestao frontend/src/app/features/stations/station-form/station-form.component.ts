import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StationService } from '../../../core/services/data.service';

@Component({
    selector: 'app-station-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">{{ isEdit ? 'Chỉnh sửa Trạm' : 'Thêm Trạm BRT mới' }}</h1>
        <p class="text-sm text-slate-500 mt-1">UC-STATION-001 • PostGIS Point</p></div>
        <button class="btn-secondary" (click)="goBack()">← Quay lại</button>
      </div>

      <div class="bg-white rounded-2xl border p-6 space-y-6">
        <h3 class="card-title">Thông tin định danh</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label class="form-label">Mã trạm *</label><input [(ngModel)]="form.code" class="form-input" placeholder="S001"/></div>
          <div><label class="form-label">Tên trạm *</label><input [(ngModel)]="form.name" class="form-input" placeholder="Kim Mã"/></div>
          <div><label class="form-label">Tên tiếng Anh</label><input [(ngModel)]="form.nameEn" class="form-input"/></div>
        </div>

        <h3 class="card-title">Vị trí địa lý</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="form-label">Kinh độ</label><input type="number" [(ngModel)]="form.lng" class="form-input" step="0.0001"/></div>
          <div><label class="form-label">Vĩ độ</label><input type="number" [(ngModel)]="form.lat" class="form-input" step="0.0001"/></div>
          <div><label class="form-label">Địa chỉ</label><input [(ngModel)]="form.address" class="form-input"/></div>
          <div><label class="form-label">Quận/Huyện</label><input [(ngModel)]="form.district" class="form-input"/></div>
        </div>

        <h3 class="card-title">Thông số vật lý</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label class="form-label">Loại trạm</label>
            <select [(ngModel)]="form.stationType" class="form-select">
              <option value="INLINE">Inline</option><option value="SIDE">Side</option>
              <option value="TERMINAL">Terminal</option><option value="TRANSFER_HUB">Transfer Hub</option>
            </select></div>
          <div><label class="form-label">Số cổng</label><input type="number" [(ngModel)]="form.gateCount" class="form-input"/></div>
          <div><label class="form-label">Chiều dài sân ga (m)</label><input type="number" [(ngModel)]="form.platformLength" class="form-input"/></div>
          <div><label class="form-label">Sức chứa</label><input type="number" [(ngModel)]="form.capacity" class="form-input"/></div>
        </div>

        <h3 class="card-title">Tiện ích</h3>
        <div class="flex flex-wrap gap-4">
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form.hasCover" class="rounded"/> Mái che</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form.hasTicketMachine" class="rounded"/> Máy bán vé</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form.hasRealtimeDisplay" class="rounded"/> Màn hình</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form.hasWifi" class="rounded"/> WiFi</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form.hasToilet" class="rounded"/> WC</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form.hasElevator" class="rounded"/> Thang máy</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form.bikeParking" class="rounded"/> Xe đạp</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form.taxiStand" class="rounded"/> Taxi</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" [(ngModel)]="form.metroConnection" class="rounded"/> Metro</label>
        </div>

        <div class="border-t pt-6 flex justify-end gap-3">
          <button class="btn-secondary" (click)="goBack()">Hủy</button>
          <button class="btn-primary" (click)="save()">{{ isEdit ? 'Cập nhật' : 'Thêm trạm' }}</button>
        </div>
      </div>
    </div>
  `
})
export class StationFormComponent implements OnInit {
    isEdit = false;
    form: any = {
        code: '', name: '', nameEn: '', lat: 0, lng: 0, address: '', district: '',
        stationType: 'INLINE', gateCount: 2, platformLength: 18, capacity: 100,
        hasCover: true, hasTicketMachine: true, hasRealtimeDisplay: true, hasWifi: false,
        hasToilet: false, hasElevator: false, bikeParking: false, taxiStand: false, metroConnection: false
    };

    constructor(private stationService: StationService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEdit = true;
            this.stationService.getById(id).subscribe(s => { if (s) this.form = { ...s }; });
        }
    }
    save() { this.router.navigate(['/stations']); }
    goBack() { this.router.navigate(['/stations']); }
}
