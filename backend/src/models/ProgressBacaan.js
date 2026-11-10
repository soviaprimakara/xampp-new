const mongoose = require('mongoose');

const pasalSelesaiItemSchema = new mongoose.Schema(
  {
    kitab: {
      type: String,
      required: true,
      trim: true,
    },
    pasal: {
      type: Number,
      required: true,
      min: 1,
    },
    selesai_pada: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const progressBacaanSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Kardinalitas 1:1, user_id unik
      index: true,
    },
    kitab_terakhir: {
      type: String,
      default: 'Kejadian',
      trim: true,
    },
    pasal_terakhir: {
      type: Number,
      default: 1,
      min: 1,
    },
    pasal_selesai: {
      type: [pasalSelesaiItemSchema],
      default: [],
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

module.exports = mongoose.model('ProgressBacaan', progressBacaanSchema);

