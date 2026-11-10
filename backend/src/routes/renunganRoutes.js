const express = require('express');
const { body } = require('express-validator');
const {
  getRenungan,
  getRenunganById,
  createRenungan,
  updateRenungan,
  deleteRenungan,
} = require('../controllers/renunganController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

// Seluruh endpoint renungan terproteksi dengan JWT
router.use(protect);

const renunganRules = [
  body('kitab').trim().notEmpty().withMessage('Kitab wajib diisi'),
  body('pasal').isInt({ min: 1 }).withMessage('Pasal harus berupa angka positif'),
  body('ayat_referensi').trim().notEmpty().withMessage('Referensi ayat wajib diisi'),
  body('isi_renungan').trim().notEmpty().withMessage('Isi renungan wajib diisi'),
];

router.route('/')
  .get(getRenungan)
  .post(renunganRules, validate, createRenungan);

router.route('/:id')
  .get(getRenunganById)
  .put(updateRenungan)
  .delete(deleteRenungan);

module.exports = router;

