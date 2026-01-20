const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Yield = require('../models/Yield');

// Get all yields with optional month/year filter
router.get('/', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { userId: req.userId };
    
    if (month) filter.month = month;
    if (year) filter.year = parseInt(year);

    const yields = await Yield.find(filter).sort({ date: -1 });
    res.json(yields);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get yields summary by month
router.get('/summary', auth, async (req, res) => {
  try {
    const summary = await Yield.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          total: { $sum: '$totalRevenue' },
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

// Create yield
router.post('/', auth, async (req, res) => {
  try {
    const { date, crop, quantity, unit, pricePerUnit } = req.body;
    
    const yieldDate = new Date(date);
    const month = yieldDate.toISOString().substring(0, 7);
    const year = yieldDate.getFullYear();
    const totalRevenue = quantity * pricePerUnit;

    const yieldData = new Yield({
      userId: req.userId,
      date: yieldDate,
      crop,
      quantity,
      unit,
      pricePerUnit,
      totalRevenue,
      month,
      year
    });

    await yieldData.save();
    res.status(201).json(yieldData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update yield
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, crop, quantity, unit, pricePerUnit } = req.body;
    
    const yieldDate = new Date(date);
    const month = yieldDate.toISOString().substring(0, 7);
    const year = yieldDate.getFullYear();
    const totalRevenue = quantity * pricePerUnit;

    const yieldData = await Yield.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { date: yieldDate, crop, quantity, unit, pricePerUnit, totalRevenue, month, year },
      { new: true }
    );

    if (!yieldData) {
      return res.status(404).json({ message: 'Yield not found' });
    }

    res.json(yieldData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete yield
router.delete('/:id', auth, async (req, res) => {
  try {
    const yieldData = await Yield.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!yieldData) {
      return res.status(404).json({ message: 'Yield not found' });
    }

    res.json({ message: 'Yield deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;