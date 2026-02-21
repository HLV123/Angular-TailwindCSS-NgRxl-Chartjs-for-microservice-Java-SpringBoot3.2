import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouteService } from '../../../core/services/route.service';
import { BrtRoute } from '../../../core/models';

@Component({
    selector: 'app-route-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="page-title">{{ isEdit ? 'Chỉnh sửa tuyến' : 'Tạo tuyến BRT mới' }}</h1>
          <p class="text-sm text-slate-500 mt-1">UC-ROUTE-001 • PostGIS LineString + Neo4j Sync</p>
        </div>
        <button class="btn-secondary" (click)="goBack()">← Quay lại</button>
      </div>

      <div class="bg-white rounded-2xl border p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label class="form-label">Mã tuyến *</label><input [(ngModel)]="form.code" class="form-input" placeholder="VD: BRT-01" [disabled]="isEdit"/></div>
          <div><label class="form-label">Tên tuyến *</label><input [(ngModel)]="form.name" class="form-input" placeholder="VD: Kim Mã - Yên Nghĩa"/></div>
          <div><label class="form-label">Loại tuyến *</label>
            <select [(ngModel)]="form.routeType" class="form-select">
              <option value="MAIN">Tuyến chính</option><option value="BRANCH">Tuyến nhánh</option>
              <option value="NIGHT">Tuyến đêm</option><option value="SPECIAL">Tuyến đặc biệt</option>
            </select>
          </div>
          <div><label class="form-label">Trạng thái</label>
            <select [(ngModel)]="form.status" class="form-select">
              <option value="DRAFT">Nháp</option><option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Ngừng HĐ</option><option value="SUSPENDED">Tạm treo</option>
            </select>
          </div>
          <div><label class="form-label">Tổng chiều dài (km)</label><input type="number" [(ngModel)]="form.totalLengthKm" class="form-input" step="0.1"/></div>
          <div><label class="form-label">Thời gian trung bình (phút)</label><input type="number" [(ngModel)]="form.avgTravelTimeMin" class="form-input"/></div>
          <div><label class="form-label">Màu hiển thị</label><input type="color" [(ngModel)]="form.color" class="h-10 w-20 rounded-lg border cursor-pointer"/></div>
        </div>
        <div><label class="form-label">Mô tả</label><textarea [(ngModel)]="form.description" class="form-input" rows="3" placeholder="Mô tả tuyến BRT..."></textarea></div>

        <div class="border-t pt-6">
          <h3 class="card-title mb-3">Danh sách trạm dừng trên tuyến</h3>
          <p class="text-xs text-slate-400 mb-4">Các trạm sẽ được chỉ định khi tích hợp bản đồ GIS (PostGIS linestring). Hiện tại có thể thêm thủ công.</p>
          <div *ngFor="let s of form.stations; let i = index" class="flex items-center gap-3 mb-2 p-3 bg-slate-50 rounded-lg">
            <span class="text-xs font-mono text-slate-400 w-6">{{ i+1 }}</span>
            <input [(ngModel)]="s.stationName" class="form-input flex-1" placeholder="Tên trạm"/>
            <input [(ngModel)]="s.stationCode" class="form-input w-24" placeholder="Mã"/>
            <input type="number" [(ngModel)]="s.distanceFromStartKm" class="form-input w-24" placeholder="km" step="0.1"/>
            <button (click)="removeStation(i)" class="text-red-400 hover:text-red-600 text-lg">&times;</button>
          </div>
          <button (click)="addStation()" class="btn-secondary text-xs mt-2">+ Thêm trạm</button>
        </div>

        <div class="border-t pt-6 flex justify-end gap-3">
          <button class="btn-secondary" (click)="goBack()">Hủy</button>
          <button class="btn-primary" (click)="save()">{{ isEdit ? 'Cập nhật' : 'Tạo tuyến' }}</button>
        </div>
      </div>
    </div>
  `
})
export class RouteFormComponent implements OnInit {
    isEdit = false;
    form: any = { code: '', name: '', routeType: 'MAIN', status: 'DRAFT', description: '', totalLengthKm: 0, avgTravelTimeMin: 0, color: '#1a56db', stations: [] };

    constructor(private routeService: RouteService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEdit = true;
            this.routeService.getById(id).subscribe(r => {
                if (r) this.form = { ...r };
            });
        }
    }

    addStation() {
        this.form.stations.push({
            stationId: 'new-' + Date.now(), stationName: '', stationCode: '',
            order: this.form.stations.length + 1, distanceFromStartKm: 0, travelTimeFromPrevMin: 0, lat: 0, lng: 0
        });
    }

    removeStation(i: number) { this.form.stations.splice(i, 1); }

    save() { this.router.navigate(['/routes']); }
    goBack() { this.router.navigate(['/routes']); }
}
