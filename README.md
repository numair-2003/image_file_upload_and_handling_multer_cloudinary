# CloudGallery — MERN Media Library & Authentication

> **Internship Week 3 Project — Cloud Media Management**

> A high-performance, full-stack application featuring secure JWT Authentication, Role-Based Access Control (RBAC), and seamless Cloudinary-integrated image management.


## Live Demo

| Component | Platform | URL |
|-----------|----------|-----|
| **Frontend** | Vercel | [image-file-upload-and-handling-mult.vercel.app](https://image-file-upload-and-handling-mult.vercel.app) |
| **Backend API** | Vercel | [image-file-upload-and-handling-mult-seven.vercel.app](https://image-file-upload-and-handling-mult-seven.vercel.app) |


## Features

- **Secure Authentication** — User signup and login with hashed passwords (`bcryptjs`) and JWT-based session management.
- **Cloud Media Storage** — Direct image uploads to Cloudinary via Multer with automatic CDN URL generation.
- **Role-Based Access (RBAC)** — Restricts administrative functions to users with the `admin` role.
- **Serverless Optimized** — Custom MongoDB connection caching and model check logic to prevent `OverwriteModelError` on Vercel.
- **Dynamic Gallery** — Real-time synchronization between MongoDB metadata and the React UI.


## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Axios, Tailwind CSS, Context API, Lucide Icons |
| **Backend** | Node.js, Express.js, Multer, Bcryptjs, JWT |
| **Database** | MongoDB Atlas (Cloud) |
| **Media Storage** | Cloudinary (v2 API) |
| **Deployment** | Vercel (Serverless Functions) |


## Project Structure

The project maintains a strict separation of concerns to ensure scalability:

```text
cloudgallery/
├── backend/
│   ├── controllers/        # Auth and Media logic (Signup, Login, Upload)
│   ├── models/             # Mongoose schemas (User, Image)
│   ├── routes/             # Express API endpoints
│   ├── server.js           # Entry point, DB connection cache, and Cloudinary config
│   └── vercel.json         # Vercel deployment configuration
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, GalleryView)
│   │   ├── context/        # AuthContext for global user state
│   │   ├── services/       # api.js with Axios interceptors
│   │   ├── App.jsx         # Main routing and upload logic
│   │   └── App.css         # Dark-themed modern styling
└── README.md
```


## Project Architecture & Flow

### 1. Authentication Flow

- **Signup** — Validates input, hashes passwords with `bcryptjs` (10 salt rounds), and stores the user in MongoDB.
- **Session** — Generates a 7-day JWT upon successful login/signup, allowing the user to remain authenticated across sessions.

### 2. Image Upload Flow

1. **Client** — React packages the file into `FormData` with the key `'image'`.
2. **Interceptors** — Axios interceptors attach the `Authorization: Bearer <token>` header while allowing the browser to set the `multipart/form-data` boundary automatically.
3. **Processing** — Multer streams the file to Cloudinary; MongoDB saves the returned URL and `public_id`.


## Local Setup

### 1. Backend Configuration (`/backend`)

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret           # Ensure no 'cloudinary://' prefix
FRONTEND_URL=http://localhost:3000
```

Install dependencies and start the server:

```bash
cd backend
npm install
npm start
```

### 2. Frontend Configuration (`/frontend`)

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
```

Install dependencies and start the app:

```bash
cd frontend
npm install
npm start
```


## Author

**Numair Fahad**
MERN Stack Intern @ **DawoodTech NextGen**
GitHub: [@numair-2003](https://github.com/numair-2003)