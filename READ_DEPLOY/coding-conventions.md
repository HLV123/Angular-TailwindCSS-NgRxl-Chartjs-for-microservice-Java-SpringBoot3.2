# Coding Conventions — BRT Gestão

Quy tắc code Java (Backend) · Angular (Frontend) · Git workflow.

---

## 1. Java / Spring Boot Conventions

### Package Structure (mỗi microservice)

```
com.brtgestao.{service}/
├── {Service}Application.java
├── config/          Configuration classes
├── controller/      REST controllers (thin — chỉ gọi service)
├── dto/             Request/Response DTOs
├── entity/          JPA entities
├── repository/      Spring Data repositories
├── service/         Interface + Impl (business logic)
├── mapper/          Entity ↔ DTO mapping (MapStruct)
├── exception/       Custom exceptions
├── client/          Feign clients (gọi service khác)
├── listener/        Kafka consumers
└── publisher/       Kafka producers
```

### Naming

| Loại | Convention | Ví dụ |
|---|---|---|
| Class | PascalCase | `RouteController`, `VehicleServiceImpl` |
| Method | camelCase, verb-first | `getById()`, `createRoute()`, `updateStatus()` |
| Variable | camelCase | `routeId`, `totalPassengers` |
| Constant | SCREAMING_SNAKE | `MAX_PAGE_SIZE`, `DEFAULT_SORT` |
| Enum value | SCREAMING_SNAKE | `ACTIVE`, `UNDER_REPAIR` |
| Table/Column | snake_case | `work_orders`, `plate_number` |
| Package | lowercase | `com.brtgestao.route` |
| REST endpoint | kebab-case | `/api/work-orders`, `/api/ticket-types` |

### Controller pattern

```java
@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {
    private final RouteService routeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','OPS_MANAGER','DISPATCHER','DRIVER','ANALYST')")
    public ResponseEntity<ApiResponse<List<RouteDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(routeService.getAll()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','OPS_MANAGER')")
    public ResponseEntity<ApiResponse<RouteDto>> create(@Valid @RequestBody RouteCreateRequest req) {
        return ResponseEntity.status(201).body(ApiResponse.success(routeService.create(req)));
    }
}
```

**Rules:**
- Controller chỉ validate + gọi service, KHÔNG có business logic
- Luôn trả `ResponseEntity<ApiResponse<T>>`
- Luôn có `@PreAuthorize` (xem rbac-matrix.md)
- Luôn dùng `@Valid` cho request body

### Service pattern

```java
public interface RouteService {
    List<RouteDto> getAll();
    RouteDto getById(String id);
    RouteDto create(RouteCreateRequest request);
}

@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {
    private final RouteRepository routeRepository;
    private final RouteMapper routeMapper;

    @Override
    @Transactional(readOnly = true)
    public List<RouteDto> getAll() {
        return routeRepository.findAll().stream()
            .map(routeMapper::toDto)
            .collect(Collectors.toList());
    }
}
```

**Rules:**
- Luôn tách Interface + Impl
- `@Transactional(readOnly = true)` cho GET methods
- `@Transactional` cho CUD methods
- Throw custom exceptions, KHÔNG return null

### DTO rules

- Request DTO: `{Entity}CreateRequest`, `{Entity}UpdateRequest`
- Response DTO: `{Entity}Dto`
- Validation annotations: `@NotNull`, `@NotBlank`, `@Size`, `@Pattern`
- KHÔNG expose Entity ra ngoài controller — luôn map sang DTO

---

## 2. Angular / TypeScript Conventions

(Xem chi tiết tại `READ_FRONTEND/frontend-conventions.md`)

Tóm tắt:
- Standalone components, single-file (inline template + styles)
- Tailwind utility-first, KHÔNG viết custom SCSS
- NgRx: actions → effects → reducers → selectors
- Services: `providedIn: 'root'`, return `Observable<T>`
- Naming: kebab-case files, PascalCase classes, camelCase methods/vars

---

## 3. Git Workflow

### Branch naming

```
main                    ← production-ready code
develop                 ← integration branch
feature/{service}/{ticket}-{description}
bugfix/{service}/{ticket}-{description}
hotfix/{ticket}-{description}
release/v{version}
```

Ví dụ:
```
feature/route-service/BRT-42-add-postgis-geometry
bugfix/vehicle-service/BRT-78-fix-telemetry-null
hotfix/BRT-99-auth-token-expired
```

### Commit message

```
{type}({scope}): {description}

feat(route-service): add PostGIS geometry column to routes table
fix(vehicle-service): handle null telemetry data
refactor(auth-service): extract JWT logic to separate class
docs(readme): update environment setup guide
test(ticket-service): add revenue calculation unit tests
chore(docker): update postgres image to 16.2
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`

### Pull Request checklist

```
[ ] Code compiles without errors
[ ] Unit tests pass (mvn test / ng test)
[ ] New code has test coverage ≥ 80%
[ ] @PreAuthorize added for new endpoints (check rbac-matrix.md)
[ ] DTO validation annotations added
[ ] Flyway migration added for schema changes
[ ] API contract updated (api-contracts.md)
[ ] No sensitive data in logs
[ ] No hardcoded values (use application.yml)
[ ] Kafka event schema documented (if new event)
```

---

## 4. Logging

### Java

```java
// Dùng SLF4J
@Slf4j
public class RouteServiceImpl {
    public RouteDto getById(String id) {
        log.info("Fetching route: {}", id);
        // ...
        log.error("Route not found: {}", id);
    }
}
```

**Rules:**
- KHÔNG log sensitive data (password, token, nationalId)
- Log format: `[timestamp] [level] [service-name] [traceId] message`
- INFO: business operations (create, update, delete)
- WARN: unexpected but recoverable (retry, fallback)
- ERROR: unrecoverable (exception, service down)
- DEBUG: development only (request/response body)

### Angular

```typescript
console.error(`[HTTP Error] ${error.status}: ${message}`, error);
```

---

## 5. Error Handling

### Java — Custom Exceptions

```java
throw new ResourceNotFoundException("Route", id);        // → 404
throw new DuplicateResourceException("Route", "code", code); // → 409
throw new ValidationException("Invalid date range");      // → 400
throw new UnauthorizedException("Token expired");         // → 401
throw new ForbiddenException("Insufficient permissions"); // → 403
```

### GlobalExceptionHandler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404)
            .body(ApiResponse.error(ex.getMessage()));
    }
}
```

### Angular — errorInterceptor

Đã có sẵn trong `core/interceptors/auth.interceptor.ts`:
- 401 → logout + redirect `/login`
- 403 → redirect `/forbidden`
- Khác → log error message
