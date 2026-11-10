const mongoose = require('mongoose');

const ayatSchema = new mongoose.Schema(
  {
    pasal: { type: Number, required: true },
    ayat: { type: Number, required: true },
    teks: { type: String, required: true },
  },
  { _id: false }
);

const alkitabSchema = new mongoose.Schema(
  {
    testament: {
      type: String,
      enum: ['Perjanjian Lama', 'Perjanjian Baru'],
      required: true,
      index: true,
    },
    kitab: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    singkatan: {
      type: String,
      required: true,
      trim: true,
    },
    total_pasal: {
      type: Number,
      required: true,
    },
    urutan: {
      type: Number,
      required: true,
    },
    ayat_list: [ayatSchema],
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

alkitabSchema.index({ testament: 1, urutan: 1 });

module.exports = mongoose.model('Alkitab', alkitabSchema);

