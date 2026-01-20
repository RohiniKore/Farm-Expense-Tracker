const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const Yield = require('../models/Yield');
const User = require('../models/User');

router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    // Get user data
    const user = await User.findById(req.userId);
    const expenses = await Expense.find({ userId: req.userId });
    const yields = await Yield.find({ userId: req.userId });

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = yields.reduce((sum, y) => sum + y.totalRevenue, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Build context for Gemini API
    const context = `You are analyzing farm data for ${user.fullName} from ${user.location}.

FARM FINANCIAL SUMMARY:
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- Total Revenue: ₹${totalRevenue.toFixed(2)}
- Net Profit: ₹${netProfit.toFixed(2)}
- Number of Yield Records: ${yields.length}
- Number of Expense Records: ${expenses.length}

Based on this farm data, answer the following question:
${message}`;

    // Here you would integrate with Gemini API
    // For now, returning a placeholder response
    const reply = `Based on your farm data showing total expenses of ₹${totalExpenses.toFixed(2)} and revenue of ₹${totalRevenue.toFixed(2)}, I can help you analyze your farming operations. What specific aspect would you like to discuss?`;

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;