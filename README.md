# 🌸 FloraCycle — Period Tracker

A full-stack period tracking web app built with React, Node.js, Express and MongoDB.

## ✨ Features
- User authentication (JWT + bcrypt)
- Period cycle tracking & predictions
- 4 phase tracking (Menstrual, Follicular, Ovulatory, Luteal)
- Symptom, mood, craving & discharge logging
- AI health assistant chatbot
- Beautiful dark lavender UI

## 🛠 Tech Stack
**Frontend:** React, Vite, Axios, React Router Dom  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Auth:** JWT, bcryptjs  
**Deployment:** Vercel (frontend) + Render (backend) + MongoDB Atlas

## 🔗 Live Demo
[period-tracker-rose-nine.vercel.app](https://period-tracker-rose-nine.vercel.app)

## 🚀 Run Locally

### Backend
\```bash
cd server
npm install
npm run dev
\```

### Frontend
\```bash
cd client
npm install
npm run dev
\```

### Environment Variables
Create a `.env` file in `server/`:
\```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
\```