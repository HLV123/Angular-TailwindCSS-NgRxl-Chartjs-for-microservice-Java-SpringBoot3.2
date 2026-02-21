import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BrtRoute } from '../models';
import { MOCK_ROUTES } from '../mock-data';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private routes = [...MOCK_ROUTES];

  getAll(): Observable<BrtRoute[]> {
    return of(this.routes).pipe(delay(300));
  }

  getById(id: string): Observable<BrtRoute | undefined> {
    return of(this.routes.find(r => r.id === id)).pipe(delay(200));
  }

  create(route: Partial<BrtRoute>): Observable<BrtRoute> {
    const newRoute: BrtRoute = {
      ...route as BrtRoute,
      id: 'r-' + (this.routes.length + 1).toString().padStart(3, '0'),
      createdAt: new Date(),
      updatedAt: new Date(),
      stations: route.stations || []
    };
    this.routes.push(newRoute);
    return of(newRoute).pipe(delay(500));
  }

  update(id: string, updates: Partial<BrtRoute>): Observable<BrtRoute> {
    const idx = this.routes.findIndex(r => r.id === id);
    if (idx >= 0) {
      this.routes[idx] = { ...this.routes[idx], ...updates, updatedAt: new Date() };
      return of(this.routes[idx]).pipe(delay(400));
    }
    throw new Error('Route not found');
  }

  delete(id: string): Observable<boolean> {
    this.routes = this.routes.filter(r => r.id !== id);
    return of(true).pipe(delay(300));
  }
}
