const AyatFavorit = require('../models/AyatFavorit');

// @desc    Mendapatkan daftar ayat favorit milik pengguna (FR-002, FR-003)
// @route   GET /api/v1/favorit
// @access  Private
const getFavorit = async (req, res, next) => {
  try {
    const { kitab, q, page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const query = { user_id: req.user.id };

    if (kitab) {
      query.kitab = { $regex: new RegExp(`^${kitab}$`, 'i') };
    }

    if (q) {
      query.$or = [
        { teks_ayat: { $regex: q, $options: 'i' } },
        { kitab: { $regex: q, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await AyatFavorit.countDocuments(query);
    const data = await AyatFavorit.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: data.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Menambahkan ayat Alkitab ke daftar favorit (FR-002)
// @route   POST /api/v1/favorit
// @access  Private
const addFavorit = async (req, res, next) => {
  try {
    const { kitab, pasal, ayat, teks_ayat } = req.body;

    if (!kitab || !pasal || !ayat || !teks_ayat) {
      return res.status(400).json({
        success: false,
        message: 'Kitab, pasal, ayat, dan teks ayat wajib diisi',
      });
    }

    // Periksa apakah sudah ada di favorit pengguna
    const existing = await AyatFavorit.findOne({
      user_id: req.user.id,
      kitab,
      pasal: Number(pasal),
      ayat: Number(ayat),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ayat ini sudah tersimpan di daftar favorit Anda',
        data: existing,
      });
    }

    const favorit = await AyatFavorit.create({
      user_id: req.user.id,
      kitab,
      pasal: Number(pasal),
      ayat: Number(ayat),
      teks_ayat,
    });

    return res.status(201).json({
      success: true,
      message: 'Ayat berhasil ditambahkan ke daftar favorit',
      data: favorit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Menghapus ayat dari daftar favorit (FR-002)
// @route   DELETE /api/v1/favorit/:id
// @access  Private
const deleteFavorit = async (req, res, next) => {
  try {
    const favorit = await AyatFavorit.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!favorit) {
      return res.status(404).json({
        success: false,
        message: 'Ayat favorit tidak ditemukan atau Anda tidak memiliki akses',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ayat favorit berhasil dihapus',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorit,
  addFavorit,
  deleteFavorit,
};

