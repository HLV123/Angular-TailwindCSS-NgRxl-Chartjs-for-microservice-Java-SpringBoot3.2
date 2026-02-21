import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../core/services/data.service';
import { TicketType, TicketTransaction, TicketRefund, EWallet } from '../../../core/models';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="page-title">Vé điện tử & Thanh toán</h1>
          <p class="text-sm text-slate-500 mt-1">E-Ticketing - QR Code, NFC, ví điện tử BRT</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border p-5 text-center"><p class="text-3xl font-bold text-blue-600">185.6M</p><p class="text-sm text-slate-500 mt-1">Doanh thu hôm nay</p></div>
        <div class="bg-white rounded-2xl border p-5 text-center"><p class="text-3xl font-bold text-emerald-600">12,845</p><p class="text-sm text-slate-500 mt-1">Giao dịch hôm nay</p></div>
        <div class="bg-white rounded-2xl border p-5 text-center"><p class="text-3xl font-bold text-purple-600">98.5%</p><p class="text-sm text-slate-500 mt-1">Tỷ lệ thành công</p></div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 border-b border-slate-200">
        <button *ngFor="let tab of tabs" (click)="activeTab = tab.key"
          class="px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors"
          [ngClass]="activeTab === tab.key ? 'bg-white text-blue-600 border border-b-white border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700'">
          {{ tab.label }}
        </button>
      </div>

      <!-- Ticket Types Tab -->
      <div *ngIf="activeTab === 'types'">
        <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div class="table-container"><table class="data-table"><thead><tr><th>Mã</th><th>Tên loại vé</th><th>Giá (VNĐ)</th><th>Loại</th><th>Thời hạn</th><th>Giảm giá</th><th>Trạng thái</th></tr></thead>
            <tbody><tr *ngFor="let t of ticketTypes">
              <td class="font-mono text-xs">{{ t.code }}</td>
              <td><p class="font-semibold">{{ t.name }}</p><p class="text-xs text-slate-400">{{ t.description }}</p></td>
              <td class="font-bold">{{ t.price === 0 ? 'Miễn phí' : t.price.toLocaleString() + 'đ' }}</td>
              <td><span class="badge badge-info">{{ t.validityType }}</span></td>
              <td>{{ t.validityDuration }}</td>
              <td><span *ngIf="t.discount > 0" class="font-bold text-red-600">-{{ t.discount }}%</span><span *ngIf="t.discount===0" class="text-slate-400">—</span></td>
              <td><span class="badge" [ngClass]="t.isActive?'badge-success':'badge-neutral'">{{ t.isActive?'Hoạt động':'Ngừng' }}</span></td>
            </tr></tbody></table>
          </div>
        </div>
      </div>

      <!-- Transactions Tab -->
      <div *ngIf="activeTab === 'transactions'">
        <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div class="table-container"><table class="data-table"><thead><tr><th>Mã GD</th><th>Loại vé</th><th>Số tiền</th><th>Thanh toán</th><th>Trạm</th><th>Thời gian</th><th>Trạng thái</th></tr></thead>
            <tbody><tr *ngFor="let tx of transactions">
              <td class="font-mono text-xs">{{ tx.id }}</td>
              <td class="font-medium">{{ tx.ticketTypeName }}</td>
              <td class="font-bold">{{ tx.amount.toLocaleString() }}đ</td>
              <td><span class="badge badge-info">{{ tx.paymentMethod }}</span></td>
              <td>{{ tx.stationName || '—' }}</td>
              <td class="text-xs">{{ tx.createdAt | date:'HH:mm dd/MM' }}</td>
              <td><span class="badge" [ngClass]="{'badge-success':tx.status==='COMPLETED','badge-neutral':tx.status==='PENDING','badge-danger':tx.status==='FAILED'}">{{ tx.status }}</span></td>
            </tr></tbody></table>
          </div>
        </div>
      </div>

      <!-- Purchase Tab -->
      <div *ngIf="activeTab === 'purchase'" class="max-w-lg mx-auto">
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Mua vé BRT</h3>
          <div class="space-y-4">
            <div><label class="form-label">Loại vé</label>
              <select [(ngModel)]="purchaseType" class="form-select">
                <option *ngFor="let t of ticketTypes" [value]="t.id">{{ t.name }} — {{ t.price === 0 ? 'Miễn phí' : t.price.toLocaleString() + 'đ' }}</option>
              </select>
            </div>
            <div><label class="form-label">Số lượng</label><input type="number" [(ngModel)]="purchaseQty" class="form-input" min="1" max="10"/></div>
            <div><label class="form-label">Phương thức thanh toán</label>
              <div class="grid grid-cols-2 gap-2">
                <button *ngFor="let m of ['MOMO','VNPAY','BANK_CARD','BRT_WALLET']" (click)="purchaseMethod = m"
                  class="p-3 rounded-xl border text-center text-sm transition-colors"
                  [ngClass]="purchaseMethod === m ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'hover:bg-slate-50'">
                  {{ m }}
                </button>
              </div>
            </div>
            <div class="p-4 bg-slate-50 rounded-xl">
              <div class="flex justify-between text-sm"><span>Đơn giá</span><span class="font-bold">{{ getSelectedPrice().toLocaleString() }}đ</span></div>
              <div class="flex justify-between text-sm mt-1"><span>Số lượng</span><span>x {{ purchaseQty }}</span></div>
              <div class="flex justify-between text-lg font-bold mt-2 pt-2 border-t"><span>Tổng</span><span class="text-blue-600">{{ (getSelectedPrice() * purchaseQty).toLocaleString() }}đ</span></div>
            </div>
            <button class="btn-primary w-full" (click)="purchase()">{{ purchaseSuccess ? '✓ Mua thành công!' : 'Thanh toán' }}</button>
            <div *ngIf="purchaseSuccess" class="text-center p-4 bg-emerald-50 rounded-xl">
              <p class="text-4xl mb-2">📱</p>
              <p class="font-bold text-emerald-700">Đã tạo QR Code!</p>
              <p class="font-mono text-xs text-slate-500 mt-1">BRT-QR-{{ Date.now().toString(36).toUpperCase() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Refunds Tab -->
      <div *ngIf="activeTab === 'refunds'">
        <div class="bg-white rounded-2xl border overflow-hidden">
          <div class="p-4 border-b"><h3 class="card-title">Yêu cầu hoàn vé</h3></div>
          <div class="table-container"><table class="data-table"><thead><tr><th>Mã GD</th><th>Loại vé</th><th>Số tiền</th><th>Lý do</th><th>Ngày YC</th><th>Trạng thái</th></tr></thead>
            <tbody><tr *ngFor="let r of refunds">
              <td class="font-mono text-xs">{{ r.transactionId }}</td>
              <td>{{ r.ticketTypeName }}</td>
              <td class="font-bold">{{ r.amount.toLocaleString() }}đ</td>
              <td class="text-sm">{{ r.reason }}</td>
              <td class="text-xs">{{ r.requestedAt | date:'HH:mm dd/MM' }}</td>
              <td><span class="badge" [ngClass]="{'badge-neutral':r.status==='PENDING','badge-success':r.status==='APPROVED','badge-danger':r.status==='REJECTED','badge-info':r.status==='REFUNDED'}">{{ r.status }}</span></td>
            </tr></tbody></table>
          </div>
        </div>
      </div>

      <!-- E-Wallet Tab -->
      <div *ngIf="activeTab === 'wallet'" class="max-w-lg mx-auto space-y-6">
        <div *ngIf="wallet" class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
          <p class="text-sm opacity-80">Số dư ví BRT</p>
          <p class="text-4xl font-bold mt-2">{{ wallet.balance.toLocaleString() }}đ</p>
          <div class="flex items-center gap-4 mt-4">
            <p class="text-sm opacity-80">{{ wallet.passengerName }} • {{ wallet.phone }}</p>
          </div>
          <button class="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">+ Nạp tiền</button>
        </div>
        <div *ngIf="wallet" class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Lịch sử giao dịch ví</h3>
          <div class="space-y-3">
            <div *ngFor="let t of wallet.transactions" class="flex items-center justify-between py-2 border-b border-slate-50">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full flex items-center justify-center text-sm" [ngClass]="t.type==='TOP_UP'?'bg-emerald-100 text-emerald-600':t.type==='REFUND'?'bg-blue-100 text-blue-600':'bg-red-100 text-red-600'">
                  {{ t.type==='TOP_UP'?'+':t.type==='REFUND'?'↩':'−' }}
                </span>
                <div>
                  <p class="text-sm font-medium">{{ t.description }}</p>
                  <p class="text-xs text-slate-400">{{ t.createdAt | date:'HH:mm dd/MM/yyyy' }}</p>
                </div>
              </div>
              <span class="font-bold" [ngClass]="t.amount>0?'text-emerald-600':'text-red-600'">{{ t.amount > 0 ? '+' : '' }}{{ t.amount.toLocaleString() }}đ</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Methods Chart -->
      <div *ngIf="activeTab === 'types'" class="grid grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Doanh thu theo phương thức thanh toán</h3>
          <div class="space-y-3">
            <div *ngFor="let m of paymentMethods" class="flex items-center gap-3">
              <span class="w-20 text-sm text-slate-600">{{ m.name }}</span>
              <div class="flex-1 h-4 bg-slate-100 rounded-full"><div class="h-full rounded-full" [style.width.%]="m.pct" [ngClass]="m.color"></div></div>
              <span class="text-sm font-bold w-12 text-right">{{ m.pct }}%</span>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Kênh bán vé</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-3"><span class="w-20 text-sm text-slate-600">App</span><div class="flex-1 h-4 bg-slate-100 rounded-full"><div class="h-full bg-blue-500 rounded-full" style="width:45%"></div></div><span class="text-sm font-bold">45%</span></div>
            <div class="flex items-center gap-3"><span class="w-20 text-sm text-slate-600">Máy bán vé</span><div class="flex-1 h-4 bg-slate-100 rounded-full"><div class="h-full bg-emerald-500 rounded-full" style="width:35%"></div></div><span class="text-sm font-bold">35%</span></div>
            <div class="flex items-center gap-3"><span class="w-20 text-sm text-slate-600">Web</span><div class="flex-1 h-4 bg-slate-100 rounded-full"><div class="h-full bg-purple-500 rounded-full" style="width:20%"></div></div><span class="text-sm font-bold">20%</span></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TicketListComponent implements OnInit {
  ticketTypes: TicketType[] = [];
  transactions: TicketTransaction[] = [];
  refunds: TicketRefund[] = [];
  wallet: EWallet | null = null;
  activeTab = 'types';
  tabs = [
    { key: 'types', label: 'Loại vé' },
    { key: 'transactions', label: 'Giao dịch' },
    { key: 'purchase', label: 'Mua vé' },
    { key: 'refunds', label: 'Hoàn vé' },
    { key: 'wallet', label: 'Ví BRT' }
  ];
  paymentMethods = [
    { name: 'MoMo', pct: 38, color: 'bg-pink-500' },
    { name: 'VNPay', pct: 28, color: 'bg-blue-500' },
    { name: 'Thẻ NH', pct: 20, color: 'bg-amber-500' },
    { name: 'Ví BRT', pct: 14, color: 'bg-emerald-500' }
  ];
  purchaseType = 'tt-001';
  purchaseQty = 1;
  purchaseMethod = 'MOMO';
  purchaseSuccess = false;
  Date = Date;

  constructor(private ts: TicketService) { }
  ngOnInit() {
    this.ts.getTicketTypes().subscribe(t => this.ticketTypes = t);
    this.ts.getTransactions().subscribe(t => this.transactions = t);
    this.ts.getRefunds().subscribe(r => this.refunds = r);
    this.ts.getEWallet().subscribe(w => this.wallet = w);
  }

  getSelectedPrice(): number {
    return this.ticketTypes.find(t => t.id === this.purchaseType)?.price || 0;
  }

  purchase() {
    this.purchaseSuccess = true;
    setTimeout(() => this.purchaseSuccess = false, 3000);
  }
}
