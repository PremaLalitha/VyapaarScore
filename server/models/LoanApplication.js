const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema(
  {
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    creditScore: {
      type: Number,
      required: true,
    },
    requestedAmount: {
      type: Number,
      default: 50000,
    },
    loanType: {
      type: String,
      default: 'Working Capital',
    },
    loanPurpose: {
      type: String,
      default: '',
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ['merchant', 'lender'],
          required: true,
        },
        text: {
          type: String,
          default: '',
        },
        attachPdf: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    lenderNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);
