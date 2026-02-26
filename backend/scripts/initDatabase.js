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

    console.log('🎉 Database initialization completed successfully!');
    console.log('📊 Tables created: users, courses, assignments');
    console.log('');
    console.log('Next steps:');
    console.log('   1. Register a user via POST /api/auth/register');
    console.log('   2. Login via POST /api/auth/login to get your JWT token');
    console.log('   3. Use the token to create courses and assignments');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
