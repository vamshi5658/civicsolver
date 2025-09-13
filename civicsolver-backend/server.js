const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Serve frontend for all other routes
app.use(express.static(path.join(__dirname, '../community-report-frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../community-report-frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('\x1b[32m%s\x1b[0m', '📦 Connected to MongoDB');
    // Start server after successful database connection
    app.listen(PORT, () => {
      console.log(`\x1b[36m%s\x1b[0m`, `🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('\x1b[31m%s\x1b[0m', '❌ MongoDB connection error:', err);
    process.exit(1);
  });