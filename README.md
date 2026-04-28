# TaskFlow — Task Management Application

A full-stack, production-ready Task Management web app with a Kanban-style board, JWT authentication, real-time updates, drag & drop, dark mode, and filtering.

**Tech Stack:** React · Vite · Tailwind CSS v3 · Node.js · Express · MongoDB · Mongoose · Socket.io

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ ([download](https://nodejs.org/))
- **MongoDB** (local or [Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone & Install

```bash
# Backend
cd server
cp .env.example .env      # Edit MONGO_URI and JWT_SECRET
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/taskmanagement` |
| `JWT_SECRET` | Secret key for JWT signing | *(change this!)* |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |

### 3. Run

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open **http://localhost:5173** → Sign up → Start managing tasks!

---

## 📁 Folder Structure

```
taskmanagement/
├── server/
│   ├── config/db.js           # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js            # JWT verification middleware
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js            # User schema (bcrypt hashing)
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── authRoutes.js      # Register, Login, Me, Users
│   │   └── taskRoutes.js      # CRUD + filter/search
│   ├── socket/index.js        # Socket.io event handlers
│   ├── index.js               # Entry point
│   ├── .env.example           # Environment template
│   └── package.json
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx    # Navigation sidebar
    │   │   ├── TaskCard.jsx   # Draggable task card
    │   │   ├── TaskModal.jsx  # Create/Edit modal
    │   │   └── Notification.jsx # Toast notifications
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Auth state management
    │   │   ├── TaskContext.jsx  # Task state + Socket.io
    │   │   └── ThemeContext.jsx # Dark/light mode
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx  # Kanban board
    │   ├── utils/
    │   │   ├── api.js         # Axios instance
    │   │   └── socket.js      # Socket.io client
    │   ├── App.jsx            # Root + Routes
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Global styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 📡 API Reference

All endpoints prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Get JWT token | No |
| GET | `/api/auth/me` | Current user profile | Yes |
| GET | `/api/auth/users` | List all users | Yes |

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | List tasks (with filters) | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| POST | `/api/tasks` | Create task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

**Query Filters:** `?status=todo&priority=high&search=keyword&assignedTo=userId`

---

## 🗄️ Database Schema

### User
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required, max 50 chars |
| email | String | Required, unique |
| password | String | Hashed (bcrypt, 12 rounds) |
| role | String | `user` or `admin` |

### Task
| Field | Type | Notes |
|-------|------|-------|
| title | String | Required, max 200 chars |
| description | String | Max 2000 chars |
| status | String | `todo`, `in-progress`, `done` |
| priority | String | `low`, `medium`, `high` |
| dueDate | Date | Optional |
| assignedTo | ObjectId | Ref → User |
| createdBy | ObjectId | Ref → User |

---

## 🌟 Features

- **Kanban Board** — Drag & drop tasks between To Do / In Progress / Done
- **Real-Time** — Socket.io broadcasts task changes to all clients instantly
- **Dark Mode** — Toggle with system preference detection
- **Search & Filter** — By title, priority, status
- **Responsive** — Mobile-first with collapsible sidebar
- **Secure Auth** — JWT tokens, bcrypt password hashing
- **Toast Notifications** — Real-time event alerts

---

## 🚢 Deployment Guide

### Backend → Render

1. Push `server/` to a GitHub repo
2. Create a **Web Service** on [Render](https://render.com)
3. **Build Command:** `npm install`
4. **Start Command:** `node index.js`
5. **Environment Variables:** Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`

### Frontend → Vercel

1. Push `client/` to a GitHub repo
2. Import on [Vercel](https://vercel.com)
3. **Framework Preset:** Vite
4. **Build Command:** `npm run build` · **Output Dir:** `dist`
5. Add a `vercel.json` redirect for SPA:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
6. Update the Axios base URL in `api.js` to point to your Render backend URL

### MongoDB → Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string → set as `MONGO_URI` in backend env
3. Whitelist Render's IP (or `0.0.0.0/0` for dev)

---

## 📝 License

MIT
