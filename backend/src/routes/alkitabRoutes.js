const express = require('express');
const {
  getDaftarKitab,
  getBacaanPasal,
} = require('../controllers/alkitabController');

const router = express.Router();

router.get('/kitab', getDaftarKitab);
router.get('/:kitab/:pasal', getBacaanPasal);

module.exports = router;

