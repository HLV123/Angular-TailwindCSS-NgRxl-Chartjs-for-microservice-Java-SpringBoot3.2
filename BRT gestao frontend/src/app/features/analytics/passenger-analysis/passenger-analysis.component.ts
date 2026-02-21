import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, PassengerService } from '../../../core/services/data.service';
import { PassengerHourlyData, PassengerFeedback } from '../../../core/models';

@Component({
  selector: 'app-passenger-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Phân tích Hành khách</h1><p class="text-sm text-slate-500 mt-1">UC-ANALYTICS-002 • Big Data Analytics (Hive + Hadoop)</p></div>
        <select [(ngModel)]="period" class="form-select max-w-[140px]"><option value="today">Hôm nay</option><option value="week">Tuần này</option><option value="month">Tháng này</option></select>
      </div>

      <div class="grid grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <p class="text-blue-200 text-xs">Tổng lượt khách</p><p class="text-2xl font-bold mt-1">{{ totalPassengers | number }}</p>
        </div>
        <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
          <p class="text-emerald-200 text-xs">TB đánh giá</p><p class="text-2xl font-bold mt-1">{{ avgRating }} ⭐</p>
        </div>
        <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <p class="text-amber-200 text-xs">Giờ cao điểm</p><p class="text-2xl font-bold mt-1">{{ peakHour }}:00</p>
        </div>
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
          <p class="text-purple-200 text-xs">Phản hồi chưa PH</p><p class="text-2xl font-bold mt-1">{{ unresolvedFeedback }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Hourly Chart -->
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Lượng khách theo giờ</h3>
          <div class="space-y-2">
            <div *ngFor="let h of hourlyData" class="flex items-center gap-3">
              <span class="text-xs text-slate-500 w-12">{{ h.hour }}:00</span>
              <div class="flex-1 bg-slate-100 rounded-full h-5 relative">
                <div class="bg-gradient-to-r from-blue-500 to-blue-400 h-5 rounded-full transition-all flex items-center justify-end pr-2"
                  [style.width.%]="((h.boardingCount || h.count) / maxHourly) * 100">
                  <span *ngIf="(h.boardingCount || h.count) > maxHourly * 0.15" class="text-[10px] text-white font-bold">{{ h.boardingCount || h.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feedback -->
        <div class="bg-white rounded-2xl border overflow-hidden">
          <div class="p-4 border-b"><h3 class="card-title">Phản hồi hành khách gần đây</h3></div>
          <div class="divide-y max-h-96 overflow-y-auto">
            <div *ngFor="let fb of feedbacks" class="p-4 hover:bg-slate-50">
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm">{{ getStars(fb.rating) }}</span>
                  <span class="badge" [ngClass]="getCategoryClass(fb.category || '')">{{ fb.category }}</span>
                </div>
                <span class="badge text-[10px]" [ngClass]="fb.status === 'NEW' ? 'badge-warning' : fb.status === 'RESPONDED' ? 'badge-success' : 'badge-info'">{{ fb.status }}</span>
              </div>
              <p class="text-sm text-slate-700">{{ fb.comment }}</p>
              <p class="text-xs text-slate-400 mt-1">{{ fb.routeCode || fb.routeName }} • {{ (fb.timestamp || fb.createdAt) | date:'HH:mm dd/MM' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PassengerAnalysisComponent implements OnInit {
  hourlyData: PassengerHourlyData[] = [];
  feedbacks: PassengerFeedback[] = [];
  period = 'today';

  constructor(private dashService: DashboardService, private passengerService: PassengerService) { }
  ngOnInit() {
    this.dashService.getPassengerHourly().subscribe(d => this.hourlyData = d);
    this.passengerService.getFeedback().subscribe(f => this.feedbacks = f);
  }

  get totalPassengers() { return this.hourlyData.reduce((a, h) => a + (h.boardingCount || h.count), 0); }
  get maxHourly() { return Math.max(...this.hourlyData.map(h => h.boardingCount || h.count), 1); }
  get peakHour() { return this.hourlyData.length ? this.hourlyData.reduce((max, h) => (h.boardingCount || h.count) > (max.boardingCount || max.count) ? h : max).hour : 0; }
  get avgRating() { return this.feedbacks.length ? (this.feedbacks.reduce((a, f) => a + f.rating, 0) / this.feedbacks.length).toFixed(1) : '0'; }
  get unresolvedFeedback() { return this.feedbacks.filter(f => f.status === 'NEW').length; }

  getStars(n: number) { return '⭐'.repeat(n); }
  getCategoryClass(c: string) {
    return { COMPLIMENT: 'badge-success', COMPLAINT: 'badge-danger', SUGGESTION: 'badge-info', QUESTION: 'badge-warning' }[c] || 'badge-neutral';
  }
}
