// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Import route files
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const placementRoutes = require('./routes/placements');
const higherStudiesRoutes = require('./routes/higherStudies');
const driveRoutes = require('./routes/drives');
const dashboardRoutes = require('./routes/dashboard');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ---------------------
// Apply Middleware
// ---------------------

// Enable CORS for all origins (configure as needed for production)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// HTTP request logging (dev format)
app.use(morgan('dev'));

// ---------------------
// Mount Routes
// ---------------------

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/higher-studies', higherStudiesRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ---------------------
// Health Check
// ---------------------

// Serve static assets in production if they exist
const fs = require('fs');
const path = require('path');
const distPath = path.join(__dirname, '../client/dist');

if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Placement & Higher Studies Tracking Portal API is running',
      version: '1.0.0',
    });
  });
}

// ---------------------
// Global Error Handler
// ---------------------

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled Error:', err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// ---------------------
// Start Server
// ---------------------

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

module.exports = app;
