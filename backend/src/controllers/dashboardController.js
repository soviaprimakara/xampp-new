const ProgressBacaan = require('../models/ProgressBacaan');
const AyatFavorit = require('../models/AyatFavorit');
const Renungan = require('../models/Renungan');

// Kitab Perjanjian Baru untuk kalkulasi breakdown statistik
const KITAB_PB = [
  'Matius', 'Markus', 'Lukas', 'Yohanes', 'Kisah Para Rasul', 'Roma',
  '1 Korintus', '2 Korintus', 'Galatia', 'Efesus', 'Filipi', 'Kolose',
  '1 Tesalonika', '2 Tesalonika', '1 Timotius', '2 Timotius', 'Titus',
  'Filemon', 'Ibrani', 'Yakobus', '1 Petrus', '2 Petrus', '1 Yohanes',
  '2 Yohanes', '3 Yohanes', 'Yudas', 'Wahyu'
];

// Total pasal Alkitab: 929 PL + 260 PB = 1189 pasal
const TOTAL_PASAL_ALKITAB = 1189;
const TOTAL_PASAL_PL = 929;
const TOTAL_PASAL_PB = 260;

// @desc    Mendapatkan ringkasan statistik dashboard (FR-004)
// @route   GET /api/v1/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [progress, totalFavorit, totalRenungan, renunganTerbaru, favoritTerbaru] =
      await Promise.all([
        ProgressBacaan.findOne({ user_id: userId }),
        AyatFavorit.countDocuments({ user_id: userId }),
        Renungan.countDocuments({ user_id: userId }),
        Renungan.find({ user_id: userId }).sort('-createdAt').limit(3),
        AyatFavorit.find({ user_id: userId }).sort('-createdAt').limit(3),
      ]);

    const pasalSelesai = progress ? progress.pasal_selesai : [];
    const totalPasalSelesai = pasalSelesai.length;

    // Hitung breakdown Perjanjian Lama & Perjanjian Baru
    let selesaiPB = 0;
    let selesaiPL = 0;

    pasalSelesai.forEach((item) => {
      if (KITAB_PB.includes(item.kitab)) {
        selesaiPB += 1;
      } else {
        selesaiPL += 1;
      }
    });

    const persentaseTotal = ((totalPasalSelesai / TOTAL_PASAL_ALKITAB) * 100).toFixed(1);
    const persentasePL = ((selesaiPL / TOTAL_PASAL_PL) * 100).toFixed(1);
    const persentasePB = ((selesaiPB / TOTAL_PASAL_PB) * 100).toFixed(1);

    return res.status(200).json({
      success: true,
      data: {
        statistik: {
          total_pasal_selesai: totalPasalSelesai,
          total_favorit: totalFavorit,
          total_renungan: totalRenungan,
          persentase_selesai: `${persentaseTotal}%`,
        },
        progres_detail: {
          bacaan_terakhir: {
            kitab: progress ? progress.kitab_terakhir : 'Kejadian',
            pasal: progress ? progress.pasal_terakhir : 1,
          },
          perjanjian_lama: {
            selesai: selesaiPL,
            total: TOTAL_PASAL_PL,
            persentase: `${persentasePL}%`,
          },
          perjanjian_baru: {
            selesai: selesaiPB,
            total: TOTAL_PASAL_PB,
            persentase: `${persentasePB}%`,
          },
        },
        aktivitas_terbaru: {
          renungan_terbaru: renunganTerbaru,
          favorit_terbaru: favoritTerbaru,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};

