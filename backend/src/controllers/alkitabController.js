const Alkitab = require('../models/Alkitab');
const { DAFTAR_KITAB, AYAT_SAMPEL } = require('../seeds/seedAlkitab');

// @desc    Mendapatkan daftar seluruh kitab (dengan filter testament & search)
// @route   GET /api/v1/alkitab/kitab
// @access  Public
const getDaftarKitab = async (req, res, next) => {
  try {
    const { testament, q } = req.query;

    const query = {};
    if (testament) {
      query.testament = { $regex: new RegExp(`^${testament}$`, 'i') };
    }
    if (q) {
      query.$or = [
        { kitab: { $regex: q, $options: 'i' } },
        { singkatan: { $regex: q, $options: 'i' } },
      ];
    }

    let list = await Alkitab.find(query).select('-ayat_list').sort('urutan');

    // Jika database belum di-seed, berikan fallback dari memory
    if (list.length === 0 && !q && !testament) {
      list = DAFTAR_KITAB;
    } else if (list.length === 0 && testament) {
      list = DAFTAR_KITAB.filter(
        (k) => k.testament.toLowerCase() === testament.toLowerCase()
      );
    }

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mendapatkan ayat-ayat bacaan untuk suatu kitab dan pasal (Frame 9: Baca Pasal)
// @route   GET /api/v1/alkitab/:kitab/:pasal
// @access  Public
const getBacaanPasal = async (req, res, next) => {
  try {
    const { kitab, pasal } = req.params;
    const pasalNum = parseInt(pasal, 10);

    const doc = await Alkitab.findOne({
      kitab: { $regex: new RegExp(`^${kitab}$`, 'i') },
    });

    let ayatList = [];
    let totalPasal = 1;
    let namaKitab = kitab;

    if (doc) {
      namaKitab = doc.kitab;
      totalPasal = doc.total_pasal;
      ayatList = doc.ayat_list.filter((a) => a.pasal === pasalNum);
    } else {
      // Fallback ke sampel
      const sampel = AYAT_SAMPEL[kitab];
      if (sampel) {
        ayatList = sampel.filter((a) => a.pasal === pasalNum);
      }
    }

    // Jika belum ada teks ayat di database untuk pasal ini, buatkan placeholder yang informatif
    if (ayatList.length === 0) {
      ayatList = [
        {
          pasal: pasalNum,
          ayat: 1,
          teks: `Teks bacaan ${namaKitab} pasal ${pasalNum} ayat 1. Firman Allah hidup dan kuat.`,
        },
        {
          pasal: pasalNum,
          ayat: 2,
          teks: `Teks bacaan ${namaKitab} pasal ${pasalNum} ayat 2. Berbahagialah orang yang merenungkannya siang dan malam.`,
        },
      ];
    }

    return res.status(200).json({
      success: true,
      data: {
        kitab: namaKitab,
        pasal: pasalNum,
        total_pasal: totalPasal,
        ayat: ayatList,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDaftarKitab,
  getBacaanPasal,
};

