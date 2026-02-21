// ============ ANALYTICS ============
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-analytics', standalone: true, imports: [CommonModule], template: `
<div class="space-y-6">
  <div><h1 class="page-title">Báo cáo & Phân tích dữ liệu</h1><p class="text-sm text-slate-500 mt-1">Analytics & Reports • Tích hợp Hive, HDFS, Neo4j cho phân tích dữ liệu lớn</p></div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="bg-white rounded-2xl border p-6 hover:shadow-lg transition-all cursor-pointer">
      <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4"><svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
      <h3 class="font-bold text-slate-800 mb-1">Báo cáo vận hành hàng ngày</h3>
      <p class="text-sm text-slate-500">OTP, chuyến xe, hành khách, doanh thu, sự cố</p>
      <p class="text-xs text-blue-600 mt-3 font-medium">REST API → PDF/Excel export</p>
    </div>
    <div class="bg-white rounded-2xl border p-6 hover:shadow-lg transition-all cursor-pointer">
      <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4"><svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg></div>
      <h3 class="font-bold text-slate-800 mb-1">Phân tích hành vi hành khách</h3>
      <p class="text-sm text-slate-500">OD Matrix, tuyến phổ biến, giờ cao điểm</p>
      <p class="text-xs text-purple-600 mt-3 font-medium">Hive Data Warehouse → GraphQL</p>
    </div>
    <div class="bg-white rounded-2xl border p-6 hover:shadow-lg transition-all cursor-pointer">
      <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4"><svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg></div>
      <h3 class="font-bold text-slate-800 mb-1">Dự báo nhu cầu</h3>
      <p class="text-sm text-slate-500">ML model trên Hadoop cluster dự báo hành khách</p>
      <p class="text-xs text-emerald-600 mt-3 font-medium">gRPC → ML Prediction Service</p>
    </div>
  </div>
  <div class="bg-white rounded-2xl border p-6">
    <h3 class="card-title mb-4">Phân tích mạng lưới tuyến (Neo4j Graph)</h3>
    <div class="grid grid-cols-2 gap-6">
      <div class="p-6 bg-slate-50 rounded-xl"><h4 class="font-semibold mb-2">Shortest Path Query</h4><code class="text-xs text-slate-500 block bg-white p-3 rounded-lg">MATCH path = shortestPath( (start:Station)-[:ON_ROUTE*..20]-&gt;(end:Station) ) RETURN path</code></div>
      <div class="p-6 bg-slate-50 rounded-xl"><h4 class="font-semibold mb-2">Station Centrality</h4><code class="text-xs text-slate-500 block bg-white p-3 rounded-lg">CALL gds.betweennessCentrality.stream(nodeProjection:'Station', relationshipProjection:'ON_ROUTE')</code></div>
    </div>
  </div>
</div>` })
export class AnalyticsComponent {}
