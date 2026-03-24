# StudyPlanner Frontend

React-based frontend for the StudyPlanner application built during Weeks 9 and 10.

## Features

- User authentication (Login/Sign Up)
- Dashboard with statistics
- Course management
- Assignment tracking
- Responsive design
- React Router navigation

## Components

### Pages
- **Login**: Authentication page with sign up option
- **Dashboard**: Overview with stats and recent assignments
- **Courses**: CRUD operations for courses
- **Assignments**: CRUD operations for assignments

### Components
- **Navbar**: Navigation and user menu
- **CourseCard**: Reusable course display component

### Services
- **api.js**: Centralized API service with methods for all endpoints

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs on `http://localhost:3000` and connects to the backend API at `http://localhost:5000`.
