import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { 
  TrendingUp, 
  Receipt, 
  UploadCloud, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Award, 
  Sparkles,
  Clock,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [scoreData, setScoreData] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [isShared, setIsShared] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareLoading, setShareLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchScoreAndStats = async () => {
    try {
      setLoading(true);
      const [scoreRes, statsRes] = await Promise.all([
        axios.get('/api/reports/my-score'),
        axios.get('/api/transactions/stats')
      ]);

      if (scoreRes.data.success) {
        setScoreData(scoreRes.data.scoreData);
        setScoreHistory(scoreRes.data.scoreHistory || []);
        setIsShared(scoreRes.data.isSharedWithLenders);
      }

      if (statsRes.data.success) {
        setRecentActivity(statsRes.data.recentActivity || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard score:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScoreAndStats();
  }, []);

  const handleToggleShare = async () => {
    try {
      setShareLoading(true);
      const res = await axios.put('/api/reports/share-toggle');
      if (res.data.success) {
        setIsShared(res.data.isSharedWithLenders);
        setToastMessage(res.data.message);
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error toggling share state:', err);
    } finally {
      setShareLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const token = localStorage.getItem('token');
    window.open(`/api/reports/pdf?token=${token}`, '_blank');
  };

  const score = scoreData?.score || 300;
  const breakdown = scoreData?.breakdown || {};

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-100 via-slate-100 to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Merchant Credit & Cashflow Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome back, {user?.name || 'Partner'}!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 font-medium">
              {user?.businessName ? (
                <span>Business: <strong className="text-slate-900 dark:text-slate-200 font-bold">{user.businessName}</strong></span>
              ) : (
                'Micro & Small Business Cashflow Dashboard'
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Download PDF Report</span>
            </button>

            <Link
              to="/upload"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Receipts</span>
            </Link>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 text-cyan-900 dark:text-cyan-200 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* MAIN VYAPAARSCORE DIAL & SUMMARY SECTION */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950 text-slate-900 dark:text-white border border-slate-200 dark:border-cyan-500/30 shadow-lg dark:shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left: Score Gauge / Meter */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative w-36 h-36 rounded-full bg-slate-50 dark:bg-slate-950 border-4 border-cyan-500 flex flex-col items-center justify-center shadow-md dark:shadow-lg dark:shadow-cyan-500/20 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">VyapaarScore</span>
              <span className="text-4xl font-black text-cyan-600 dark:text-cyan-400 my-0.5">{loading ? '...' : score}</span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">300 to 900 Range</span>
            </div>

            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 text-xs font-extrabold">
                <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>{scoreData?.riskGrade || 'Tier D - Building History'}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Estimated Micro-Credit Line: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">₹{Number(scoreData?.creditLimitEstimate || 25000).toLocaleString('en-IN')}</span>
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Calculated dynamically from real-time OCR receipts, UPI payment volume, customer retention, and expense stability.
              </p>
            </div>
          </div>

          {/* Right: Actions & Share Toggle */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={handleToggleShare}
              disabled={shareLoading}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all border ${
                isShared
                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40 hover:bg-emerald-200 dark:hover:bg-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isShared ? 'Shared with Lenders (Consented)' : 'Sharing Disabled'}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-sky-600 hover:from-cyan-500 hover:to-sky-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Report</span>
            </button>
          </div>

        </div>

        {/* 4 Summary Metrics Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>Cash-flow Performance Overview</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">All Time Ledger Summary</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total Sales Inflow */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Inflow</span>
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ₹{loading ? '0' : Number(breakdown.totalInflow || 0).toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-500 mt-2 font-medium">Verified UPI sales income</div>
            </div>

            {/* Card 2: Total Outflow */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Outflow</span>
                <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                ₹{loading ? '0' : Number(breakdown.totalOutflow || 0).toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-500 mt-2 font-medium">Supplier & operating expenses</div>
            </div>

            {/* Card 3: Net Cashflow */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Cashflow</span>
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                  <Receipt className="w-5 h-5" />
                </div>
              </div>
              <div className={`text-3xl font-extrabold ${(breakdown.netCashflow || 0) >= 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-rose-600'}`}>
                ₹{loading ? '0' : Number(breakdown.netCashflow || 0).toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-500 mt-2 font-medium">Net operating surplus</div>
            </div>

            {/* Card 4: Documents Uploaded */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Uploaded Receipts</span>
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20">
                  <UploadCloud className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {loading ? '...' : breakdown.transactionCount || 0}
              </div>
              <div className="text-xs text-slate-500 mt-2 font-medium">OCR Screenshots & SMS</div>
            </div>
          </div>
        </div>

        {/* VISUALIZATION CHARTS & CASHFLOW METRICS GRAPH */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-500" />
                <span>Cash-Flow & Credit Analytics Visualizer</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Graphical analysis of sales inflow vs supplier outflow and credit limit trajectory</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Real-Time OCR Verified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Visual 1: Inflow vs Outflow Visual Bar Chart */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Monthly Cashflow Comparison</span>
                <span className="text-cyan-500">Inflow vs Outflow</span>
              </div>

              {/* Bar Chart Graphics */}
              <div className="space-y-3 pt-2">
                {/* Sales Inflow Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Sales Inflow (+ Credit)
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{Number(breakdown.totalInflow || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 shadow-sm"
                      style={{ 
                        width: `${Math.min(100, Math.max(10, ((breakdown.totalInflow || 0) / (Math.max(1, (breakdown.totalInflow || 0) + (breakdown.totalOutflow || 0)))) * 100))}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Expenses Outflow Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Supplier Outflow (- Debit)
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ₹{Number(breakdown.totalOutflow || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-700 shadow-sm"
                      style={{ 
                        width: `${Math.min(100, Math.max(10, ((breakdown.totalOutflow || 0) / (Math.max(1, (breakdown.totalInflow || 0) + (breakdown.totalOutflow || 0)))) * 100))}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Net Cashflow Surplus Bar */}
                <div className="space-y-1 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5" />
                      Net Cash Margin Surplus
                    </span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">
                      ₹{Number(breakdown.netCashflow || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full transition-all duration-700 shadow-sm"
                      style={{ 
                        width: `${Math.min(100, Math.max(15, ((breakdown.netCashflow || 0) > 0 ? 75 : 20)))}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visual 2: VyapaarScore Tier Distribution Speedometer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>VyapaarScore Index Spectrum (300 - 900)</span>
                <span className="text-amber-500 font-extrabold">{score} / 900</span>
              </div>

              {/* Progress Spectrum Bar */}
              <div className="space-y-2 pt-2">
                <div className="relative w-full h-5 bg-gradient-to-r from-rose-500 via-amber-500 via-cyan-500 to-emerald-500 rounded-full p-0.5 shadow-inner">
                  {/* Indicator Arrow Marker */}
                  <div 
                    className="absolute -top-1.5 w-8 h-8 -ml-4 bg-white dark:bg-slate-950 border-2 border-slate-900 rounded-full shadow-lg flex items-center justify-center text-[10px] font-black text-slate-900 dark:text-white transition-all duration-700"
                    style={{ 
                      left: `${Math.min(95, Math.max(5, ((score - 300) / 600) * 100))}%` 
                    }}
                  >
                    {score}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold pt-2">
                  <span className="text-rose-500">Tier D (&lt;600)</span>
                  <span className="text-amber-500">Tier C (600-679)</span>
                  <span className="text-cyan-500">Tier B (680-749)</span>
                  <span className="text-emerald-500">Tier A (750+)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between mt-3">
                  <div>
                    <span className="text-slate-400 font-medium block">Calculated Borrowing Capacity</span>
                    <span className="font-extrabold text-emerald-500 text-sm mt-0.5 block">
                      ₹{Number(scoreData?.creditLimitEstimate || 25000).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 font-medium block">Risk Classification</span>
                    <span className="font-extrabold text-amber-500 text-xs mt-0.5 block">
                      {scoreData?.riskGrade || 'Tier D Risk'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Score Drivers (Top Reasons for Score) */}
        {scoreData?.scoreDrivers && scoreData.scoreDrivers.length > 0 && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>Key Credit Score Impact Factors</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scoreData.scoreDrivers.map((driver, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3"
                >
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase mt-0.5 shrink-0 ${
                    driver.impact === 'positive'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                      : driver.impact === 'negative'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                  }`}>
                    {driver.impact}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{driver.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{driver.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations List */}
        {scoreData?.recommendations && scoreData.recommendations.length > 0 && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Score Improvement Action Plan</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {scoreData.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Score History Timeline */}
        {scoreHistory && scoreHistory.length > 0 && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" />
              <span>Score History & Calculation Snapshot Logs</span>
            </h3>
            <div className="space-y-2.5">
              {scoreHistory.map((log) => (
                <div
                  key={log._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-extrabold flex items-center justify-center text-sm">
                      {log.score}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{log.riskGrade || 'Calculated Rating'}</div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(log.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{Number(log.totalInflow || 0).toLocaleString('en-IN')} Sales
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      {log.transactionCount} Document(s) Parsed
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* Recent Activity List */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span>Recent Parsed Receipts</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Uploaded UPI screenshots and bank SMS alerts</p>
            </div>

            <Link to="/transactions" className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline">
              View All Transactions &rarr;
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Receipt className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-semibold text-slate-800 dark:text-slate-300">No payment history yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Your analyzed UPI screenshots and bank SMS notifications will appear here.
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload First Payment</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'}`}>
                      {tx.type === 'credit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{tx.counterparty}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                        <span className="capitalize">{tx.category}</span>
                        <span>•</span>
                        <span>{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-base font-bold ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                      {tx.source === 'ocr_image' ? 'UPI Screenshot' : 'SMS Alert'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
