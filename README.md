# Task Management System (TMS)
**INTE 21323 — Group Assignment**

Full-stack web app: **Node.js + Express + React + MySQL**

## Project Structure
```
tms/
├── backend/          ← Express REST API
├── frontend/         ← React app
├── docs/             ← Database design & ER diagram
├── .github/workflows ← CI/CD pipelines
└── docker-compose.yml
```

## Quick Start

### 1. Create databases
```sql
CREATE DATABASE tms_db;
CREATE DATABASE tms_db_test;
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env        # fill in DB_PASSWORD
npm run dev                 # starts on http://localhost:5000
node seed.js                # creates admin@tms.com / Admin@1234
```

### 3. Frontend
```bash
cd frontend
npm install
npm start                   # opens http://localhost:3000
```

### 4. Run tests
```bash
cd backend
npm test
```

## Technologies
| Layer | Tech |
|---|---|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL 8, Sequelize ORM |
| Auth | JWT, bcryptjs |
| Real-time | WebSockets |
| API Docs | Swagger at `/api/docs` |
| DevOps | Docker, GitHub Actions CI |

## Login Accounts (after running seed.js)
| Role | Email | Password |
|---|---|---|
| Admin | admin@tms.com | Admin@1234 |

## Links
- Frontend: *(add after deployment)*
- Backend API: *(add after deployment)*
- Swagger Docs: `http://localhost:5000/api/docs`
- GitHub: *(add your repo link)*

## Team Members
| Name | Student ID | Contribution |
|---|---|---|
| | | |
