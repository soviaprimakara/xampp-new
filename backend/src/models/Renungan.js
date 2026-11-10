const mongoose = require('mongoose');

const renunganSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID wajib disertakan'],
      index: true,
    },
    kitab: {
      type: String,
      required: [true, 'Nama kitab wajib diisi'],
      trim: true,
    },
    pasal: {
      type: Number,
      required: [true, 'Nomor pasal wajib diisi'],
      min: [1, 'Nomor pasal minimal 1'],
    },
    ayat_referensi: {
      type: String,
      required: [true, 'Referensi ayat wajib diisi'],
      trim: true,
    },
    isi_renungan: {
      type: String,
      required: [true, 'Isi renungan wajib diisi'],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indeks sesuai SDS:
// 1. Compound index pada (user_id, createdAt) untuk optimasi query list & sort per user
renunganSchema.index({ user_id: 1, createdAt: -1 });

// 2. Text index pada isi_renungan dan kitab untuk fitur pencarian kata kunci (FR-003)
renunganSchema.index({ isi_renungan: 'text', kitab: 'text', ayat_referensi: 'text' });

module.exports = mongoose.model('Renungan', renunganSchema);

