const express = require('express');
const {
  getProgress,
  updateProgress,
} = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Seluruh endpoint progres terproteksi dengan JWT
router.use(protect);

router.route('/')
  .get(getProgress)
  .put(updateProgress);

module.exports = router;

