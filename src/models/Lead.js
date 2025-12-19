const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, default: null },
    probability: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Verified', 'To Check'],
      default: 'To Check'
    },
    syncedToCRM: {
      type: Boolean,
      default: false,
      index: true
    },
    syncedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;


