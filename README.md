# ISLIIT — Integrated SLIIT Student Portal

A web application for SLIIT students and staff to manage timetables, modules, kuppi sessions, peer support, and administration.

- **Frontend:** Vue 3 + Vite + Tailwind CSS (`client/`)
- **Backend:** Express + MongoDB (`server/`)

---

## What's Inside

| Module             | Description                                   |
| ------------------ | --------------------------------------------- |
| Module Sessions    | Student dashboard, My Timetable, My Modules   |
| Kuppi Sessions     | Browse, create, and join kuppi study sessions |
| Connect U          | Student requests and support forms            |
| Peer Point         | Uploads, printing, documents, payments, kits  |
| Admin Management   | Admin configuration and oversight             |
| Student Management | Student records and operations                |
| User Profile       | Profile and account settings                  |

---

## Tech Stack

**Frontend**

- Vue 3 (Composition API) + TypeScript
- Vite (build tool)
- Tailwind CSS
- Vue Router
- FullCalendar, ApexCharts, jsPDF
- Vue Toastification

**Backend**

- Node.js + Express (ESM)
- MongoDB (native driver)
- multer (file uploads)
- nodemailer (email)
- dotenv, cors

---

## Team

| Name                      | Student ID | Assigned Modules                                                    |
| ------------------------- | ---------- | ------------------------------------------------------------------- |
| Hettiarachchi H. A. A. I. | IT21193118 | Module Sessions, Admin Management, Student Management, User Profile |
| _(IT 2)_                  | —          | Kuppi Sessions                                                      |
| _(IT 3)_                  | —          | Connect U                                                           |
| _(IT 4)_                  | —          | Peer Point                                                          |

> Add full names and IDs for IT 2–4 when your group roster is confirmed.

---

## Prerequisites

- Node.js 20+ (LTS)
- npm
- MongoDB connection string (Atlas or local)

---

## Getting Started

### 1. Clone the repo and install dependencies

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Set up environment variables

**Backend** — create `server/.env`:

```env
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.example.mongodb.net/?appName=YourApp
DB_NAME=your_database_name
PORT=4000

# Email (optional — needed for timetable PDF feature)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="ISLIIT" <your_email@gmail.com>
```

**Frontend** — create `client/.env`:

```env
VITE_API_URL=http://localhost:4000
```

### 3. Run the app

Open two terminals:

```bash
# Terminal 1 — Start the backend API
cd server
npm start

# Terminal 2 — Start the frontend
cd client
npm run dev
```

Then open the URL Vite prints — usually `http://localhost:5173`

---

## API

- Base URL: `http://localhost:4000`
- Health check: `GET /api/health`

---

## Project Structure

```
ITMP-Project/
├── client/                  # Vue 3 frontend
│   ├── src/
│   │   ├── views/           # Page components
│   │   ├── router/          # Route definitions
│   │   └── ...
│   └── package.json
│
├── server/                  # Express backend
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── controllers/
│   │   └── models/
│   ├── index.mjs            # Entry point
│   └── package.json
│
└── README.md
```

---

## How It Works

```
Browser (Vue 3)  →  REST API (Express :4000)  →  MongoDB
```

The frontend talks to the backend via the `VITE_API_URL` environment variable. All data is stored in MongoDB.
