import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Download, 
  TrendingUp, 
  Eye, 
  X,
  Search,
  Check,
  AlertCircle,
  MessageSquare,
  Send,
  Paperclip,
  History,
  RotateCcw
} from 'lucide-react';

const LenderDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeChatApp, setActiveChatApp] = useState(null);
  const [chatText, setChatText] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'

  const fetchLenderReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/reports/lender/merchants');
      if (res.data.success) {
        setReports(res.data.reports || []);
      }
    } catch (error) {
      console.error('Error fetching lender merchant reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendLenderMessage = async (e) => {
    e.preventDefault();
    if (!activeChatApp || !chatText.trim()) return;
    try {
      const res = await axios.post('/api/reports/chat', {
        applicationId: activeChatApp.applicationId || activeChatApp._id,
        text: chatText,
      });

      if (res.data.success) {
        setActiveChatApp({
          ...activeChatApp,
          messages: res.data.messages,
        });
        setChatText('');
        fetchLenderReports();
      }
    } catch (err) {
      console.error('Error sending lender chat reply:', err);
    }
  };

  useEffect(() => {
    fetchLenderReports();
  }, []);

  const handleDecision = async (merchantId, decision) => {
    try {
      setActionLoading(true);
      setMessage('');
      const res = await axios.post('/api/reports/lender/decision', {
        merchantId,
        decision,
      });
      if (res.data.success) {
        if (decision === 'rejected') {
          setMessage(`Loan application REJECTED and archived to Decision History.`);
        } else {
          setMessage(`Loan application APPROVED successfully!`);
        }
        fetchLenderReports();
        if (selectedReport && selectedReport.merchant.id === merchantId) {
          setSelectedReport((prev) => ({ ...prev, applicationStatus: decision }));
        }
      }
    } catch (err) {
      console.error('Loan decision error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPDF = (merchantId, merchantName) => {
    const token = localStorage.getItem('token');
    window.open(`/api/reports/pdf?token=${token}&merchantId=${merchantId}`, '_blank');
  };

  const [scoreFilter, setScoreFilter] = useState('All');

  const activeReportsCount = reports.filter((r) => r.applicationStatus !== 'rejected').length;
  const rejectedReportsCount = reports.filter((r) => r.applicationStatus === 'rejected').length;

  const filteredReports = reports.filter((item) => {
    // TAB FILTERING: Active tab shows Pending + Approved; History tab shows Rejected
    if (activeTab === 'active' && item.applicationStatus === 'rejected') return false;
    if (activeTab === 'history' && item.applicationStatus !== 'rejected') return false;

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


  const totalApproved = reports.filter((r) => r.applicationStatus === 'approved').length;
  const totalPending = reports.filter((r) => r.applicationStatus === 'pending').length;
  const totalCapitalUnderwritten = reports
    .filter((r) => r.applicationStatus === 'approved')
    .reduce((sum, r) => sum + (r.scoreData?.creditLimitEstimate || 50000), 0);

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/80 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-amber-500/30 text-slate-900 dark:text-white shadow-md dark:shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-2">
                <Building2 className="w-4 h-4" />
                <span>NBFC & Financial Lender Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Underwriting & Credit Risk Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                Evaluate real-time OCR cashflow analytics and approve/reject micro-business credit applications.
              </p>
            </div>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage('')} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div 
            onClick={() => setActiveTab('active')}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-900/80 border transition-all cursor-pointer ${
              activeTab === 'active' ? 'border-amber-500 shadow-md' : 'border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Active Credit Profiles
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : activeReportsCount}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Consented MSME Merchants</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
              Pending Applications
            </div>
            <div className="text-3xl font-extrabold text-amber-500">
              {loading ? '...' : totalPending}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Awaiting decision</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">
              Approved Loans
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {loading ? '...' : totalApproved}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Credit granted</div>
          </div>

          <div 
            onClick={() => setActiveTab('history')}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-900/80 border transition-all cursor-pointer ${
              activeTab === 'history' ? 'border-rose-500 shadow-md' : 'border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Rejected History</span>
              <History className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {loading ? '...' : rejectedReportsCount}
            </div>
            <div className="text-xs text-rose-500/80 mt-1 font-medium underline">Click to view history</div>
          </div>
        </div>

        {/* Consented Merchants Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* TAB NAVIGATION & SEARCH CONTROLS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            
            {/* TABS */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
                  activeTab === 'active'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Active Underwriting ({activeReportsCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
                  activeTab === 'history'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Rejected History ({rejectedReportsCount})</span>
              </button>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search merchant or business..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="w-full sm:w-auto bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
              >
                <option value="All">All Score Ranges</option>
                <option value="750+">750+ (Tier A Low Risk)</option>
                <option value="680-749">680-749 (Tier B Good)</option>
                <option value="<680">&lt; 680 (Tier C/D Risk)</option>
              </select>
            </div>

          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Loading merchant credit reports...</div>
          ) : filteredReports.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              {activeTab === 'history' ? (
                <>
                  <History className="w-10 h-10 text-rose-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Rejected Applications in History</h4>
                  <p className="text-xs text-slate-500">Rejected loan applications will appear in this history archive.</p>
                </>
              ) : (
                <>
                  <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Active Credit Reports Found</h4>
                  <p className="text-xs text-slate-500">No pending or approved merchant reports match your filter.</p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Merchant & Business</th>
                    <th className="p-3.5 whitespace-nowrap">VyapaarScore</th>
                    <th className="p-3.5 whitespace-nowrap">Risk Grade</th>
                    <th className="p-3.5 whitespace-nowrap">Monthly Inflow</th>
                    <th className="p-3.5 whitespace-nowrap">Est. Credit Line</th>
                    <th className="p-3.5 whitespace-nowrap">Status</th>
                    <th className="p-3.5 rounded-r-xl text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredReports.map((item) => {
                    const score = item.scoreData?.score || 300;
                    const status = item.applicationStatus;
                    return (
                      <tr key={item.merchant.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                        <td className="p-3.5 font-medium">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {item.merchant.businessName}
                          </div>
                          <div className="text-slate-500 text-[11px]">{item.merchant.name} • {item.merchant.email}</div>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className="text-base font-black text-cyan-600 dark:text-cyan-400">
                            {score}
                          </span>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap border ${
                            score >= 750
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                              : score >= 680
                              ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400'
                              : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400'
                          }`}>
                            {item.scoreData?.riskGrade || 'Tier D'}
                          </span>
                        </td>

                        <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                          ₹{Number(item.scoreData?.breakdown?.totalInflow || 0).toLocaleString('en-IN')}
                        </td>

                        <td className="p-3.5 font-bold text-slate-900 dark:text-slate-200 whitespace-nowrap">
                          ₹{Number(item.scoreData?.creditLimitEstimate || 25000).toLocaleString('en-IN')}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            status === 'approved'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                              : status === 'rejected'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              status === 'approved' ? 'bg-emerald-500' : status === 'rejected' ? 'bg-rose-500' : 'bg-slate-400'
                            }`}></span>
                            {status}
                          </span>
                        </td>

                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* Tools Group */}
                            <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                              <button
                                onClick={() => setSelectedReport(item)}
                                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                                title="View Full Credit Report"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setActiveChatApp(item)}
                                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 transition-colors"
                                title="Chat & Messages"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleDownloadPDF(item.merchant.id, item.merchant.name)}
                                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 transition-colors"
                                title="Download Official PDF Report"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Underwriting Decision / Restore Buttons */}
                            {activeTab === 'history' ? (
                              <button
                                onClick={() => handleDecision(item.merchant.id, 'approved')}
                                disabled={actionLoading}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5 border border-slate-700"
                                title="Re-evaluate and move back to active underwriting"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Re-evaluate</span>
                              </button>
                            ) : (
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => handleDecision(item.merchant.id, 'approved')}
                                  disabled={actionLoading}
                                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-sm transition-all disabled:opacity-50 ${
                                    status === 'approved'
                                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                                      : 'bg-emerald-600/90 hover:bg-emerald-500 text-white'
                                  }`}
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() => handleDecision(item.merchant.id, 'rejected')}
                                  disabled={actionLoading}
                                  className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-extrabold text-xs shadow-sm transition-all disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </div>
                            )}

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* MODAL VIEW FOR SELECTED REPORT */}
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

              {/* Score Meter */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-gradient-to-r dark:from-slate-900 dark:to-cyan-950 text-slate-900 dark:text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-200 dark:border-cyan-500/30 shadow-sm">
                <div className="text-center sm:text-left">
                  <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">VyapaarScore Rating</div>
                  <div className="text-5xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs mt-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Sales Inflow</span>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    ₹{Number(selectedReport.scoreData?.breakdown?.totalInflow || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Outflow</span>
                  <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
                    ₹{Number(selectedReport.scoreData?.breakdown?.totalOutflow || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Score Drivers Reasons */}
              {selectedReport.scoreData?.scoreDrivers && selectedReport.scoreData.scoreDrivers.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Underwriting Score Impact Factors
                  </h4>
                  <div className="space-y-2">
                    {selectedReport.scoreData.scoreDrivers.map((driver, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
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
                          <span className="font-bold text-slate-900 dark:text-white">{driver.title}: </span>
                          <span className="text-slate-600 dark:text-slate-300">{driver.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Action Decision Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleDecision(selectedReport.merchant.id, 'rejected')}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Loan</span>
                </button>

                <button
                  onClick={() => handleDecision(selectedReport.merchant.id, 'approved')}
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Loan Credit</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* LENDER CHAT & ATTACHMENT MODAL */}
        {activeChatApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col h-[540px] relative">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-500" />
                    <span>Merchant Application: {activeChatApp.merchant?.businessName || activeChatApp.merchant?.name}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Merchant Email: {activeChatApp.merchant?.email} • Score Rating: <strong className="text-cyan-500">{activeChatApp.scoreData?.score || 'N/A'}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setActiveChatApp(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {activeChatApp.messages && activeChatApp.messages.length > 0 ? (
                  activeChatApp.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${msg.sender === 'lender' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1.5 ${
                          msg.sender === 'lender'
                            ? 'bg-emerald-600 text-white rounded-br-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-[10px] opacity-75 uppercase">
                          {msg.sender === 'lender' ? 'You (NBFC Lender)' : 'Merchant'}
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                        
                        {msg.attachPdf && (
                          <div className="mt-2 p-2 rounded-lg bg-black/20 text-white flex items-center justify-between gap-2 text-[11px] font-bold">
                            <div className="flex items-center gap-1.5">
                              <Paperclip className="w-3.5 h-3.5" />
                              <span>Attached: VyapaarScore_Report.pdf</span>
                            </div>
                            <button
                              onClick={() => handleDownloadPDF(activeChatApp.merchant?.id || activeChatApp.merchant?._id, activeChatApp.merchant?.name)}
                              className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white text-[10px] underline"
                            >
                              Download
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs">No direct messages received yet.</div>
                )}
              </div>

              {/* Reply Footer */}
              <form onSubmit={handleSendLenderMessage} className="border-t border-slate-200 dark:border-slate-800 pt-3 shrink-0 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type reply or loan terms to merchant..."
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center transition-all gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default LenderDashboard;
