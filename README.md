# Open Day Registration System (יום פתוח להנדסאים)

A full-stack project for managing registrations for an Open Day event.
Users can register from the landing page, and admins can view registrations in the admin area.

## Features
- Landing page in Hebrew (RTL)
- Registration form with validation
- Saves registrations to MongoDB
- Admin login with JWT
- Admin view of registrations (and export if included)

## Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Node.js + Express + TypeScript
- Database: MongoDB

## How to run (Local)

### 1 Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev