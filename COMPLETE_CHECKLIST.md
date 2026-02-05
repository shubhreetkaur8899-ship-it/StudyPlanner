# Sprint 1 Complete Checklist & Action Plan

**Student:** Shubhreet Kaur  
**Due Date:** February 5, 2026  
**Project:** StudyPlanner Backend API

---

## 📋 Complete Setup Checklist

### Phase 1: Local Development Setup ⏱️ 30 minutes

#### Step 1: Install Dependencies
```bash
cd backend
npm install
```
- [ ] Navigate to backend folder
- [ ] Run npm install
- [ ] Verify no errors in installation
- [ ] Check node_modules folder created

#### Step 2: Setup Local Database
```bash
# Option A: Install PostgreSQL locally
# Option B: Create database on Render (recommended)
```
- [ ] PostgreSQL installed OR Render database created
- [ ] Database credentials ready
- [ ] Test database connection with psql

#### Step 3: Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```
- [ ] Copy .env.example to .env
- [ ] Update database credentials
- [ ] Generate JWT_SECRET (32+ characters)
- [ ] Save and close .env file

#### Step 4: Test Locally
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] See "Connected to PostgreSQL database"
- [ ] See "Database tables initialized"
- [ ] See "Server running on port 5000"
- [ ] Visit http://localhost:5000 in browser
- [ ] Get JSON response with API info

**✅ Local setup complete!**

---

### Phase 2: Git & GitHub Setup ⏱️ 20 minutes

#### Step 1: Initialize Git
```bash
git init
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```
- [ ] Git initialized in project folder
- [ ] User name configured
- [ ] User email configured

#### Step 2: First Commit
```bash
git add .
git commit -m "Initial commit: Sprint 1 backend complete with PostgreSQL and JWT auth"
```
- [ ] All files staged (git status shows green)
- [ ] Initial commit created
- [ ] Commit message is descriptive

#### Step 3: Create GitHub Repository
- [ ] Log in to GitHub
- [ ] Create new repository: "StudyPlanner"
- [ ] Set description
- [ ] Choose public or private
- [ ] DO NOT initialize with README
- [ ] Repository created successfully

#### Step 4: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/StudyPlanner.git
git branch -M main
git push -u origin main
```
- [ ] Remote origin added
- [ ] Branch renamed to main
- [ ] Pushed to GitHub successfully
- [ ] Refresh GitHub page - see all files
- [ ] README displays properly

**✅ Git setup complete!**

---

### Phase 3: API Testing ⏱️ 45 minutes

#### Test 1: Authentication
- [ ] Register new user - success (201)
- [ ] Register duplicate email - fails (400)
- [ ] Login with correct password - success (200)
- [ ] Login with wrong password - fails (401)
- [ ] Save JWT token for next tests

#### Test 2: Courses
- [ ] Create first course - success (201)
- [ ] Create second course - success (201)
- [ ] Get all courses - shows 2 courses (200)
- [ ] Get single course by ID - success (200)
- [ ] Update course name - success (200)
- [ ] Try to access without token - fails (401)

#### Test 3: Assignments
- [ ] Create assignment for course 1 - success (201)
- [ ] Create second assignment - success (201)
- [ ] Get all assignments - shows 2 assignments (200)
- [ ] Get assignments by course - success (200)
- [ ] Update assignment status to Completed - success (200)
- [ ] Delete assignment - success (200)

#### Test 4: Error Handling
- [ ] Access protected route without token - 401
- [ ] Create course with missing fields - 400
- [ ] Update non-existent course - 404
- [ ] Invalid JWT token - 401
- [ ] SQL injection attempt - blocked

**Use:** Postman, Thunder Client, or cURL (see API_TESTING_GUIDE.md)

**✅ Testing complete!**

---

### Phase 4: Render Deployment ⏱️ 30 minutes

#### Step 1: Create PostgreSQL Database
- [ ] Log in to Render dashboard
- [ ] Click New + → PostgreSQL
- [ ] Name: studyplanner-db
- [ ] Region: Choose closest
- [ ] Plan: Free
- [ ] Click Create Database
- [ ] Wait for database to be ready
- [ ] Copy Internal Database URL

#### Step 2: Create Web Service
- [ ] Click New + → Web Service
- [ ] Connect GitHub repository
- [ ] Select StudyPlanner repository
- [ ] Name: studyplanner-api
- [ ] Region: Same as database
- [ ] Root Directory: backend
- [ ] Runtime: Node
- [ ] Build Command: npm install
- [ ] Start Command: npm start
- [ ] Plan: Free

#### Step 3: Configure Environment Variables
Add these in Render web service settings:
- [ ] NODE_ENV = production
- [ ] PORT = 10000
- [ ] DATABASE_URL = (paste Internal Database URL)
- [ ] JWT_SECRET = (generate random 32+ characters)
- [ ] JWT_EXPIRE = 7d
- [ ] CORS_ORIGIN = *

#### Step 4: Deploy
- [ ] Click Create Web Service
- [ ] Watch build logs
- [ ] Wait for deployment (2-3 minutes)
- [ ] See "Live" status
- [ ] Copy deployment URL

#### Step 5: Test Deployed API
```bash
# Replace with your actual URL
curl https://studyplanner-api.onrender.com
```
- [ ] Health check returns 200 OK
- [ ] Register test user - success
- [ ] Login test user - success
- [ ] Create course - success
- [ ] Create assignment - success

**✅ Deployment complete!**

---

### Phase 5: Documentation ⏱️ 15 minutes

#### Review All Documentation
- [ ] Read README.md - main project overview
- [ ] Read backend/README.md - API documentation
- [ ] Read QUICK_START.md - setup instructions
- [ ] Read DEPLOYMENT_GUIDE.md - deployment steps
- [ ] Read API_TESTING_GUIDE.md - testing examples
- [ ] Read PROJECT_SUMMARY.md - complete overview

#### Verify Documentation Accuracy
- [ ] All URLs updated with your actual URLs
- [ ] Your name appears correctly
- [ ] Student ID filled in
- [ ] GitHub repository URL correct
- [ ] Deployed API URL correct

**✅ Documentation verified!**

---

### Phase 6: Submission Preparation ⏱️ 20 minutes

#### Step 1: Fill Out Submission Template
Open: SPRINT1_SUBMISSION_TEMPLATE.txt
- [ ] Student Name filled in
- [ ] Student ID filled in
- [ ] GitHub Repository URL added
- [ ] Deployed API URL added
- [ ] Test credentials documented
- [ ] Commit history summary added
- [ ] All checkboxes reviewed

#### Step 2: Create Test Account for Instructor
```bash
# Use deployed API
curl -X POST https://your-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Instructor Test Account",
    "email": "instructor@test.com",
    "password": "test123456"
  }'
```
- [ ] Test account created
- [ ] Add sample courses (2-3)
- [ ] Add sample assignments (4-5)
- [ ] Mix of Pending and Completed statuses
- [ ] Credentials documented in submission

#### Step 3: Final Code Review
- [ ] No .env file in GitHub
- [ ] node_modules not committed
- [ ] All code files present
- [ ] No commented-out debug code
- [ ] Console.logs for important events only
- [ ] Consistent code formatting
- [ ] Comments on complex logic

#### Step 4: Final Tests
- [ ] Local server runs without errors
- [ ] Deployed API accessible
- [ ] All endpoints work on deployed version
- [ ] Database tables created correctly
- [ ] Authentication works
- [ ] CRUD operations work

**✅ Submission ready!**

---

### Phase 7: Live Demo Preparation ⏱️ 15 minutes

#### Prepare to Show
- [ ] Know how to start local server
- [ ] Have Postman/Thunder Client ready
- [ ] Have deployed URL bookmarked
- [ ] Know where each route file is
- [ ] Can explain database schema
- [ ] Can explain JWT authentication flow

#### Practice Explaining
Be ready to answer:
1. **"Show me where you defined your routes"**
   - Answer: `backend/routes/` folder
   - Show: auth.js, courses.js, assignments.js

2. **"How does authentication work?"**
   - Answer: JWT tokens, bcrypt password hashing
   - Show: `middleware/auth.js` and `routes/auth.js`

3. **"How do you connect to the database?"**
   - Answer: PostgreSQL with pg library
   - Show: `config/database.js`

4. **"Show me a CRUD operation"**
   - Answer: Pick any from courses.js or assignments.js
   - Explain: GET, POST, PUT, DELETE methods

5. **"How do you handle errors?"**
   - Answer: Try-catch blocks, proper status codes
   - Show: Error handling in any route file

#### Demo Checklist
- [ ] Laptop fully charged
- [ ] Internet connection working
- [ ] VS Code open with project
- [ ] Terminal ready to run commands
- [ ] Browser tabs ready (GitHub, Render, API)
- [ ] Postman/Thunder Client configured
- [ ] Know your GitHub repo URL
- [ ] Know your deployed API URL

**✅ Demo ready!**

---

## 🎯 Final Pre-Submission Checklist

### Critical Items (Must Have)
- [ ] ✅ Project deployed to Render (public URL)
- [ ] ✅ GitHub repository created and pushed
- [ ] ✅ Regular commit history (10+ commits)
- [ ] ✅ All API endpoints functional
- [ ] ✅ PostgreSQL database connected
- [ ] ✅ README.md complete
- [ ] ✅ Can run and demonstrate code
- [ ] ✅ Submission file ready

### Code Quality
- [ ] No syntax errors
- [ ] Consistent formatting
- [ ] Meaningful variable names
- [ ] Comments on complex logic
- [ ] Error handling present
- [ ] Input validation implemented

### Documentation
- [ ] README.md complete
- [ ] API endpoints documented
- [ ] Setup instructions clear
- [ ] Deployment guide present
- [ ] Testing guide included

### Security
- [ ] Passwords hashed with bcrypt
- [ ] JWT authentication working
- [ ] SQL queries parameterized
- [ ] .env not in GitHub
- [ ] CORS configured

### Functionality
- [ ] User registration works
- [ ] User login works
- [ ] JWT tokens generated
- [ ] All CRUD for courses works
- [ ] All CRUD for assignments works
- [ ] Cascading deletes work
- [ ] Status validation works

---

## 📅 Timeline Recommendation

### 3 Days Before Due Date
- Complete Phases 1-3 (Setup, Git, Testing)
- Fix any bugs found during testing

### 2 Days Before Due Date
- Complete Phase 4 (Deployment)
- Verify deployed version works
- Make final commits

### 1 Day Before Due Date
- Complete Phases 5-7 (Docs, Submission, Demo prep)
- Practice demo
- Get good sleep!

### Day Of Submission
- Final verification
- Submit to assignment folder
- Be ready for live demo

---

## 🚨 Common Last-Minute Issues

### Issue: "It works locally but not on Render"
**Check:**
- Environment variables set correctly
- DATABASE_URL uses Internal URL
- All dependencies in package.json
- Build logs for errors

### Issue: "Can't access protected routes"
**Check:**
- Token format: `Bearer <token>`
- Token not expired (7 days)
- Authorization header present
- JWT_SECRET same as when token generated

### Issue: "Database tables not created"
**Check:**
- Server startup logs
- Database connection successful
- initializeDatabase() called
- PostgreSQL version compatible

### Issue: "Commits not showing on GitHub"
**Fix:**
```bash
git push origin main
```

### Issue: "Can't find files in project"
**Fix:**
```bash
git status  # Check if files committed
git add .   # Stage any missing files
git commit -m "Add missing files"
git push
```

---

## 📞 Emergency Contacts

**If You're Stuck:**
1. Review relevant documentation file
2. Check troubleshooting sections
3. Google the specific error message
4. Ask classmates (collaboration is OK!)
5. Contact instructor/TA during office hours

**Course Resources:**
- Workshop materials (Weeks 2-3)
- Course Discord/Slack
- Instructor office hours
- TA help sessions

---

## ✅ Submission Day Checklist

### Morning Of
- [ ] Test local server one more time
- [ ] Test deployed API one more time
- [ ] Verify GitHub is up to date
- [ ] Review submission template
- [ ] Charge laptop fully
- [ ] Bring charger to class

### During Class
- [ ] Submit text file to assignment folder
- [ ] Wait for instructor to call you
- [ ] Have project ready to show
- [ ] Be ready to answer questions
- [ ] Stay calm and confident!

### After Demo
- [ ] Listen to feedback
- [ ] Note any issues for next sprint
- [ ] Celebrate completing Sprint 1! 🎉

---

## 🎉 You're All Set!

Follow this checklist step by step, and you'll have a complete, working, deployed backend API ready for Sprint 1 submission.

**Key Success Factors:**
1. ✅ Start early
2. ✅ Test thoroughly
3. ✅ Commit regularly
4. ✅ Document everything
5. ✅ Deploy and verify
6. ✅ Practice your demo

**You've got this!** 💪

---

**Last Updated:** February 5, 2026  
**Status:** Ready for Submission ✅
