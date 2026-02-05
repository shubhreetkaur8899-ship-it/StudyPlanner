# StudyPlanner - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (1 minute)
```bash
cd backend
npm install
```

### Step 2: Setup Database (2 minutes)

**Option A: Local PostgreSQL**
1. Install PostgreSQL on your computer
2. Create database:
```sql
CREATE DATABASE studyplanner_db;
```

**Option B: Use Render PostgreSQL (Recommended)**
1. Go to https://render.com
2. Create PostgreSQL database (free tier)
3. Copy the Internal Database URL

### Step 3: Configure Environment (1 minute)
```bash
# Copy example file
cp .env.example .env

# Edit .env file with your settings
```

For local PostgreSQL, edit `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studyplanner_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_random_secret_key_here
```

For Render PostgreSQL, edit `.env`:
```env
DATABASE_URL=postgresql://user:pass@host/database
JWT_SECRET=your_random_secret_key_here
```

### Step 4: Run the Server (1 minute)
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ Connected to PostgreSQL database
✅ Database tables initialized successfully
🚀 Server running on port 5000
📝 Environment: development
🌐 API Base URL: http://localhost:5000
```

### Step 5: Test the API
Open browser and visit: http://localhost:5000

You should see:
```json
{
  "success": true,
  "message": "StudyPlanner API is running",
  "version": "1.0.0"
}
```

## 📝 Quick API Test Flow

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shubhreet Kaur",
    "email": "shubhreet@test.com",
    "password": "password123"
  }'
```

Save the `token` from response!

### 2. Create a Course
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "course_name": "Full Stack Development",
    "course_code": "PROG2500",
    "semester": "Winter 2026"
  }'
```

Save the `course_id` from response!

### 3. Create an Assignment
```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "course_id": 1,
    "title": "Sprint 1 Review",
    "description": "Backend development",
    "due_date": "2026-02-05",
    "status": "Pending"
  }'
```

### 4. Get All Assignments
```bash
curl http://localhost:5000/api/assignments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎯 Common Commands

### Development
```bash
# Install dependencies
npm install

# Run in development mode (auto-restart)
npm run dev

# Run in production mode
npm start
```

### Git Commands
```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit changes
git commit -m "feat: initial backend setup"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/StudyPlanner.git
git branch -M main
git push -u origin main
```

### Database Commands

**Check if PostgreSQL is running:**
```bash
# Windows
pg_ctl status

# Mac/Linux
ps aux | grep postgres
```

**Connect to database:**
```bash
psql -U postgres -d studyplanner_db
```

**View tables:**
```sql
\dt
```

**View users:**
```sql
SELECT * FROM users;
```

## 🔧 Troubleshooting

### "Module not found"
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### "Connection refused" (Database)
```bash
# Check if PostgreSQL is running
# Windows: Check Services
# Mac: brew services list
# Linux: sudo systemctl status postgresql
```

### "Port 5000 already in use"
```bash
# Change port in .env file
PORT=3001
```

Or kill the process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### Tables not created
The app automatically creates tables on startup. If they're missing:
```sql
-- Run these manually in psql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  course_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  course_name VARCHAR(200) NOT NULL,
  course_code VARCHAR(50) NOT NULL,
  semester VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

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

## 📱 Testing with Postman/Thunder Client

### Setup
1. Install Thunder Client (VS Code) or Postman
2. Create a new collection: "StudyPlanner API"
3. Set base URL variable: `http://localhost:5000`

### Create Requests

**1. Register**
- Method: POST
- URL: `{{baseURL}}/api/auth/register`
- Body (JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**2. Login**
- Method: POST
- URL: `{{baseURL}}/api/auth/login`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- Save the token to environment variable

**3. Get Courses**
- Method: GET
- URL: `{{baseURL}}/api/courses`
- Headers: `Authorization: Bearer {{token}}`

**4. Create Course**
- Method: POST
- URL: `{{baseURL}}/api/courses`
- Headers: `Authorization: Bearer {{token}}`
- Body (JSON):
```json
{
  "course_name": "Full Stack Development",
  "course_code": "PROG2500",
  "semester": "Winter 2026"
}
```

## 📚 Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection & setup
├── middleware/
│   └── auth.js              # JWT authentication
├── routes/
│   ├── auth.js              # Register & Login
│   ├── courses.js           # Course CRUD
│   └── assignments.js       # Assignment CRUD
├── .env                     # Environment variables (DO NOT COMMIT)
├── .env.example             # Template for .env
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── README.md                # Full documentation
└── server.js                # Application entry point
```

## 🎓 Sprint 1 Checklist

Before submission, verify:

✅ Code runs locally without errors  
✅ All API endpoints work (test with Postman/cURL)  
✅ GitHub repository created and pushed  
✅ Regular commits with good messages  
✅ Deployed to Render successfully  
✅ Can access deployed API via public URL  
✅ Database connected and tables created  
✅ Can register, login, and perform CRUD operations  
✅ README.md documentation complete  
✅ Ready to demo and answer technical questions  

## 🚀 Deploy to Render

Follow the detailed steps in `DEPLOYMENT_GUIDE.md`

Quick summary:
1. Create PostgreSQL database on Render
2. Copy Internal Database URL
3. Create Web Service on Render
4. Connect GitHub repository
5. Set environment variables
6. Deploy!

Your deployed API will be at:
```
https://your-service-name.onrender.com
```

## 📖 Additional Resources

- Full API Documentation: `README.md`
- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- Render Dashboard: https://dashboard.render.com
- PostgreSQL Docs: https://www.postgresql.org/docs/

## 💡 Tips for Success

1. **Commit frequently** - Every feature or fix deserves a commit
2. **Test locally first** - Make sure everything works before deploying
3. **Use descriptive commit messages** - Your future self will thank you
4. **Keep credentials secret** - Never commit `.env` file
5. **Document as you go** - Add comments to complex code

## 🆘 Getting Help

If you're stuck:
1. Check the error message carefully
2. Review the troubleshooting section
3. Check server logs (terminal output or Render logs)
4. Test each endpoint individually
5. Ask instructor during workshop hours

---

**Good luck with Sprint 1! 🎉**

You've got this! Remember to start early and test thoroughly.
