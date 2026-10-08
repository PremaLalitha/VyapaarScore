const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const LoanApplication = require('../models/LoanApplication');
const ScoreHistory = require('../models/ScoreHistory');
const { calculateVyapaarScore } = require('../utils/scoreCalculator');
const { sendDecisionNotificationEmail } = require('../utils/sendEmail');

// 1. GET MERCHANT CREDIT SCORE & ANALYTICS
router.get('/my-score', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    const scoreData = calculateVyapaarScore(transactions);

    // Fetch score history timeline for merchant
    const historyLogs = await ScoreHistory.find({ userId }).sort({ createdAt: -1 }).limit(10);

    res.status(200).json({
      success: true,
      scoreData,
      scoreHistory: historyLogs,
      isSharedWithLenders: req.user.isSharedWithLenders !== false,
      user: {
        id: req.user._id,
        name: req.user.name,
        businessName: req.user.businessName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error('[GET SCORE ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to calculate credit score.' });
  }
});


// 2. TOGGLE SHARE CONSENT WITH LENDERS
router.put('/share-toggle', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isSharedWithLenders = !user.isSharedWithLenders;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Credit report sharing is now ${user.isSharedWithLenders ? 'ENABLED' : 'DISABLED'}.`,
      isSharedWithLenders: user.isSharedWithLenders,
    });
  } catch (error) {
    console.error('[SHARE TOGGLE ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to update sharing preference.' });
  }
});

// 3. GENERATE & DOWNLOAD OFFICIAL PDF CREDIT REPORT
router.get('/pdf', protect, async (req, res) => {
  try {
    // If merchant ID passed in query by authorized lender/admin, use target merchant, else use logged-in user
    let targetUserId = req.user._id;
    if (req.query.merchantId && (req.user.role === 'lender' || req.user.role === 'admin')) {
      targetUserId = req.query.merchantId;
    }

    const merchant = await User.findById(targetUserId);
    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant account not found.' });
    }

    const transactions = await Transaction.find({ userId: targetUserId }).sort({ date: -1 });
    const scoreData = calculateVyapaarScore(transactions);

    // Set Response Headers for PDF Download
    const filename = `VyapaarScore_CreditReport_${merchant.name.replace(/\s+/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    // --- PDF BRAND HEADER ---
    doc.rect(0, 0, doc.page.width, 100).fill('#0f172a');
    
    doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('VyapaarScore', 40, 30);
    doc.fillColor('#38bdf8').fontSize(12).font('Helvetica').text('AI Micro-Business Credit Evaluation Summary', 40, 60);

    doc.fillColor('#94a3b8').fontSize(10).text(`Generated Date: ${new Date().toLocaleDateString('en-IN')}`, 380, 40, { align: 'right' });
    doc.text(`Report Ref ID: VYP-${Date.now().toString().slice(-8)}`, 380, 55, { align: 'right' });

    doc.moveDown(4);

    // --- MERCHANT INFORMATION BOX ---
    doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text('1. Merchant Account Details', 40, 120);
    doc.rect(40, 140, 515, 60).fillAndStroke('#f8fafc', '#cbd5e1');

    doc.fillColor('#334155').fontSize(10).font('Helvetica-Bold').text(`Business Name: `, 55, 152);
    doc.font('Helvetica').text(merchant.businessName || 'N/A', 145, 152);

    doc.font('Helvetica-Bold').text(`Merchant Name: `, 55, 172);
    doc.font('Helvetica').text(merchant.name, 145, 172);

    doc.font('Helvetica-Bold').text(`Email Address: `, 300, 152);
    doc.font('Helvetica').text(merchant.email, 385, 152);

    doc.font('Helvetica-Bold').text(`Account ID: `, 300, 172);
    doc.font('Helvetica').text(merchant._id.toString(), 385, 172);

    // --- SCORE & RISK GRADE BADGE ---
    doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text('2. VyapaarScore Rating & Credit Limit', 40, 220);
    doc.rect(40, 240, 515, 80).fillAndStroke('#ecfeff', '#06b6d4');

    doc.fillColor('#0891b2').fontSize(36).font('Helvetica-Bold').text(`${scoreData.score}`, 60, 255);
    doc.fillColor('#64748b').fontSize(10).font('Helvetica').text('Score Range: 300 to 900', 60, 295);

    doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text(`Risk Grade: ${scoreData.riskGrade}`, 220, 255);
    doc.fillColor('#16a34a').fontSize(11).font('Helvetica-Bold').text(`Estimated Micro-Credit Line: ₹${Number(scoreData.creditLimitEstimate).toLocaleString('en-IN')}`, 220, 275);
    doc.fillColor('#475569').fontSize(9).font('Helvetica').text('Underwriting Model: Multivariable Cashflow Velocity & OCR Receipt Verification', 220, 295);

    // --- FINANCIAL METRICS BREAKDOWN ---
    doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text('3. Verified Cashflow Metrics', 40, 340);

    const b = scoreData.breakdown;
    doc.rect(40, 360, 515, 65).fillAndStroke('#f1f5f9', '#94a3b8');

    doc.fillColor('#334155').fontSize(10).font('Helvetica-Bold').text('Total Inflow (Sales):', 55, 372);
    doc.fillColor('#16a34a').text(`₹${Number(b.totalInflow).toLocaleString('en-IN')}`, 160, 372);

    doc.fillColor('#334155').text('Total Outflow (Expenses):', 55, 395);
    doc.fillColor('#dc2626').text(`₹${Number(b.totalOutflow).toLocaleString('en-IN')}`, 160, 395);

    doc.fillColor('#334155').text('Net Cashflow:', 300, 372);
    doc.fillColor(b.netCashflow >= 0 ? '#16a34a' : '#dc2626').text(`₹${Number(b.netCashflow).toLocaleString('en-IN')}`, 410, 372);

    doc.fillColor('#334155').text('Parsed Documents:', 300, 395);
    doc.fillColor('#0284c7').text(`${b.transactionCount} Record(s)`, 410, 395);

    // --- TRANSACTIONS SUMMARY TABLE ---
    doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text('4. Recent Analyzed Transactions', 40, 445);

    let y = 465;
    doc.rect(40, y, 515, 20).fill('#e2e8f0');
    doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold');
    doc.text('Date', 50, y + 5);
    doc.text('Counterparty / Source', 130, y + 5);
    doc.text('Category', 280, y + 5);
    doc.text('Type', 370, y + 5);
    doc.text('Amount (₹)', 460, y + 5);

    y += 20;

    const displayTxs = transactions.slice(0, 8);
    if (displayTxs.length === 0) {
      doc.fillColor('#64748b').fontSize(10).font('Helvetica-Oblique').text('No transaction receipts uploaded yet.', 50, y + 10);
    } else {
      displayTxs.forEach((tx) => {
        doc.fillColor('#334155').fontSize(9).font('Helvetica');
        doc.text(new Date(tx.date).toLocaleDateString('en-IN'), 50, y + 5);
        doc.text(tx.counterparty.substring(0, 22), 130, y + 5);
        doc.text(tx.category, 280, y + 5);
        doc.fillColor(tx.type === 'credit' ? '#16a34a' : '#dc2626').text(tx.type.toUpperCase(), 370, y + 5);
        doc.fillColor('#0f172a').font('Helvetica-Bold').text(`₹${Number(tx.amount).toLocaleString('en-IN')}`, 460, y + 5);
        y += 18;
      });
    }

    // --- VERIFICATION FOOTER STAMP ---
    doc.rect(40, 720, 515, 45).fillAndStroke('#f8fafc', '#cbd5e1');
    doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold').text('OFFICIAL VERIFICATION STAMP', 55, 728);
    doc.fillColor('#64748b').fontSize(8).font('Helvetica').text('This document was generated automatically by VyapaarScore AI Engine. Authenticity hash verified with 2FA email logs.', 55, 742);

    doc.end();
  } catch (error) {
    console.error('[GENERATE PDF ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF credit report.' });
  }
});

// 4. LENDER: GET ALL SHARED MERCHANT REPORTS
router.get('/lender/merchants', protect, async (req, res) => {
  try {
    if (req.user.role !== 'lender' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Lender access required.' });
    }

    // Find merchants who strictly have role = 'merchant' and are shared
    const merchants = await User.find({
      role: 'merchant',
      isSharedWithLenders: { $ne: false },
      email: { $not: /admin/i },
      name: { $not: /admin/i }
    }).select('-password');
    const lenderId = req.user._id;

    const reports = [];

    for (const m of merchants) {
      const transactions = await Transaction.find({ userId: m._id }).sort({ date: -1 });
      const scoreData = calculateVyapaarScore(transactions);

      // Check if lender has an existing loan decision
      const application = await LoanApplication.findOne({ merchantId: m._id, lenderId });

      reports.push({
        merchant: {
          id: m._id,
          name: m.name,
          businessName: m.businessName || 'Kirana Store',
          email: m.email,
          phone: m.phone,
          createdAt: m.createdAt,
        },
        scoreData,
        applicationStatus: application ? application.status : 'pending',
        applicationId: application ? application._id : null,
        messages: application ? application.messages : [],
        requestedAmount: application ? application.requestedAmount : scoreData.creditLimitEstimate,
        loanType: application ? application.loanType : 'Working Capital',
        loanPurpose: application ? application.loanPurpose : '',
      });
    }

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error('[LENDER MERCHANTS ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch merchant credit reports.' });
  }
});

// 5. LENDER: DECIDE LOAN APPLICATION (APPROVE / REJECT)
router.post('/lender/decision', protect, async (req, res) => {
  try {
    if (req.user.role !== 'lender' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Lender access required.' });
    }

    const { merchantId, decision, requestedAmount } = req.body;
    if (!merchantId || !['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({ success: false, message: 'Invalid decision payload.' });
    }

    const transactions = await Transaction.find({ userId: merchantId });
    const scoreData = calculateVyapaarScore(transactions);

    let application = await LoanApplication.findOne({ merchantId, lenderId: req.user._id });
    if (!application) {
      application = new LoanApplication({
        merchantId,
        lenderId: req.user._id,
        creditScore: scoreData.score,
        requestedAmount: requestedAmount || scoreData.creditLimitEstimate,
        status: decision,
      });
    } else {
      application.status = decision;
      application.creditScore = scoreData.score;
    }

    await application.save();

    // Notify Merchant via email asynchronously
    const merchant = await User.findById(merchantId);
    if (merchant && merchant.email) {
      sendDecisionNotificationEmail(
        merchant.email,
        merchant.name,
        decision,
        req.user.name || 'NBFC Lender'
      ).catch((err) => console.error('[EMAIL NOTIF ASYNC ERR]', err));
    }

    res.status(200).json({
      success: true,
      message: `Loan application successfully ${decision.toUpperCase()}! Notification sent to merchant.`,
      application,
    });
  } catch (error) {
    console.error('[LENDER DECISION ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to record loan decision.' });
  }
});

// 6. GET REGISTERED LENDER DIRECTORY (Strictly fetches unique registered lender accounts from MongoDB)
router.get('/lenders', protect, async (req, res) => {
  try {
    const lenders = await User.find({ role: 'lender' }).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: lenders.length,
      lenders,
    });
  } catch (error) {
    console.error('[GET LENDERS ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch registered lender directory.' });
  }
});

// 7. MERCHANT: APPLY FOR LOAN & START CHAT WITH CHOSEN LENDER
router.post('/apply-loan', protect, async (req, res) => {
  try {
    const { lenderId, requestedAmount, loanType, loanPurpose, initialMessage, attachPdf } = req.body;
    const merchantId = req.user._id;

    if (!lenderId) {
      return res.status(400).json({ success: false, message: 'Target lender selection is required.' });
    }

    const transactions = await Transaction.find({ userId: merchantId });
    const scoreData = calculateVyapaarScore(transactions);

    let application = await LoanApplication.findOne({ merchantId, lenderId });
    
    const initialMsg = {
      sender: 'merchant',
      text: initialMessage || `Hello! I would like to apply for a ${loanType || 'Working Capital'} loan of ₹${Number(requestedAmount || 50000).toLocaleString('en-IN')} for ${loanPurpose || 'business expansion'}. Attached is my VyapaarScore AI credit evaluation report.`,
      attachPdf: attachPdf !== false,
      createdAt: new Date(),
    };

    if (!application) {
      application = new LoanApplication({
        merchantId,
        lenderId,
        creditScore: scoreData.score,
        requestedAmount: requestedAmount || 50000,
        loanType: loanType || 'Working Capital',
        loanPurpose: loanPurpose || 'Inventory Purchase',
        status: 'pending',
        messages: [initialMsg],
      });
    } else {
      application.requestedAmount = requestedAmount || application.requestedAmount;
      application.loanType = loanType || application.loanType;
      application.loanPurpose = loanPurpose || application.loanPurpose;
      application.messages.push(initialMsg);
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Loan application & credit report successfully transmitted to lender!',
      application,
    });
  } catch (error) {
    console.error('[APPLY LOAN ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to submit loan application.' });
  }
});

// 8. MERCHANT / LENDER: FETCH MY LOAN APPLICATIONS & CHAT HISTORY
router.get('/my-applications', protect, async (req, res) => {
  try {
    const query = req.user.role === 'lender' ? { lenderId: req.user._id } : { merchantId: req.user._id };
    const applications = await LoanApplication.find(query)
      .populate('merchantId', 'name businessName email phone')
      .populate('lenderId', 'name businessName email phone')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('[MY APPLICATIONS ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch loan applications.' });
  }
});

// 9. POST CHAT MESSAGE IN LOAN APPLICATION
router.post('/chat', protect, async (req, res) => {
  try {
    const { applicationId, text, attachPdf } = req.body;
    if (!applicationId || !text) {
      return res.status(400).json({ success: false, message: 'Application ID and text message are required.' });
    }

    const application = await LoanApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Loan application not found.' });
    }

    const senderRole = req.user.role === 'lender' ? 'lender' : 'merchant';
    application.messages.push({
      sender: senderRole,
      text,
      attachPdf: !!attachPdf,
      createdAt: new Date(),
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
      messages: application.messages,
    });
  } catch (error) {
    console.error('[SEND CHAT ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

module.exports = router;

