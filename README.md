# Service Request Board

A full-stack application where homeowners can post service requests and tradespeople can browse, update status, and manage jobs.

## Live Demo

- Frontend: https://service-request-board.vercel.app
- Backend API: https://service-request-board-api.onrender.com
- GitHub: https://github.com/yasithyuran/service-request-board

## Tech Stack

- Frontend: Next.js 14, JavaScript, CSS
- Backend: Node.js, Express, MongoDB, JWT

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB

### Backend Setup

--cd backend
--npm install
--npm run dev

### Frontend Setup

-cd frontend
-npm install
-npm run dev

### SeedDatabase Setup
-cd backend
-npm run seed

-creates demo acc- demo@example.com/demo123

### Required Environment Variables
File	             Variable	          Description
backend/.env	     MONGODB_URI	      MongoDB connection string
backend/.env	     JWT_SECRET	          Secret key for JWT tokens
backend/.env	     PORT	              Server port (5000)
frontend/.env.local	 NEXT_PUBLIC_API_URL  Backend API URL

#### Run Instructions
-Local Development
Start backend: cd backend && npm run dev

Start frontend: cd frontend && npm run dev

Open http://localhost:3000

-Production Deployment
..Backend (Render):

Root Directory: backend

Build: npm install

Start: node server.js

..Frontend (Vercel):

Root Directory: frontend

Framework: Next.js

Env: NEXT_PUBLIC_API_URL = your backend URL + /api

#### Features
Browse jobs with category and status filters

Create new job requests

View job details

Update job status (Open/In Progress/Closed)

Delete jobs

Keyword search

User authentication (Login/Register)

Only owners can edit/delete their posts

Dark/Light mode toggle

#### Demo Account
Email: demo@example.com

Password: demo123

#### Author
Yasith Yuran