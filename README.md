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
✅ User registration & login (normal users only)

✅ Password hashing with bcrypt

✅ JWT-based login session

✅ Admin dashboard: total users, stores, ratings

✅ Admin: create users (admin, store_owner, user)

✅ Admin: create stores assigned to store_owner

✅ Store listing with average ratings

✅ Users can rate and update ratings for stores

✅ Store owner dashboard: see own store and who rated it

✅ Filters for searching stores/users

✅ Secure role-based route access



### 📘 API Reference
🔐 Auth
Method	Endpoint	        Description
POST	/api/auth/register	Register a normal user only
POST	/api/auth/login	    Login and receive JWT

👤 User
Method	Endpoint	                Description
PATCH	/api/users/update-password	Update current user's password

🧑‍💼 Admin
Method	Endpoint	        Description
POST	/api/admin/users	Admin creates any user (admin, store_owner, user)
POST	/api/admin/stores	Admin creates a new store
GET	    /api/admin/users	    View all users with filters
GET	    /api/admin/stores	        View all stores with avg. rating
GET	    /api/admin/stats	Dashboard stats (users, stores, ratings)

🛍️ Stores (User)
Method	Endpoint	                Description
GET	    /api/stores	                    View stores with filters
POST	/api/stores/rate	        Submit rating for a store
PATCH	/api/stores/rate/:id	Update user's rating

📊 Store Owner
Method	Endpoint	            Description
GET	    /api/owner/dashboard	View your store, ratings, and users who rated


### 📂 Folder Structure
```bash
store-rating-platform/
├── backend/     # Express API
├── frontend/    # React app
└── README.md
```

### 🚪 Logout Handling
Logout is handled client-side by removing the stored JWT token (localStorage/sessionStorage).

### 🧪 Testing the API
Use Postman or ThunderClient:

Login to get JWT token.

Set header: Authorization: Bearer <token>.

Access protected/admin routes.


## 🚀 Features

### 👤 Users
- View and search stores
- Rate and update ratings
- Change their password

### 🛠 Admin
- Dashboard with analytics (Users, Stores, Ratings count)
- Add and manage normal/admin users
- Add and manage stores
- Filter user and store listings
- Logout functionality

### 🧑‍💼 Store Owners
- Login and view their store's average rating
- View users who rated their store
- Change their password


