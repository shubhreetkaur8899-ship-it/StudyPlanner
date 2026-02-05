require('dotenv').config();
const { pool } = require('../config/database');

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing StudyPlanner database...');

    // Drop existing tables (be careful in production!)
    await pool.query(`
      DROP TABLE IF EXISTS assignments CASCADE;
      DROP TABLE IF EXISTS courses CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('✅ Dropped existing tables');

    // Create users table
    await pool.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created users table');

    // Create courses table
    await pool.query(`
      CREATE TABLE courses (
        course_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        course_name VARCHAR(200) NOT NULL,
        course_code VARCHAR(50) NOT NULL,
        semester VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Created courses table');

    // Create assignments table
    await pool.query(`
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
    `);
    console.log('✅ Created assignments table');

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX idx_courses_user_id ON courses(user_id);
      CREATE INDEX idx_assignments_course_id ON assignments(course_id);
      CREATE INDEX idx_assignments_status ON assignments(status);
      CREATE INDEX idx_assignments_due_date ON assignments(due_date);
    `);
    console.log('✅ Created indexes');

    // Insert sample data
    console.log('🔄 Inserting sample data...');

    // Insert sample users (password is 'password123' hashed with bcrypt)
    await pool.query(`
      INSERT INTO users (name, email, password_hash) VALUES
      ('Shubhreet Kaur', 'shubhreet@example.com', '$2b$10$YourHashedPasswordHere'),
      ('Test Student', 'test@example.com', '$2b$10$YourHashedPasswordHere');
    `);
    console.log('✅ Inserted sample users');

    // Insert sample courses
    await pool.query(`
      INSERT INTO courses (user_id, course_name, course_code, semester) VALUES
      (1, 'Full Stack Development', 'PROG2500', 'Winter 2026'),
      (1, 'Database Management', 'PROG1400', 'Winter 2026'),
      (1, 'Web Programming', 'PROG1700', 'Winter 2026'),
      (2, 'Mobile Development', 'PROG3000', 'Winter 2026');
    `);
    console.log('✅ Inserted sample courses');

    // Insert sample assignments
    await pool.query(`
      INSERT INTO assignments (course_id, title, description, due_date, status) VALUES
      (1, 'Sprint 1 - Backend API', 'Build REST API with PostgreSQL', '2026-02-15', 'Pending'),
      (1, 'Sprint 2 - Frontend', 'Create React frontend', '2026-03-01', 'Pending'),
      (2, 'Database Design Project', 'Design normalized database schema', '2026-02-20', 'Pending'),
      (2, 'SQL Queries Assignment', 'Write complex SQL queries', '2026-02-12', 'Completed'),
      (3, 'HTML/CSS Portfolio', 'Build personal portfolio website', '2026-02-18', 'Completed'),
      (3, 'JavaScript Mini-Project', 'Interactive web application', '2026-02-25', 'Pending'),
      (4, 'Android App Development', 'Build native Android app', '2026-03-05', 'Pending');
    `);
    console.log('✅ Inserted sample assignments');

    console.log('🎉 Database initialization completed successfully!');
    console.log('📊 Summary:');
    console.log('   - 2 users created');
    console.log('   - 4 courses created');
    console.log('   - 7 assignments created');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
