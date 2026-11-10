const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

// Validasi untuk registrasi
const registerRules = [
  body('name').trim().notEmpty().withMessage('Nama lengkap wajib diisi'),
  body('email').trim().isEmail().withMessage('Format email tidak valid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Kata sandi minimal 6 karakter'),
];

// Validasi untuk login
const loginRules = [
  body('email').trim().isEmail().withMessage('Format email tidak valid'),
  body('password').notEmpty().withMessage('Kata sandi wajib diisi'),
];

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put(
  '/password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Kata sandi lama wajib diisi'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Kata sandi baru minimal 6 karakter'),
  ],
  validate,
  changePassword
);

module.exports = router;

