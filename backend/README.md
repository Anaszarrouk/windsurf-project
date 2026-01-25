# CineVault Backend

NestJS backend for the CineVault Movie Theater Management System.

## Setup

```bash
cd backend
npm install
```

## Environment

Copy `.env.development` to `.env` and configure your MySQL database settings.

## Database

Create a MySQL database:
```sql
CREATE DATABASE cinevault_dev;
```

## Run

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Seed database
npm run seed
```

## API Versioning

- **v1**: In-memory storage (for testing)
- **v2**: TypeORM with MySQL (production)

## Endpoints

- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `GET /v1/movies` - Get movies (in-memory)
- `GET /v2/movies` - Get movies (database)
- `GET /v1/tasks` - Get tasks (in-memory)
- `GET /v2/tasks` - Get tasks (database)
- `GET /genres` - Get genres
