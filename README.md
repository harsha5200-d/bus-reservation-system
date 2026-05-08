# 🚌 BusGo — Bus Reservation System

A full-stack bus ticket booking platform built with the MERN stack + Three.js.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Three.js / @react-three/fiber, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs

---

## 📁 Project Structure
```
BUS_RESERVATION/
├── client/          # React + Vite frontend
│   └── src/
│       ├── api/       axios.js
│       ├── components/ Navbar, SearchForm, BusCard, SeatCanvas (3D)
│       ├── context/   AuthContext.jsx
│       └── pages/     Home, Login, Register, BusList, BusDetail, BookingHistory, Confirmation
└── server/          # Node.js + Express backend
    ├── models/        User.js, Bus.js, Booking.js
    ├── routes/        auth.js, buses.js, bookings.js
    ├── middleware/    auth.js (JWT)
    ├── index.js
    └── seed.js        (10 sample buses)
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port 27017

### 1. Start Backend
```bash
cd server
npm install
node seed.js       # Seed 10 sample buses into MongoDB
npm run dev        # Starts on http://localhost:5000
```

### 2. Start Frontend
```bash
cd client
npm install
npm run dev        # Starts on http://localhost:5173
```

---

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login and get JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/buses` | No | List buses (filter by from/to/date) |
| GET | `/api/buses/:id` | No | Get bus by ID |
| POST | `/api/bookings` | Yes | Create booking |
| GET | `/api/bookings/me` | Yes | Get user's bookings |
| GET | `/api/bookings/:id` | Yes | Get booking by ID |
| DELETE | `/api/bookings/:id` | Yes | Cancel booking |

---

## ✨ Features
- 🔐 JWT Authentication (register / login / protected routes)
- 🔍 Search buses by From / To / Date
- 🎮 **3D interactive seat selection** using Three.js (drag, zoom, click seats)
- ✅ Real-time seat availability (green/red/purple color coding)
- 🎫 Booking confirmation with unique Booking ID
- 📋 Booking history with cancel functionality
- 🌙 Premium dark-mode UI with glassmorphism cards & animations

---

## 🌱 Seeded Buses (sample routes)
| Route | Type | Price |
|-------|------|-------|
| Bangalore → Mumbai | Volvo AC | ₹1200 |
| Mumbai → Pune | AC Sleeper | ₹450 |
| Chennai → Bangalore | AC Seater | ₹650 |
| Delhi → Jaipur | Volvo AC | ₹700 |
| Hyderabad → Chennai | AC Seater | ₹900 |
| Kochi → Bangalore | Volvo AC | ₹1100 |
| ... and 4 more | | |
