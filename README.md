# CineVault - Movie Theater Management System

A full-stack application built with NestJS (backend) and Angular 19 (frontend).

## Project Structure

```
windsurf-project/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication (JWT, Passport)
│   │   ├── movie/          # Movie management (v1/v2 versioning)
│   │   ├── genre/          # Genre management
│   │   ├── screening-task/ # Task management
│   │   ├── common/         # Middleware, Pipes, Filters, Interceptors
│   │   └── database/       # Seed script
│   └── .env files
└── frontend/         # Angular 19 App
    └── src/
        └── app/
            ├── components/   # Standalone components
            ├── services/     # Auth, Movie, BookingCart
            ├── guards/       # AuthGuard
            ├── interceptors/ # AuthInterceptor
            ├── pipes/        # DefaultImage, Team
            └── directives/   # Rainbow
```

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+
- Angular CLI 19

### Backend Setup

```bash
cd backend
npm install

# Create MySQL database
mysql -u root -p -e "CREATE DATABASE cinevault_dev;"

# Configure .env (already created with defaults)
# Start development server
npm run start:dev

# Seed database with sample data
npm run seed
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register user |
| `/auth/login` | POST | Login |
| `/v1/movies` | GET/POST | Movies (in-memory) |
| `/v2/movies` | GET/POST/PATCH/DELETE | Movies (database) |
| `/v1/tasks` | GET/POST | Tasks (in-memory) |
| `/v2/tasks` | GET/POST/PATCH/DELETE | Tasks (database) |
| `/genres` | GET/POST | Genres |

## Exercise References

### Backend (NestJS)
- **Exercise 2.1**: URI Versioning (v1/v2) for MovieController, TaskController
- **Exercise 3.1**: PartialType DTOs (UpdateMovieDto, UpdateTaskDto)
- **Exercise 4.1**: FirstMiddleware (log requests)
- **Exercise 4.2**: LoggerMiddleware (log IP, Method, User-Agent)
- **Exercise 6.1**: FusionUpperPipe (transform array to uppercase string)
- **Exercise 6.2**: FreezePipe (Object.freeze on DTOs)
- **Exercise 7.1**: CustomFilter (timestamp + CineVault_ERR prefix)
- **Exercise 8.1**: RequestDurationInterceptor (log execution time)
- **Exercise 8.2**: TransformInterceptor (wrap response in {data})

### Frontend (Angular 19)
- **Exercise 5.1**: TicketPriceEngineComponent (computed signals, discounts)
- **Exercise 5.2**: GenreListComponent (@for/@empty/@if control flow)
- **Exercise 8.1**: RainbowDirective (HostBinding/HostListener)
- **Exercise 9.1**: DefaultImagePipe (placeholder images)
- **Exercise 9.2**: TeamPipe (name nicknames)
- **Exercise 10.1**: BookingCartService (manage movie cart)
- **Exercise 13.1**: AuthInterceptor (JWT Bearer token)

## Technologies

### Backend
- NestJS 10
- TypeORM + MySQL
- Passport JWT
- class-validator
- bcrypt

### Frontend
- Angular 19
- Standalone Components
- Signals
- RxJS
- New Control Flow (@for, @if, @empty)

## Default Credentials

After seeding:
- **Admin**: admin / password123
- **Manager**: manager / password123
- **User**: john_doe / password123
