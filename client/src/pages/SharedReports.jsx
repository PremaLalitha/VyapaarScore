import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { 
  FileCheck, 
  Search, 
  Download, 
  Eye, 
  X, 
  TrendingUp, 
  ShieldCheck, 
  Building2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

const SharedReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/reports/lender/merchants');
      if (res.data.success) {
        setReports(res.data.reports || []);
      }
    } catch (err) {
      console.error('Error fetching shared merchant reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownloadPDF = (merchantId, merchantName) => {
    const token = localStorage.getItem('token');
    window.open(`/api/reports/pdf?token=${token}&merchantId=${merchantId}`, '_blank');
  };

  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      item.merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.merchant.email.toLowerCase().includes(searchTerm.toLowerCase());

    const score = item.scoreData?.score || 300;
    let matchesScore = true;
    if (scoreFilter === '750+') matchesScore = score >= 750;
    else if (scoreFilter === '680-749') matchesScore = score >= 680 && score < 750;
    else if (scoreFilter === '<680') matchesScore = score < 680;

    return matchesSearch && matchesScore;
  });

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-cyan-950 p-6 sm:p-8 rounded-2xl border border-teal-500/30 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
              <FileCheck className="w-4 h-4 text-teal-400" />
              <span>Consented Borrower Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Shared Merchant Credit Scorecards
            </h1>
            <p className="text-teal-100/80 text-xs sm:text-sm mt-1">
              Browse official VyapaarScore AI credit ratings and verified OCR financial disclosures shared by MSME merchants.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 p-4 rounded-xl border border-teal-500/20 shrink-0">
            <UserCheck className="w-6 h-6 text-teal-400" />
            <div>
              <div className="text-[10px] text-teal-300/70 font-bold uppercase">Consented Profiles</div>
              <div className="text-xl font-black text-white">{reports.length} Merchants</div>
            </div>
          </div>
        </div>

        {/* Directory Grid & Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-500" />
                <span>Verified Borrower Scorecards</span>
              </h2>
              <p className="text-xs text-slate-500">Real-time cashflow analytics from PhonePe, GPay, Paytm & Bank statements</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search merchant or business..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="w-full sm:w-auto bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
              >
                <option value="All">All Tier Ratings</option>
                <option value="750+">750+ (Tier A Low Risk)</option>
                <option value="680-749">680-749 (Tier B Good)</option>
                <option value="<680">&lt; 680 (Tier C/D Risk)</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 font-medium">Loading merchant scorecards...</div>
          ) : filteredReports.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              <FileCheck className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Consented Reports Found</h4>
              <p className="text-xs text-slate-500">No merchant credit profiles match your search filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReports.map((item) => {
                const score = item.scoreData?.score || 300;
                return (
                  <div
                    key={item.merchant.id}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                          score >= 750
                            ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                            : score >= 680
                            ? 'bg-cyan-100 dark:bg-cyan-950 border-cyan-300 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400'
                            : 'bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400'
                        }`}>
                          {item.scoreData?.riskGrade || 'Tier D'}
                        </span>
                        <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
                          {score}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {item.merchant.businessName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{item.merchant.name} • {item.merchant.email}</p>

                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                          <span>Verified Monthly Inflow:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{Number(item.scoreData?.breakdown?.totalInflow || 0).toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                          <span>Est. Micro-Credit Limit:</span>
                          <span className="font-bold text-slate-900 dark:text-white">₹{Number(item.scoreData?.creditLimitEstimate || 25000).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => setSelectedReport(item)}
                        className="py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-500" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => handleDownloadPDF(item.merchant.id, item.merchant.name)}
                        className="py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF Report</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* MODAL VIEW FOR DETAILED CREDIT PROFILE */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedReport.merchant.businessName}
                  </h3>
                  <p className="text-xs text-slate-500">Merchant: {selectedReport.merchant.name} ({selectedReport.merchant.email})</p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Score Meter Header */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-gradient-to-r dark:from-slate-900 dark:to-teal-950 text-slate-900 dark:text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-200 dark:border-teal-500/30 shadow-sm">
                <div className="text-center sm:text-left">
                  <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">VyapaarScore Rating</div>
                  <div className="text-5xl font-black text-teal-600 dark:text-teal-400 mt-1">
                    {selectedReport.scoreData?.score}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-semibold">
                    {selectedReport.scoreData?.riskGrade}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Estimated Credit Limit</div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{Number(selectedReport.scoreData?.creditLimitEstimate || 25000).toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => handleDownloadPDF(selectedReport.merchant.id, selectedReport.merchant.name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs mt-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official PDF</span>
                  </button>
                </div>
              </div>

              {/* Cashflow Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase">Verified Inflow (Sales)</span>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    ₹{Number(selectedReport.scoreData?.breakdown?.totalInflow || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase">Verified Outflow (Expenses)</span>
                  <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
                    ₹{Number(selectedReport.scoreData?.breakdown?.totalOutflow || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Close Inspection
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default SharedReports;
