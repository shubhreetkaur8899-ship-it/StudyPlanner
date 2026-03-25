require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

const seedDatabase = async () => {
  try {
    // Hash passwords
    const hashedPassword = await bcrypt.hash('Password123', 10);
    const usersData = [
      {
        name: 'Shubhreet Kaur',
        email: 'shubhreet@example.com',
        password_hash: hashedPassword
      },
      {
        name: 'Shubhreet',
        email: 'shubhreet1@example.com',
        password_hash: hashedPassword
      },
      {
        name: 'Shubhreet User',
        email: 'shubhreet2@example.com',
        password_hash: hashedPassword
      },
      {
        name: 'Shubhreet Demo',
        email: 'shubhreet3@example.com',
        password_hash: hashedPassword
      },
      {
        name: 'Shubhreet Student',
        email: 'shubhreet4@example.com',
        password_hash: hashedPassword
      }
    ];

    const userIds = [];
    for (const user of usersData) {
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id',
        [user.name, user.email, user.password_hash]
      );
      userIds.push(result.rows[0].user_id);
    }
    const courses = [
      { userId: userIds[0], name: 'Web Development', code: 'CS101', semester: 'Spring 2026' },
      { userId: userIds[0], name: 'Database Design', code: 'CS201', semester: 'Spring 2026' },
      { userId: userIds[0], name: 'Mobile App Dev', code: 'CS301', semester: 'Spring 2026' },
      { userId: userIds[1], name: 'Cloud Computing', code: 'CS102', semester: 'Spring 2026' },
      { userId: userIds[1], name: 'AI & Machine Learning', code: 'CS202', semester: 'Spring 2026' }
    ];

    const courseIds = [];
    for (const course of courses) {
      const result = await pool.query(
        'INSERT INTO courses (user_id, course_name, course_code, semester) VALUES ($1, $2, $3, $4) RETURNING course_id',
        [course.userId, course.name, course.code, course.semester]
      );
      courseIds.push(result.rows[0].course_id);
    }
    const assignments = [
      { courseId: courseIds[0], title: 'React Todo App', description: 'Build a todo application with React', dueDate: '2026-04-01', status: 'Pending' },
      { courseId: courseIds[0], title: 'Express REST API', description: 'Create a REST API with Express', dueDate: '2026-04-05', status: 'Completed' },
      { courseId: courseIds[0], title: 'Database Queries', description: 'Write SQL queries for reports', dueDate: '2026-04-10', status: 'Pending' },
      { courseId: courseIds[1], title: 'Schema Design', description: 'Design database schema for e-commerce', dueDate: '2026-04-08', status: 'Pending' },
      { courseId: courseIds[1], title: 'Query Optimization', description: 'Optimize slow database queries', dueDate: '2026-04-12', status: 'Completed' }
    ];

    for (const assignment of assignments) {
      await pool.query(
        'INSERT INTO assignments (course_id, title, description, due_date, status) VALUES ($1, $2, $3, $4, $5)',
        [assignment.courseId, assignment.title, assignment.description, assignment.dueDate, assignment.status]
      );
    }

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

seedDatabase();
