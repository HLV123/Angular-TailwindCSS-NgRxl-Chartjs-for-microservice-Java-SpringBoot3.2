import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassengerService } from '../../../core/services/data.service';
import { ODMatrixEntry } from '../../../core/models';
import { MOCK_ROUTES, MOCK_STATIONS } from '../../../core/mock-data';

@Component({
  selector: 'app-network-analysis',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Phân tích Mạng lưới</h1><p class="text-sm text-slate-500 mt-1">UC-ANALYTICS-001 • Neo4j Graph Analysis</p></div>
      </div>

      <!-- KPI -->
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
          <p class="text-indigo-200 text-xs">Tổng tuyến</p><p class="text-3xl font-bold mt-1">{{ routes.length }}</p>
        </div>
        <div class="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-5 text-white">
          <p class="text-cyan-200 text-xs">Tổng trạm</p><p class="text-3xl font-bold mt-1">{{ stations.length }}</p>
        </div>
        <div class="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-5 text-white">
          <p class="text-violet-200 text-xs">Cặp OD</p><p class="text-3xl font-bold mt-1">{{ odMatrix.length }}</p>
        </div>
        <div class="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-5 text-white">
          <p class="text-teal-200 text-xs">Kết nối TB/trạm</p><p class="text-3xl font-bold mt-1">{{ avgConnections }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Network Graph Placeholder -->
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Đồ thị mạng lưới (Neo4j)</h3>
          <div class="h-64 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center">
            <div class="text-center">
              <p class="text-4xl mb-2">🕸️</p>
              <p class="text-sm text-slate-500">Graph Visualization</p>
              <p class="text-xs text-slate-400 mt-1">Tích hợp D3.js / vis.js cho Neo4j graph</p>
              <div class="mt-4 space-y-1">
                <div *ngFor="let r of routes.slice(0,3)" class="flex items-center gap-2 text-xs">
                  <span class="w-3 h-3 rounded-full" [style.background]="r.color"></span>
                  <span class="text-slate-600">{{ r.code }}: {{ r.name }}</span>
                  <span class="text-slate-400">({{ r.totalStations }} trạm)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- OD Matrix -->
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Ma trận OD (Origin-Destination)</h3>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div *ngFor="let od of topODPairs" class="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div class="flex items-center gap-2 text-sm flex-1">
                <span class="font-medium text-blue-600 w-16">{{ od.originStationCode || od.originStationName }}</span>
                <span class="text-slate-300">→</span>
                <span class="font-medium text-emerald-600 w-16">{{ od.destStationCode || od.destStationName }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-24 bg-slate-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" [style.width.%]="((od.tripCount || od.count) / maxTrips) * 100"></div>
                </div>
                <span class="text-sm font-bold text-slate-700 w-12 text-right">{{ od.tripCount || od.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Route Connectivity -->
        <div class="bg-white rounded-2xl border p-6 lg:col-span-2">
          <h3 class="card-title mb-4">Kết nối giữa các tuyến</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div *ngFor="let r of routes" class="p-4 rounded-xl border hover:shadow-md transition-all cursor-pointer">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-4 h-4 rounded-full" [style.background]="r.color"></span>
                <span class="font-bold text-sm">{{ r.code }}</span>
              </div>
              <p class="text-xs text-slate-500 truncate">{{ r.name }}</p>
              <div class="flex items-center gap-2 mt-2 text-xs text-slate-400">
                <span>📍 {{ r.totalStations }} trạm</span>
                <span>📏 {{ r.totalLengthKm }} km</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NetworkAnalysisComponent implements OnInit {
  routes = MOCK_ROUTES;
  stations = MOCK_STATIONS;
  odMatrix: ODMatrixEntry[] = [];

  constructor(private passengerService: PassengerService) { }
  ngOnInit() { this.passengerService.getODMatrix().subscribe(m => this.odMatrix = m); }

  get avgConnections() { return this.stations.length ? Math.round(this.routes.length * 2 / this.stations.length * 10) / 10 : 0; }
  get topODPairs() { return [...this.odMatrix].sort((a, b) => (b.tripCount || b.count) - (a.tripCount || a.count)).slice(0, 10); }
  get maxTrips() { return this.topODPairs.length ? (this.topODPairs[0].tripCount || this.topODPairs[0].count) : 1; }
}
