const Renungan = require('../models/Renungan');

// @desc    Mendapatkan daftar renungan milik pengguna dengan filter & pagination (FR-002, FR-003)
// @route   GET /api/v1/renungan
// @access  Private
const getRenungan = async (req, res, next) => {
  try {
    const { q, kitab, dari, sampai, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const query = { user_id: req.user.id };

    // Filter berdasarkan kata kunci (FR-003)
    if (q) {
      query.$or = [
        { isi_renungan: { $regex: q, $options: 'i' } },
        { kitab: { $regex: q, $options: 'i' } },
        { ayat_referensi: { $regex: q, $options: 'i' } },
      ];
    }

    // Filter berdasarkan kitab
    if (kitab) {
      query.kitab = { $regex: new RegExp(`^${kitab}$`, 'i') };
    }

    // Filter berdasarkan rentang tanggal
    if (dari || sampai) {
      query.createdAt = {};
      if (dari) {
        query.createdAt.$gte = new Date(dari);
      }
      if (sampai) {
        const sampaiDate = new Date(sampai);
        sampaiDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = sampaiDate;
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Renungan.countDocuments(query);
    const data = await Renungan.find(query)
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

// @desc    Mendapatkan detail satu renungan berdasarkan ID
// @route   GET /api/v1/renungan/:id
// @access  Private
const getRenunganById = async (req, res, next) => {
  try {
    const renungan = await Renungan.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!renungan) {
      return res.status(404).json({
        success: false,
        message: 'Renungan tidak ditemukan atau Anda tidak memiliki akses',
      });
    }

    return res.status(200).json({
      success: true,
      data: renungan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Menambahkan renungan baru (FR-002)
// @route   POST /api/v1/renungan
// @access  Private
const createRenungan = async (req, res, next) => {
  try {
    const { kitab, pasal, ayat_referensi, isi_renungan } = req.body;

    if (!kitab || !pasal || !ayat_referensi || !isi_renungan) {
      return res.status(400).json({
        success: false,
        message: 'Kitab, pasal, ayat referensi, dan isi renungan wajib diisi',
      });
    }

    const renungan = await Renungan.create({
      user_id: req.user.id,
      kitab,
      pasal: Number(pasal),
      ayat_referensi,
      isi_renungan,
    });

    return res.status(201).json({
      success: true,
      message: 'Renungan berhasil disimpan',
      data: renungan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mengubah renungan berdasarkan ID (FR-002)
// @route   PUT /api/v1/renungan/:id
// @access  Private
const updateRenungan = async (req, res, next) => {
  try {
    const { kitab, pasal, ayat_referensi, isi_renungan } = req.body;

    const renungan = await Renungan.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!renungan) {
      return res.status(404).json({
        success: false,
        message: 'Renungan tidak ditemukan atau Anda tidak memiliki akses',
      });
    }

    if (kitab) renungan.kitab = kitab;
    if (pasal) renungan.pasal = Number(pasal);
    if (ayat_referensi) renungan.ayat_referensi = ayat_referensi;
    if (isi_renungan) renungan.isi_renungan = isi_renungan;

    const updated = await renungan.save();

    return res.status(200).json({
      success: true,
      message: 'Renungan berhasil diperbarui',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Menghapus renungan berdasarkan ID (FR-002)
// @route   DELETE /api/v1/renungan/:id
// @access  Private
const deleteRenungan = async (req, res, next) => {
  try {
    const renungan = await Renungan.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!renungan) {
      return res.status(404).json({
        success: false,
        message: 'Renungan tidak ditemukan atau Anda tidak memiliki akses',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Renungan berhasil dihapus',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRenungan,
  getRenunganById,
  createRenungan,
  updateRenungan,
  deleteRenungan,
};

