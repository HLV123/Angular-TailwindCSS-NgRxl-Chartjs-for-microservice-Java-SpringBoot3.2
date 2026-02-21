import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataPlatformService } from '../../../core/services/data.service';
import { KafkaTopicStatus } from '../../../core/models';

@Component({
    selector: 'app-data-catalog',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Data Catalog</h1><p class="text-sm text-slate-500 mt-1">Kylo Data Catalog • Apache Hive + HDFS</p></div>
      </div>

      <div class="flex items-center gap-3">
        <input [(ngModel)]="searchTerm" placeholder="Tìm dataset..." class="form-input max-w-xs"/>
        <select [(ngModel)]="filterDB" class="form-select max-w-[160px]">
          <option value="">Tất cả nguồn</option>
          <option value="postgres">PostgreSQL</option><option value="timescale">TimescaleDB</option>
          <option value="hive">Hive/HDFS</option><option value="neo4j">Neo4j</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let ds of filteredDatasets" class="bg-white rounded-2xl border p-5 hover:shadow-md transition-all cursor-pointer">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" [ngClass]="ds.iconBg">
              <span class="text-lg">{{ ds.icon }}</span>
            </div>
            <div><p class="font-bold text-sm">{{ ds.name }}</p><p class="text-xs text-slate-400">{{ ds.source }}</p></div>
          </div>
          <p class="text-xs text-slate-500 mb-3">{{ ds.description }}</p>
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span>{{ ds.recordCount | number }} records</span>
            <span>Cập nhật: {{ ds.lastUpdated }}</span>
          </div>
          <div class="flex flex-wrap gap-1 mt-3">
            <span *ngFor="let tag of ds.tags" class="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px]">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DataCatalogComponent {
    searchTerm = ''; filterDB = '';
    datasets = [
        { name: 'routes', source: 'PostgreSQL/PostGIS', description: 'Thông tin tuyến BRT, geometry linestring, danh sách trạm', recordCount: 4, lastUpdated: 'Hôm nay', icon: '🛣️', iconBg: 'bg-blue-100', db: 'postgres', tags: ['GIS', 'Core'] },
        { name: 'vehicles', source: 'PostgreSQL', description: 'Đăng ký phương tiện, trạng thái, thiết bị lắp đặt', recordCount: 25, lastUpdated: 'Hôm nay', icon: '🚌', iconBg: 'bg-emerald-100', db: 'postgres', tags: ['Fleet', 'Core'] },
        { name: 'vehicle_telemetry', source: 'TimescaleDB', description: 'Dữ liệu cảm biến IoT: nhiệt độ, nhiên liệu, vị trí, tốc độ', recordCount: 2500000, lastUpdated: '5 phút trước', icon: '📡', iconBg: 'bg-amber-100', db: 'timescale', tags: ['IoT', 'TimeSeries'] },
        { name: 'gps_tracks', source: 'TimescaleDB', description: 'Lịch sử GPS tracking với hypertable time partitioning', recordCount: 15000000, lastUpdated: 'Real-time', icon: '📍', iconBg: 'bg-red-100', db: 'timescale', tags: ['GPS', 'TimeSeries'] },
        { name: 'route_graph', source: 'Neo4j', description: 'Graph model: Station nodes, Route relationships, Transfer edges', recordCount: 150, lastUpdated: 'Hôm qua', icon: '🕸️', iconBg: 'bg-violet-100', db: 'neo4j', tags: ['Graph', 'Network'] },
        { name: 'od_matrix', source: 'Hive/HDFS', description: 'Ma trận OD analysis từ boarding/alighting data', recordCount: 50000, lastUpdated: 'Hàng ngày', icon: '🗺️', iconBg: 'bg-indigo-100', db: 'hive', tags: ['BigData', 'Analytics'] },
        { name: 'passenger_events', source: 'Hive/HDFS', description: 'Event log hành khách: boarding, alighting, transfer', recordCount: 8000000, lastUpdated: 'Hàng ngày', icon: '👥', iconBg: 'bg-cyan-100', db: 'hive', tags: ['BigData', 'Events'] },
        { name: 'incidents', source: 'PostgreSQL', description: 'Sự cố vận hành, workflow xử lý, resolution log', recordCount: 342, lastUpdated: 'Hôm nay', icon: '⚠️', iconBg: 'bg-orange-100', db: 'postgres', tags: ['Operations', 'Core'] },
        { name: 'predictive_models', source: 'Hive/HDFS', description: 'ML model results: maintenance prediction, demand forecast', recordCount: 12000, lastUpdated: '3 ngày trước', icon: '🤖', iconBg: 'bg-pink-100', db: 'hive', tags: ['ML', 'BigData'] },
    ];

    get filteredDatasets() {
        return this.datasets.filter(d =>
            (!this.searchTerm || d.name.includes(this.searchTerm.toLowerCase()) || d.description.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
            (!this.filterDB || d.db === this.filterDB)
        );
    }
}
