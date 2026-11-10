const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Middleware dasar
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (hanya saat development)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Route API utama (v1)
app.use('/api/v1', routes);

// Root route informasi API
app.get('/', (req, res) => {
  res.json({
    name: 'Habits Bible Tracker REST API',
    version: '1.0.0',
    documentation: 'https://documenter.getpostman.com/view/59208278/2sBYHUULNZ',
    team: 'Peace Maker Joy - Universitas Primakara',
    status: 'Active',
  });
});

// Middleware 404 & Centralized Error Handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;

