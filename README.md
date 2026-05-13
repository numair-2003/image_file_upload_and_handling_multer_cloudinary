# CloudGallery — MERN Media Library & Authentication

> **Internship Week 3 Project — Cloud Media Management**

> A high-performance MERN application featuring JWT Authentication, Role-Based Access Control (RBAC), and Cloudinary-integrated image management.


## Live Demo

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | [image-file-upload-and-handling-mult.vercel.app](https://image-file-upload-and-handling-mult.vercel.app) |
| Backend API | Vercel | [image-file-upload-and-handling-mult-seven.vercel.app](https://image-file-upload-and-handling-mult-seven.vercel.app) |


## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Axios, Tailwind CSS, Context API |
| **Backend** | Node.js, Express.js, Multer |
| **Database** | MongoDB Atlas (Cloud) |
| **Media Storage** | Cloudinary (v2 API) |
| **Deployment** | Vercel (Serverless Functions) |


## Project Architecture & Flow

### Image Upload Flow

1. **Client** — User selects a file and sends a `POST` request with `multipart/form-data`.
2. **Middleware** — Multer processes the file and `multer-storage-cloudinary` uploads it directly to the cloud.
3. **Database** — MongoDB stores the returned Cloudinary URL and `public_id`.
4. **Security** — Only authenticated users with a valid JWT can access the `/api/upload` endpoint.

### Authentication Flow

- **Signup** — Validates input, hashes passwords with `bcrypt`, and generates a 7-day JWT.
- **Interceptors** — Axios interceptors automatically attach the `Authorization: Bearer <token>` header to all protected requests.


## Testing & Verification Guide

### 1. Functional Testing (The "Happy Path")

| Feature | Action | Expected Result |
|---------|--------|-----------------|
| Signup | Register at `/signup` | User appears in MongoDB `users` collection. |
| Login | Log in with credentials | Token saved in `localStorage`; User state updates. |
| Cloud Upload | Upload an image | Image appears in the UI and Cloudinary Media Library. |
| Admin Access | Access `/admin` | Only visible if the user role is manually updated to `admin`. |

### 2. Technical Verification

- **CORS Check** — Verify that the backend allows requests from the frontend domain via the `FRONTEND_URL` environment variable.
- **Token Expiry** — Verify that the app redirects to `/login` if the JWT is missing or invalid (HTTP `401`).
- **Multipart Boundary** — Ensure `api.js` does **not** manually set the `Content-Type` for uploads, allowing Axios to automatically set the boundary for Multer.


## Local Setup

### 1. Backend Configuration (`/backend`)

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
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


## Deployment Guide (Vercel)

### Backend Deployment

- **Root Directory** — Set to `backend`.
- **Framework Preset** — Select `Node.js`.
- **CORS Tip** — Ensure `FRONTEND_URL` in Vercel settings matches your live frontend URL exactly.

### Frontend Deployment

- **Root Directory** — Set to `frontend`.
- **Environment Variable** — Set `REACT_APP_API_URL` to your live Vercel backend URL.


## Security Features

| Feature | Implementation |
|---------|---------------|
| **Bcrypt Password Hashing** | 10 salt rounds used for secure storage. |
| **RBAC** | Middleware restricts specific routes (like user deletion) to `admin` accounts only. |
| **Cloudinary Folders** | Media is organized in a dedicated `mern_gallery` folder to prevent clutter. |


## Project Structure

```
cloudgallery/
├── backend/
│   ├── config/         # Cloudinary & DB config
│   ├── middleware/      # Auth & RBAC middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express API routes
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth Context API
│       ├── pages/       # Route-level pages
│       └── api.js       # Axios instance with interceptors
└── README.md
```


## Author

**Numair Fahad**
MERN Stack Intern @ **DawoodTech NextGen**