const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    counterparty: {
      type: String,
      required: true,
      trim: true,
      default: 'Unknown Counterparty',
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
      default: 'credit',
    },
    category: {
      type: String,
      enum: ['Sales', 'Supplies', 'Utilities', 'Personal', 'Other'],
      default: 'Sales',
    },
    source: {
      type: String,
      enum: ['ocr_image', 'sms_text', 'manual'],
      default: 'ocr_image',
    },
    rawText: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
