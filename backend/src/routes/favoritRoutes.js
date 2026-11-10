const express = require('express');
const { body } = require('express-validator');
const {
  getFavorit,
  addFavorit,
  deleteFavorit,
} = require('../controllers/favoritController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

// Seluruh endpoint favorit terproteksi dengan JWT
router.use(protect);

const favoritRules = [
  body('kitab').trim().notEmpty().withMessage('Kitab wajib diisi'),
  body('pasal').isInt({ min: 1 }).withMessage('Pasal harus berupa angka'),
  body('ayat').isInt({ min: 1 }).withMessage('Ayat harus berupa angka'),
  body('teks_ayat').trim().notEmpty().withMessage('Teks ayat wajib diisi'),
];

router.route('/')
  .get(getFavorit)
  .post(favoritRules, validate, addFavorit);

router.route('/:id')
  .delete(deleteFavorit);

module.exports = router;

