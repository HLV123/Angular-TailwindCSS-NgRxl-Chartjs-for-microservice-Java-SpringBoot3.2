import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService, DashboardService } from '../../../core/services/data.service';
import { TicketTransaction, RevenueReport } from '../../../core/models';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Doanh thu & Đối soát</h1><p class="text-sm text-slate-500 mt-1">UC-REVENUE-001 • Finance Analytics</p></div>
        <div class="flex gap-2">
          <select [(ngModel)]="periodFilter" class="form-select max-w-[140px]"><option value="today">Hôm nay</option><option value="week">Tuần này</option><option value="month">Tháng này</option><option value="quarter">Quý này</option></select>
          <button class="btn-primary text-sm">📥 Xuất Excel</button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <p class="text-blue-100 text-xs">Tổng doanh thu</p><p class="text-2xl font-bold mt-1">{{ formatCurrency(totalRevenue) }}</p>
          <p class="text-xs text-blue-200 mt-1">+12.5% so với kỳ trước</p>
        </div>
        <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
          <p class="text-emerald-100 text-xs">Giao dịch thành công</p><p class="text-2xl font-bold mt-1">{{ transactions.length }}</p>
          <p class="text-xs text-emerald-200 mt-1">Tỷ lệ 98.2%</p>
        </div>
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
          <p class="text-purple-100 text-xs">Vé bán ra</p><p class="text-2xl font-bold mt-1">{{ ticketsSold }}</p>
          <p class="text-xs text-purple-200 mt-1">Bình quân {{ avgPerTicket }} VNĐ/vé</p>
        </div>
        <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <p class="text-amber-100 text-xs">Hoàn vé</p><p class="text-2xl font-bold mt-1">{{ refundCount }}</p>
          <p class="text-xs text-amber-200 mt-1">{{ formatCurrency(refundAmount) }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue by Route -->
        <div class="bg-white rounded-2xl border overflow-hidden">
          <div class="p-4 border-b"><h3 class="card-title">Doanh thu theo tuyến</h3></div>
          <div class="divide-y">
            <div *ngFor="let r of revenueReports" class="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
              <div>
                <p class="font-medium text-sm">{{ r.routeCode || '' }}</p>
                <p class="text-xs text-slate-400">{{ r.totalTrips || 0 }} chuyến • {{ r.avgOccupancy || 0 }}% lấp đầy</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-blue-600">{{ formatCurrency(r.totalRevenue) }}</p>
                <p class="text-xs" [ngClass]="(r.revenueGrowthPercent || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'">
                  {{ (r.revenueGrowthPercent || 0) >= 0 ? '+' : '' }}{{ r.revenueGrowthPercent || 0 }}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-white rounded-2xl border overflow-hidden">
          <div class="p-4 border-b"><h3 class="card-title">Giao dịch gần đây</h3></div>
          <div class="divide-y max-h-80 overflow-y-auto">
            <div *ngFor="let t of transactions" class="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
              <div>
                <p class="font-mono text-xs text-slate-400">{{ t.transactionId || t.id }}</p>
                <p class="text-sm font-medium">{{ t.ticketTypeName }}</p>
                <p class="text-xs text-slate-400">{{ (t.timestamp || t.createdAt) | date:'HH:mm dd/MM' }} • {{ t.paymentMethod }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold" [ngClass]="t.status === 'SUCCESS' ? 'text-emerald-600' : 'text-red-600'">{{ formatCurrency(t.amount) }}</p>
                <span class="badge text-[10px]" [ngClass]="t.status === 'SUCCESS' ? 'badge-success' : 'badge-danger'">{{ t.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Methods Distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Phương thức thanh toán</h3>
          <div class="space-y-3">
            <div *ngFor="let pm of paymentMethods" class="flex items-center gap-3">
              <span class="text-lg w-8 text-center">{{ pm.icon }}</span>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium">{{ pm.label }}</span>
                  <span class="text-xs font-bold text-slate-600">{{ pm.percent }}%</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all" [style.width.%]="pm.percent" [style.background]="pm.color"></div>
                </div>
              </div>
              <span class="text-xs text-slate-500 w-20 text-right">{{ formatCurrency(pm.amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Revenue Trend -->
        <div class="lg:col-span-2 bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Xu hướng doanh thu (7 ngày gần nhất)</h3>
          <div class="flex items-end gap-2 h-40">
            <div *ngFor="let day of weeklyTrend" class="flex-1 flex flex-col items-center gap-1">
              <span class="text-[9px] font-bold" [ngClass]="day.growth >= 0 ? 'text-emerald-600' : 'text-red-600'">
                {{ day.growth >= 0 ? '+' : '' }}{{ day.growth }}%
              </span>
              <div class="w-full rounded-t transition-all" [style.height.px]="(day.revenue / maxWeeklyRevenue) * 120"
                [ngClass]="day.isToday ? 'bg-blue-500' : 'bg-blue-200 hover:bg-blue-300'"></div>
              <span class="text-[9px] text-slate-400">{{ day.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RevenueComponent implements OnInit {
  transactions: TicketTransaction[] = [];
  revenueReports: RevenueReport[] = [];
  periodFilter = 'month';
  paymentMethods = [
    { icon: '💳', label: 'Thẻ NFC/RFID', percent: 42, amount: 89600000, color: '#3b82f6' },
    { icon: '📱', label: 'MoMo', percent: 28, amount: 59700000, color: '#d946ef' },
    { icon: '🏦', label: 'VNPay', percent: 18, amount: 38300000, color: '#14b8a6' },
    { icon: '💵', label: 'Tiền mặt', percent: 8, amount: 17000000, color: '#f59e0b' },
    { icon: '🎫', label: 'Vé giấy', percent: 4, amount: 8500000, color: '#6b7280' }
  ];
  weeklyTrend = [
    { label: 'T2', revenue: 28500000, growth: 5.2, isToday: false },
    { label: 'T3', revenue: 31200000, growth: 9.5, isToday: false },
    { label: 'T4', revenue: 27800000, growth: -3.1, isToday: false },
    { label: 'T5', revenue: 33400000, growth: 12.0, isToday: false },
    { label: 'T6', revenue: 35100000, growth: 5.1, isToday: false },
    { label: 'T7', revenue: 22300000, growth: -8.4, isToday: false },
    { label: 'CN', revenue: 19800000, growth: -11.2, isToday: true }
  ];

  get totalRevenue() { return this.transactions.filter(t => t.status === 'SUCCESS').reduce((a, t) => a + t.amount, 0); }
  get ticketsSold() { return this.transactions.filter(t => t.status === 'SUCCESS').length; }
  get avgPerTicket() { return this.ticketsSold ? Math.round(this.totalRevenue / this.ticketsSold) : 0; }
  get refundCount() { return this.transactions.filter(t => t.status === 'REFUNDED').length; }
  get refundAmount() { return this.transactions.filter(t => t.status === 'REFUNDED').reduce((a, t) => a + t.amount, 0); }
  get maxWeeklyRevenue() { return Math.max(...this.weeklyTrend.map(d => d.revenue), 1); }

  constructor(private ticketService: TicketService, private dashboardService: DashboardService) { }
  ngOnInit() {
    this.ticketService.getTransactions().subscribe(t => this.transactions = t);
    this.dashboardService.getRevenueReports().subscribe(r => this.revenueReports = r);
  }
  formatCurrency(n: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n);
  }
}
