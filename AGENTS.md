# AGENTS.md - MyCifras

## Project Overview

**MyCifras** is a personal, offline chord chart manager for managing fixed/simplified versions of musical chord charts (cifras). It solves the problem of:
- Fixing broken chord charts on sites like cifrasclub that get reverted by other users
- Creating simplified versions for memorization
- Supporting guitar, electric guitar, and keyboard (no sheet music)

**Architecture**: Microservices - Angular frontend + Spring Boot backend + PostgreSQL (Docker)

## Tech Stack

### Backend
- **Java 21** with **Spring Boot 4.1.0**
- **Spring Data JPA** + **PostgreSQL** (runtime)
- **Lombok** for boilerplate reduction
- **Maven** build tool
- Base package: `com.andersonjuniorz.cifras`

### Frontend
- **Angular 22** with TypeScript 6.0
- **Tailwind CSS 4.x** for styling
- **npm** package manager (configured in angular.json)
- Testing: **Vitest**

### Database
- **PostgreSQL** running in Docker (local)

## Project Structure

```
mycifras/
├── Backend/                    # Spring Boot API
│   ├── src/main/java/com/andersonjuniorz/cifras/
│   │   ├── CifrasApplication.java
│   │   ├── controller/         # REST controllers
│   │   ├── service/            # Business logic
│   │   ├── repository/         # JPA repositories
│   │   ├── model/              # Entity classes
│   │   └── dto/                # Data transfer objects
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                   # Angular app
│   └── src/app/
│       ├── components/         # UI components
│       ├── services/           # API services
│       ├── models/             # TypeScript interfaces
│       └── routes/
└── docker-compose.yml          # PostgreSQL container
```

## Domain Model

### Cifra (Chord Chart)
- `id` (Long) - Auto-generated primary key
- `titulo` (String) - Song title
- `artista` (String) - Artist/band name
- `tom` (String) - Musical key (e.g., "C", "Am", "G")
- `instrumento` (Enum) - GUITAR, ELECTRIC_GUITAR, KEYBOARD
- `conteudo` (String/TEXT) - The chord chart text content
- `fonte` (String) - Original source URL (optional)
- `observacoes` (String) - Personal notes about fixes/simplifications
- `criadoEm` (LocalDateTime) - Creation timestamp
- `atualizadoEm` (LocalDateTime) - Last update timestamp

## API Endpoints

```
GET    /api/cifras           - List all chord charts (with filters)
GET    /api/cifras/{id}      - Get chord chart by ID
POST   /api/cifras           - Create new chord chart
PUT    /api/cifras/{id}      - Update chord chart
DELETE /api/cifras/{id}      - Delete chord chart
GET    /api/cifras/search    - Search by title/artist
GET    /api/cifras/favoritos - List favorite chord charts
PATCH  /api/cifras/{id}/favorito - Toggle favorite status
GET    /api/listas           - List all playlists
GET    /api/listas/{id}      - Get playlist by ID
POST   /api/listas           - Create new playlist
PUT    /api/listas/{id}      - Update playlist
DELETE /api/listas/{id}      - Delete playlist
GET    /api/listas/search    - Search playlists by name
POST   /api/listas/{id}/cifras/{cifraId} - Add cifra to playlist
DELETE /api/listas/{id}/cifras/{cifraId} - Remove cifra from playlist
GET    /api/backup           - Download database backup (SQL)
GET    /api/admin/info       - Backend system info
POST   /api/admin/restore-backup - Restore database from SQL backup
```

## Frontend Routes

```
/                  - Home/Dashboard
/cifras            - List all chord charts
/cifras/novo       - Create new chord chart
/cifras/:id        - View chord chart
/cifras/:id/editar - Edit chord chart
/acordes           - Manage chord diagrams
/listas            - List all playlists
/listas/nova       - Create new playlist
/listas/:id        - View playlist
/listas/:id/editar - Edit playlist
/admin             - Admin (DB backup/restore, system info)
```

## Development Commands

### Backend
```bash
cd Backend
./mvnw spring-boot:run          # Run dev server
./mvnw test                     # Run tests
./mvnw clean install            # Full build
```

### Frontend
```bash
cd frontend
pnpm install                    # Install dependencies
pnpm start                      # Run dev server (ng serve)
pnpm build                      # Production build
pnpm test                       # Run unit tests
```

### Docker (PostgreSQL)
```bash
docker-compose up -d            # Start database
docker-compose down             # Stop database
docker-compose logs postgres    # View logs
```

## Code Conventions

### Backend (Java/Spring Boot)
- Use Lombok `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor` on entities
- DTOs for API requests/responses (never expose entities directly)
- Service layer handles business logic, repository only data access
- Use `@RestController` with `@RequestMapping("/api/...")`
- HTTP status codes: 201 Created, 204 No Content, 404 Not Found

### Frontend (Angular)
- Standalone components (Angular 22 default)
- Use `inject()` function instead of constructor injection
- Signals for reactive state (`signal()`, `computed()`)
- Tailwind CSS for all styling (no custom CSS unless necessary)
- Services use `HttpClient` with `provideHttpClient()`
- Component naming: `feature-name.component.ts`

### TypeScript Interfaces
```typescript
export interface Cifra {
  id?: number;
  titulo: string;
  artista: string;
  tom: string;
  instrumento: 'VIOLAO' | 'GUITARRA' | 'TECLADO';
  conteudo: string;
  fonte?: string;
  observacoes?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}
```

## Database Configuration

- **Container**: `postgres_db` (PostgreSQL 17 on Docker)
- **Database**: `${DB_NAME}` (default: `cifras_db`)
- **Schema init**: `schema.sql` via `spring.sql.init.mode=always`
- Credenciais via variáveis de ambiente (ver `.env.example`)

```properties
# application.properties (valores vindos do .env via Docker Compose)
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.hibernate.ddl-auto=none
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:schema.sql
```

## Environment Variables

Use `.env` (local, não commitado) baseado em `.env.example`:

```env
# Database
DB_NAME=cifras_db
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# Spring Datasource (derivados)
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/${DB_NAME}
SPRING_DATASOURCE_USERNAME=${DB_USERNAME}
SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}

# PostgreSQL Client (backup/restore)
PGHOST=postgres
PGDATABASE=${DB_NAME}
PGUSER=${DB_USERNAME}
PGPASSWORD=${DB_PASSWORD}

# Application
SERVER_PORT=8080

# Frontend
API_URL=http://localhost:8080
```

## Testing Strategy

- **Backend**: JUnit 5 + Spring Boot Test for integration tests
- **Frontend**: Vitest for unit tests
- Manual testing via Swagger UI or Postman for API validation

## Git Workflow

- Branch naming: `feature/`, `fix/`, `chore/`
- Commit messages in Portuguese or English (user preference)
- No CI/CD needed (personal offline project)

## Future Enhancements (Optional)

- Chord transposition (change key)
- Chord chart versioning/history
- Export to PDF/HTML
- Chord chart templates
- Search/filter by instrument, key, artist
