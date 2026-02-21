import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataPlatformService } from '../../../core/services/data.service';
import { NiFiFlowStatus, KafkaTopicStatus } from '../../../core/models';

@Component({
  selector: 'app-data-flows',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div><h1 class="page-title">Data Flows</h1><p class="text-sm text-slate-500 mt-1">Apache NiFi Flows & Kafka Topics</p></div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-emerald-600">{{ runningFlows }}</p><p class="text-xs text-slate-500 mt-1">NiFi Flows Running</p>
        </div>
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-blue-600">{{ kafkaTopics.length }}</p><p class="text-xs text-slate-500 mt-1">Kafka Topics</p>
        </div>
        <div class="bg-white rounded-2xl border p-5 text-center">
          <p class="text-3xl font-bold text-purple-600">{{ totalMessages | number }}</p><p class="text-xs text-slate-500 mt-1">Messages/min</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- NiFi Flows -->
        <div class="bg-white rounded-2xl border overflow-hidden">
          <div class="p-4 border-b"><h3 class="card-title">🔄 NiFi Data Flows</h3></div>
          <div class="divide-y">
            <div *ngFor="let flow of nifiFlows" class="p-4 hover:bg-slate-50">
              <div class="flex items-center justify-between mb-2">
                <span class="font-semibold text-sm">{{ flow.name }}</span>
                <span class="badge" [ngClass]="flow.status === 'RUNNING' ? 'badge-success' : flow.status === 'STOPPED' ? 'badge-neutral' : 'badge-danger'">{{ flow.status }}</span>
              </div>
              <div class="grid grid-cols-3 gap-2 text-xs text-slate-500">
                <div class="p-2 bg-slate-50 rounded-lg text-center"><p class="font-bold text-blue-600">{{ flow.inputCount }}</p><p>Input</p></div>
                <div class="p-2 bg-slate-50 rounded-lg text-center"><p class="font-bold text-emerald-600">{{ flow.outputCount }}</p><p>Output</p></div>
                <div class="p-2 bg-slate-50 rounded-lg text-center"><p class="font-bold" [ngClass]="flow.errorCount > 0 ? 'text-red-600' : 'text-slate-400'">{{ flow.errorCount }}</p><p>Errors</p></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kafka Topics -->
        <div class="bg-white rounded-2xl border overflow-hidden">
          <div class="p-4 border-b"><h3 class="card-title">📨 Kafka Topics</h3></div>
          <div class="divide-y">
            <div *ngFor="let topic of kafkaTopics" class="p-4 hover:bg-slate-50">
              <div class="flex items-center justify-between mb-2">
                <span class="font-mono text-sm font-medium">{{ topic.name }}</span>
                <span class="badge" [ngClass]="topic.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'">{{ topic.status }}</span>
              </div>
              <div class="flex items-center gap-4 text-xs text-slate-500">
                <span>📦 {{ topic.partitions }} partitions</span>
                <span>📄 {{ topic.messageRate || topic.messagesPerSecond }}/min</span>
                <span [ngClass]="topic.consumerLag > 100 ? 'text-red-600 font-bold' : ''">Lag: {{ topic.consumerLag }}</span>
              </div>
              <div class="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                <div class="h-1.5 rounded-full transition-all" [style.width.%]="Math.min((topic.messageRate || topic.messagesPerSecond) / 10, 100)"
                  [ngClass]="topic.consumerLag > 100 ? 'bg-red-500' : 'bg-emerald-500'"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Pipeline Architecture -->
      <div class="bg-white rounded-2xl border p-6">
        <h3 class="card-title mb-4">Pipeline Architecture</h3>
        <div class="flex items-center justify-between gap-4 overflow-x-auto py-4">
          <div *ngFor="let step of pipelineSteps; let i = index" class="flex items-center gap-3">
            <div class="flex flex-col items-center gap-2 min-w-[100px]">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center" [ngClass]="step.bg">
                <span class="text-2xl">{{ step.icon }}</span>
              </div>
              <p class="text-xs font-medium text-center">{{ step.label }}</p>
              <p class="text-[10px] text-slate-400 text-center">{{ step.tech }}</p>
            </div>
            <svg *ngIf="i < pipelineSteps.length - 1" class="w-8 h-4 text-slate-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 12"><path d="M0 6h20l-4-4m4 4l-4 4"/></svg>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DataFlowsComponent implements OnInit {
  nifiFlows: NiFiFlowStatus[] = [];
  kafkaTopics: KafkaTopicStatus[] = [];
  Math = Math;

  pipelineSteps = [
    { icon: '📡', label: 'IoT Sensors', tech: 'GPS / OBD-II', bg: 'bg-blue-100' },
    { icon: '🔄', label: 'NiFi Ingest', tech: 'Apache NiFi', bg: 'bg-emerald-100' },
    { icon: '📨', label: 'Kafka Stream', tech: 'Kafka Topics', bg: 'bg-amber-100' },
    { icon: '💾', label: 'Storage', tech: 'HDFS + TimescaleDB', bg: 'bg-purple-100' },
    { icon: '🔍', label: 'Processing', tech: 'Hive + Kylo', bg: 'bg-red-100' },
    { icon: '📊', label: 'Dashboard', tech: 'Angular Frontend', bg: 'bg-indigo-100' },
  ];

  constructor(private ds: DataPlatformService) { }
  ngOnInit() {
    this.ds.getNiFiFlows().subscribe(f => this.nifiFlows = f);
    this.ds.getKafkaTopics().subscribe(t => this.kafkaTopics = t);
  }
  get runningFlows() { return this.nifiFlows.filter(f => f.status === 'RUNNING').length; }
  get totalMessages() { return this.kafkaTopics.reduce((a, t) => a + (t.messageRate || t.messagesPerSecond || 0), 0); }
}
