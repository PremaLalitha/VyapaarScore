const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// 1. GET ALL TRANSACTIONS (WITH SEARCH, FILTER, PAGINATION)
router.get('/', protect, async (req, res) => {
  try {
    const { search, category, type, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { userId: req.user._id };

    // Search filter (counterparty, raw text, or category)
    if (search) {
      query.$or = [
        { counterparty: { $regex: search, $options: 'i' } },
        { rawText: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Type filter
    if (type && type !== 'All') {
      query.type = type.toLowerCase();
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      transactions,
    });
  } catch (error) {
    console.error('[GET TRANSACTIONS ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching transactions.' });
  }
});

// 2. GET DASHBOARD SUMMARY METRICS
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId });

    let totalInflow = 0;
    let totalOutflow = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'credit') {
        totalInflow += tx.amount;
      } else {
        totalOutflow += tx.amount;
      }
    });

    const netCashflow = totalInflow - totalOutflow;
    const documentCount = transactions.length;

    // Calculate stability score status based on activity
    let stabilityStatus = 'Initializing';
    let scoreEstimate = 650;

    if (documentCount > 0) {
      if (netCashflow > 10000 && documentCount >= 5) {
        stabilityStatus = 'High Stability';
        scoreEstimate = 780;
      } else if (netCashflow >= 0) {
        stabilityStatus = 'Moderate Stability';
        scoreEstimate = 710;
      } else {
        stabilityStatus = 'Building History';
        scoreEstimate = 640;
      }
    }

    // Recent activity (latest 5 transactions)
    const recentTransactions = await Transaction.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalInflow,
        totalOutflow,
        netCashflow,
        monthlyAvgInflow: documentCount > 0 ? (totalInflow / Math.max(1, Math.ceil(documentCount / 10))).toFixed(2) : 0,
        totalTransactions: documentCount,
        documentsAnalyzed: documentCount,
        stabilityStatus,
        scoreEstimate,
        hasData: documentCount > 0,
      },
      recentActivity: recentTransactions,
    });
  } catch (error) {
    console.error('[GET DASHBOARD STATS ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Error compiling dashboard statistics.' });
  }
});

// 3. DELETE A TRANSACTION
router.delete('/:id', protect, async (req, res) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
    if (!tx) {
      return res.status(404).json({ success: false, message: 'Transaction record not found.' });
    }

    await tx.deleteOne();
    res.status(200).json({ success: true, message: 'Transaction removed.' });
  } catch (error) {
    console.error('[DELETE TRANSACTION ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Error deleting transaction.' });
  }
});

module.exports = router;
