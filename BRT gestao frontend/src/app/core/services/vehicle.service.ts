import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Vehicle, VehiclePosition } from '../models';
import { MOCK_VEHICLES, MOCK_VEHICLE_POSITIONS } from '../mock-data';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private vehicles = [...MOCK_VEHICLES];

  getAll(): Observable<Vehicle[]> {
    return of(this.vehicles).pipe(delay(300));
  }

  getById(id: string): Observable<Vehicle | undefined> {
    return of(this.vehicles.find(v => v.id === id)).pipe(delay(200));
  }

  getPositions(): Observable<VehiclePosition[]> {
    const positions = MOCK_VEHICLE_POSITIONS.map(p => ({
      ...p,
      lat: p.lat + (Math.random() - 0.5) * 0.002,
      lng: p.lng + (Math.random() - 0.5) * 0.002,
      speed: p.speed + Math.floor(Math.random() * 10 - 5),
      timestamp: new Date()
    }));
    return of(positions).pipe(delay(100));
  }

  create(vehicle: Partial<Vehicle>): Observable<Vehicle> {
    const newVehicle: Vehicle = {
      ...vehicle as Vehicle,
      id: 'v-' + (this.vehicles.length + 1).toString().padStart(3, '0'),
      totalKm: 0, lastMaintenanceKm: 0, currentStatus: 'REGISTERED',
      createdAt: new Date()
    };
    this.vehicles.push(newVehicle);
    return of(newVehicle).pipe(delay(500));
  }

  update(id: string, updates: Partial<Vehicle>): Observable<Vehicle> {
    const idx = this.vehicles.findIndex(v => v.id === id);
    if (idx >= 0) {
      this.vehicles[idx] = { ...this.vehicles[idx], ...updates };
      return of(this.vehicles[idx]).pipe(delay(400));
    }
    throw new Error('Vehicle not found');
  }

  delete(id: string): Observable<boolean> {
    this.vehicles = this.vehicles.filter(v => v.id !== id);
    return of(true).pipe(delay(300));
  }
}
