# Placement & Higher Studies Tracking Portal

A centralized web platform for managing student placement records, higher studies data, placement drives, and analytics.

## Tech Stack

- **Frontend**: React.js + Vite + Tailwind CSS v3
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Atlas or Local)
- **Authentication**: JWT + bcrypt

## Getting Started
1
### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas connection string)

### Backend Setup

```bash
cd server
npm install
# Configure .env with your MONGO_URI
npm run seed    # Seed database with sample data
npm run dev     # Start development server on port 5000
```

### Frontend Setup

```bash
cd client
npm install
npm run dev     # Start development server on port 5173
```

### Default Credentials

| Role    | Email               | Password   |
|---------|---------------------|------------|
| Admin   | admin@college.edu   | admin123   |
| Student | student@college.edu | student123 |

## Project Structure

```
placement-portal/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── hooks/
│   └── ...
├── server/          # Express backend
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── seed/
└── README.md
```

## Features

- 🔐 JWT Authentication with role-based access (Admin / Student)
- 👨‍🎓 Student record management
- 🏢 Placement tracking with company, role, and package details
- 🎓 Higher studies record management
- 📊 Interactive analytics dashboard with charts
- 🔍 Advanced search and filtering
- 📅 Placement drive management
