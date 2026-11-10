const ProgressBacaan = require('../models/ProgressBacaan');

// @desc    Mendapatkan posisi bacaan & riwayat progres pengguna (FR-002)
// @route   GET /api/v1/progress
// @access  Private
const getProgress = async (req, res, next) => {
  try {
    let progress = await ProgressBacaan.findOne({ user_id: req.user.id });

    // Jika belum ada, buat dokumen default awal
    if (!progress) {
      progress = await ProgressBacaan.create({
        user_id: req.user.id,
        kitab_terakhir: 'Kejadian',
        pasal_terakhir: 1,
        pasal_selesai: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Memperbarui posisi bacaan & menandai pasal selesai dibaca (FR-002, T-09)
// @route   PUT /api/v1/progress
// @access  Private
const updateProgress = async (req, res, next) => {
  try {
    const { kitab_terakhir, pasal_terakhir, kitab, pasal, tandai_selesai } = req.body;

    let progress = await ProgressBacaan.findOne({ user_id: req.user.id });

    if (!progress) {
      progress = new ProgressBacaan({
        user_id: req.user.id,
        kitab_terakhir: kitab_terakhir || kitab || 'Kejadian',
        pasal_terakhir: pasal_terakhir || (pasal ? Number(pasal) : 1),
        pasal_selesai: [],
      });
    }

    // Perbarui posisi terakhir jika diberikan
    if (kitab_terakhir) {
      progress.kitab_terakhir = kitab_terakhir;
    }
    if (pasal_terakhir !== undefined) {
      progress.pasal_terakhir = Number(pasal_terakhir);
    }

    // Tandai pasal selesai (jika dikirim kitab & pasal)
    const targetKitab = kitab || kitab_terakhir;
    const targetPasal = pasal !== undefined ? Number(pasal) : (pasal_terakhir !== undefined ? Number(pasal_terakhir) : null);

    if (tandai_selesai !== false && targetKitab && targetPasal) {
      // Pastikan tidak ada duplikasi pada array pasal_selesai
      const alreadyRead = progress.pasal_selesai.some(
        (item) =>
          item.kitab.toLowerCase() === targetKitab.toLowerCase() &&
          item.pasal === targetPasal
      );

      if (!alreadyRead) {
        progress.pasal_selesai.push({
          kitab: targetKitab,
          pasal: targetPasal,
          selesai_pada: new Date(),
        });
      }

      // Update juga posisi terakhir ke pasal yang baru ditandai
      progress.kitab_terakhir = targetKitab;
      progress.pasal_terakhir = targetPasal;
    }

    await progress.save();

    return res.status(200).json({
      success: true,
      message: 'Progres bacaan berhasil diperbarui',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProgress,
  updateProgress,
};

