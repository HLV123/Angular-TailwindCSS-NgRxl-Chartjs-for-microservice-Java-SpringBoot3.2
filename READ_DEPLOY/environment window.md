# BRT Gestão — Hướng dẫn cài đặt môi trường trên Windows

Tài liệu này liệt kê **tất cả** phần mềm cần cài để chạy full project (Frontend + Backend microservices + Big Data pipeline) trên máy Windows.

---

## Tổng quan các thành phần cần cài

```
┌─────────────────────────────────────────────────────────────────┐
│                      MÁY WINDOWS CỦA BẠN                       │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  Frontend    │  │   Backend    │  │   Infrastructure       │ │
│  │  Node.js     │  │   JDK 21    │  │   Docker Desktop       │ │
│  │  npm         │  │   Maven     │  │     ├─ PostgreSQL 16   │ │
│  │  Angular CLI │  │   IntelliJ  │  │     ├─ Neo4j           │ │
│  │  VS Code     │  │   / VS Code │  │     ├─ Kafka           │ │
│  │              │  │             │  │     ├─ Zookeeper       │ │
│  │              │  │             │  │     ├─ NiFi            │ │
│  │              │  │             │  │     ├─ Hadoop/HDFS     │ │
│  │              │  │             │  │     ├─ Hive            │ │
│  │              │  │             │  │     ├─ Kylo            │ │
│  │              │  │             │  │     ├─ Ranger          │ │
│  │              │  │             │  │     ├─ Prometheus      │ │
│  │              │  │             │  │     ├─ Grafana         │ │
│  │              │  │             │  │     └─ ELK Stack       │ │
│  └─────────────┘  └──────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Yêu cầu phần cứng tối thiểu

| Thông số | Tối thiểu | Khuyến nghị |
|---|---|---|
| RAM | 16 GB | 32 GB |
| CPU | 4 cores | 8 cores |
| Ổ cứng trống | 50 GB | 100 GB (SSD) |
| Hệ điều hành | Windows 10 Pro 64-bit (build 19041+) | Windows 11 Pro 64-bit |

> Windows Pro/Enterprise/Education bắt buộc nếu dùng Docker Desktop với WSL 2 hoặc Hyper-V.  
> Windows Home cũng chạy được Docker Desktop nhưng chỉ qua WSL 2.

---

## 2. Nền tảng cơ sở — Cài trước tiên

### 2.1. WSL 2 (Windows Subsystem for Linux)
### 2.2. Git
### 2.3. Docker Desktop

---

## 3. Frontend — Môi trường Angular
### 3.1. Node.js
### 3.2. npm
### 3.3. Angular CLI
### 3.4. Visual Studio Code

---

## 4. Backend — Môi trường Java / Spring Boot
### 4.1. JDK 21
### 4.2. Apache Maven
### 4.3. 

| IDE | Tải |
|---|---|
| VS Code + Extension Pack for Java | https://code.visualstudio.com/ |

### 4.4. Lombok

Đã khai báo trong `pom.xml`, nhưng IDE cần hỗ trợ:
- VS Code: tự động qua Extension Pack for Java

---

## 5. Databases — Chạy qua Docker
### 5.1. PostgreSQL 16 + PostGIS + TimescaleDB

```powershell
docker run -d --name brt-postgres ^
  -p 5432:5432 ^
  -e POSTGRES_USER=brtadmin ^
  -e POSTGRES_PASSWORD=brtpass123 ^
  -e POSTGRES_DB=brt_gestao ^
  -v brt-pgdata:/var/lib/postgresql/data ^
  timescale/timescaledb-ha:pg16

# Sau khi container chạy, bật PostGIS:
docker exec -it brt-postgres psql -U brtadmin -d brt_gestao -c "CREATE EXTENSION IF NOT EXISTS postgis;"
docker exec -it brt-postgres psql -U brtadmin -d brt_gestao -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
```

| | |
|---|---|
| Port | 5432 |
| Image | `timescale/timescaledb-ha:pg16` (đã bao gồm PostgreSQL 16 + TimescaleDB) |
| PostGIS | Cài thêm extension trong container |
| GUI client (tuỳ chọn) | pgAdmin 4 — https://www.pgadmin.org/download/pgadmin-4-windows/ hoặc DBeaver |

### 5.2. Neo4j

```powershell
docker run -d --name brt-neo4j ^
  -p 7474:7474 -p 7687:7687 ^
  -e NEO4J_AUTH=neo4j/brtneo4j123 ^
  -v brt-neo4j-data:/data ^
  neo4j:5-community
```

| | |
|---|---|
| Port | 7474 (browser), 7687 (bolt) |
| Giao diện web | http://localhost:7474 |

---

## 6. Message Broker — Kafka
### 6.1. Zookeeper + Kafka

```powershell
# Zookeeper
docker run -d --name brt-zookeeper ^
  -p 2181:2181 ^
  -e ALLOW_ANONYMOUS_LOGIN=yes ^
  bitnami/zookeeper:latest

# Kafka
docker run -d --name brt-kafka ^
  -p 9092:9092 ^
  -e KAFKA_CFG_ZOOKEEPER_CONNECT=host.docker.internal:2181 ^
  -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 ^
  -e ALLOW_PLAINTEXT_LISTENER=yes ^
  bitnami/kafka:latest
```

| | |
|---|---|
| Kafka Port | 9092 |
| Zookeeper Port | 2181 |

### 6.2. Kafka UI (tuỳ chọn, giám sát)

```powershell
docker run -d --name brt-kafka-ui ^
  -p 9093:8080 ^
  -e KAFKA_CLUSTERS_0_NAME=brt-local ^
  -e KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=host.docker.internal:9092 ^
  provectuslabs/kafka-ui:latest
```

Truy cập: http://localhost:9093

---

## 7. Big Data Pipeline
### 7.1. Apache NiFi

```powershell
docker run -d --name brt-nifi ^
  -p 8443:8443 ^
  -e SINGLE_USER_CREDENTIALS_USERNAME=admin ^
  -e SINGLE_USER_CREDENTIALS_PASSWORD=brtNifi123456 ^
  apache/nifi:1.25.0
```

| | |
|---|---|
| Port | 8443 (HTTPS) |
| Giao diện web | https://localhost:8443/nifi |

### 7.2. Hadoop (HDFS) + Hive

Dùng Docker image all-in-one cho dev:

```powershell
docker run -d --name brt-hadoop ^
  -p 9870:9870 ^
  -p 8088:8088 ^
  -p 9000:9000 ^
  -p 10000:10000 ^
  -p 10002:10002 ^
  sequenceiq/hadoop-docker:2.7.1
```

Hoặc dùng image tách riêng Hive:

```powershell
docker run -d --name brt-hive ^
  -p 10000:10000 -p 10002:10002 ^
  apache/hive:3.1.3
```

| Service | Port |
|---|---|
| HDFS NameNode UI | http://localhost:9870 |
| YARN ResourceManager UI | http://localhost:8088 |
| HDFS RPC | 9000 |
| Hive Server2 (JDBC) | 10000 |
| Hive Web UI | http://localhost:10002 |

### 7.3. Apache Kylo

```powershell
docker run -d --name brt-kylo ^
  -p 8400:8400 ^
  teradata/kylo:latest
```

| | |
|---|---|
| Port | 8400 |
| Giao diện web | http://localhost:8400 |

### 7.4. Apache Ranger

```powershell
docker run -d --name brt-ranger ^
  -p 6080:6080 ^
  kadensungbincho/apache-ranger-docker:latest
```

| | |
|---|---|
| Port | 6080 |
| Giao diện web | http://localhost:6080 |
| Login mặc định | admin / rangerR0cks! |

---

## 8. Service Discovery & Config
### 8.1. Spring Cloud Config Server

Nằm trong source code `infrastructure/config-server/`, chạy bằng Maven:

```powershell
cd infrastructure\config-server
mvn spring-boot:run
```

| | |
|---|---|
| Port | 8888 |

### 8.2. Eureka Discovery Server

```powershell
cd infrastructure\discovery-server
mvn spring-boot:run
```

| | |
|---|---|
| Port | 8761 |
| Giao diện web | http://localhost:8761 |

### 8.3. API Gateway

```powershell
cd infrastructure\api-gateway
mvn spring-boot:run
```

| | |
|---|---|
| Port | 8080 |

---

## 9. Monitoring (tuỳ chọn)
### 9.1. Prometheus

```powershell
docker run -d --name brt-prometheus ^
  -p 9090:9090 ^
  -v %cd%\infrastructure\monitoring\prometheus\prometheus.yml:/etc/prometheus/prometheus.yml ^
  prom/prometheus:latest
```

| | |
|---|---|
| Port | 9090 |
| Giao diện web | http://localhost:9090 |

### 9.2. Grafana

```powershell
docker run -d --name brt-grafana ^
  -p 3000:3000 ^
  -e GF_SECURITY_ADMIN_PASSWORD=brtgrafana ^
  grafana/grafana:latest
```

| | |
|---|---|
| Port | 3000 |
| Giao diện web | http://localhost:3000 |
| Login | admin / brtgrafana |

### 9.3. ELK Stack (Elasticsearch + Logstash + Kibana)

```powershell
# Elasticsearch
docker run -d --name brt-elasticsearch ^
  -p 9200:9200 ^
  -e discovery.type=single-node ^
  -e xpack.security.enabled=false ^
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" ^
  elasticsearch:8.12.0

# Kibana
docker run -d --name brt-kibana ^
  -p 5601:5601 ^
  -e ELASTICSEARCH_HOSTS=http://host.docker.internal:9200 ^
  kibana:8.12.0

# Logstash
docker run -d --name brt-logstash ^
  -p 5044:5044 ^
  -e XPACK_MONITORING_ENABLED=false ^
  logstash:8.12.0
```

| Service | Port |
|---|---|
| Elasticsearch | 9200 |
| Kibana | http://localhost:5601 |
| Logstash | 5044 |

---

## 10. Bảng tổng hợp tất cả ports

| Service | Port | URL |
|---|---|---|
| **Frontend (Angular)** | 4200 | http://localhost:4200 |
| **API Gateway** | 8080 | http://localhost:8080 |
| **Config Server** | 8888 | http://localhost:8888 |
| **Eureka Discovery** | 8761 | http://localhost:8761 |
| auth-service | 8081 | |
| route-service | 8082 | |
| vehicle-service | 8083 | |
| station-service | 8084 | |
| driver-service | 8085 | |
| schedule-service | 8086 | |
| ticket-service | 8087 | |
| incident-service | 8088 | |
| maintenance-service | 8089 | |
| analytics-service | 8090 | |
| notification-service | 8091 | |
| data-platform-service | 8092 | |
| passenger-service | 8093 | |
| **PostgreSQL** | 5432 | |
| **Neo4j Browser** | 7474 | http://localhost:7474 |
| **Neo4j Bolt** | 7687 | |
| **Kafka** | 9092 | |
| **Zookeeper** | 2181 | |
| **Kafka UI** | 9093 | http://localhost:9093 |
| **NiFi** | 8443 | https://localhost:8443/nifi |
| **HDFS NameNode** | 9870 | http://localhost:9870 |
| **YARN** | 8088 | http://localhost:8088 |
| **HDFS RPC** | 9000 | |
| **Hive Server2** | 10000 | |
| **Hive Web UI** | 10002 | http://localhost:10002 |
| **Kylo** | 8400 | http://localhost:8400 |
| **Ranger** | 6080 | http://localhost:6080 |
| **Prometheus** | 9090 | http://localhost:9090 |
| **Grafana** | 3000 | http://localhost:3000 |
| **Elasticsearch** | 9200 | |
| **Kibana** | 5601 | http://localhost:5601 |
| **Logstash** | 5044 | |

---

## 11. Chạy toàn bộ bằng Docker Compose (cách nhanh nhất)

Thay vì chạy từng container riêng lẻ ở trên, dùng `docker-compose.yml` ở thư mục gốc backend:

```powershell
# Bước 1: Khởi động toàn bộ infrastructure
docker compose -f docker-compose.infra.yml up -d

# Bước 2: Build tất cả microservices
mvn clean package -DskipTests

# Bước 3: Khởi động toàn bộ services
docker compose up -d

# Bước 4: Chạy frontend
cd ..\frontend
npm install
npm start
```

Kiểm tra trạng thái:

```powershell
docker compose ps
docker compose logs -f [service-name]
```

---

## 12. Thứ tự khởi động khuyến nghị (chạy thủ công)

```
Bước 1:  Docker Desktop               ← bật lên đầu tiên
Bước 2:  PostgreSQL + Neo4j            ← databases
Bước 3:  Zookeeper → Kafka             ← message broker (Kafka phụ thuộc Zookeeper)
Bước 4:  NiFi + Hadoop + Hive          ← big data (nếu cần test data-platform)
Bước 5:  Kylo + Ranger                 ← data governance (nếu cần)
Bước 6:  Config Server                 ← phải chạy trước tất cả Spring services
Bước 7:  Eureka Discovery Server       ← service registry
Bước 8:  API Gateway                   ← entry point
Bước 9:  Các microservices (8081-8093) ← chạy song song
Bước 10: Prometheus + Grafana + ELK    ← monitoring (tuỳ chọn)
Bước 11: Frontend (ng serve)           ← cuối cùng
```

---

## 13. Checklist xác nhận môi trường

Chạy lần lượt trong PowerShell hoặc CMD để kiểm tra:

```powershell
# Nền tảng
wsl --list --verbose
git --version
docker --version
docker compose version

# Frontend
node --version          # ≥ 18.19
npm --version           # ≥ 9.x
ng version              # 17.3.x

# Backend
java --version          # 21.x
mvn --version           # ≥ 3.9

# Docker containers
docker ps               # liệt kê tất cả container đang chạy
```

Kết quả mong đợi — tất cả lệnh trả version, `docker ps` hiển thị các container ở trạng thái `Up`.

---

Tất cả databases và infrastructure services (PostgreSQL, Neo4j, Kafka, NiFi, Hadoop, Hive, Kylo, Ranger, Prometheus, Grafana, ELK) đều **chạy qua Docker** — không cần cài native trên Windows.
