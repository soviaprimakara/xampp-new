const mongoose = require('mongoose');

const ayatFavoritSchema = new mongoose.Schema(
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
    ayat: {
      type: Number,
      required: [true, 'Nomor ayat wajib diisi'],
      min: [1, 'Nomor ayat minimal 1'],
    },
    teks_ayat: {
      type: String,
      required: [true, 'Teks ayat wajib diisi'],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indeks sesuai SDS:
// Compound index pada (user_id, kitab)
ayatFavoritSchema.index({ user_id: 1, kitab: 1 });

// Mencegah duplikasi ayat favorit yang sama persis oleh pengguna yang sama
ayatFavoritSchema.index({ user_id: 1, kitab: 1, pasal: 1, ayat: 1 }, { unique: true });

module.exports = mongoose.model('AyatFavorit', ayatFavoritSchema);

