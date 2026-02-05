# StudyPlanner - Deployment Guide for Render

This guide will walk you through deploying both your PostgreSQL database and Node.js backend to Render.

## Prerequisites
- GitHub account with your project pushed
- Render account (sign up at https://render.com)
- Your project code ready in GitHub repository

## Part 1: Deploy PostgreSQL Database

### Step 1: Create Database
1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click the **New +** button (top right)
3. Select **PostgreSQL**

### Step 2: Configure Database
Fill in the following details:
- **Name:** `studyplanner-db` (or any name you prefer)
- **Database:** `studyplanner_db`
- **User:** Leave default (auto-generated)
- **Region:** Choose the closest region to you (e.g., Ohio, Oregon)
- **PostgreSQL Version:** Latest (default)
- **Instance Type:** Free

### Step 3: Create Database
1. Click **Create Database**
2. Wait for the database to be created (takes 1-2 minutes)
3. Once created, you'll see the database dashboard

### Step 4: Copy Database URL
On the database info page, you'll see:
- **Internal Database URL** - Use this one! It looks like:
  ```
  postgresql://studyplanner_user:password@dpg-xxx-a.ohio-postgres.render.com/studyplanner_db
  ```
- Copy this entire URL - you'll need it in Part 2

> **Important:** Use the INTERNAL Database URL, not the External one. Internal URL works within Render's network.

## Part 2: Deploy Backend Web Service

### Step 1: Prepare Your GitHub Repository

Make sure your repository has this structure:
```
YourRepo/
├── backend/
│   ├── config/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

**Important:** Make sure `.env` file is in `.gitignore` (never commit secrets!)

### Step 2: Create Web Service on Render

1. In Render Dashboard, click **New +** button
2. Select **Web Service**
3. Click **Build and deploy from a Git repository**
4. Click **Next**

### Step 3: Connect GitHub Repository

1. If first time: Click **Connect GitHub** and authorize Render
2. Find your repository in the list
3. Click **Connect** next to your repository

### Step 4: Configure Web Service

Fill in these settings:

**Basic Settings:**
- **Name:** `studyplanner-api` (this will be your URL subdomain)
- **Region:** Same region as your database (important!)
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Settings:**
- **Instance Type:** Free

### Step 5: Add Environment Variables

Scroll down to **Environment Variables** section and add these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | Paste the Internal Database URL from Part 1 |
| `JWT_SECRET` | Generate a random string (see below) |
| `JWT_EXPIRE` | `7d` |
| `CORS_ORIGIN` | `*` |

**How to generate JWT_SECRET:**

Option 1 - Online (quick):
```bash
# Just make something long and random like:
a8f5c2d9e1b7f4a3c8d6e9b2f5a1c7d4e8b3f6a2c9d5e1b8f4a7c3d6e9b2f5a1
```

Option 2 - In terminal (more secure):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 6: Create Web Service

1. Review all settings
2. Click **Create Web Service**
3. Render will start building and deploying (takes 2-3 minutes)

### Step 7: Monitor Deployment

Watch the build logs in real-time. You should see:
```
==> Installing dependencies
==> Starting application
✅ Connected to PostgreSQL database
✅ Database tables initialized successfully
🚀 Server running on port 10000
```

## Part 3: Verify Deployment

### Step 1: Get Your API URL

Once deployed successfully, your API URL will be:
```
https://studyplanner-api.onrender.com
```

(Replace `studyplanner-api` with whatever name you chose)

### Step 2: Test Your API

**Test 1: Health Check**
```bash
curl https://studyplanner-api.onrender.com
```

Expected response:
```json
{
  "success": true,
  "message": "StudyPlanner API is running",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "courses": "/api/courses",
    "assignments": "/api/assignments"
  }
}
```

**Test 2: Register a User**
```bash
curl -X POST https://studyplanner-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Test 3: Login**
```bash
curl -X POST https://studyplanner-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy the `token` from the response for authenticated requests.

**Test 4: Create a Course**
```bash
curl -X POST https://studyplanner-api.onrender.com/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "course_name": "Full Stack Development",
    "course_code": "PROG2500",
    "semester": "Winter 2026"
  }'
```

## Part 4: Prepare for Sprint 1 Submission

### What to Submit

Create a text file named: `Sprint1_Submission_Shubhreet_Kaur.txt`

Include:
```
Student Name: Shubhreet Kaur
Student ID: [Your Student ID]
Course: PROG2500 - Full Stack Development
Assignment: Sprint 1 - Backend Review

GitHub Repository URL:
https://github.com/yourusername/StudyPlanner

Deployed API URL:
https://studyplanner-api.onrender.com

Database:
PostgreSQL on Render (Internal connection)

Test Credentials (for instructor):
Email: instructor@test.com
Password: test123456

Notes:
- All authentication endpoints functional
- Complete CRUD for courses
- Complete CRUD for assignments
- Database tables auto-initialize on deployment
- JWT authentication implemented
- Password hashing with bcrypt
```

### Live Demo Preparation

Be ready to show during Dev Day:

1. **Show Running Code:**
   - Open your deployed API URL in browser
   - Demonstrate health check endpoint

2. **Answer Technical Questions:**
   - Where are your routes defined? → `backend/routes/`
   - How do you connect to PostgreSQL? → `backend/config/database.js`
   - How is authentication handled? → JWT with bcrypt, middleware in `backend/middleware/auth.js`
   - Show database schema → `database.js` lines 24-62

3. **Demonstrate Functionality:**
   - Use Postman/Thunder Client to show:
     - User registration
     - User login (get token)
     - Create a course (with token)
     - Get all courses
     - Create an assignment
     - Update assignment status

## Troubleshooting

### Issue: "Connection refused" or database errors

**Solution:**
- Make sure you used INTERNAL Database URL, not External
- Check that DATABASE_URL environment variable is set correctly
- Ensure both database and web service are in the same region

### Issue: "502 Bad Gateway"

**Solution:**
- Service is still starting (first deploy takes longer)
- Check logs in Render dashboard
- Free tier services sleep after inactivity - first request wakes them up (30-60 seconds)

### Issue: "Module not found" errors

**Solution:**
- Make sure `package.json` is in the `backend/` directory
- Verify "Root Directory" in Render settings is set to `backend`
- Check build logs for npm install errors

### Issue: Tables not created

**Solution:**
- Check logs - tables auto-create on first connection
- If needed, you can manually create via Render's PostgreSQL shell:
  1. Go to database dashboard
  2. Click "Connect"
  3. Use psql shell to run SQL commands

### Issue: CORS errors

**Solution:**
- Set CORS_ORIGIN to `*` for development
- Later, change to your frontend URL for production

## Important Notes

### Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free (enough for one service 24/7)
- Database: 1GB storage, 100 connections

### Git Commit Best Practices
Make regular commits with descriptive messages:
```bash
git add .
git commit -m "feat: implement user authentication with JWT"
git push origin main
```

Good commit messages for your project:
- `feat: setup express server and database config`
- `feat: implement authentication routes`
- `feat: add course CRUD operations`
- `feat: add assignment management endpoints`
- `fix: handle authorization errors properly`
- `docs: update API documentation`

### Security Reminders
- Never commit `.env` file
- Use strong JWT_SECRET in production
- Validate all user inputs
- Use parameterized queries (already implemented)

## Quick Reference Commands

### Local Testing
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your local PostgreSQL credentials
# Run development server
npm run dev
```

### Git Commands
```bash
# Stage all changes
git add .

# Commit with message
git commit -m "your message"

# Push to GitHub
git push origin main
```

### Check Render Logs
- Go to Render dashboard
- Click on your web service
- Click "Logs" tab
- See real-time server logs

## Success Criteria for Sprint 1

✅ API deployed to public URL (not localhost)  
✅ GitHub shows regular commit history  
✅ PostgreSQL database connected and working  
✅ All authentication endpoints functional  
✅ Full CRUD operations for courses  
✅ Full CRUD operations for assignments  
✅ JWT authentication working  
✅ Can demonstrate and explain code  

## Need Help?

If you encounter issues:
1. Check the logs in Render dashboard
2. Review this guide again
3. Test locally first to isolate issues
4. Ask instructor during workshop hours

**Your API URL after deployment:**
```
https://studyplanner-api.onrender.com
```

Good luck with your deployment! 🚀
