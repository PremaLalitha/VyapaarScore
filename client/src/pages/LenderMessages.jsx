import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { 
  Building2, 
  MessageSquare, 
  Paperclip, 
  Send, 
  X, 
  CheckCircle2, 
  XCircle,
  Download, 
  Search, 
  User, 
  Clock, 
  CreditCard,
  Filter
} from 'lucide-react';

const LenderMessages = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeApp, setActiveApp] = useState(null);
  const [chatInputText, setChatInputText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/reports/my-applications');
      if (res.data.success) {
        setApplications(res.data.applications || []);
        if (res.data.applications?.length > 0 && !activeApp) {
          setActiveApp(res.data.applications[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching lender applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!activeApp || !chatInputText.trim()) return;

    try {
      const res = await axios.post('/api/reports/chat', {
        applicationId: activeApp._id,
        text: chatInputText,
      });

      if (res.data.success) {
        const updatedMessages = res.data.messages;
        setActiveApp({
          ...activeApp,
          messages: updatedMessages,
        });
        setChatInputText('');
        
        // Refresh application list to update timestamps and snippets
        fetchApplications();
      }
    } catch (err) {
      console.error('Error sending reply:', err);
    }
  };

  const handleDecision = async (merchantId, decision) => {
    try {
      setActionLoading(true);
      const res = await axios.post('/api/reports/lender/decision', {
        merchantId,
        decision,
      });
      if (res.data.success) {
        setToastMessage(`Loan application successfully marked as ${decision.toUpperCase()}! Notification sent.`);
        setActiveApp((prev) => (prev ? { ...prev, status: decision } : prev));
        fetchApplications();
        setTimeout(() => setToastMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error recording decision:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPDF = (merchantId) => {
    const token = localStorage.getItem('token');
    window.open(`/api/reports/pdf?token=${token}&merchantId=${merchantId}`, '_blank');
  };

  const filteredApps = applications.filter((app) => {
    const merchantName = app.merchantId?.name || '';
    const businessName = app.merchantId?.businessName || '';
    const email = app.merchantId?.email || '';

    const matchesSearch =
      merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ? true : app.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900 via-slate-900 to-emerald-950 p-6 sm:p-8 rounded-2xl border border-cyan-500/30 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Lender Communications Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Merchant Applications & Live Messages
            </h1>
            <p className="text-cyan-100/80 text-xs sm:text-sm mt-1">
              Review incoming loan requests, communicate directly with micro-merchants, and inspect attached credit reports.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-cyan-500/20 shrink-0">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-[10px] text-cyan-300/70 font-bold uppercase">Total Inquiries</div>
              <div className="text-lg font-black text-white">{applications.length} Requests</div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* MAIN CHAT INTERFACE SPLIT VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          
          {/* LEFT COLUMN: APPLICATION LIST & SEARCH */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col space-y-4">
            
            {/* Search & Filter bar */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search merchant or business..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 ${
                      statusFilter === status
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {loading ? (
                <div className="py-12 text-center text-slate-500 text-xs">Loading loan applications...</div>
              ) : filteredApps.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">No applications found</h4>
                  <p className="text-[11px] text-slate-500">No incoming merchant requests match your search filter.</p>
                </div>
              ) : (
                filteredApps.map((app) => {
                  const isSelected = activeApp?._id === app._id;
                  const latestMsg = app.messages && app.messages.length > 0 ? app.messages[app.messages.length - 1] : null;
                  
                  return (
                    <div
                      key={app._id}
                      onClick={() => setActiveApp(app)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-400 dark:border-cyan-500/50 shadow-md ring-1 ring-cyan-400/30'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {app.merchantId?.businessName || app.merchantId?.name || 'MSME Merchant'}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border border-rose-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-300'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                        ₹{Number(app.requestedAmount || 50000).toLocaleString('en-IN')} • <span className="text-slate-500 font-normal">{app.loanType || 'Working Capital'}</span>
                      </div>

                      {latestMsg && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
                          "{latestMsg.text}"
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{app.merchantId?.name}</span>
                        <span>{new Date(app.updatedAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: ACTIVE CONVERSATION THREAD */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
            
            {activeApp ? (
              <>
                {/* Active Chat Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-3 shrink-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {activeApp.merchantId?.businessName || activeApp.merchantId?.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        activeApp.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : activeApp.status === 'rejected'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                      }`}>
                        {activeApp.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Merchant: {activeApp.merchantId?.name} ({activeApp.merchantId?.email || 'N/A'})
                    </p>
                    
                    <div className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Requested: <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{Number(activeApp.requestedAmount || 50000).toLocaleString('en-IN')}</span> ({activeApp.loanType || 'Working Capital'})
                    </div>
                  </div>

                  {/* Actions Header Group */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDownloadPDF(activeApp.merchantId?._id || activeApp.merchantId)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      title="Download Merchant PDF Credit Report"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF Report</span>
                    </button>

                    <button
                      onClick={() => handleDecision(activeApp.merchantId?._id || activeApp.merchantId, 'approved')}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleDecision(activeApp.merchantId?._id || activeApp.merchantId, 'rejected')}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-sm"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                {/* Message Log Thread */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3.5">
                  {activeApp.messages && activeApp.messages.length > 0 ? (
                    activeApp.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${msg.sender === 'lender' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1.5 ${
                            msg.sender === 'lender'
                              ? 'bg-cyan-600 text-white rounded-br-none shadow-md'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="font-bold text-[10px] opacity-75 uppercase">
                            {msg.sender === 'lender' ? 'You (NBFC Lender)' : `Merchant (${activeApp.merchantId?.name || 'Applicant'})`}
                          </div>
                          
                          <p className="leading-relaxed">{msg.text}</p>

                          {msg.attachPdf && (
                            <div className="mt-2 p-2 rounded-xl bg-black/20 text-white flex items-center justify-between gap-2 text-[11px] font-bold">
                              <div className="flex items-center gap-1.5">
                                <Paperclip className="w-3.5 h-3.5 text-cyan-300" />
                                <span>Attached: VyapaarScore_CreditReport.pdf</span>
                              </div>
                              <button
                                onClick={() => handleDownloadPDF(activeApp.merchantId?._id || activeApp.merchantId)}
                                className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white text-[10px] underline"
                              >
                                View PDF
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
                    <div className="py-16 text-center text-slate-500 text-xs">No message thread history yet.</div>
                  )}
                </div>

                {/* Reply Footer */}
                <form onSubmit={handleSendReply} className="border-t border-slate-200 dark:border-slate-800 pt-3 shrink-0 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type reply, ask questions or offer loan terms to merchant..."
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Reply</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Select an application to view conversation</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Click any loan request from the left list to open the live chat thread and review credit details.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </Layout>
  );
};

export default LenderMessages;
