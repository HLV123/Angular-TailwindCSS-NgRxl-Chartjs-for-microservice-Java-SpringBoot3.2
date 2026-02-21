import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MOCK_ROUTES, MOCK_STATIONS, MOCK_VEHICLE_POSITIONS } from '../../core/mock-data';
import { PassengerService } from '../../core/services/data.service';
import { PassengerFeedback } from '../../core/models';

@Component({
    selector: 'app-passenger-portal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">BRT Hà Nội</h1>
        <p class="text-slate-500 mt-2">Cổng thông tin hành khách</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 border-b border-slate-200 justify-center">
        <button *ngFor="let tab of tabs" (click)="activeTab = tab.key"
          class="px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors"
          [ngClass]="activeTab === tab.key ? 'bg-white text-blue-600 border border-b-white border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700'">
          {{ tab.label }}
        </button>
      </div>

      <!-- Route Planner -->
      <div *ngIf="activeTab === 'planner'" class="space-y-6">
        <div class="bg-white rounded-2xl border p-6 max-w-2xl mx-auto">
          <h3 class="card-title mb-4">Lập kế hoạch hành trình</h3>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div><label class="form-label">Điểm đi</label>
              <select [(ngModel)]="fromStation" class="form-select">
                <option value="">Chọn trạm...</option>
                <option *ngFor="let s of stations" [value]="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div><label class="form-label">Điểm đến</label>
              <select [(ngModel)]="toStation" class="form-select">
                <option value="">Chọn trạm...</option>
                <option *ngFor="let s of stations" [value]="s.id">{{ s.name }}</option>
              </select>
            </div>
          </div>
          <button class="btn-primary w-full" (click)="searchRoute()">Tìm đường</button>

          <div *ngIf="searchResult" class="mt-6 p-4 bg-blue-50 rounded-xl">
            <h4 class="font-bold text-blue-700 mb-2">Kết quả</h4>
            <p class="text-sm"><strong>Tuyến:</strong> {{ searchResult.routeCode }} — {{ searchResult.routeName }}</p>
            <p class="text-sm"><strong>Khoảng cách:</strong> {{ searchResult.distance }} km</p>
            <p class="text-sm"><strong>Thời gian ước tính:</strong> {{ searchResult.time }} phút</p>
            <p class="text-sm"><strong>Giá vé:</strong> 7,000đ (lượt đơn)</p>
          </div>
        </div>

        <!-- All Routes -->
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Tất cả tuyến BRT</h3>
          <div class="space-y-3">
            <div *ngFor="let r of routes" class="flex items-center gap-4 p-4 rounded-xl border hover:shadow-md transition-all">
              <div class="w-3 h-16 rounded-full" [style.backgroundColor]="r.color"></div>
              <div class="flex-1">
                <p class="font-bold">{{ r.code }} — {{ r.name }}</p>
                <p class="text-sm text-slate-500">{{ r.stations[0]?.stationName }} → {{ r.stations[r.stations.length-1]?.stationName }}</p>
                <p class="text-xs text-slate-400 mt-1">{{ r.totalLengthKm }} km • {{ r.avgTravelTimeMin }} phút • {{ r.stations.length }} trạm</p>
              </div>
              <span class="badge" [ngClass]="r.status==='ACTIVE'?'badge-success':'badge-neutral'">{{ r.status==='ACTIVE'?'Đang chạy':'Ngừng' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Tracking -->
      <div *ngIf="activeTab === 'tracking'" class="space-y-6">
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Theo dõi xe trực tiếp</h3>
          <div class="bg-gradient-to-br from-blue-50 to-slate-100 rounded-xl p-6 relative" style="min-height: 300px">
            <div *ngFor="let pos of vehiclePositions" class="absolute"
              [style.left.%]="((pos.lng - 105.73) / (105.86 - 105.73)) * 100"
              [style.top.%]="((21.14 - pos.lat) / (21.14 - 20.95)) * 100">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-lg animate-pulse"
                [ngClass]="pos.status === 'ON_TIME' ? 'bg-emerald-500' : pos.status === 'SLIGHTLY_DELAYED' ? 'bg-amber-500' : 'bg-red-500'">
                🚌
              </div>
            </div>
            <!-- Station markers -->
            <div *ngFor="let s of stations" class="absolute"
              [style.left.%]="((s.lng - 105.73) / (105.86 - 105.73)) * 100"
              [style.top.%]="((21.14 - s.lat) / (21.14 - 20.95)) * 100">
              <div class="w-3 h-3 rounded-full bg-slate-400 border-2 border-white shadow-sm"></div>
            </div>
            <p class="absolute bottom-2 right-2 text-[10px] text-slate-400">Bản đồ minh họa • Tích hợp Leaflet/PostGIS khi kết nối backend</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div *ngFor="let pos of vehiclePositions" class="bg-white rounded-2xl border p-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                [ngClass]="pos.status==='ON_TIME'?'bg-emerald-100 text-emerald-600':pos.status==='SLIGHTLY_DELAYED'?'bg-amber-100 text-amber-600':'bg-red-100 text-red-600'">🚌</div>
              <div>
                <p class="font-bold text-sm">{{ pos.vehicleId }}</p>
                <p class="text-xs text-slate-400">{{ pos.speed }} km/h • {{ pos.status==='ON_TIME'?'Đúng giờ':pos.status==='SLIGHTLY_DELAYED'?'Trễ nhẹ':'Trễ nặng' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feedback -->
      <div *ngIf="activeTab === 'feedback'" class="space-y-6">
        <div class="bg-white rounded-2xl border p-6 max-w-2xl mx-auto">
          <h3 class="card-title mb-4">Gửi đánh giá</h3>
          <div class="space-y-4">
            <div><label class="form-label">Tuyến</label>
              <select [(ngModel)]="feedbackRoute" class="form-select">
                <option *ngFor="let r of routes" [value]="r.id">{{ r.code }} — {{ r.name }}</option>
              </select>
            </div>
            <div><label class="form-label">Đánh giá</label>
              <div class="flex gap-2">
                <button *ngFor="let star of [1,2,3,4,5]" (click)="feedbackRating = star"
                  class="text-3xl transition-transform hover:scale-110" [ngClass]="star <= feedbackRating ? 'text-amber-400' : 'text-slate-200'">★</button>
              </div>
            </div>
            <div><label class="form-label">Nhận xét</label>
              <textarea [(ngModel)]="feedbackComment" class="form-input" rows="3" placeholder="Chia sẻ trải nghiệm của bạn..."></textarea>
            </div>
            <button class="btn-primary w-full" (click)="submitFeedback()">Gửi đánh giá</button>
          </div>
        </div>

        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Đánh giá gần đây</h3>
          <div class="space-y-3">
            <div *ngFor="let fb of feedbacks" class="p-4 rounded-xl bg-slate-50">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-amber-400">{{ getStars(fb.rating) }}</span>
                <span class="font-bold text-sm">{{ fb.passengerName || 'Ẩn danh' }}</span>
                <span class="text-xs text-slate-400">• {{ fb.routeName }}</span>
              </div>
              <p *ngIf="fb.comment" class="text-sm text-slate-600">{{ fb.comment }}</p>
              <div class="flex gap-1 mt-2">
                <span *ngFor="let c of fb.categories" class="badge badge-info text-[10px]">{{ c }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PassengerPortalComponent implements OnInit {
    activeTab = 'planner';
    tabs = [
        { key: 'planner', label: 'Tìm đường' },
        { key: 'tracking', label: 'Theo dõi xe' },
        { key: 'feedback', label: 'Đánh giá' }
    ];
    routes = MOCK_ROUTES;
    stations = MOCK_STATIONS;
    vehiclePositions = MOCK_VEHICLE_POSITIONS;
    feedbacks: PassengerFeedback[] = [];
    fromStation = '';
    toStation = '';
    searchResult: any = null;
    feedbackRoute = 'r-001';
    feedbackRating = 5;
    feedbackComment = '';

    constructor(private passengerService: PassengerService) { }
    ngOnInit() { this.passengerService.getFeedback().subscribe(f => this.feedbacks = f); }

    searchRoute() {
        if (this.fromStation && this.toStation) {
            const from = this.stations.find(s => s.id === this.fromStation);
            const to = this.stations.find(s => s.id === this.toStation);
            if (from && to) {
                const route = this.routes.find(r => r.stations.some(s => s.stationId === from.id) && r.stations.some(s => s.stationId === to.id));
                this.searchResult = {
                    routeCode: route?.code || 'BRT-01', routeName: route?.name || 'Tuyến phù hợp',
                    distance: Math.abs(from.lat - to.lat) * 111 + Math.abs(from.lng - to.lng) * 85,
                    time: Math.round((Math.abs(from.lat - to.lat) * 111 + Math.abs(from.lng - to.lng) * 85) * 3.5)
                };
                this.searchResult.distance = Math.round(this.searchResult.distance * 10) / 10;
            }
        }
    }

    submitFeedback() {
        const route = this.routes.find(r => r.id === this.feedbackRoute);
        this.feedbacks.unshift({
            id: 'fb-new-' + Date.now(), routeId: this.feedbackRoute, routeName: route?.name || '',
            rating: this.feedbackRating, categories: ['Đánh giá mới'], comment: this.feedbackComment,
            passengerName: 'Bạn', status: 'NEW', createdAt: new Date()
        });
        this.feedbackComment = '';
    }

    getStars(n: number): string { return '★'.repeat(n) + '☆'.repeat(5 - n); }
}
