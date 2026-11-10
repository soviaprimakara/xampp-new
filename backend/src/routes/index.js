const express = require('express');
const authRoutes = require('./authRoutes');
const renunganRoutes = require('./renunganRoutes');
const favoritRoutes = require('./favoritRoutes');
const progressRoutes = require('./progressRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const alkitabRoutes = require('./alkitabRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/renungan', renunganRoutes);
router.use('/favorit', favoritRoutes);
router.use('/progress', progressRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/alkitab', alkitabRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Habits Bible Tracker REST API berjalan normal',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

