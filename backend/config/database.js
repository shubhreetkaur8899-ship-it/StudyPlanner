const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration
// Uses DATABASE_URL environment variable (set in .env for local dev, auto-set by Render in production)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
});

let dbConnected = false;

// Test database connection immediately
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.log('⚠️  Database connection failed at startup:', err.message);
    console.log('💡 Make sure DATABASE_URL is valid in .env');
  } else {
    console.log('✅ Database connected successfully');
    dbConnected = true;
  }
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ New connection to PostgreSQL database established');
  dbConnected = true;
});

pool.on('error', (err) => {
  console.error('⚠️  Database connection error:', err.message);
  dbConnected = false;
});

// Helper function to execute queries with timeout
const query = async (text, params) => {
  try {
    const res = await Promise.race([
      pool.query(text, params),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), 10000)
      )
    ]);
    
    const duration = Date.now();
    console.log('✓ Query executed', { rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error.message);
    console.error('   Query:', text);
    throw error;
  }
};

module.exports = {
  pool,
  query,
  isConnected: () => dbConnected
};
