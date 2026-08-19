# MyCifras

## Descrição do projeto

MyCifras é uma aplicação **local e pessoal** para gerenciar cifras musicais (chord charts). Permite criar, editar, organizar e versionar suas próprias versões simplificadas/corrigidas de músicas — ideal para violão, guitarra e teclado. Resolve o problema de cifras incorretas em sites públicos que são revertidas por outros usuários, e suporta criação de playlists (listas) para ensaios e apresentações.

## Tecnologias

### Backend
- **Java 21**
- **Spring Boot 4.1.0**
- **Spring Data JPA** / Hibernate
- **PostgreSQL 17** (runtime)
- **Lombok**
- **Maven** (build)

### Frontend
- **Angular 22**
- **TypeScript 6.0**
- **Tailwind CSS 4.x**
- **pnpm** (gerenciador de pacotes)
- **Vitest** (testes)

### Infraestrutura
- **Docker** / **Docker Compose**
- **PostgreSQL** em container

## Instalação

### 1. Via Docker (Recomendado)

**Pré-requisitos:**
- Docker Engine 24+
- Docker Compose 2+

**Passos:**

```bash
# Clone o repositório
git clone <url-do-repo>
cd mycifras

# Copie o arquivo de ambiente e ajuste
cp .env.example .env

# Suba os containers
docker compose up -d

# Acesse:
# Frontend: http://localhost
# Backend API: http://localhost:8080/api
# Admin: http://localhost/admin
```

**Parar:**
```bash
docker compose down
```

**Parar e remover dados do banco:**
```bash
docker compose down -v
```

---

### 2. Instalação Manual (Desenvolvimento)

**Pré-requisitos:**
- **Java 21** (JDK)
- **Node.js 20+** 
- **pnpm 9+** (`npm install -g pnpm`)
- **Angular CLI 22** (`pnpm add -g @angular/cli@22`)
- **PostgreSQL 17** rodando localmente (ou via Docker: `docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cifras_db -p 5432:5432 postgres:17-alpine`)

**Backend:**

```bash
cd Backend

# Configure variáveis de ambiente (ou use application.properties defaults)
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/cifras_db
export SPRING_DATASOURCE_USERNAME=postgres 
export SPRING_DATASOURCE_PASSWORD=postgres

Verifique se o seu USERNAME e PASSWORD REALMENTE SÃO ESSAS.

# Compile e rode
./mvnw spring-boot:run
```

Backend disponível em `http://localhost:8080/api`

**Frontend:**

```bash
cd frontend

# Instale dependências
pnpm install

# Configure API URL (opcional, default: http://localhost:8080)
# Edite src/environments/environment.ts se necessário

# Rode em modo desenvolvimento
pnpm start
```

Frontend disponível em `http://localhost:4200`

**Build de produção:**
```bash
# Backend
./mvnw clean package -DskipTests

# Frontend
pnpm build
```

---

## Backup / Restore

- **Backup:** `GET /api/backup` → baixa arquivo `.sql` (pg_dump)
- **Restore:** `POST /api/admin/restore-backup` (multipart/form-data com arquivo `.sql`)
  - Usa banco temporário + validação + swap atômico (seguro contra falhas parciais)
- Interface em `/admin`

---

Powered by **OpenCode** & **Big Pickle**