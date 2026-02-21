# Docker Compose — BRT Gestão

Toàn bộ hạ tầng chạy bằng 1 file: 13 databases/services + Kafka + NiFi + Hadoop + Hive + monitoring.

---

## Kiến trúc Docker

```
docker-compose.infra.yml      ← Databases + Message Broker + Big Data (khởi động trước)
docker-compose.yml             ← 13 microservices + infrastructure services (khởi động sau)
docker-compose.monitoring.yml  ← Prometheus + Grafana + ELK (tuỳ chọn)
```

---

## docker-compose.infra.yml

```yaml
version: '3.8'

services:
  # ==================== DATABASES ====================
  postgres:
    image: timescale/timescaledb-ha:pg16
    container_name: brt-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: brtadmin
      POSTGRES_PASSWORD: brtpass123
    volumes:
      - brt-pgdata:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U brtadmin"]
      interval: 10s
      timeout: 5s
      retries: 5

  neo4j:
    image: neo4j:5-community
    container_name: brt-neo4j
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      NEO4J_AUTH: neo4j/brtneo4j123
    volumes:
      - brt-neo4j-data:/data

  # ==================== MESSAGE BROKER ====================
  zookeeper:
    image: bitnami/zookeeper:latest
    container_name: brt-zookeeper
    ports:
      - "2181:2181"
    environment:
      ALLOW_ANONYMOUS_LOGIN: "yes"
    volumes:
      - brt-zk-data:/bitnami/zookeeper

  kafka:
    image: bitnami/kafka:latest
    container_name: brt-kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_CFG_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_CFG_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      ALLOW_PLAINTEXT_LISTENER: "yes"
      KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE: "true"
    depends_on:
      - zookeeper
    volumes:
      - brt-kafka-data:/bitnami/kafka

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: brt-kafka-ui
    ports:
      - "9093:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: brt-local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092

  # ==================== BIG DATA ====================
  nifi:
    image: apache/nifi:1.25.0
    container_name: brt-nifi
    ports:
      - "8443:8443"
    environment:
      SINGLE_USER_CREDENTIALS_USERNAME: admin
      SINGLE_USER_CREDENTIALS_PASSWORD: brtNifi123456
    volumes:
      - brt-nifi-data:/opt/nifi/nifi-current/conf

  hadoop-namenode:
    image: bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8
    container_name: brt-namenode
    ports:
      - "9870:9870"
      - "9000:9000"
    environment:
      CLUSTER_NAME: brt-hadoop
    volumes:
      - brt-hdfs-namenode:/hadoop/dfs/name

  hadoop-datanode:
    image: bde2020/hadoop-datanode:2.0.0-hadoop3.2.1-java8
    container_name: brt-datanode
    ports:
      - "9864:9864"
    environment:
      SERVICE_PRECONDITION: "hadoop-namenode:9870"
    volumes:
      - brt-hdfs-datanode:/hadoop/dfs/data

  hive-server:
    image: apache/hive:3.1.3
    container_name: brt-hive
    ports:
      - "10000:10000"
      - "10002:10002"
    depends_on:
      - postgres

volumes:
  brt-pgdata:
  brt-neo4j-data:
  brt-zk-data:
  brt-kafka-data:
  brt-nifi-data:
  brt-hdfs-namenode:
  brt-hdfs-datanode:
```

---

## docker/postgres/init.sql — Tạo databases cho mỗi service

```sql
-- Tạo 11 databases (database-per-service)
CREATE DATABASE brt_auth;
CREATE DATABASE brt_route;
CREATE DATABASE brt_vehicle;
CREATE DATABASE brt_station;
CREATE DATABASE brt_driver;
CREATE DATABASE brt_schedule;
CREATE DATABASE brt_ticket;
CREATE DATABASE brt_incident;
CREATE DATABASE brt_maintenance;
CREATE DATABASE brt_notification;
CREATE DATABASE brt_passenger;

-- Bật extensions cho các DB cần thiết
\c brt_route
CREATE EXTENSION IF NOT EXISTS postgis;

\c brt_station
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;

\c brt_vehicle
CREATE EXTENSION IF NOT EXISTS timescaledb;

\c brt_schedule
CREATE EXTENSION IF NOT EXISTS timescaledb;

\c brt_ticket
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

---

## Lệnh khởi động

```powershell
# 1. Khởi động infrastructure
docker compose -f docker-compose.infra.yml up -d

# 2. Chờ postgres healthy
docker compose -f docker-compose.infra.yml ps

# 3. Khởi động microservices
docker compose up -d

# 4. Kiểm tra
docker compose ps
docker compose logs -f auth-service

# 5. Dừng
docker compose down
docker compose -f docker-compose.infra.yml down

# 6. Dừng + xóa data
docker compose down -v
docker compose -f docker-compose.infra.yml down -v
```

---

## Kiểm tra services

| Service | Cách kiểm tra |
|---|---|
| PostgreSQL | `docker exec -it brt-postgres psql -U brtadmin -l` |
| Neo4j | Truy cập http://localhost:7474, login neo4j/brtneo4j123 |
| Kafka | Truy cập Kafka UI http://localhost:9093 |
| NiFi | Truy cập https://localhost:8443/nifi |
| HDFS | Truy cập http://localhost:9870 |
| Hive | `docker exec -it brt-hive beeline -u jdbc:hive2://localhost:10000` |
| Eureka | http://localhost:8761 |
| API Gateway | `curl http://localhost:8080/actuator/health` |

---

## Tài nguyên yêu cầu

| Profile | RAM | CPU | Mô tả |
|---|---|---|---|
| Minimal | 8 GB | 4 cores | Chỉ PostgreSQL + Neo4j + Kafka + 3 services |
| Standard | 16 GB | 6 cores | Tất cả DB + Kafka + 13 services (không Big Data) |
| Full | 24 GB | 8 cores | Tất cả bao gồm NiFi + Hadoop + Hive + monitoring |

Cấp RAM cho Docker Desktop: Settings → Resources → Memory.
