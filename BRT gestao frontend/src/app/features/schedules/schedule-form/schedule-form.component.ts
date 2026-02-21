import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../../core/services/data.service';

@Component({
    selector: 'app-schedule-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">{{ isEdit ? 'Chỉnh sửa Lịch trình' : 'Tạo Lịch trình mới' }}</h1>
        <p class="text-sm text-slate-500 mt-1">UC-SCHED-001 • Scheduling & Timetable</p></div>
        <button class="btn-secondary" (click)="goBack()">← Quay lại</button>
      </div>

      <div class="bg-white rounded-2xl border p-6 space-y-6">
        <h3 class="card-title">Thông tin tuyến & Thời gian</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label class="form-label">Tuyến BRT *</label>
            <select [(ngModel)]="form.routeCode" class="form-select">
              <option value="BRT-01">BRT-01 (Kim Mã - Yên Nghĩa)</option>
              <option value="BRT-02">BRT-02 (Cầu Giấy - Hà Đông)</option>
              <option value="BRT-03">BRT-03 (Đông Anh - Hoàn Kiếm)</option>
              <option value="BRT-N1">BRT-N1 (Tuyến đêm)</option>
            </select></div>
          <div><label class="form-label">Loại lịch trình</label>
            <select [(ngModel)]="form.scheduleType" class="form-select">
              <option value="WEEKDAY">Ngày thường</option><option value="WEEKEND">Cuối tuần</option>
              <option value="HOLIDAY">Ngày lễ</option><option value="SPECIAL_EVENT">Sự kiện đặc biệt</option>
            </select></div>
          <div><label class="form-label">Trạng thái</label>
            <select [(ngModel)]="form.status" class="form-select">
              <option value="DRAFT">Nháp</option><option value="APPROVED">Đã duyệt</option><option value="ACTIVE">Đang áp dụng</option>
            </select></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="form-label">Bắt đầu hoạt động</label><input type="time" [(ngModel)]="form.operatingHoursStart" class="form-input"/></div>
          <div><label class="form-label">Kết thúc hoạt động</label><input type="time" [(ngModel)]="form.operatingHoursEnd" class="form-input"/></div>
          <div><label class="form-label">Ngày áp dụng</label><input type="date" [(ngModel)]="form.effectiveDate" class="form-input"/></div>
          <div><label class="form-label">Ngày kết thúc</label><input type="date" [(ngModel)]="form.endDate" class="form-input"/></div>
        </div>

        <h3 class="card-title">Tần suất (phút/chuyến)</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-red-50 rounded-xl">
            <label class="form-label text-red-700">🔴 Cao điểm</label>
            <input type="number" [(ngModel)]="form.peakFrequencyMin" class="form-input" min="1"/>
            <p class="text-xs text-red-400 mt-1">6:30-8:30, 17:00-19:00</p>
          </div>
          <div class="p-4 bg-amber-50 rounded-xl">
            <label class="form-label text-amber-700">🟡 Bình thường</label>
            <input type="number" [(ngModel)]="form.normalFrequencyMin" class="form-input" min="1"/>
            <p class="text-xs text-amber-400 mt-1">8:30-17:00</p>
          </div>
          <div class="p-4 bg-blue-50 rounded-xl">
            <label class="form-label text-blue-700">🔵 Thấp điểm</label>
            <input type="number" [(ngModel)]="form.offPeakFrequencyMin" class="form-input" min="1"/>
            <p class="text-xs text-blue-400 mt-1">19:00-23:00</p>
          </div>
        </div>

        <h3 class="card-title">Nhu cầu nguồn lực</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="form-label">Số xe tối thiểu</label><input type="number" [(ngModel)]="form.requiredVehicles" class="form-input"/></div>
          <div><label class="form-label">Số tài xế cần</label><input type="number" [(ngModel)]="form.requiredDrivers" class="form-input"/></div>
        </div>

        <div class="border-t pt-6 flex justify-end gap-3">
          <button class="btn-secondary" (click)="goBack()">Hủy</button>
          <button class="btn-primary" (click)="save()">{{ isEdit ? 'Cập nhật' : 'Tạo lịch trình' }}</button>
        </div>
      </div>
    </div>
  `
})
export class ScheduleFormComponent implements OnInit {
    isEdit = false;
    form: any = {
        routeCode: 'BRT-01', scheduleType: 'WEEKDAY', status: 'DRAFT',
        operatingHoursStart: '05:00', operatingHoursEnd: '23:00',
        effectiveDate: '', endDate: '',
        peakFrequencyMin: 5, normalFrequencyMin: 10, offPeakFrequencyMin: 15,
        requiredVehicles: 8, requiredDrivers: 12
    };

    constructor(private scheduleService: ScheduleService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEdit = true;
            this.scheduleService.getById(id).subscribe(s => { if (s) this.form = { ...s }; });
        }
    }
    save() { this.router.navigate(['/schedules']); }
    goBack() { this.router.navigate(['/schedules']); }
}
