<div align="center">

# 🏥 CareSync

**A comprehensive, modern healthcare platform — built for patients, doctors, and admins.**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?logo=postgresql)](https://www.postgresql.org/)

> CareSync (formerly SymptomSync) helps patients track symptoms, manage medications, schedule appointments, and get AI-powered health insights — all in a sleek, real-time dashboard.

</div>

---

## 📸 Preview

> Dashboard overview with live health metrics, symptom trend graphs, and appointment tracking.

![CareSync Dashboard](./screenshot.png)

---

## ✨ What CareSync Does

| Feature | Description |
|---|---|
| 🔐 **Auth & Roles** | Secure JWT login with Role-Based Access (Patient / Doctor / Admin) |
| 📊 **Dashboard** | Real-time health metrics, trend graphs, and appointment calendar |
| 🩺 **Symptom Logging** | Log severity (1–10), duration, temperature, and notes daily |
| 💊 **Medication Tracking** | Manage prescriptions, dosages, and frequencies |
| 📅 **Appointment Scheduling** | Book and track doctor visits with status updates |
| 📂 **Reports & Files** | Securely upload and manage medical documents |
| 🤖 **AI Health Insights** | Powered by Google Gemini for intelligent health analysis |
| ⚡ **Real-Time Updates** | Live sync across the app via Socket.IO |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite** — fast, modern UI framework
- **TypeScript** — full type safety
- **Tailwind CSS v4** — dark glassmorphism design system
- **Framer Motion** — smooth animations and micro-interactions
- **React Router v7** — client-side routing
- **Recharts** — symptom trend visualizations
- **React Big Calendar** — appointment calendar view
- **Socket.IO Client** — real-time live updates
- **Axios** — HTTP client for API calls

### Backend
- **Node.js** + **Express.js** — REST API server
- **TypeScript** — consistent typing across the stack
- **Prisma ORM** + **PostgreSQL** — robust relational database
- **Google Gemini API** — AI-powered health insights
- **Socket.IO** — real-time communication layer
- **JWT** + **bcrypt** — secure authentication
- **Multer** — file upload handling

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) v18 or higher
- [PostgreSQL](https://www.postgresql.org/) database (local or hosted)
- A [Google Gemini API Key](https://ai.google.dev/)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Adityatomar28/CareSync.git
cd CareSync
```

---

### Step 2 — Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/caresync_db"

# Secret key for signing JWTs
JWT_SECRET="your_jwt_secret_key"

# Google Gemini API key for AI insights
GEMINI_API_KEY="your_gemini_api_key"

# Port the server listens on
PORT=5000
```

Run database migrations to set up your schema:

```bash
npx prisma migrate dev --name init
```

Start the backend development server:

```bash
npm run dev
```

> The backend API will be running at `http://localhost:5000`

---

### Step 3 — Set Up the Frontend

Open a **new terminal** and navigate to the frontend:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL="http://localhost:5000/api"
VITE_SOCKET_URL="http://localhost:5000"
```

Start the frontend development server:

```bash
npm run dev
```

> The app will be live at `http://localhost:5173` 🎉

---

## 📂 Project Structure

```
CareSync/
│
├── backend/
│   ├── prisma/                 # Database schema & migrations
│   └── src/
│       ├── controllers/        # Route handlers (business entry points)
│       ├── middlewares/        # Auth checks, error handlers
│       ├── routes/             # API route definitions
│       ├── services/           # Core logic & Gemini AI integrations
│       └── server.ts           # Express + Socket.IO setup
│
├── frontend/
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── context/            # Global state (e.g., AuthContext)
│       ├── hooks/              # Custom hooks (e.g., useSocket)
│       ├── pages/              # Full page views (Dashboard, Login, etc.)
│       ├── services/           # API call functions
│       └── App.tsx             # Root component & routing
│
└── README.md
```

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `GEMINI_API_KEY` | Google Gemini API key for AI features |
| `PORT` | Port for the Express server (default: 5000) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for backend REST API |
| `VITE_SOCKET_URL` | URL for the Socket.IO server |

---

## 🧑‍💻 User Roles

CareSync supports role with different levels of access:

- **Patient** — Log symptoms, view trends, manage meds, book appointments


---

## 📜 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

<div align="center">

Built with ❤️ by [Aditya Tomar](https://github.com/Adityatomar28)

</div>
