const mongoose = require('mongoose');

const ScoreHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
    },
    riskGrade: {
      type: String,
      default: '',
    },
    totalInflow: {
      type: Number,
      default: 0,
    },
    totalOutflow: {
      type: Number,
      default: 0,
    },
    netCashflow: {
      type: Number,
      default: 0,
    },
    transactionCount: {
      type: Number,
      default: 0,
    },
    triggerSource: {
      type: String,
      default: 'upload',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ScoreHistory', ScoreHistorySchema);
