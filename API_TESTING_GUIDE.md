# StudyPlanner API Testing Guide

Complete guide for testing all API endpoints using cURL, Postman, or Thunder Client.

## Prerequisites
- Backend server running (locally or deployed to Render)
- API Base URL ready:
  - Local: `http://localhost:5000`
  - Deployed: `https://your-app-name.onrender.com`

## Setup Instructions

### Option 1: Using cURL (Command Line)

All examples below use cURL. Replace `BASE_URL` with your actual URL:
```bash
# For local testing
export BASE_URL="http://localhost:5000"

# For Render deployment
export BASE_URL="https://studyplanner-api.onrender.com"
```

### Option 2: Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension in VS Code
2. Create new collection: "StudyPlanner API"
3. Set environment variable: `baseURL` = your API URL
4. Import the requests below

### Option 3: Using Postman

1. Open Postman
2. Create new collection: "StudyPlanner API"
3. Add environment with variable: `baseURL` = your API URL
4. Create requests following the examples below

---

## Test Flow (Recommended Order)

### Step 0: Health Check

**Test that API is running**

```bash
curl $BASE_URL
```

**Expected Response: 200 OK**
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

## Authentication Tests

### Test 1: Register New User

**Request:**
```bash
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shubhreet Kaur",
    "email": "shubhreet@test.com",
    "password": "password123"
  }'
```

**Expected Response: 201 Created**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "userId": 1,
      "name": "Shubhreet Kaur",
      "email": "shubhreet@test.com",
      "createdAt": "2026-02-05T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoic2h1YmhyZWV0QHRlc3QuY29tIiwiaWF0IjoxNzM4NzYwNDAwLCJleHAiOjE3Mzk0NjU2MDB9.abcdef123456"
  }
}
```

**Save the token!** You'll need it for all protected endpoints.

**Error Cases to Test:**

1. Missing fields:
```bash
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User"}'
# Expected: 400 Bad Request - "Please provide all required fields"
```

2. Invalid email:
```bash
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "password": "password123"
  }'
# Expected: 400 Bad Request - "Please provide a valid email address"
```

3. Duplicate email:
```bash
# Try registering same email again
# Expected: 400 Bad Request - "User with this email already exists"
```

4. Weak password:
```bash
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test2@test.com",
    "password": "12345"
  }'
# Expected: 400 Bad Request - "Password must be at least 6 characters"
```

---

### Test 2: Login User

**Request:**
```bash
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "shubhreet@test.com",
    "password": "password123"
  }'
```

**Expected Response: 200 OK**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": 1,
      "name": "Shubhreet Kaur",
      "email": "shubhreet@test.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Store the token in a variable:**
```bash
export TOKEN="paste_your_token_here"
```

**Error Cases:**

1. Wrong password:
```bash
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "shubhreet@test.com",
    "password": "wrongpassword"
  }'
# Expected: 401 Unauthorized - "Invalid credentials"
```

2. Non-existent user:
```bash
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nobody@test.com",
    "password": "password123"
  }'
# Expected: 401 Unauthorized - "Invalid credentials"
```

---

## Course Management Tests

### Test 3: Create a Course

**Request:**
```bash
curl -X POST $BASE_URL/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "course_name": "Full Stack Development",
    "course_code": "PROG2500",
    "semester": "Winter 2026"
  }'
```

**Expected Response: 201 Created**
```json
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

**Save the course_id!** You'll need it for assignment tests.

```bash
export COURSE_ID=1
```

**Create a second course:**
```bash
curl -X POST $BASE_URL/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "course_name": "Database Administration",
    "course_code": "DBAS2100",
    "semester": "Winter 2026"
  }'
```

**Error Cases:**

1. Missing authentication:
```bash
curl -X POST $BASE_URL/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "course_name": "Test Course",
    "course_code": "TEST101"
  }'
# Expected: 401 Unauthorized - "No token provided"
```

2. Missing required fields:
```bash
curl -X POST $BASE_URL/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "course_name": "Test Course"
  }'
# Expected: 400 Bad Request - "Please provide course_name and course_code"
```

---

### Test 4: Get All Courses

**Request:**
```bash
curl $BASE_URL/api/courses \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response: 200 OK**
```json
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
    },
    {
      "course_id": 2,
      "user_id": 1,
      "course_name": "Database Administration",
      "course_code": "DBAS2100",
      "semester": "Winter 2026",
      "created_at": "2026-02-05T10:05:00.000Z"
    }
  ]
}
```

---

### Test 5: Get Single Course

**Request:**
```bash
curl $BASE_URL/api/courses/$COURSE_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response: 200 OK**
```json
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

**Error Case:**
```bash
curl $BASE_URL/api/courses/999 \
  -H "Authorization: Bearer $TOKEN"
# Expected: 404 Not Found - "Course not found"
```

---

### Test 6: Update a Course

**Request:**
```bash
curl -X PUT $BASE_URL/api/courses/$COURSE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "course_name": "Advanced Full Stack Development",
    "semester": "Winter 2026"
  }'
```

**Expected Response: 200 OK**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "course_id": 1,
    "user_id": 1,
    "course_name": "Advanced Full Stack Development",
    "course_code": "PROG2500",
    "semester": "Winter 2026",
    "created_at": "2026-02-05T10:00:00.000Z"
  }
}
```

---

### Test 7: Delete a Course

**Create a test course to delete:**
```bash
curl -X POST $BASE_URL/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "course_name": "Test Course to Delete",
    "course_code": "TEST999"
  }'

# Save the returned course_id
export DELETE_COURSE_ID=3
```

**Delete the course:**
```bash
curl -X DELETE $BASE_URL/api/courses/$DELETE_COURSE_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response: 200 OK**
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": {
    "course_id": 3,
    "course_name": "Test Course to Delete",
    ...
  }
}
```

**Verify deletion:**
```bash
curl $BASE_URL/api/courses \
  -H "Authorization: Bearer $TOKEN"
# Course should no longer appear in the list
```

---

## Assignment Management Tests

### Test 8: Create an Assignment

**Request:**
```bash
curl -X POST $BASE_URL/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "course_id": '$COURSE_ID',
    "title": "Sprint 1 Review",
    "description": "Backend development review and demonstration",
    "due_date": "2026-02-05",
    "status": "Pending"
  }'
```

**Expected Response: 201 Created**
```json
{
  "success": true,
  "message": "Assignment created successfully",
  "data": {
    "assignment_id": 1,
    "course_id": 1,
    "title": "Sprint 1 Review",
    "description": "Backend development review and demonstration",
    "due_date": "2026-02-05",
    "status": "Pending",
    "created_at": "2026-02-05T10:00:00.000Z"
  }
}
```

**Save the assignment_id:**
```bash
export ASSIGNMENT_ID=1
```

**Create more assignments:**
```bash
# Assignment 2
curl -X POST $BASE_URL/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "course_id": '$COURSE_ID',
    "title": "Database Design Project",
    "description": "Design and implement database schema",
    "due_date": "2026-02-12",
    "status": "Pending"
  }'

# Assignment 3 (for second course)
curl -X POST $BASE_URL/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "course_id": 2,
    "title": "SQL Query Practice",
    "description": "Complete SQL exercises",
    "due_date": "2026-02-10",
    "status": "Completed"
  }'
```

**Error Cases:**

1. Invalid course_id:
```bash
curl -X POST $BASE_URL/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "course_id": 999,
    "title": "Test Assignment",
    "due_date": "2026-02-10"
  }'
# Expected: 404 Not Found - "Course not found"
```

2. Invalid status:
```bash
curl -X POST $BASE_URL/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "course_id": '$COURSE_ID',
    "title": "Test Assignment",
    "due_date": "2026-02-10",
    "status": "InvalidStatus"
  }'
# Expected: 400 Bad Request - "Status must be either Pending or Completed"
```

---

### Test 9: Get All Assignments

**Request:**
```bash
curl $BASE_URL/api/assignments \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response: 200 OK**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "assignment_id": 1,
      "course_id": 1,
      "title": "Sprint 1 Review",
      "description": "Backend development review and demonstration",
      "due_date": "2026-02-05",
      "status": "Pending",
      "course_name": "Full Stack Development",
      "course_code": "PROG2500",
      "created_at": "2026-02-05T10:00:00.000Z"
    },
    ...
  ]
}
```

---

### Test 10: Get Assignments by Course

**Request:**
```bash
curl $BASE_URL/api/courses/$COURSE_ID/assignments \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response: 200 OK**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "assignment_id": 1,
      "course_id": 1,
      "title": "Sprint 1 Review",
      ...
    },
    {
      "assignment_id": 2,
      "course_id": 1,
      "title": "Database Design Project",
      ...
    }
  ]
}
```

---

### Test 11: Get Single Assignment

**Request:**
```bash
curl $BASE_URL/api/assignments/$ASSIGNMENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "assignment_id": 1,
    "course_id": 1,
    "title": "Sprint 1 Review",
    "description": "Backend development review and demonstration",
    "due_date": "2026-02-05",
    "status": "Pending",
    "course_name": "Full Stack Development",
    "course_code": "PROG2500",
    "user_id": 1,
    "created_at": "2026-02-05T10:00:00.000Z"
  }
}
```

---

### Test 12: Update an Assignment

**Mark assignment as completed:**
```bash
curl -X PUT $BASE_URL/api/assignments/$ASSIGNMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "Completed",
    "description": "Backend development review completed successfully!"
  }'
```

**Expected Response: 200 OK**
```json
{
  "success": true,
  "message": "Assignment updated successfully",
  "data": {
    "assignment_id": 1,
    "status": "Completed",
    "description": "Backend development review completed successfully!",
    ...
  }
}
```

---

### Test 13: Delete an Assignment

**Request:**
```bash
curl -X DELETE $BASE_URL/api/assignments/$ASSIGNMENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response: 200 OK**
```json
{
  "success": true,
  "message": "Assignment deleted successfully",
  "data": {
    "assignment_id": 1,
    ...
  }
}
```

---

## Complete Test Scenarios

### Scenario 1: New Student Setup

```bash
# 1. Register
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"New Student","email":"student@test.com","password":"pass123"}'

# 2. Login (save token)
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"pass123"}'

# 3. Add courses
curl -X POST $BASE_URL/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"course_name":"Math 101","course_code":"MATH101","semester":"Winter 2026"}'

# 4. Add assignments
curl -X POST $BASE_URL/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"course_id":1,"title":"Homework 1","due_date":"2026-02-15","status":"Pending"}'
```

### Scenario 2: Track Assignment Progress

```bash
# 1. View all pending assignments
curl $BASE_URL/api/assignments \
  -H "Authorization: Bearer $TOKEN"

# 2. Complete an assignment
curl -X PUT $BASE_URL/api/assignments/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"Completed"}'

# 3. View updated assignments
curl $BASE_URL/api/assignments \
  -H "Authorization: Bearer $TOKEN"
```

### Scenario 3: Course Management

```bash
# 1. View all courses
curl $BASE_URL/api/courses \
  -H "Authorization: Bearer $TOKEN"

# 2. View assignments for specific course
curl $BASE_URL/api/courses/1/assignments \
  -H "Authorization: Bearer $TOKEN"

# 3. Update course information
curl -X PUT $BASE_URL/api/courses/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"semester":"Spring 2026"}'

# 4. Delete old course
curl -X DELETE $BASE_URL/api/courses/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Testing Checklist

Use this checklist to verify all functionality:

### Authentication
- [ ] Register new user with valid data
- [ ] Register fails with duplicate email
- [ ] Register fails with invalid email
- [ ] Register fails with short password
- [ ] Login with correct credentials
- [ ] Login fails with wrong password
- [ ] Login fails with non-existent user

### Courses
- [ ] Create course with all fields
- [ ] Create course without optional semester
- [ ] Get all courses (empty list initially)
- [ ] Get all courses (with data)
- [ ] Get single course by ID
- [ ] Get non-existent course (404)
- [ ] Update course name
- [ ] Update multiple course fields
- [ ] Delete course
- [ ] Verify course deleted

### Assignments
- [ ] Create assignment with all fields
- [ ] Create assignment without description
- [ ] Get all assignments
- [ ] Get assignments by course
- [ ] Get single assignment by ID
- [ ] Update assignment status to Completed
- [ ] Update assignment description
- [ ] Delete assignment
- [ ] Cascade delete (delete course, verify assignments deleted)

### Security
- [ ] Access protected route without token (401)
- [ ] Access protected route with invalid token (401)
- [ ] Access another user's course (403)
- [ ] Access another user's assignment (403)

---

## Tips for Testing

1. **Save tokens and IDs** - Store them in variables for easy reuse
2. **Test in order** - Follow the recommended test flow
3. **Check status codes** - Verify you get expected HTTP status codes
4. **Read error messages** - They tell you what went wrong
5. **Test edge cases** - Try invalid inputs, missing fields, etc.
6. **Verify cascading deletes** - Delete a course and check assignments
7. **Test with multiple users** - Create two accounts and verify data isolation

---

## Automated Testing Script

Save this as `test_api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "Testing StudyPlanner API..."
echo "============================"

# Health check
echo "1. Health check..."
curl -s $BASE_URL | json_pp

# Register
echo "
2. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}')
echo $REGISTER_RESPONSE | json_pp

# Extract token
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

# Create course
echo "
3. Creating course..."
COURSE_RESPONSE=$(curl -s -X POST $BASE_URL/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"course_name":"Test Course","course_code":"TEST101","semester":"Winter 2026"}')
echo $COURSE_RESPONSE | json_pp

# Extract course_id
COURSE_ID=$(echo $COURSE_RESPONSE | grep -o '"course_id":[0-9]*' | cut -d':' -f2)
echo "Course ID: $COURSE_ID"

# Create assignment
echo "
4. Creating assignment..."
curl -s -X POST $BASE_URL/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"course_id\":$COURSE_ID,\"title\":\"Test Assignment\",\"due_date\":\"2026-02-15\",\"status\":\"Pending\"}" \
  | json_pp

# Get all assignments
echo "
5. Getting all assignments..."
curl -s $BASE_URL/api/assignments \
  -H "Authorization: Bearer $TOKEN" \
  | json_pp

echo "
Testing complete!"
```

Make it executable:
```bash
chmod +x test_api.sh
./test_api.sh
```

---

**Happy Testing! 🧪**

For questions or issues, refer to the main README.md or contact your instructor.
