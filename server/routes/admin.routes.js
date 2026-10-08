const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const LoanApplication = require('../models/LoanApplication');
const { calculateVyapaarScore } = require('../utils/scoreCalculator');

// Middleware to enforce Admin role
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Platform Admin access required.' });
};

// 1. GET ALL REGISTERED USERS & SYSTEM STATS
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const totalUsers = users.length;
    const merchantsCount = users.filter((u) => u.role === 'merchant').length;
    const lendersCount = users.filter((u) => u.role === 'lender').length;
    const adminsCount = users.filter((u) => u.role === 'admin').length;

    const totalTransactions = await Transaction.countDocuments();
    
    // Aggregate distinct merchants who have uploaded transactions (scores generated)
    const distinctScoredMerchants = await Transaction.distinct('userId');

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        merchantsCount,
        lendersCount,
        adminsCount,
        totalTransactions,
        scoresGenerated: distinctScoredMerchants.length,
      },
      users,
    });
  } catch (error) {
    console.error('[ADMIN GET USERS ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin users data.' });
  }
});

// 2. CHANGE USER ROLE (Merchant <-> Lender <-> Admin)
router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['merchant', 'lender', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `User ${targetUser.email} role updated to ${role.toUpperCase()}.`,
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
      },
    });
  } catch (error) {
    console.error('[ADMIN CHANGE ROLE ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to change user role.' });
  }
});

// 3. GET DEDICATED MERCHANTS DIRECTORY WITH SCORES & APPLICATIONS
router.get('/merchants', protect, adminOnly, async (req, res) => {
  try {
    const rawMerchants = await User.find({ role: 'merchant' }).select('-password').sort({ createdAt: -1 });

    const merchants = [];
    for (const m of rawMerchants) {
      const txns = await Transaction.find({ userId: m._id }).sort({ date: -1 });
      const scoreData = calculateVyapaarScore(txns);

      // Find loan applications submitted by this merchant
      const apps = await LoanApplication.find({ merchantId: m._id }).populate('lenderId', 'name businessName');

      merchants.push({
        _id: m._id,
        name: m.name,
        email: m.email,
        phone: m.phone || '+91 98765 43210',
        businessName: m.businessName || 'Kirana Store',
        isVerified: m.isVerified,
        createdAt: m.createdAt,
        transactionCount: txns.length,
        scoreData,
        applications: apps.map(a => ({
          id: a._id,
          lenderName: a.lenderId?.name || 'NBFC Lender',
          loanType: a.loanType,
          requestedAmount: a.requestedAmount,
          status: a.status,
          createdAt: a.createdAt,
        })),
      });
    }

    res.status(200).json({
      success: true,
      count: merchants.length,
      merchants,
    });
  } catch (error) {
    console.error('[ADMIN GET MERCHANTS ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch merchants directory.' });
  }
});

// 4. GET DEDICATED LENDERS DIRECTORY WITH REVIEW METRICS
router.get('/lenders', protect, adminOnly, async (req, res) => {
  try {
    const rawLenders = await User.find({ role: 'lender' }).select('-password').sort({ createdAt: -1 });

    const lenders = [];
    for (const l of rawLenders) {
      const apps = await LoanApplication.find({ lenderId: l._id }).populate('merchantId', 'name businessName email');

      const totalReviewed = apps.length;
      const approvedCount = apps.filter(a => a.status === 'approved').length;
      const rejectedCount = apps.filter(a => a.status === 'rejected').length;
      const pendingCount = apps.filter(a => a.status === 'pending').length;

      lenders.push({
        _id: l._id,
        name: l.name,
        email: l.email,
        phone: l.phone || '+91 1800 209 0144',
        businessName: l.businessName || 'NBFC Financial Institution',
        isVerified: l.isVerified,
        createdAt: l.createdAt,
        totalReviewed,
        approvedCount,
        rejectedCount,
        pendingCount,
        applications: apps.map(a => ({
          id: a._id,
          merchantName: a.merchantId?.name || 'Merchant',
          merchantBusiness: a.merchantId?.businessName || 'Kirana Store',
          merchantEmail: a.merchantId?.email,
          loanType: a.loanType || 'Working Capital',
          requestedAmount: a.requestedAmount || 50000,
          status: a.status || 'pending',
          createdAt: a.createdAt || Date.now(),
        })),
      });
    }

    res.status(200).json({
      success: true,
      count: lenders.length,
      lenders,
    });
  } catch (error) {
    console.error('[ADMIN GET LENDERS ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch lenders directory.' });
  }
});

module.exports = router;
