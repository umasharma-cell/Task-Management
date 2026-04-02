# TaskFlow - Task Management System

A full-stack task management application built with **Next.js** and **Node.js**, featuring JWT authentication with refresh token rotation, CRUD operations with optimistic updates, and a responsive dashboard with real-time feedback.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | JWT (Access + Refresh tokens), bcrypt |
| **Validation** | Zod schema validation |
| **Frontend** | Next.js 14 (App Router), TypeScript |
| **Styling** | Tailwind CSS with custom design system |
| **HTTP Client** | Axios with interceptors |
| **UI** | Lucide React icons, react-hot-toast |

## Architecture

### Backend — Layered Architecture
```
backend/src/
├── config/           # Environment variables, Prisma client
├── controllers/      # HTTP request handlers (thin layer)
├── services/         # Business logic & orchestration
├── repositories/     # Data access layer (Prisma queries)
├── middleware/        # Auth guard, validation, error handling, logging, rate limiting
├── routes/           # Express route definitions
├── types/            # TypeScript interfaces (AuthPayload, ApiResponse, etc.)
└── utils/            # ApiError, asyncHandler, Zod schemas
```

### Frontend — Component Architecture
```
frontend/src/
├── app/              # Next.js App Router pages
│   ├── auth/         # Login & Register pages
│   ├── dashboard/    # Main task dashboard
│   └── not-found.tsx # Custom 404 page
├── components/
│   ├── auth/         # AuthGuard (route protection)
│   ├── layout/       # Navbar
│   ├── tasks/        # TaskCard, TaskFormModal, DeleteConfirmModal,
│   │                 # SearchBar, FilterDropdown, Pagination, StatusSummary
│   └── ui/           # Skeleton, Spinner, ErrorState, EmptyState
├── hooks/            # useAuth (AuthContext provider + consumer)
├── lib/              # Axios client, auth-api, task-api, utilities
├── styles/           # Tailwind globals + animations
└── types/            # Shared TypeScript interfaces
```

### Database Schema
```
┌──────────────┐       ┌──────────────────┐
│    users     │       │      tasks       │
├──────────────┤       ├──────────────────┤
│ id (uuid)    │──┐    │ id (uuid)        │
│ email        │  │    │ title            │
│ name         │  │    │ description      │
│ password     │  └───>│ userId (FK)      │
│ refreshToken │       │ status (enum)    │
│ createdAt    │       │ priority (enum)  │
│ updatedAt    │       │ dueDate          │
└──────────────┘       │ createdAt        │
                       │ updatedAt        │
                       └──────────────────┘
```

**Enums:**
- `TaskStatus`: PENDING | IN_PROGRESS | COMPLETED
- `TaskPriority`: LOW | MEDIUM | HIGH

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### 1. Clone the repository
```bash
git clone <repo-url>
cd TaskManagement
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/taskmanager?schema=public"
JWT_ACCESS_SECRET="generate-a-strong-random-secret"
JWT_REFRESH_SECRET="generate-a-different-strong-secret"
```

Run migrations and start:
```bash
npx prisma migrate dev --name init
npm run dev
```
Server starts at `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
App starts at `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format
All endpoints return a consistent JSON structure:
```json
{
  "success": true,
  "message": "Operation description",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
```

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

---

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass1"
}
```
**Password requirements:** 8+ characters, at least one uppercase, one lowercase, one number.

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": { "id": "uuid", "email": "user@example.com", "name": "John Doe" },
    "accessToken": "eyJhbG..."
  }
}
```
Refresh token is set as an httpOnly cookie.

**Errors:** `409` duplicate email, `400` validation failure

---

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass1"
}
```

**Response (200):** Same structure as register.

**Errors:** `401` invalid credentials (generic message to prevent email enumeration)

---

#### Refresh Tokens
```
POST /api/auth/refresh
```
No request body needed. The refresh token is read from the httpOnly cookie sent automatically by the browser.

**Response (200):** New access token + rotated refresh cookie.

**Security:** If a previously used refresh token is resubmitted (reuse attack), all sessions for that user are revoked immediately.

**Errors:** `401` expired/invalid/revoked token

---

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

**Response (200):** Clears refresh token from database and cookie.

---

### Task Endpoints (Protected)

All task endpoints require `Authorization: Bearer <accessToken>` header.

#### List Tasks
```
GET /api/tasks?page=1&limit=10&status=PENDING&search=meeting
```

| Parameter | Type   | Default | Description |
|-----------|--------|---------|-------------|
| page      | number | 1       | Page number |
| limit     | number | 10      | Items per page (max 50) |
| status    | string | —       | Filter: PENDING, IN_PROGRESS, COMPLETED |
| search    | string | —       | Case-insensitive title search |

**Response (200):**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Review PR",
      "description": "Check the latest pull request",
      "status": "PENDING",
      "priority": "HIGH",
      "dueDate": "2025-04-10T00:00:00.000Z",
      "createdAt": "2025-04-01T...",
      "updatedAt": "2025-04-01T...",
      "userId": "uuid"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
```

---

#### Create Task
```
POST /api/tasks
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Review PR",
  "description": "Check the latest pull request",
  "priority": "HIGH",
  "dueDate": "2025-04-10T00:00:00.000Z"
}
```

| Field       | Required | Constraints |
|-------------|----------|-------------|
| title       | Yes      | 1-200 characters |
| description | No       | Max 2000 characters |
| priority    | No       | LOW, MEDIUM (default), HIGH |
| dueDate     | No       | ISO 8601 datetime |

**Response (201):** Created task object.

---

#### Get Single Task
```
GET /api/tasks/:id
Authorization: Bearer <accessToken>
```

**Errors:** `400` invalid UUID format, `404` not found (or belongs to another user)

---

#### Update Task
```
PATCH /api/tasks/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```
All fields are optional. At least one field must be provided.

**Errors:** `400` empty body or invalid data, `404` not found

---

#### Delete Task
```
DELETE /api/tasks/:id
Authorization: Bearer <accessToken>
```

**Response (200):** Confirmation message.

---

#### Toggle Task Status
```
PATCH /api/tasks/:id/toggle
Authorization: Bearer <accessToken>
```

Cycles: `PENDING` → `IN_PROGRESS` → `COMPLETED` → `PENDING`

**Response (200):** Updated task with new status.

---

### Error Codes

| Code | Meaning |
|------|---------|
| 400  | Bad request — validation failure, malformed JSON, empty update |
| 401  | Unauthorized — missing/invalid/expired token |
| 404  | Not found — resource doesn't exist or belongs to another user |
| 409  | Conflict — duplicate resource (e.g., email already registered) |
| 429  | Too many requests — rate limit exceeded |
| 500  | Internal server error |

## Security Features

- **Password hashing:** bcrypt with 12 salt rounds
- **JWT tokens:** Short-lived access token (15min), long-lived refresh token (7d)
- **Refresh token rotation:** New token pair on every refresh, old token invalidated
- **Reuse detection:** If a revoked refresh token is used, all sessions are terminated
- **httpOnly cookies:** Refresh token stored in httpOnly, secure, sameSite cookie
- **In-memory access token:** Never persisted to localStorage or cookies on the client
- **Rate limiting:** Auth routes (15 req/15min), API routes (100 req/min)
- **Helmet:** Security headers (XSS, clickjacking, MIME sniffing protection)
- **Input validation:** Zod schemas on all endpoints with sanitized error messages
- **Request body limit:** 10KB max to prevent payload abuse
- **Ownership enforcement:** Every task query scopes by authenticated userId
- **Concurrent safety:** Prisma transactions for check-then-act operations

## Frontend Features

- **Split-panel auth pages** with branding and responsive mobile layout
- **Real-time password strength** indicators on registration
- **Optimistic status toggle** with automatic rollback on failure
- **Debounced search** (400ms) with Ctrl+K keyboard shortcut
- **Loading skeletons** that match exact layout dimensions (no content jump)
- **Error states** with retry buttons and contextual messaging
- **Empty states** with relevant CTAs based on filter context
- **Toast notifications** with color-coded accents and appropriate durations
- **Status summary cards** that double as quick filters
- **Numbered pagination** with smart ellipsis for large page counts
- **Overdue date highlighting** in task cards
- **Unsaved changes indicator** in the edit modal
- **Escape key** support on all modals
- **Custom 404 page** with navigation options

## Available Scripts

### Backend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled production build |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma migrate dev` | Run database migrations |

### Frontend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Create production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

## Environment Variables

### Backend (`.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens | — |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | — |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime | `15m` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime | `7d` |
| `PORT` | Server port | `5000` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

### Frontend (`.env.local`)
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |
