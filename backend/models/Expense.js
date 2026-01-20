const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  crop: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Seeds', 'Fertilizers', 'Pesticides', 'Fuel', 'Labor', 'Equipment', 'Water', 'Other']
  },
  description: { type: String },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // Format: "YYYY-MM"
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

expenseSchema.index({ userId: 1, month: 1, year: 1 });

module.exports = mongoose.model('Expense', expenseSchema);