import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../core/services/data.service';
import { RoutePerformance, RevenueReport } from '../../../core/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Báo cáo Vận hành</h1><p class="text-sm text-slate-500 mt-1">UC-REPORT-001 • Operational Reports</p></div>
        <div class="flex gap-2">
          <select [(ngModel)]="reportType" class="form-select max-w-[180px]">
            <option value="performance">Hiệu suất tuyến</option><option value="revenue">Doanh thu</option>
            <option value="punctuality">Đúng giờ</option><option value="incidents">Sự cố</option>
          </select>
          <button class="btn-primary text-sm">📄 Xuất PDF</button>
          <button class="btn-secondary text-sm">📊 Xuất Excel</button>
        </div>
      </div>

      <!-- Route Performance -->
      <div class="bg-white rounded-2xl border overflow-hidden">
        <div class="p-4 border-b"><h3 class="card-title">Hiệu suất theo tuyến</h3></div>
        <div class="table-container"><table class="data-table">
          <thead><tr><th>Tuyến</th><th>Tổng chuyến</th><th>Đúng giờ (%)</th><th>HK TB</th><th>Headway TB</th><th>Điểm KPI</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of routePerformance" class="hover:bg-slate-50">
              <td><span class="font-bold text-blue-600">{{ r.routeCode }}</span></td>
              <td>{{ r.totalTrips }}</td>
              <td><div class="flex items-center gap-2">
                <div class="w-16 bg-slate-200 rounded-full h-2"><div [ngClass]="(r.onTimePercentage || r.otp) >= 90 ? 'bg-emerald-500' : (r.onTimePercentage || r.otp) >= 80 ? 'bg-amber-500' : 'bg-red-500'" class="h-2 rounded-full" [style.width.%]="r.onTimePercentage || r.otp"></div></div>
                <span class="text-sm font-medium">{{ r.onTimePercentage || r.otp }}%</span>
              </div></td>
              <td>{{ r.avgPassengers || r.totalPassengers }}</td>
              <td>{{ r.avgHeadwayMin || 0 }} phút</td>
              <td><span class="badge" [ngClass]="(r.onTimePercentage || r.otp) >= 90 ? 'badge-success' : (r.onTimePercentage || r.otp) >= 80 ? 'badge-warning' : 'badge-danger'">{{ (r.onTimePercentage || r.otp) >= 90 ? 'A' : (r.onTimePercentage || r.otp) >= 80 ? 'B' : 'C' }}</span></td>
            </tr>
          </tbody>
        </table></div>
      </div>

      <!-- Revenue Summary -->
      <div class="bg-white rounded-2xl border overflow-hidden">
        <div class="p-4 border-b"><h3 class="card-title">Tổng hợp Doanh thu</h3></div>
        <div class="table-container"><table class="data-table">
          <thead><tr><th>Tuyến</th><th>Doanh thu</th><th>Chi phí VH</th><th>Lợi nhuận</th><th>Tăng trưởng</th><th>% Lấp đầy</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of revenueReports" class="hover:bg-slate-50">
              <td class="font-bold text-blue-600">{{ r.routeCode || '' }}</td>
              <td class="font-medium">{{ formatCurrency(r.totalRevenue) }}</td>
              <td class="text-slate-500">{{ formatCurrency(r.operatingCost || 0) }}</td>
              <td [ngClass]="r.totalRevenue - (r.operatingCost || 0) >= 0 ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'">{{ formatCurrency(r.totalRevenue - (r.operatingCost || 0)) }}</td>
              <td><span [ngClass]="(r.revenueGrowthPercent || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'" class="font-medium">{{ (r.revenueGrowthPercent || 0) >= 0 ? '+' : '' }}{{ r.revenueGrowthPercent || 0 }}%</span></td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="w-12 bg-slate-200 rounded-full h-2"><div class="bg-blue-500 h-2 rounded-full" [style.width.%]="r.avgOccupancy || 0"></div></div>
                  <span class="text-xs">{{ r.avgOccupancy || 0 }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table></div>
      </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  routePerformance: RoutePerformance[] = [];
  revenueReports: RevenueReport[] = [];
  reportType = 'performance';

  constructor(private dashService: DashboardService) { }
  ngOnInit() {
    this.dashService.getRoutePerformance().subscribe(r => this.routePerformance = r);
    this.dashService.getRevenueReports().subscribe(r => this.revenueReports = r);
  }
  formatCurrency(n: number | undefined) { return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n || 0); }
}
