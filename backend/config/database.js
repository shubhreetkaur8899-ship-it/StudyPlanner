const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration
// Uses DATABASE_URL environment variable (set in .env for local dev, auto-set by Render in production)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Accept self-signed certs from all cloud PostgreSQL providers (Neon, Render, Supabase)
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000
});

let dbConnected = false;

// Test database connection immediately
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    dbConnected = false;
  } else {
    dbConnected = true;
  }
});

// Test database connection
pool.on('connect', () => {
  dbConnected = true;
});

pool.on('error', (err) => {
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
    
    return res;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  pool,
  query,
  isConnected: () => dbConnected
};
