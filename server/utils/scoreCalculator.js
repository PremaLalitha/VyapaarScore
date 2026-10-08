/**
 * Transparent 300 to 900 Credit Score Calculation Engine for VyapaarScore
 * 
 * Algorithm breakdown:
 * - Base Score: 300
 * - Inflow / Sales Volume: Up to 250 points
 * - Net Cashflow Stability: Up to 150 points
 * - Transaction Frequency & Consistency: Up to 100 points
 * - Expense Management Ratio (Inflow vs Outflow): Up to 100 points
 */
const calculateVyapaarScore = (transactions = []) => {
  if (!transactions || transactions.length === 0) {
    return {
      score: 300,
      riskGrade: 'Tier D - Needs Building',
      badgeColor: 'amber',
      creditLimitEstimate: 10000,
      breakdown: {
        totalInflow: 0,
        totalOutflow: 0,
        netCashflow: 0,
        transactionCount: 0,
        avgTransactionValue: 0,
        inflowPoints: 0,
        netCashflowPoints: 0,
        frequencyPoints: 0,
        expenseRatioPoints: 0,
      },
      recommendations: [
        'Upload your daily UPI QR receipts (PhonePe, GPay, Paytm) to start building credit history.',
        'Paste bank SMS alerts to verify monthly sales income.',
      ],
    };
  }

  let totalInflow = 0;
  let totalOutflow = 0;
  let creditCount = 0;
  let debitCount = 0;

  transactions.forEach((tx) => {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'credit') {
      totalInflow += amt;
      creditCount++;
    } else {
      totalOutflow += amt;
      debitCount++;
    }
  });

  const totalCount = transactions.length;
  const netCashflow = totalInflow - totalOutflow;
  const avgTxValue = totalCount > 0 ? (totalInflow + totalOutflow) / totalCount : 0;

  // 1. Inflow Points (Max 250)
  // Scale: ₹0 = 0 pts, ₹50,000+ = 250 pts
  let inflowPoints = Math.min(250, Math.round((totalInflow / 50000) * 250));

  // 2. Net Cashflow Points (Max 150)
  // Scale: Positive net cash flow adds up to 150 pts
  let netCashflowPoints = 0;
  if (netCashflow > 0) {
    netCashflowPoints = Math.min(150, Math.round((netCashflow / 30000) * 150));
  }

  // 3. Transaction Frequency & Volume Points (Max 100)
  // Scale: 1 tx = 10 pts, 10+ txs = 100 pts
  let frequencyPoints = Math.min(100, totalCount * 10);

  // 4. Expense Management Ratio Points (Max 100)
  // Higher ratio of credit vs debit = healthier business margin
  let expenseRatioPoints = 50;
  if (totalInflow > 0) {
    const marginRatio = (totalInflow - totalOutflow) / totalInflow;
    if (marginRatio >= 0.4) {
      expenseRatioPoints = 100;
    } else if (marginRatio >= 0.2) {
      expenseRatioPoints = 80;
    } else if (marginRatio >= 0) {
      expenseRatioPoints = 60;
    } else {
      expenseRatioPoints = 30;
    }
  }

  // Total Score Calculation (300 to 900 cap)
  const rawScore = 300 + inflowPoints + netCashflowPoints + frequencyPoints + expenseRatioPoints;
  const score = Math.min(900, Math.max(300, rawScore));

  // Determine Risk Tier Grade
  let riskGrade = 'Tier D - Building History';
  let badgeColor = 'amber';
  let creditLimitEstimate = 25000;

  if (score >= 750) {
    riskGrade = 'Tier A - Low Risk (Excellent)';
    badgeColor = 'emerald';
    creditLimitEstimate = Math.min(500000, Math.max(100000, Math.round(totalInflow * 1.5)));
  } else if (score >= 680) {
    riskGrade = 'Tier B - Moderate Risk (Good)';
    badgeColor = 'cyan';
    creditLimitEstimate = Math.min(250000, Math.max(50000, Math.round(totalInflow * 1.0)));
  } else if (score >= 600) {
    riskGrade = 'Tier C - Fair Stability';
    badgeColor = 'sky';
    creditLimitEstimate = Math.min(100000, Math.max(25000, Math.round(totalInflow * 0.5)));
  }

  const recommendations = [];
  const scoreDrivers = [];

  // 1. Inflow Driver
  if (inflowPoints >= 180) {
    scoreDrivers.push({
      title: 'Strong Digital Inflow Volume',
      impact: 'positive',
      description: `High recorded sales income of ₹${totalInflow.toLocaleString('en-IN')} (+${inflowPoints} pts).`,
    });
  } else if (inflowPoints >= 80) {
    scoreDrivers.push({
      title: 'Moderate Sales Volume',
      impact: 'neutral',
      description: `Recorded sales of ₹${totalInflow.toLocaleString('en-IN')}. Upload more QR receipts to boost score (+${inflowPoints} pts).`,
    });
  } else {
    scoreDrivers.push({
      title: 'Low Verified Inflow',
      impact: 'negative',
      description: `Total sales volume is under ₹20,000 (+${inflowPoints} pts). Upload UPI screenshots regularly.`,
    });
    recommendations.push('Increase your digital QR sales uploads to demonstrate higher monthly revenue.');
  }

  // 2. Net Cashflow Driver
  if (netCashflowPoints >= 100) {
    scoreDrivers.push({
      title: 'Healthy Net Cash Balance',
      impact: 'positive',
      description: `Surplus cash reserve of ₹${netCashflow.toLocaleString('en-IN')} (+${netCashflowPoints} pts).`,
    });
  } else if (netCashflowPoints > 0) {
    scoreDrivers.push({
      title: 'Positive Cash Operating Margin',
      impact: 'positive',
      description: `Maintained positive net balance of ₹${netCashflow.toLocaleString('en-IN')} (+${netCashflowPoints} pts).`,
    });
  } else {
    scoreDrivers.push({
      title: 'Negative / Tight Net Cashflow',
      impact: 'negative',
      description: `Outflows exceed or equal inflows. Managing business expenses will improve score (+${netCashflowPoints} pts).`,
    });
    recommendations.push('Maintain positive monthly net cash flows by managing business supply expenses.');
  }

  // 3. Frequency & Volume Driver
  if (frequencyPoints >= 80) {
    scoreDrivers.push({
      title: 'High Transaction Consistency',
      impact: 'positive',
      description: `Active business history with ${totalCount} verified receipt documents (+${frequencyPoints} pts).`,
    });
  } else {
    scoreDrivers.push({
      title: 'Limited Transaction History',
      impact: 'neutral',
      description: `Only ${totalCount} parsed record(s). Upload 5+ receipts to build history (+${frequencyPoints} pts).`,
    });
    recommendations.push('Upload at least 5 to 10 payment receipts to establish a strong score trend.');
  }

  // 4. Expense Ratio Driver
  if (expenseRatioPoints >= 80) {
    scoreDrivers.push({
      title: 'Disciplined Expense Management',
      impact: 'positive',
      description: `Healthy profit margin ratio relative to sales expenses (+${expenseRatioPoints} pts).`,
    });
  } else {
    scoreDrivers.push({
      title: 'High Expense Ratio',
      impact: 'negative',
      description: `Outflows form a large percentage of total income (+${expenseRatioPoints} pts).`,
    });
  }

  if (recommendations.length === 0) {
    recommendations.push('Maintain your current daily digital cash flow velocity to unlock higher credit limits.');
  }

  return {
    score,
    riskGrade,
    badgeColor,
    creditLimitEstimate,
    scoreDrivers,
    breakdown: {
      totalInflow,
      totalOutflow,
      netCashflow,
      transactionCount: totalCount,
      avgTransactionValue: Math.round(avgTxValue),
      inflowPoints,
      netCashflowPoints,
      frequencyPoints,
      expenseRatioPoints,
    },
    recommendations,
  };
};

module.exports = {
  calculateVyapaarScore,
};

