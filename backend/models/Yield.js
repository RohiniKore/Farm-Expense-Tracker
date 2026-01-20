const mongoose = require('mongoose');

const yieldSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  crop: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { 
    type: String, 
    required: true,
    enum: ['kg', 'tons', 'bags', 'liters', 'units']
  },
  pricePerUnit: { type: Number, required: true },
  totalRevenue: { type: Number, required: true },
  month: { type: String, required: true }, // Format: "YYYY-MM"
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

yieldSchema.index({ userId: 1, month: 1, year: 1 });

module.exports = mongoose.model('Yield', yieldSchema);