# BRT Gestão — Frontend

Hệ thống quản lý vận hành xe buýt nhanh BRT (Bus Rapid Transit).  
Frontend được xây dựng bằng **Angular 17** + **Tailwind CSS** + **NgRx**, chạy độc lập với mock data hoặc kết nối full-stack với backend Spring Boot.

---

## 1. Cấu trúc ban đầu khi mở bằng VS Code
Mở bằng VS Code sẽ thấy:

```
frontend/
├── .editorconfig
├── .gitignore
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   └── tasks.json
├── angular.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.scss
    ├── favicon.ico
    ├── assets/
    │   ├── .gitkeep
    │   └── logo.png
    └── app/
        ├── app.component.ts
        ├── app.config.ts
        ├── app.routes.ts
        ├── core/
        │   ├── guards/
        │   │   └── auth.guard.ts
        │   ├── interceptors/
        │   │   └── auth.interceptor.ts
        │   ├── mock-data/
        │   │   └── index.ts
        │   ├── models/
        │   │   └── index.ts
        │   ├── services/
        │   │   ├── auth.service.ts
        │   │   ├── data.service.ts
        │   │   ├── route.service.ts
        │   │   └── vehicle.service.ts
        │   └── store/
        │       ├── auth/
        │       │   └── index.ts
        │       ├── drivers/
        │       │   └── index.ts
        │       ├── incidents/
        │       │   └── index.ts
        │       ├── routes/
        │       │   └── index.ts
        │       ├── schedules/
        │       │   └── index.ts
        │       ├── stations/
        │       │   └── index.ts
        │       ├── tickets/
        │       │   └── index.ts
        │       └── vehicles/
        │           └── index.ts
        ├── features/
        │   ├── analytics/
        │   │   ├── analytics.component.ts
        │   │   ├── network-analysis/
        │   │   │   └── network-analysis.component.ts
        │   │   ├── passenger-analysis/
        │   │   │   └── passenger-analysis.component.ts
        │   │   └── reports/
        │   │       └── reports.component.ts
        │   ├── auth/
        │   │   └── login/
        │   │       └── login.component.ts
        │   ├── dashboard/
        │   │   └── dashboard.component.ts
        │   ├── data-platform/
        │   │   ├── data-platform.component.ts
        │   │   ├── data-catalog/
        │   │   │   └── data-catalog.component.ts
        │   │   └── data-flows/
        │   │       └── data-flows.component.ts
        │   ├── drivers/
        │   │   ├── driver-detail/
        │   │   │   └── driver-detail.component.ts
        │   │   ├── driver-form/
        │   │   │   └── driver-form.component.ts
        │   │   └── driver-list/
        │   │       └── driver-list.component.ts
        │   ├── incidents/
        │   │   ├── incident-detail/
        │   │   │   └── incident-detail.component.ts
        │   │   ├── incident-form/
        │   │   │   └── incident-form.component.ts
        │   │   └── incident-list/
        │   │       └── incident-list.component.ts
        │   ├── maintenance/
        │   │   ├── maintenance.component.ts
        │   │   ├── parts-inventory/
        │   │   │   └── parts-inventory.component.ts
        │   │   ├── schedule/
        │   │   │   └── maintenance-schedule.component.ts
        │   │   └── work-orders/
        │   │       └── work-orders.component.ts
        │   ├── notifications/
        │   │   └── notification-center.component.ts
        │   ├── passenger-portal/
        │   │   └── passenger-portal.component.ts
        │   ├── routes/
        │   │   ├── route-detail/
        │   │   │   └── route-detail.component.ts
        │   │   ├── route-form/
        │   │   │   └── route-form.component.ts
        │   │   └── route-list/
        │   │       └── route-list.component.ts
        │   ├── schedules/
        │   │   ├── dispatch/
        │   │   │   └── dispatch.component.ts
        │   │   ├── schedule-detail/
        │   │   │   └── schedule-detail.component.ts
        │   │   ├── schedule-form/
        │   │   │   └── schedule-form.component.ts
        │   │   └── schedule-list/
        │   │       └── schedule-list.component.ts
        │   ├── security/
        │   │   ├── security.component.ts
        │   │   ├── audit-log/
        │   │   │   └── audit-log.component.ts
        │   │   ├── roles/
        │   │   │   └── roles.component.ts
        │   │   └── users/
        │   │       └── users.component.ts
        │   ├── settings/
        │   │   └── settings.component.ts
        │   ├── shared/
        │   │   └── forbidden/
        │   │       └── forbidden.component.ts
        │   ├── stations/
        │   │   ├── station-detail/
        │   │   │   └── station-detail.component.ts
        │   │   ├── station-form/
        │   │   │   └── station-form.component.ts
        │   │   └── station-list/
        │   │       └── station-list.component.ts
        │   ├── tickets/
        │   │   ├── revenue/
        │   │   │   └── revenue.component.ts
        │   │   ├── ticket-list/
        │   │   │   └── ticket-list.component.ts
        │   │   └── ticket-types/
        │   │       └── ticket-types.component.ts
        │   └── vehicles/
        │       ├── vehicle-detail/
        │       │   └── vehicle-detail.component.ts
        │       ├── vehicle-form/
        │       │   └── vehicle-form.component.ts
        │       └── vehicle-list/
        │           └── vehicle-list.component.ts
        ├── layouts/
        │   └── main-layout/
        │       └── main-layout.component.ts
        └── shared/
            ├── components/
            │   ├── confirm-dialog/
            │   │   └── confirm-dialog.component.ts
            │   ├── loading/
            │   │   └── loading.component.ts
            │   └── toast/
            │       └── toast.component.ts
            ├── directives/
            │   └── index.ts
            └── pipes/
                └── index.ts
```

---

## Cài đặt dependencies — Các file được sinh thêm
Mở Terminal trong VS Code, chạy:

```bash
npm install
```
Sau khi lệnh hoàn tất, cấu trúc project sẽ có thêm:

```
frontend/
├── node_modules/            ← THƯ MỤC MỚI (hàng nghìn packages)
├── package-lock.json        ← FILE MỚI (nếu chưa có) hoặc được cập nhật
└── ... (các file cũ giữ nguyên)
```

---

## Chạy ứng dụng trên trình duyệt

```bash
npx ng serve
```
Sau khi build xong, thư mục `.angular/cache/` sẽ được tạo (hoặc cập nhật):

```
frontend/
├── .angular/
│   └── cache/
│       └── 17.3.17/
│           ├── vite/
│           │   └── deps/          ← các file .js, .js.map được cache
│           └── brt-gestao/
│               └── .tsbuildinfo
└── ... (các file cũ giữ nguyên)
```

```
http://localhost:4200
```

---

## Mock Data

| Username       | Password   | Role          |
|----------------|------------|---------------|
| `admin`        | `admin123` | ADMIN         |
| `opsmanager`   | `ops123`   | OPS_MANAGER   |
| `dispatcher1`  | `disp123`  | DISPATCHER    |
| `driver01`     | `drv123`   | DRIVER        |
| `analyst1`     | `ana123`   | ANALYST       |
| `finance1`     | `fin123`   | FINANCE       |
| `maint1`       | `mnt123`   | MAINTENANCE   |

Mỗi role sẽ thấy các module khác nhau trên sidebar tùy theo phân quyền.

---

## Build production

```bash
npm run build
```

File output được sinh ra trong:

```
frontend/
├── dist/
│   └── brt-gestao/
│       └── browser/
│           ├── index.html
│           ├── main-[hash].js
│           ├── polyfills-[hash].js
│           ├── styles-[hash].css
│           ├── chunk-[hash].js     ← nhiều chunk files (lazy loading)
│           ├── favicon.ico
│           └── assets/
│               └── logo.png
└── ...
```

**Quy tắc:**
- `core/` chỉ chứa singletons — KHÔNG import vào nhau (tránh circular dependency)
- `features/` mỗi module KHÔNG import component từ feature khác
- `shared/` là nơi duy nhất chứa reusable components
- `layouts/` chỉ chứa layout wrapper, KHÔNG chứa business logic

---

## 2. Component pattern

### Standalone Components (không dùng NgModule)

Toàn bộ project dùng standalone components. Không có NgModule nào.

```typescript
@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `...`,
  styles: [`...`]
})
export class RouteListComponent { }
```

### Single-file component

Template và styles viết inline trong file `.component.ts`. Không tách ra file `.html` và `.scss` riêng.

### Lazy loading

Tất cả feature components được lazy load qua `loadComponent` trong `app.routes.ts`:

```typescript
{
  path: 'routes',
  loadComponent: () => import('./features/routes/route-list/route-list.component')
    .then(m => m.RouteListComponent)
}
```

---

## 3. NgRx Store pattern

### Cấu trúc store

Mỗi domain có 1 file `index.ts` chứa tất cả: state, actions, reducer, selectors.

```
core/store/
├── auth/index.ts           AuthState (user, token, loading, error)
├── routes/index.ts         RouteState (EntityState<BrtRoute>)
├── vehicles/index.ts       VehicleState (EntityState<Vehicle>)
├── stations/index.ts       StationState (EntityState<Station>)
├── drivers/index.ts        DriverState (EntityState<Driver>)
├── schedules/index.ts      ScheduleState (EntityState<Schedule>)
├── tickets/index.ts        TicketState (EntityState<TicketTransaction>)
└── incidents/index.ts      IncidentState (EntityState<Incident>)
```

### Pattern áp dụng cho mỗi store slice

```typescript
// STATE — dùng @ngrx/entity cho collection
export interface RouteState extends EntityState<BrtRoute> {
  loading: boolean;
  error: string | null;
  selectedId: string | null;  // optional, cho detail views
}

// ACTIONS — naming convention: [Domain] Verb
export const loadRoutes = createAction('[Route] Load');
export const loadRoutesSuccess = createAction('[Route] Load Success', props<{ routes: BrtRoute[] }>());
export const loadRoutesFailure = createAction('[Route] Load Failure', props<{ error: string }>());

// REDUCER — immutable updates via EntityAdapter
export const routeReducer = createReducer(
  initialRouteState,
  on(loadRoutes, s => ({ ...s, loading: true })),
  on(loadRoutesSuccess, (s, { routes }) => routeAdapter.setAll(routes, { ...s, loading: false })),
  on(loadRoutesFailure, (s, { error }) => ({ ...s, loading: false, error }))
);

// SELECTORS
export const selectAllRoutes = routeAdapter.getSelectors(selectRouteState).selectAll;
export const selectRoutesLoading = createSelector(selectRouteState, s => s.loading);
```

---

## 4. Service pattern

### Mock mode (hiện tại)

```typescript
@Injectable({ providedIn: 'root' })
export class RouteService {
  getAll(): Observable<BrtRoute[]> {
    return of(MOCK_ROUTES).pipe(delay(300));
  }
}
```

### Chuyển sang real backend

Chỉ cần sửa trong `core/services/`, KHÔNG sửa components:

```typescript
@Injectable({ providedIn: 'root' })
export class RouteService {
  private apiUrl = '/api/routes';
  constructor(private http: HttpClient) {}

  getAll(): Observable<BrtRoute[]> {
    return this.http.get<ApiResponse<BrtRoute[]>>(this.apiUrl)
      .pipe(map(res => res.data));
  }
}
```

**Quy tắc:**
- Mỗi service `providedIn: 'root'` (singleton)
- Return type luôn là `Observable<T>`
- Không subscribe trong service, chỉ return Observable

---

## 5. Tailwind CSS

### Utility-first

Dùng Tailwind classes trực tiếp trong template. KHÔNG viết SCSS custom trừ global styles.

```html
<!-- ĐỂ ĐÚNG -->
<div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">

<!-- KHÔNG NÊN -->
<div class="custom-card">  <!-- rồi viết .custom-card trong SCSS -->
```

### Responsive

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

### Dark mode

Chưa triển khai. Nếu cần, dùng Tailwind `dark:` prefix.

---

## 6. Naming conventions

### Files

```
feature-name/
├── feature-action/
│   └── feature-action.component.ts
```

Ví dụ:
```
routes/
├── route-list/
│   └── route-list.component.ts
├── route-detail/
│   └── route-detail.component.ts
└── route-form/
    └── route-form.component.ts
```

### Components

| Loại | Naming | Ví dụ |
|---|---|---|
| List | `{entity}-list.component.ts` | route-list.component.ts |
| Detail | `{entity}-detail.component.ts` | route-detail.component.ts |
| Form (create + edit) | `{entity}-form.component.ts` | route-form.component.ts |

### Interfaces & Types

- Interface: PascalCase, mô tả entity → `BrtRoute`, `Vehicle`, `Station`
- Type alias (union): PascalCase → `VehicleStatus`, `UserRole`, `IncidentType`
- Enum values: SCREAMING_SNAKE_CASE → `'ACTIVE'`, `'UNDER_REPAIR'`

### NgRx

- Actions: `[Domain] Verb` → `'[Route] Load'`, `'[Vehicle] Load Success'`
- Feature key: lowercase → `'routes'`, `'vehicles'`, `'auth'`
- Selectors: `select` + description → `selectAllRoutes`, `selectRoutesLoading`

---

## 7. Route guards

### authGuard

Kiểm tra user đã đăng nhập chưa. Nếu chưa → redirect `/login`.

### roleGuard

Factory function nhận array roles, kiểm tra `currentUser.role`. Nếu không có quyền → redirect `/forbidden`.

```typescript
{
  path: 'routes/new',
  canActivate: [roleGuard(['ADMIN', 'OPS_MANAGER'])],
  loadComponent: () => import(...)
}
```

---

## 8. HTTP Interceptors

### authInterceptor

Tự động gắn `Authorization: Bearer {token}` vào mọi HTTP request.

### errorInterceptor

Xử lý error response:
- 0 → "Không thể kết nối đến server"
- 400 → "Yêu cầu không hợp lệ"
- 401 → auto logout + redirect `/login`
- 403 → redirect `/forbidden`
- 404 → "Không tìm thấy tài nguyên"
- 500 → "Lỗi hệ thống nội bộ"

---

## 9. Thư viện bên thứ ba

| Thư viện | Version | Dùng cho |
|---|---|---|
| Leaflet | 1.9.4 | Bản đồ real-time vehicle tracking |
| Chart.js + ng2-charts | 4.5.1 / 8.0.0 | Biểu đồ (passenger hourly, revenue, performance) |
| NgRx Store | 21.0.1 | State management |
| NgRx Entity | 21.0.1 | Collection management (adapter pattern) |
| NgRx Effects | 21.0.1 | Side effects (API calls) |
| NgRx Store DevTools | 21.0.1 | Redux DevTools extension (dev only) |
| uuid | 13.0.0 | Generate unique IDs |
