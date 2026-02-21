import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest } from '../models';
import { MOCK_USERS, MOCK_CREDENTIALS } from '../mock-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'brt_token';
  private userKey = 'brt_user';

  constructor() {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const stored = localStorage.getItem(this.userKey);
    if (stored) {
      try {
        const user = JSON.parse(stored);
        this.currentUserSubject.next(user);
      } catch { localStorage.removeItem(this.userKey); }
    }
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    const cred = MOCK_CREDENTIALS.find(c => c.username === req.username && c.password === req.password);
    if (!cred) {
      return throwError(() => new Error('Sai tên đăng nhập hoặc mật khẩu'));
    }
    const user = MOCK_USERS.find(u => u.id === cred.userId)!;
    const response: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-' + Date.now(),
      user: { ...user, lastLogin: new Date() },
      expiresIn: 3600
    };
    return of(response).pipe(
      delay(800),
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.userKey, JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasRole(roles: string[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }
}
