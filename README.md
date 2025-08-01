# Store Rating Platform

A full-stack web application that allows users to rate and review stores. Includes user authentication, role-based access control, and an admin dashboard for managing users and stores.

## 🛠 Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS (planned)
- **Backend:** Express.js, PostgreSQL (hosted on Neon)
- **Auth:** JWT (token-based), bcrypt (password hashing)

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/store-rating-platform.git
cd store-rating-platform
```

### 2. Setup & Run Backend
```bash
cd backend
npm install
npm run dev


Make sure to create a .env file inside backend/:

PORT=5000
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_secret_key

```

### 3. Setup & Run Frontend

```bash
cd ../frontend
npm install
npm run dev
```


🚀 Features
User signup & login (with validation)

Admin-only access to:

Create users (admin/user/store_owner)

Create stores

View dashboard stats (user, store, rating count)

JWT-based authentication

PostgreSQL schema with secure constraints


 ### API Routes Implemented
```bash
 | Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/auth/register` | Register a new user   |
| POST   | `/api/auth/login`    | Login and get JWT     |
| POST   | `/api/admin/users`   | Admin creates a user  |
| POST   | `/api/admin/stores`  | Admin creates a store |
| GET    | `/api/admin/stats`   | Admin dashboard stats |
```


### 📂 Folder Structure
```bash
store-rating-platform/
├── backend/     # Express API
├── frontend/    # React app
└── README.md
```


