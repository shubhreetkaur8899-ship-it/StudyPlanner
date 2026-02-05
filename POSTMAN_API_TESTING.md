# API Testing Guide - Postman with Render

## Base URL
**Production (Render):** `https://studyplanner-api.onrender.com`

Replace with your actual Render deployment URL.

---

## Setup in Postman

### 1. Create New Collection
1. Open Postman
2. Click **Collections** in left sidebar
3. Click **+ Create new collection**
4. Name it: `StudyPlanner API - Render`

### 2. Set Environment Variables
1. Click **Environments** (top right)
2. Click **+ Create Environment**
3. Name it: `StudyPlanner Production`
4. Add variable:
   - **Variable:** `base_url`
   - **Initial Value:** `https://your-studyplanner-app.onrender.com`
   - **Current Value:** `https://your-studyplanner-app.onrender.com`
5. Click **Save**
6. Select this environment from dropdown (top right)

---

## All API Tests for Postman

### 🏥 Health Check Endpoints

#### 1. Welcome Message
- **Method:** `GET`
- **URL:** `{{base_url}}/`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
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

---

#### 2. Database Health Check
- **Method:** `GET`
- **URL:** `{{base_url}}/health`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "success": true,
  "message": "Database connected",
  "timestamp": "2026-02-05T19:45:00.000Z"
}
```

---

## 👤 AUTH ENDPOINTS

### 1. Register New User
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/register`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "Test Student",
  "email": "teststudent@example.com",
  "password": "SecurePassword123!"
}
```
- **Expected Status:** `201 Created`

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "user_id": 3,
    "name": "Test Student",
    "email": "teststudent@example.com",
    "created_at": "2026-02-05T19:50:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login User
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "teststudent@example.com",
  "password": "SecurePassword123!"
}
```
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "user_id": 3,
    "name": "Test Student",
    "email": "teststudent@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token for authenticated requests!**

In Postman Tests tab, add:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("auth_token", jsonData.token);
}
```

---

## 📚 COURSE ENDPOINTS

### 1. Get All Courses (Protected)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/courses`
- **Headers:** 
  - `Authorization: Bearer {{auth_token}}`
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "success": true,
  "count": 3,
  "courses": [
    {
      "course_id": 1,
      "user_id": 1,
      "course_name": "Full Stack Development",
      "course_code": "PROG2500",
      "semester": "Winter 2026",
      "created_at": "2026-02-05T10:00:00.000Z"
    },
    {
      "course_id": 2,
      "user_id": 1,
      "course_name": "Database Management",
      "course_code": "PROG1400",
      "semester": "Winter 2026",
      "created_at": "2026-02-05T10:00:00.000Z"
    },
    {
      "course_id": 3,
      "user_id": 1,
      "course_name": "Web Programming",
      "course_code": "PROG1700",
      "semester": "Winter 2026",
      "created_at": "2026-02-05T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Specific Course by ID (Protected)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/courses/1`
- **Headers:** 
  - `Authorization: Bearer {{auth_token}}`
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "success": true,
  "course": {
    "course_id": 1,
    "user_id": 1,
    "course_name": "Full Stack Development",
    "course_code": "PROG2500",
    "semester": "Winter 2026",
    "created_at": "2026-02-05T10:00:00.000Z"
  }
}
```

---

### 3. Create New Course (Protected)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/courses`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Body (raw JSON):**
```json
{
  "course_name": "Advanced JavaScript",
  "course_code": "PROG2800",
  "semester": "Winter 2026"
}
```
- **Expected Status:** `201 Created`

**Expected Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "course_id": 5,
    "user_id": 3,
    "course_name": "Advanced JavaScript",
    "course_code": "PROG2800",
    "semester": "Winter 2026",
    "created_at": "2026-02-05T20:00:00.000Z"
  }
}
```

---

### 4. Update Course (Protected)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/courses/5`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Body (raw JSON):**
```json
{
  "course_name": "Advanced JavaScript & TypeScript",
  "course_code": "PROG2800",
  "semester": "Winter 2026"
}
```
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "course": {
    "course_id": 5,
    "user_id": 3,
    "course_name": "Advanced JavaScript & TypeScript",
    "course_code": "PROG2800",
    "semester": "Winter 2026",
    "created_at": "2026-02-05T20:00:00.000Z"
  }
}
```

---

### 5. Delete Course (Protected)
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/courses/5`
- **Headers:** 
  - `Authorization: Bearer {{auth_token}}`
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## 📝 ASSIGNMENT ENDPOINTS

### 1. Get All Assignments (Protected)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/assignments`
- **Headers:** 
  - `Authorization: Bearer {{auth_token}}`
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "success": true,
  "count": 7,
  "assignments": [
    {
      "assignment_id": 1,
      "course_id": 1,
      "course_name": "Full Stack Development",
      "course_code": "PROG2500",
      "title": "Sprint 1 - Backend API",
      "description": "Build REST API with PostgreSQL",
      "due_date": "2026-02-15",
      "status": "Pending",
      "created_at": "2026-02-05T10:00:00.000Z"
    },
    {
      "assignment_id": 2,
      "course_id": 1,
      "course_name": "Full Stack Development",
      "course_code": "PROG2500",
      "title": "Sprint 2 - Frontend",
      "description": "Create React frontend",
      "due_date": "2026-03-01",
      "status": "Pending",
      "created_at": "2026-02-05T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Specific Assignment by ID (Protected)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/assignments/1`
- **Headers:** 
  - `Authorization: Bearer {{auth_token}}`
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "success": true,
  "assignment": {
    "assignment_id": 1,
    "course_id": 1,
    "course_name": "Full Stack Development",
    "course_code": "PROG2500",
    "title": "Sprint 1 - Backend API",
    "description": "Build REST API with PostgreSQL",
    "due_date": "2026-02-15",
    "status": "Pending",
    "created_at": "2026-02-05T10:00:00.000Z"
  }
}
```

---

### 3. Get Assignments by Course (Protected)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/assignments/course/1`
- **Headers:** 
  - `Authorization: Bearer {{auth_token}}`
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "success": true,
  "count": 2,
  "assignments": [
    {
      "assignment_id": 1,
      "course_id": 1,
      "title": "Sprint 1 - Backend API",
      "description": "Build REST API with PostgreSQL",
      "due_date": "2026-02-15",
      "status": "Pending",
      "created_at": "2026-02-05T10:00:00.000Z"
    },
    {
      "assignment_id": 2,
      "course_id": 1,
      "title": "Sprint 2 - Frontend",
      "description": "Create React frontend",
      "due_date": "2026-03-01",
      "status": "Pending",
      "created_at": "2026-02-05T10:00:00.000Z"
    }
  ]
}
```

---

### 4. Create New Assignment (Protected)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/assignments`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Body (raw JSON):**
```json
{
  "course_id": 1,
  "title": "Final Project",
  "description": "Complete full-stack application with authentication",
  "due_date": "2026-04-15",
  "status": "Pending"
}
```
- **Expected Status:** `201 Created`

**Expected Response:**
```json
{
  "success": true,
  "message": "Assignment created successfully",
  "assignment": {
    "assignment_id": 8,
    "course_id": 1,
    "title": "Final Project",
    "description": "Complete full-stack application with authentication",
    "due_date": "2026-04-15",
    "status": "Pending",
    "created_at": "2026-02-05T20:15:00.000Z"
  }
}
```

---

### 5. Update Assignment (Protected)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/assignments/8`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Body (raw JSON):**
```json
{
  "title": "Final Project - Updated",
  "description": "Complete full-stack application with authentication and deployment",
  "due_date": "2026-04-20",
  "status": "Completed"
}
```
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "success": true,
  "message": "Assignment updated successfully",
  "assignment": {
    "assignment_id": 8,
    "course_id": 1,
    "title": "Final Project - Updated",
    "description": "Complete full-stack application with authentication and deployment",
    "due_date": "2026-04-20",
    "status": "Completed",
    "created_at": "2026-02-05T20:15:00.000Z"
  }
}
```

---

### 6. Delete Assignment (Protected)
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/assignments/8`
- **Headers:** 
  - `Authorization: Bearer {{auth_token}}`
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "success": true,
  "message": "Assignment deleted successfully"
}
```

---

## 🧪 Testing Scenarios

### Scenario 1: Complete User Workflow

**Step 1:** Register a new user
```
POST {{base_url}}/api/auth/register
Body: {"name": "John Doe", "email": "john@example.com", "password": "Test123!"}
Save the token from response
```

**Step 2:** Login with the new user
```
POST {{base_url}}/api/auth/login
Body: {"email": "john@example.com", "password": "Test123!"}
```

**Step 3:** Create a course
```
POST {{base_url}}/api/courses
Headers: Authorization: Bearer {token}
Body: {"course_name": "React Development", "course_code": "PROG3000", "semester": "Winter 2026"}
```

**Step 4:** Create an assignment for the course
```
POST {{base_url}}/api/assignments
Headers: Authorization: Bearer {token}
Body: {"course_id": 5, "title": "Build Todo App", "description": "Create React Todo App", "due_date": "2026-03-15", "status": "Pending"}
```

**Step 5:** Get all assignments
```
GET {{base_url}}/api/assignments
Headers: Authorization: Bearer {token}
```

**Step 6:** Update assignment status to Completed
```
PUT {{base_url}}/api/assignments/8
Headers: Authorization: Bearer {token}
Body: {"status": "Completed"}
```

---

### Scenario 2: Error Testing

**Test 1:** Login with wrong password
```
POST {{base_url}}/api/auth/login
Body: {"email": "john@example.com", "password": "WrongPassword"}
Expected: 401 Unauthorized
```

**Test 2:** Access protected route without token
```
GET {{base_url}}/api/courses
Headers: None
Expected: 401 Unauthorized
```

**Test 3:** Create course with missing fields
```
POST {{base_url}}/api/courses
Headers: Authorization: Bearer {token}
Body: {"course_name": "Test Course"}
Expected: 400 Bad Request
```

**Test 4:** Get non-existent assignment
```
GET {{base_url}}/api/assignments/99999
Headers: Authorization: Bearer {token}
Expected: 404 Not Found
```

---

## 📊 Postman Test Scripts

### For Login Requests (Save Token):
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("auth_token", jsonData.token);
    pm.test("Token saved", function() {
        pm.expect(jsonData.token).to.exist;
    });
}

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

### For GET Requests:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success property", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success', true);
});

pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

### For POST (Create) Requests:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has success property", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success', true);
});

pm.test("Resource created", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('message');
});
```

### For PUT (Update) Requests:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Update successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.include('updated');
});
```

### For DELETE Requests:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Delete successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.message).to.include('deleted');
});
```

---

## ✅ Testing Checklist

**Before Testing:**
- [ ] Server is deployed on Render
- [ ] Database is initialized (run `npm run init-db` in Render Shell)
- [ ] Environment variable is set in Postman
- [ ] Base URL is correct

**Authentication:**
- [ ] Register new user works
- [ ] Login returns JWT token
- [ ] Token is saved in environment variable

**Courses:**
- [ ] Get all courses (with auth)
- [ ] Get specific course by ID
- [ ] Create new course
- [ ] Update course
- [ ] Delete course

**Assignments:**
- [ ] Get all assignments (with auth)
- [ ] Get specific assignment by ID
- [ ] Get assignments by course ID
- [ ] Create new assignment
- [ ] Update assignment status
- [ ] Delete assignment

**Error Handling:**
- [ ] Test 401 errors (no token)
- [ ] Test 404 errors (non-existent IDs)
- [ ] Test 400 errors (missing required fields)
- [ ] Test wrong credentials

---

## 🚀 Quick Testing Tips

1. **Start with Health Check** - Verify server is running
2. **Register & Login First** - Get your auth token
3. **Save Token** - Use Postman environment variables
4. **Test in Order** - Auth → Create → Read → Update → Delete
5. **Check Response Times** - Render free tier may have slow cold starts
6. **Document Errors** - Note any unexpected behaviors
7. **Use Collections** - Organize tests by resource type (Auth, Courses, Assignments)

---

## 📝 Notes

- **Authentication Required:** All `/api/courses` and `/api/assignments` endpoints require a valid JWT token
- **Token Format:** `Authorization: Bearer <your-token-here>`
- **Render Cold Starts:** First request may take 30-60 seconds if service was asleep
- **Free Tier Limits:** Render free tier has limited resources
- **Database Persistence:** Data persists between requests on Render
- **Status Codes:**
  - `200` = Success (GET, PUT, DELETE)
  - `201` = Created (POST)
  - `400` = Bad Request (validation error)
  - `401` = Unauthorized (missing/invalid token)
  - `404` = Not Found
  - `500` = Server Error

---

## Need Help?

If endpoints don't work:
1. Check Render dashboard for service status
2. View application logs in Render
3. Verify database is initialized (`npm run init-db`)
4. Ensure JWT_SECRET is set in environment variables
5. Check that you're using the correct auth token

---

**Happy Testing! 🎉**
