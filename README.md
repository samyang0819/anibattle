# ⚔️ AniBattle

AniBattle is a full-stack anime quiz platform where users compete in solo mode, climb ranks, and improve through adaptive difficulty progression.

**Live App:** https://anibattle.vercel.app  
**Backend API:** https://anibattle-production.up.railway.app/api  

---

## 🚀 Project Overview

AniBattle is a production-ready full-stack web application built using:

- React (Vite)
- Node.js
- Express
- MongoDB Atlas

The platform allows users to:

- Create accounts and authenticate securely
- Play adaptive solo quiz sessions
- Submit answers and receive scoring analytics
- View leaderboard rankings
- Track performance progression

This project demonstrates full-stack architecture, RESTful API design, secure authentication, deployment configuration, and production debugging.

---

## 🧠 Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Persistent session handling

### 🎮 Solo Arena
- 10-question quiz sessions
- Adaptive difficulty mode
- Manual difficulty selection
- One-question-at-a-time interface
- Real-time progress tracking

### 📊 Scoring System
- Score calculation
- Accuracy percentage
- Recommended next difficulty level

### 🏆 Leaderboards
- Rank-based sorting
- Performance comparison

---

## 🏗️ Architecture

### Frontend
- React (Vite)
- Component-based modular design
- React Hooks for state management
- API abstraction layer
- Environment-based configuration

### Backend
- Node.js
- Express
- MongoDB (Mongoose ODM)
- RESTful API structure
- Centralized error handling
- Environment variable configuration

### Database

MongoDB Atlas collections:

- Users
- Questions
- Quiz Results

---

## 📦 Technologies Used

### Frontend
- React
- Vite
- JavaScript (ES6+)
- Custom CSS

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- CORS
- Morgan
- dotenv
- JSON Web Tokens (JWT)

### Deployment
- Vercel (Frontend)
- Railway (Backend)
- MongoDB Atlas (Database)

---

## 🛠️ Installation (Local Development)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/samyang0819/anibattle.git
cd anibattle
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_ORIGIN=http://localhost:5173
PORT=4000
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside `/client`:

```env
VITE_API_URL=http://localhost:4000/api
```

Run frontend:

```bash
npm run dev
```

---

## 🧪 Testing & Debugging

The application was tested through:

- API endpoint verification
- Authentication flow validation
- CORS configuration testing
- MongoDB Atlas connection debugging
- Production deployment testing
- Preflight request troubleshooting

---

## 📈 Future Improvements

- Real-time multiplayer battles (WebSockets)
- Achievement system
- Timed quiz mode
- Image-based questions
- Admin dashboard for managing questions
- Performance analytics dashboard
- Caching layer for scalability

---

## 🧾 Development Log Summary

- Week 1: Backend architecture and API scaffolding
- Week 2: Authentication and quiz logic implementation
- Week 3: Adaptive difficulty and UI refinement
- Week 4: Deployment debugging (CORS, MongoDB IP access, environment variables)

Key challenges included resolving cross-origin issues between Vercel and Railway, configuring MongoDB Atlas network access, and handling production environment variables securely.

---

## 🔒 Security Considerations

- JWT authentication
- Environment variable isolation
- Production CORS restrictions
- MongoDB network access control
- No secrets committed to repository

---

## 👨‍💻 Author

Samuel Yang  
Full Stack JavaScript Capstone Project