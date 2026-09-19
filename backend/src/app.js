const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup (pointing to frontend/web/views)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'frontend', 'web', 'views'));

// Static files setup (pointing to frontend/web/public)
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'web', 'public')));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root route
app.get('/', (_req, res) => {
  res.render('pages/index', { title: 'Aplikasi Bank Sampah Terintegrasi' });
});

module.exports = app;
