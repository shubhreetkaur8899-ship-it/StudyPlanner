# StudyPlanner Backend API

## Overview
Full-stack student assignment tracker backend built with Node.js, Express, and PostgreSQL.

**Author:** Shubhreet Kaur  
**Course:** PROG2500 - Full Stack Development  
**Project:** Sprint 1 - Backend Development

## Technology Stack
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Deployment:** Render

## Project Structure
```
backend/
├── config/
│   └── database.js          # PostgreSQL connection & initialization
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── courses.js           # Course CRUD endpoints
│   └── assignments.js       # Assignment CRUD endpoints
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── server.js                # Main application entry point
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Courses Table
```sql
CREATE TABLE courses (
  course_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  course_name VARCHAR(200) NOT NULL,
  course_code VARCHAR(50) NOT NULL,
  semester VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### Assignments Table
```sql
CREATE TABLE assignments (
  assignment_id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
  CHECK (status IN ('Pending', 'Completed'))
);
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Shubhreet Kaur",
  "email": "shubhreet@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "userId": 1,
      "name": "Shubhreet Kaur",
      "email": "shubhreet@example.com",
      "createdAt": "2026-02-05T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "shubhreet@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": 1,
      "name": "Shubhreet Kaur",
      "email": "shubhreet@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Course Routes (`/api/courses`) - All Protected

#### Get All Courses
```http
GET /api/courses
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "count": 2,
  "data": [
    {
      "course_id": 1,
      "user_id": 1,
      "course_name": "Full Stack Development",
      "course_code": "PROG2500",
      "semester": "Winter 2026",
      "created_at": "2026-02-05T10:00:00.000Z"
    }
  ]
}
```

#### Get Single Course
```http
GET /api/courses/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "course_id": 1,
    "user_id": 1,
    "course_name": "Full Stack Development",
    "course_code": "PROG2500",
    "semester": "Winter 2026",
    "created_at": "2026-02-05T10:00:00.000Z"
  }
}
```

#### Create Course
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "course_name": "Full Stack Development",
  "course_code": "PROG2500",
  "semester": "Winter 2026"
}

Response: 201 Created
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "course_id": 1,
    "user_id": 1,
    "course_name": "Full Stack Development",
    "course_code": "PROG2500",
    "semester": "Winter 2026",
    "created_at": "2026-02-05T10:00:00.000Z"
  }
}
```

#### Update Course
```http
PUT /api/courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "course_name": "Advanced Full Stack Development",
  "semester": "Winter 2026"
}

Response: 200 OK
{
  "success": true,
  "message": "Course updated successfully",
  "data": { ... }
}
```

#### Delete Course
```http
DELETE /api/courses/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Course deleted successfully",
  "data": { ... }
}
```

### Assignment Routes (`/api/assignments`) - All Protected

#### Get All Assignments (All Courses)
```http
GET /api/assignments
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "count": 3,
  "data": [
    {
      "assignment_id": 1,
      "course_id": 1,
      "title": "Sprint 1 Review",
      "description": "Backend development review",
      "due_date": "2026-02-05",
      "status": "Pending",
      "course_name": "Full Stack Development",
      "course_code": "PROG2500",
      "created_at": "2026-02-01T10:00:00.000Z"
    }
  ]
}
```

#### Get Assignments by Course
```http
GET /api/courses/:id/assignments
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "count": 2,
  "data": [ ... ]
}
```

#### Get Single Assignment
```http
GET /api/assignments/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": { ... }
}
```

#### Create Assignment
```http
POST /api/assignments
Authorization: Bearer <token>
Content-Type: application/json

{
  "course_id": 1,
  "title": "Sprint 1 Review",
  "description": "Backend development review",
  "due_date": "2026-02-05",
  "status": "Pending"
}

Response: 201 Created
{
  "success": true,
  "message": "Assignment created successfully",
  "data": { ... }
}
```

#### Update Assignment
```http
PUT /api/assignments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Completed",
  "description": "Updated description"
}

Response: 200 OK
{
  "success": true,
  "message": "Assignment updated successfully",
  "data": { ... }
}
```

#### Delete Assignment
```http
DELETE /api/assignments/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Assignment deleted successfully",
  "data": { ... }
}
```

## Installation & Setup

### Local Development Setup

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up PostgreSQL**
- Install PostgreSQL on your machine
- Create a new database:
```sql
CREATE DATABASE studyplanner_db;
```

4. **Configure environment variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your database credentials
```

5. **Run the server**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## Deployment to Render

### Step 1: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Fill in the details:
   - **Name:** studyplanner-db
   - **Database:** studyplanner_db
   - **User:** (auto-generated)
   - **Region:** Choose closest to you
   - **Plan:** Free
4. Click **Create Database**
5. Copy the **Internal Database URL** (starts with `postgres://`)

### Step 2: Create Web Service on Render

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure the service:
   - **Name:** studyplanner-api
   - **Region:** Same as database
   - **Branch:** main
   - **Root Directory:** backend
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Step 3: Add Environment Variables

In the Render web service settings, add these environment variables:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=<paste your Internal Database URL from Step 1>
JWT_SECRET=<generate a strong random string>
JWT_EXPIRE=7d
CORS_ORIGIN=*
```

To generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Deploy

1. Click **Create Web Service**
2. Render will automatically:
   - Install dependencies
   - Initialize database tables
   - Start the server
3. Your API will be available at: `https://studyplanner-api.onrender.com`

### Important Notes for Render Deployment

- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Database automatically initializes tables on first connection
- SSL is automatically enabled for PostgreSQL connections

## Testing the API

### Using cURL

```bash
# Health check
curl https://your-api.onrender.com

# Register user
curl -X POST https://your-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://your-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create course (replace TOKEN with your JWT)
curl -X POST https://your-api.onrender.com/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"course_name":"Test Course","course_code":"TEST101","semester":"Winter 2026"}'
```

### Using Postman or Thunder Client

1. Import the API endpoints
2. Create an environment variable for `baseURL` and `token`
3. Test each endpoint following the authentication flow:
   - Register → Login → Get token → Use token for protected routes

## Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Authentication:** Token-based auth with expiration
- **SQL Injection Protection:** Parameterized queries
- **CORS:** Configurable cross-origin resource sharing
- **Input Validation:** Request body validation
- **Authorization:** User-specific data access control

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `500` - Internal Server Error

## Sprint 1 Requirements Checklist

✅ **Deployment & Integrity Checks**
- Deployed to Render with live public URL
- GitHub repository with regular commits
- PostgreSQL database configured

✅ **Sprint Completion**
- All authentication endpoints functional
- Complete CRUD for courses
- Complete CRUD for assignments
- RESTful API architecture

✅ **Technical Understanding**
- Well-structured code with comments
- Proper error handling
- Security best practices implemented

## Support & Contact

**Student:** Shubhreet Kaur  
**Course:** PROG2500 - Full Stack Development  
**Semester:** Winter 2026

For questions or issues, contact your instructor during workshop hours.
