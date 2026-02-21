import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.token;

    let authReq = req;
    if (token) {
        authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                authService.logout();
                router.navigate(['/login']);
            }
            if (error.status === 403) {
                router.navigate(['/forbidden']);
            }
            return throwError(() => error);
        })
    );
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message = 'Đã xảy ra lỗi không xác định';
            if (error.error instanceof ErrorEvent) {
                message = error.error.message;
            } else {
                switch (error.status) {
                    case 0: message = 'Không thể kết nối đến server'; break;
                    case 400: message = 'Yêu cầu không hợp lệ'; break;
                    case 404: message = 'Không tìm thấy tài nguyên'; break;
                    case 500: message = 'Lỗi hệ thống nội bộ'; break;
                }
            }
            console.error(`[HTTP Error] ${error.status}: ${message}`, error);
            return throwError(() => new Error(message));
        })
    );
};
