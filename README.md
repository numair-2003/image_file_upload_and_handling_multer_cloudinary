# MERN User Management App
### Internship Week 1 Project — DawoodTech NextGen

A full-stack CRUD application built with **MongoDB · Express.js · React · Node.js**


## Live Demo

| | URL |
|---|---|
| **Frontend** | https://user-management-system-ten-phi.vercel.app |
| **Backend API** | https://usermanagementsystem-production-c417.up.railway.app |

> **Note:** The backend is hosted on Railway's free tier and may take 10–15 seconds to wake up after a period of inactivity. Simply refresh if the page doesn't load immediately.


## Deployment Stack

| Service | Platform | Purpose |
|---------|----------|---------|
| Frontend | [Vercel](https://vercel.com) | Hosts the React app |
| Backend | [Railway](https://railway.app) | Runs the Node/Express server |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud-hosted MongoDB |


## Project Structure

```
project-root/
├── backend/
│   ├── controllers/
│   │   └── userController.js   -> Business logic (GET, POST, DELETE)
│   ├── models/
│   │   └── User.js             -> Mongoose schema (name, email)
│   ├── routes/
│   │   └── userRoutes.js       -> Express route definitions
│   ├── .env                    -> Environment variables (PORT, MONGO_URI)
│   ├── package.json
│   └── server.js               -> Entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserForm.jsx    -> Add user form
│   │   │   ├── UserForm.css
│   │   │   ├── UserList.jsx    -> Display & delete users
│   │   │   └── UserList.css
│   │   ├── services/
│   │   │   └── api.js          -> Axios API calls
│   │   ├── App.jsx             -> Root component + state management
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── MERN_API_Tests.postman_collection.json
└── README.md
```


## Prerequisites

Make sure the following are installed for local development:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| MongoDB | 6+ | https://www.mongodb.com/try/download/community |
| MongoDB Compass | Latest | https://www.mongodb.com/products/compass |
| VS Code | Latest | https://code.visualstudio.com |
| Postman | Latest | https://www.postman.com/downloads |


## Local Setup & Running

### 1. Clone the Repository

```bash
git clone https://github.com/numair-2003/user_management_system.git
cd user_management_system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```
PORT = 5000
MONGO_URI = mongodb://localhost:27017/mern_users
```

Then run:

```bash
npm run dev       # uses nodemon for auto-reload
# OR
npm start         # plain node
```

You should see:

  1. Connected to MongoDB
  2. Server running at http://localhost:5000
  

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

React app opens at: **http://localhost:3000**


## API Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/users` | Fetch all users | — |
| POST | `/users` | Create new user | `{ "name": "...", "email": "..." }` |
| DELETE | `/users/:id` | Delete user by ID | — |


### Example Responses

**GET /users**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "657f...",
      "name": "Alice",
      "email": "alice@example.com",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

**POST /users**
```json
// Request body
{ "name": "Alice", "email": "alice@example.com" }

// Response 201
{ "success": true, "message": "User created successfully!", "data": { ... } }
```

**DELETE /users/:id**
```json
// Response 200
{ "success": true, "message": "User deleted successfully!", "data": { ... } }
```

## Postman API Testing

1. Open **Postman**
2. Click **Import** -> upload `MERN_API_Tests.postman_collection.json`
3. The collection includes 6 pre-built requests:
   - Health Check (GET /)
   - GET All Users
   - POST Create User
   - DELETE User by ID
   - POST Missing Email (validation test)
   - DELETE Invalid ID (error handling test)

> **Tip:** Run POST first to add a user, then copy the `_id` from the response and paste it into the DELETE request URL.


## Frontend Features

- **Add User Form** — Name + email inputs with client-side validation
- **User List** — Displays all users with avatar initials, name, email, date added
- **Delete** — Removes user instantly from UI and database
- **Toast Notifications** — Success/error feedback
- **Error Banner** — Shows if backend is unreachable
- **Responsive Design** — Works on mobile and desktop


## Deployment Guide

### Frontend -> Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) -> Import GitHub repo
3. Set Root Directory to `frontend`
4. Add environment variable: `REACT_APP_API_URL` = your Railway backend URL
5. Deploy

### Backend -> Railway
1. Go to [railway.app](https://railway.app) -> New Project -> GitHub Repository
2. Select your repo and set Root Directory to `backend`
3. Add environment variable: `MONGO_URI` = your MongoDB Atlas connection string
4. Generate a public domain in Settings -> Networking
5. Deploy

### Database -> MongoDB Atlas
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) -> Create free cluster
2. Create a database user and allow all IP addresses (0.0.0.0/0)
3. Get your connection string and use it as `MONGO_URI`


## GitHub Repository

- `/backend` — Node.js + Express server
- `/frontend` — React application
- `.gitignore` — Excludes node_modules and .env
- `README.md` — Project documentation
- `MERN_API_Tests.postman_collection.json` — API test collection

*Built by **Numair Fahad** — MERN Stack Intern at DawoodTech NextGen*