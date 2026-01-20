const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// Get all expenses with optional month/year filter
router.get('/', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { userId: req.userId };
    
    if (month) filter.month = month;
    if (year) filter.year = parseInt(year);

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get expenses summary by month
router.get('/summary', auth, async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create expense
router.post('/', auth, async (req, res) => {
  try {
    const { date, crop, category, description, amount } = req.body;
    
    const expenseDate = new Date(date);
    const month = expenseDate.toISOString().substring(0, 7); // YYYY-MM
    const year = expenseDate.getFullYear();

    const expense = new Expense({
      userId: req.userId,
      date: expenseDate,
      crop,
      category,
      description,
      amount,
      month,
      year
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, crop, category, description, amount } = req.body;
    
    const expenseDate = new Date(date);
    const month = expenseDate.toISOString().substring(0, 7);
    const year = expenseDate.getFullYear();

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { date: expenseDate, crop, category, description, amount, month, year },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;