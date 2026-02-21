import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataPlatformService } from '../../core/services/data.service';
import { NiFiFlowStatus, KafkaTopicStatus } from '../../core/models';

@Component({
  selector: 'app-data-platform',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="page-title">Data Platform</h1>
        <p class="text-sm text-slate-500 mt-1">NiFi • Kafka • HDFS • Hive • Ranger</p>
      </div>

      <!-- Architecture -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Kiến trúc Big Data Pipeline</h3>
        <div class="flex items-center justify-center gap-4 flex-wrap">
          <div *ngFor="let node of pipelineNodes" class="text-center">
            <div class="w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all hover:shadow-lg" [ngClass]="node.color">
              <p class="text-2xl mb-1">{{ node.icon }}</p>
              <p class="text-xs font-bold">{{ node.name }}</p>
            </div>
            <p class="text-[10px] text-slate-400 mt-1">{{ node.status }}</p>
          </div>
        </div>
      </div>

      <!-- NiFi Flows -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Apache NiFi — Data Flows</h3>
        <div class="space-y-3">
          <div *ngFor="let flow of nifiFlows" class="flex items-center gap-4 p-4 rounded-xl border" [ngClass]="flow.status==='RUNNING'?'border-emerald-200 bg-emerald-50':flow.status==='STOPPED'?'border-red-200 bg-red-50':'border-amber-200 bg-amber-50'">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" [ngClass]="flow.status==='RUNNING'?'bg-emerald-100 text-emerald-600':flow.status==='STOPPED'?'bg-red-100 text-red-600':'bg-amber-100 text-amber-600'">
              {{ flow.status==='RUNNING'?'▶':'■' }}
            </div>
            <div class="flex-1">
              <p class="font-bold text-sm">{{ flow.name }}</p>
              <p class="text-xs text-slate-500">{{ flow.description }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold">{{ flow.inputRecords.toLocaleString() }} ➜ {{ flow.outputRecords.toLocaleString() }}</p>
              <p class="text-[10px] text-slate-400">in/out records</p>
            </div>
            <div class="text-right">
              <p class="text-sm">{{ flow.errorCount }}</p>
              <p class="text-[10px]" [ngClass]="flow.errorCount>0?'text-red-500':'text-emerald-500'">errors</p>
            </div>
            <span class="badge" [ngClass]="flow.status==='RUNNING'?'badge-success':flow.status==='STOPPED'?'badge-danger':'badge-warning'">{{ flow.status }}</span>
          </div>
        </div>
      </div>

      <!-- Kafka Topics -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Apache Kafka — Topics</h3>
        <div class="table-container">
          <table class="data-table">
            <thead><tr><th>Topic</th><th>Partitions</th><th>Replicas</th><th>Messages In/s</th><th>Consumer Groups</th><th>Lag</th></tr></thead>
            <tbody>
              <tr *ngFor="let t of kafkaTopics">
                <td class="font-mono text-xs font-bold">{{ t.topicName }}</td>
                <td class="text-center">{{ t.partitions }}</td>
                <td class="text-center">{{ t.replicas }}</td>
                <td class="text-center font-bold text-blue-600">{{ t.messagesPerSecond }}</td>
                <td class="text-center">{{ t.consumerGroups }}</td>
                <td class="text-center"><span class="font-bold" [ngClass]="t.consumerLag > 1000 ? 'text-red-600' : t.consumerLag > 100 ? 'text-amber-600' : 'text-emerald-600'">{{ t.consumerLag.toLocaleString() }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- HDFS & Hive -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">HDFS Status</h3>
          <div class="space-y-3">
            <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Tổng dung lượng</span><span class="font-bold">2.4 TB</span></div>
            <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Đã sử dụng</span><span class="font-bold text-blue-600">1.8 TB (75%)</span></div>
            <div class="h-3 bg-slate-100 rounded-full"><div class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style="width:75%"></div></div>
            <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">DataNodes</span><span class="badge badge-success">3 online</span></div>
            <div class="flex justify-between py-2"><span class="text-sm text-slate-500">NameNode HA</span><span class="badge badge-success">Active</span></div>
          </div>
        </div>
        <div class="bg-white rounded-2xl border p-6">
          <h3 class="card-title mb-4">Hive Metastore</h3>
          <div class="space-y-3">
            <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Databases</span><span class="font-bold">3</span></div>
            <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Tables</span><span class="font-bold text-blue-600">28</span></div>
            <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Partitions</span><span class="font-bold">1,245</span></div>
            <div class="flex justify-between py-2 border-b border-slate-50"><span class="text-sm text-slate-500">Query Engine</span><span class="badge badge-success">Tez Active</span></div>
            <div class="flex justify-between py-2"><span class="text-sm text-slate-500">Ranger Policies</span><span class="badge badge-info">12 active</span></div>
          </div>
        </div>
      </div>

      <!-- Ranger -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Apache Ranger — Access Policies</h3>
        <div class="grid grid-cols-4 gap-4">
          <div *ngFor="let policy of rangerPolicies" class="p-4 rounded-xl border text-center hover:shadow-md transition-all">
            <p class="text-lg font-bold text-blue-600">{{ policy.count }}</p>
            <p class="text-sm text-slate-600">{{ policy.name }}</p>
            <p class="text-[10px] text-slate-400 mt-1">{{ policy.scope }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DataPlatformComponent implements OnInit {
  nifiFlows: NiFiFlowStatus[] = [];
  kafkaTopics: KafkaTopicStatus[] = [];

  pipelineNodes = [
    { name: 'GPS/IoT', icon: '📡', color: 'border-blue-300 bg-blue-50', status: 'Source' },
    { name: 'NiFi', icon: '🔄', color: 'border-amber-300 bg-amber-50', status: 'Ingestion' },
    { name: 'Kafka', icon: '📨', color: 'border-purple-300 bg-purple-50', status: 'Streaming' },
    { name: 'HDFS', icon: '💾', color: 'border-emerald-300 bg-emerald-50', status: 'Storage' },
    { name: 'Hive', icon: '🐝', color: 'border-amber-300 bg-amber-50', status: 'Analytics' },
    { name: 'Ranger', icon: '🛡️', color: 'border-red-300 bg-red-50', status: 'Security' },
  ];

  rangerPolicies = [
    { name: 'HDFS', count: 8, scope: 'Read/Write' },
    { name: 'Hive', count: 12, scope: 'Select/Insert' },
    { name: 'Kafka', count: 6, scope: 'Consume/Produce' },
    { name: 'NiFi', count: 4, scope: 'Flow Control' },
  ];

  constructor(private dataPlatformService: DataPlatformService) { }
  ngOnInit() {
    this.dataPlatformService.getNiFiFlows().subscribe(f => this.nifiFlows = f);
    this.dataPlatformService.getKafkaTopics().subscribe(t => this.kafkaTopics = t);
  }
}
