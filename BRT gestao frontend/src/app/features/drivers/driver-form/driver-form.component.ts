import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DriverService } from '../../../core/services/data.service';

@Component({
    selector: 'app-driver-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">{{ isEdit ? 'Chỉnh sửa Tài xế' : 'Thêm Tài xế mới' }}</h1>
        <p class="text-sm text-slate-500 mt-1">UC-DRIVER-001 • Human Resources</p></div>
        <button class="btn-secondary" (click)="goBack()">← Quay lại</button>
      </div>

      <div class="bg-white rounded-2xl border p-6 space-y-6">
        <h3 class="card-title">Thông tin cá nhân</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label class="form-label">Họ tên *</label><input [(ngModel)]="form.fullName" class="form-input"/></div>
          <div><label class="form-label">Mã NV *</label><input [(ngModel)]="form.employeeCode" class="form-input" placeholder="DRV-XXX"/></div>
          <div><label class="form-label">CCCD *</label><input [(ngModel)]="form.nationalId" class="form-input"/></div>
          <div><label class="form-label">SĐT *</label><input [(ngModel)]="form.phone" class="form-input"/></div>
          <div><label class="form-label">Email</label><input [(ngModel)]="form.email" class="form-input" type="email"/></div>
          <div><label class="form-label">Địa chỉ</label><input [(ngModel)]="form.address" class="form-input"/></div>
        </div>

        <h3 class="card-title">Bằng lái xe</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><label class="form-label">Số bằng lái *</label><input [(ngModel)]="form.licenseNumber" class="form-input"/></div>
          <div><label class="form-label">Hạng bằng *</label>
            <select [(ngModel)]="form.licenseClass" class="form-select">
              <option value="D">Hạng D</option><option value="E">Hạng E</option><option value="F">Hạng F</option>
            </select></div>
          <div><label class="form-label">Ngày hết hạn</label><input [(ngModel)]="form.licenseExpiry" class="form-input" type="date"/></div>
          <div><label class="form-label">Cơ quan cấp</label><input [(ngModel)]="form.licenseAuthority" class="form-input"/></div>
        </div>

        <h3 class="card-title">Thông tin công việc</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label class="form-label">Ngày vào làm</label><input [(ngModel)]="form.hireDate" class="form-input" type="date"/></div>
          <div><label class="form-label">Phòng ban</label><input [(ngModel)]="form.department" class="form-input" placeholder="Đội xe 1"/></div>
          <div><label class="form-label">Cấp bậc</label>
            <select [(ngModel)]="form.rank" class="form-select">
              <option value="Tài xế mới">Tài xế mới</option><option value="Tài xế">Tài xế</option><option value="Tài xế chính">Tài xế chính</option>
            </select></div>
        </div>

        <h3 class="card-title">Đào tạo & Chứng chỉ</h3>
        <div class="flex flex-wrap gap-2">
          <span *ngFor="let cert of form.certifications; let i = index" class="badge badge-info flex items-center gap-1">
            {{ cert }} <button (click)="removeCert(i)" class="ml-1 text-xs">&times;</button>
          </span>
          <div class="flex items-center gap-2">
            <input [(ngModel)]="newCert" class="form-input w-40 text-xs" placeholder="Thêm chứng chỉ"/>
            <button class="btn-secondary text-xs" (click)="addCert()">+</button>
          </div>
        </div>

        <h3 class="card-title">Sức khỏe</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label class="form-label">Ngày khám gần nhất</label><input [(ngModel)]="form.healthCheckDate" class="form-input" type="date"/></div>
          <div><label class="form-label">Kết quả</label>
            <select [(ngModel)]="form.healthCheckResult" class="form-select">
              <option value="Đạt">Đạt</option><option value="Không đạt">Không đạt</option><option value="Cần tái khám">Cần tái khám</option>
            </select></div>
          <div><label class="form-label">Ngày tái khám</label><input [(ngModel)]="form.nextHealthCheckDate" class="form-input" type="date"/></div>
        </div>

        <div class="border-t pt-6 flex justify-end gap-3">
          <button class="btn-secondary" (click)="goBack()">Hủy</button>
          <button class="btn-primary" (click)="save()">{{ isEdit ? 'Cập nhật' : 'Thêm tài xế' }}</button>
        </div>
      </div>
    </div>
  `
})
export class DriverFormComponent implements OnInit {
    isEdit = false;
    newCert = '';
    form: any = {
        fullName: '', employeeCode: '', nationalId: '', phone: '', email: '', address: '',
        licenseNumber: '', licenseClass: 'D', licenseExpiry: '', licenseAuthority: 'Sở GTVT Hà Nội',
        hireDate: '', department: 'Đội xe 1', rank: 'Tài xế mới', certifications: ['BRT Certified'],
        healthCheckDate: '', healthCheckResult: 'Đạt', nextHealthCheckDate: ''
    };

    constructor(private driverService: DriverService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEdit = true;
            this.driverService.getById(id).subscribe(d => { if (d) this.form = { ...d, certifications: [...d.certifications] }; });
        }
    }
    addCert() { if (this.newCert.trim()) { this.form.certifications.push(this.newCert.trim()); this.newCert = ''; } }
    removeCert(i: number) { this.form.certifications.splice(i, 1); }
    save() { this.router.navigate(['/drivers']); }
    goBack() { this.router.navigate(['/drivers']); }
}
