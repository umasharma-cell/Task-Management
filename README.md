# TaskFlow - Task Management System

A full-stack task management application with user authentication, CRUD operations, and a responsive dashboard.

## Tech Stack

### Backend
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT (Access + Refresh tokens), bcrypt

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Project Structure

```
TaskManagement/
├── backend/                  # Express API server
│   ├── prisma/               # Database schema & migrations
│   └── src/
│       ├── config/           # Environment & database config
│       ├── controllers/      # Route handlers
│       ├── middleware/        # Auth guard, validation, error handling
│       ├── repositories/     # Data access layer
│       ├── routes/           # Route definitions
│       ├── services/         # Business logic
│       ├── types/            # TypeScript interfaces
│       └── utils/            # Shared utilities
├── frontend/                 # Next.js web application
│   └── src/
│       ├── app/              # App Router pages
│       ├── components/       # Reusable UI components
│       ├── hooks/            # Custom React hooks
│       ├── lib/              # API client & utilities
│       ├── styles/           # Global styles
│       └── types/            # TypeScript interfaces
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env     # Configure your database URL and secrets
npx prisma migrate dev   # Run database migrations
npm run dev              # Starts on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local  # Configure API URL
npm run dev                  # Starts on http://localhost:3000
```

## API Endpoints

### Authentication
| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| POST   | /api/auth/register | Register new user  |
| POST   | /api/auth/login    | Login user         |
| POST   | /api/auth/refresh  | Refresh tokens     |
| POST   | /api/auth/logout   | Logout user        |

### Tasks (Protected)
| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | /api/tasks            | List tasks (paginated/filtered) |
| POST   | /api/tasks            | Create task                     |
| GET    | /api/tasks/:id        | Get single task                 |
| PATCH  | /api/tasks/:id        | Update task                     |
| DELETE | /api/tasks/:id        | Delete task                     |
| PATCH  | /api/tasks/:id/toggle | Toggle task status              |
