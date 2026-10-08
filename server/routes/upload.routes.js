const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const { runOCRAndParse, parseTransactionText, parsePDFDocument } = require('../utils/ocrParser');
const Transaction = require('../models/Transaction');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|bmp|pdf/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isPdfMime = file.mimetype === 'application/pdf';
  const isImageMime = /jpeg|jpg|png|webp|bmp/.test(file.mimetype);

  if (extName && (isPdfMime || isImageMime)) {
    return cb(null, true);
  }
  cb(new Error('Only images (JPG, PNG, WEBP, BMP) or PDF documents are accepted for scanning.'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

// 1. UPLOAD IMAGE SCREENSHOT, PDF DOCUMENT, OR SMS TEXT FOR PARSING
router.post('/', protect, upload.single('document'), async (req, res) => {
  try {
    const { smsText } = req.body;

    // Case A: SMS text provided
    if (smsText && smsText.trim().length > 0) {
      const parsedData = parseTransactionText(smsText);
      return res.status(200).json({
        success: true,
        source: 'sms_text',
        data: parsedData,
      });
    }

    // Case B: File provided (Image or PDF)
    if (req.file) {
      const filePath = req.file.path;
      const isPdf = path.extname(req.file.originalname).toLowerCase() === '.pdf' || req.file.mimetype === 'application/pdf';

      let parsedData;
      if (isPdf) {
        parsedData = await parsePDFDocument(filePath);
      } else {
        parsedData = await runOCRAndParse(filePath);
      }
      
      // Clean up uploaded temp file asynchronously
      fs.unlink(filePath, () => {});

      return res.status(200).json({
        success: true,
        source: isPdf ? 'pdf_document' : 'ocr_image',
        fileName: req.file.originalname,
        data: parsedData,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Please provide a UPI screenshot, PDF bank statement, or bank SMS text.',
    });
  } catch (error) {
    console.error('[UPLOAD OCR ERROR]', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process document and extract text.',
    });
  }
});

const ScoreHistory = require('../models/ScoreHistory');
const { calculateVyapaarScore } = require('../utils/scoreCalculator');

// 2. CONFIRM & SAVE Extracted Transactions to Ledger
router.post('/confirm', protect, async (req, res) => {
  try {
    const { transactions } = req.body; // Can be object or array of objects

    if (!transactions) {
      return res.status(400).json({ success: false, message: 'No transaction data provided for confirmation.' });
    }

    const itemsToSave = Array.isArray(transactions) ? transactions : [transactions];
    const createdItems = [];

    for (const item of itemsToSave) {
      const newTx = await Transaction.create({
        userId: req.user._id,
        date: item.date ? new Date(item.date) : new Date(),
        counterparty: item.counterparty || 'Unknown Counterparty',
        amount: parseFloat(item.amount) || 0,
        type: item.type === 'debit' ? 'debit' : 'credit',
        category: item.category || 'Sales',
        source: item.source || 'ocr_image',
        rawText: item.rawText || '',
        fileName: item.fileName || '',
      });
      createdItems.push(newTx);
    }

    // Record ScoreHistory Snapshot
    const allUserTxs = await Transaction.find({ userId: req.user._id });
    const newScoreData = calculateVyapaarScore(allUserTxs);

    await ScoreHistory.create({
      userId: req.user._id,
      score: newScoreData.score,
      riskGrade: newScoreData.riskGrade,
      totalInflow: newScoreData.breakdown.totalInflow,
      totalOutflow: newScoreData.breakdown.totalOutflow,
      netCashflow: newScoreData.breakdown.netCashflow,
      transactionCount: newScoreData.breakdown.transactionCount,
      triggerSource: 'ocr_upload',
    });

    res.status(201).json({
      success: true,
      message: `Successfully saved ${createdItems.length} transaction(s) to ledger.`,
      transactions: createdItems,
      newScoreData,
    });
  } catch (error) {
    console.error('[CONFIRM TRANSACTIONS ERROR]', error);
    res.status(500).json({ success: false, message: error.message || 'Error saving transactions.' });
  }
});

module.exports = router;

