# Testing Guide — BRT Gestão

Test pyramid, coverage targets, tools, và cách viết test cho từng layer.

---

## 1. Test Pyramid

```
                    ┌─────────┐
                    │   E2E   │  5%   Cypress / Playwright
                    │  Tests  │       Full user flows
                    ├─────────┤
                  ┌─┤  Integ. ├─┐  20%  Testcontainers
                  │ │  Tests  │ │       API tests, DB tests
                  │ ├─────────┤ │
                ┌─┤ │  Unit   │ ├─┐  70%  JUnit 5 / Jasmine
                │ │ │  Tests  │ │ │      Service, Mapper, Utils
                │ │ ├─────────┤ │ │
              ┌─┤ │ │Contract │ │ ├─┐  5%   Pact / Spring Cloud Contract
              │ │ │ │  Tests  │ │ │ │      API contract verification
              └─┴─┴─┴─────────┴─┴─┴─┘
```

| Layer | Tỷ lệ | Tools | Scope |
|---|:---:|---|---|
| Unit Tests | 70% | JUnit 5, Mockito, Jasmine/Karma | Service logic, mapper, utils |
| Integration Tests | 20% | Testcontainers, MockMvc, WebTestClient | API endpoint, DB query, Kafka |
| Contract Tests | 5% | Spring Cloud Contract | REST contract giữa services |
| E2E Tests | 5% | Cypress hoặc Playwright | Full user flow qua UI |

---

## 2. Coverage Targets

| Scope | Target | Công cụ đo |
|---|:---:|---|
| Backend overall | ≥ 80% | JaCoCo |
| Service layer | ≥ 90% | JaCoCo |
| Controller layer | ≥ 80% | JaCoCo |
| Repository layer | ≥ 70% | JaCoCo (integration test) |
| Frontend overall | ≥ 75% | Karma + Istanbul |
| NgRx Store | ≥ 90% | Jasmine |
| Services | ≥ 85% | Jasmine |
| Components | ≥ 70% | Jasmine |

---

## 3. Backend — Unit Tests (JUnit 5 + Mockito)

### Service layer test

```java
@ExtendWith(MockitoExtension.class)
class RouteServiceImplTest {

    @Mock
    private RouteRepository routeRepository;

    @Mock
    private RouteMapper routeMapper;

    @InjectMocks
    private RouteServiceImpl routeService;

    @Test
    @DisplayName("getAll - trả về danh sách routes")
    void getAll_shouldReturnRoutes() {
        // Given
        Route entity = Route.builder().id("r-001").code("BRT-01").name("Kim Mã - Yên Nghĩa").build();
        RouteDto dto = new RouteDto("r-001", "BRT-01", "Kim Mã - Yên Nghĩa");
        when(routeRepository.findAll()).thenReturn(List.of(entity));
        when(routeMapper.toDto(entity)).thenReturn(dto);

        // When
        List<RouteDto> result = routeService.getAll();

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCode()).isEqualTo("BRT-01");
        verify(routeRepository).findAll();
    }

    @Test
    @DisplayName("getById - route không tồn tại - throw ResourceNotFoundException")
    void getById_notFound_shouldThrow() {
        when(routeRepository.findById("r-999")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> routeService.getById("r-999"));
    }

    @Test
    @DisplayName("create - mã tuyến trùng - throw DuplicateResourceException")
    void create_duplicateCode_shouldThrow() {
        RouteCreateRequest req = new RouteCreateRequest("BRT-01", "Test", "MAIN");
        when(routeRepository.existsByCode("BRT-01")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> routeService.create(req));
    }
}
```

### Naming convention cho test

```
{methodName}_{condition}_{expectedResult}

getAll_shouldReturnRoutes
getById_notFound_shouldThrow
create_duplicateCode_shouldThrow
updateStatus_fromOpenToInProgress_shouldSucceed
updateStatus_fromClosedToOpen_shouldThrowInvalidStateTransition
```

---

## 4. Backend — Integration Tests (Testcontainers)

### PostgreSQL Integration Test

```java
@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
class RouteRepositoryIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("timescale/timescaledb-ha:pg16")
        .withDatabaseName("brt_route_test")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private RouteRepository routeRepository;

    @Test
    void findByStatus_shouldReturnActiveRoutes() {
        // Flyway đã seed data
        List<Route> active = routeRepository.findByStatus("ACTIVE");
        assertThat(active).isNotEmpty();
        assertThat(active).allMatch(r -> "ACTIVE".equals(r.getStatus()));
    }
}
```

### Kafka Integration Test

```java
@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
class IncidentEventPublisherIntegrationTest {

    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"));

    @DynamicPropertySource
    static void kafkaProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
    }

    @Autowired
    private IncidentEventPublisher publisher;

    @Autowired
    private KafkaConsumer<String, String> testConsumer;

    @Test
    void publishIncidentCreated_shouldSendToKafka() {
        IncidentCreatedEvent event = new IncidentCreatedEvent("inc-test", "BREAKDOWN", "P2");
        publisher.publish(event);

        // Consume và verify
        ConsumerRecords<String, String> records = testConsumer.poll(Duration.ofSeconds(10));
        assertThat(records.count()).isEqualTo(1);
    }
}
```

### API Controller Integration Test (MockMvc)

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RouteControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAll_asAdmin_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/routes"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser(roles = "FINANCE")
    void getAll_asFinance_shouldReturn403() throws Exception {
        mockMvc.perform(get("/api/routes"))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void create_validRequest_shouldReturn201() throws Exception {
        String json = """
            {
              "code": "BRT-TEST",
              "name": "Test Route",
              "routeType": "BRANCH",
              "totalLengthKm": 10.5,
              "avgTravelTimeMin": 30,
              "color": "#000000",
              "stations": []
            }
            """;

        mockMvc.perform(post("/api/routes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.code").value("BRT-TEST"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void create_missingName_shouldReturn400() throws Exception {
        String json = """
            { "code": "BRT-TEST", "routeType": "BRANCH" }
            """;

        mockMvc.perform(post("/api/routes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.errors").isNotEmpty());
    }
}
```

---

## 5. Frontend — Unit Tests (Jasmine + Karma)

### Service test

```typescript
describe('RouteService', () => {
  let service: RouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteService);
  });

  it('getAll should return routes', (done) => {
    service.getAll().subscribe(routes => {
      expect(routes.length).toBeGreaterThan(0);
      expect(routes[0].code).toBe('BRT-01');
      done();
    });
  });

  it('getById should return specific route', (done) => {
    service.getById('r-001').subscribe(route => {
      expect(route).toBeDefined();
      expect(route!.name).toBe('Kim Mã - Yên Nghĩa');
      done();
    });
  });
});
```

### NgRx Store test

```typescript
describe('Route Reducer', () => {
  it('loadRoutesSuccess should set all routes', () => {
    const routes: BrtRoute[] = [{ id: 'r-001', code: 'BRT-01' } as BrtRoute];
    const action = loadRoutesSuccess({ routes });
    const state = routeReducer(initialRouteState, action);

    expect(state.loading).toBe(false);
    expect(state.ids.length).toBe(1);
  });

  it('loadRoutes should set loading to true', () => {
    const state = routeReducer(initialRouteState, loadRoutes());
    expect(state.loading).toBe(true);
  });
});
```

---

## 6. Chạy tests

### Backend

```bash
# Unit tests only
mvn test

# Integration tests (cần Docker chạy cho Testcontainers)
mvn verify -Pintegration-test

# Coverage report
mvn test jacoco:report
# Mở: target/site/jacoco/index.html

# Chạy test cho 1 service cụ thể
cd services/route-service
mvn test
```

### Frontend

```bash
# Unit tests
ng test

# Unit tests với coverage
ng test --code-coverage
# Mở: coverage/index.html

# Tests chạy 1 lần (CI mode)
ng test --watch=false --browsers=ChromeHeadless
```

---

## 7. Test data management

- **Unit test:** Dùng mock data tạo trong test (Builder pattern)
- **Integration test:** Dùng Flyway migration `V999__test_seed_data.sql` với profile `test`
- **E2E test:** Dùng API calls để seed data trước mỗi test suite, cleanup sau
- **KHÔNG bao giờ** chạy test trên database production
- Mock data trong frontend (`MOCK_*`) là reference cho backend seed data

---

## 8. CI/CD Test Pipeline

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────┐
│  Git Push    │────►│  Unit Tests  │────►│  Integration │────►│  Build  │
│              │     │  (mvn test)  │     │  Tests       │     │  Docker │
│              │     │  (ng test)   │     │  (Testcontainers)  │  Image  │
└─────────────┘     └──────┬───────┘     └──────┬───────┘     └────┬────┘
                           │                     │                  │
                    Coverage < 80%?        Any failure?        Push to
                    → BLOCK merge          → BLOCK merge       registry
```
