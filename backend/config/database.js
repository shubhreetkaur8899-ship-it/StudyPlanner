const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration for Render
const connectionConfig = {
  user: 'studyplanner_db_3hw8_user',
  password: 'V3Uw2Q853Afu5oRPCZqbhA8Nh9mlHIg3',
  host: 'dpg-d62ejocoud1c73dlbvfg-a.oregon-postgres.render.com',
  port: 5432,
  database: 'studyplanner_db_3hw8',
  ssl: {
    rejectUnauthorized: false
  }
};

// Create a connection pool
const pool = new Pool(connectionConfig);

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Helper function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

module.exports = {
  pool,
  query
};
