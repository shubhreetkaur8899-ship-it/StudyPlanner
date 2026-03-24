const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { pool } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const assignmentRoutes = require('./routes/assignments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'StudyPlanner API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      assignments: '/api/assignments'
    }
  });
});

// Database health check
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      success: true,
      message: 'Database connected',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection (optional for demo mode)
    try {
      await pool.query('SELECT NOW()');
      console.log('✅ Database connection verified');
    } catch (dbError) {
      console.log('⚠️  Database not available - running in demo mode');
      console.log('   Error:', dbError.message);
    }
    
    // Start listening
    app.listen(PORT, () => {
      console.log('');
      console.log('╔════════════════════════════════════════╗');
      console.log('║                                        ║');
      console.log('║   📚 StudyPlanner API Running 📚      ║');
      console.log('║                                        ║');
      console.log(`║   Port: ${PORT}                           ║`);
      console.log(`║   Environment: ${process.env.NODE_ENV || 'development'}            ║`);
      console.log('║                                        ║');
      console.log('║   Ready to plan your studies! 🎯      ║');
      console.log('║                                        ║');
      console.log('╚════════════════════════════════════════╝');
      console.log('');
      console.log('📡 API Endpoints:');
      console.log('   - GET  /health           - Database health check');
      console.log('   - POST /api/auth/register - Register new user');
      console.log('   - POST /api/auth/login    - User login');
      console.log('   - GET  /api/courses       - Get all courses');
      console.log('   - GET  /api/assignments   - Get all assignments');
      console.log('');
      console.log('💡 Tip: Run "npm run init-db" to initialize database tables');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
