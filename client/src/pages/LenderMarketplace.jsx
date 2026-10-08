import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  CreditCard, 
  MessageSquare, 
  Paperclip, 
  Send, 
  X, 
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';

const LenderMarketplace = () => {
  const { user } = useAuth();
  const [lenders, setLenders] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedLender, setSelectedLender] = useState(null);
  const [loanForm, setLoanForm] = useState({
    loanType: 'Working Capital',
    amount: 50000,
    purpose: '',
    initialMsg: '',
    attachPdf: true,
  });
  const [applying, setApplying] = useState(false);
  const [activeAppChat, setActiveAppChat] = useState(null);
  const [chatInputText, setChatInputText] = useState('');
  const [chatAttachPdf, setChatAttachPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchLendersAndApps = async () => {
    try {
      setLoading(true);
      const [lenderRes, appRes] = await Promise.all([
        axios.get('/api/reports/lenders'),
        axios.get('/api/reports/my-applications')
      ]);

      if (lenderRes.data.success) {
        setLenders(lenderRes.data.lenders || []);
      }
      if (appRes.data.success) {
        setMyApplications(appRes.data.applications || []);
      }
    } catch (err) {
      console.error('Error fetching lenders/apps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLendersAndApps();
  }, []);

  const handleOpenLoanModal = (lender = null) => {
    if (lender) setSelectedLender(lender);
    else if (lenders.length > 0) setSelectedLender(lenders[0]);
    setShowLoanModal(true);
  };

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    if (!selectedLender) return;
    try {
      setApplying(true);
      const res = await axios.post('/api/reports/apply-loan', {
        lenderId: selectedLender._id || selectedLender.id,
        requestedAmount: Number(loanForm.amount),
        loanType: loanForm.loanType,
        loanPurpose: loanForm.purpose,
        initialMessage: loanForm.initialMsg,
        attachPdf: loanForm.attachPdf,
      });

      if (res.data.success) {
        setToastMessage('Loan Application & VyapaarScore PDF Report sent to Lender!');
        setShowLoanModal(false);
        fetchLendersAndApps();
        setTimeout(() => setToastMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error applying for loan:', err);
    } finally {
      setApplying(false);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!activeAppChat || !chatInputText.trim()) return;

    try {
      const res = await axios.post('/api/reports/chat', {
        applicationId: activeAppChat._id,
        text: chatInputText,
        attachPdf: chatAttachPdf,
      });

      if (res.data.success) {
        setActiveAppChat({
          ...activeAppChat,
          messages: res.data.messages,
        });
        setChatInputText('');
        setChatAttachPdf(false);
        fetchLendersAndApps();
      }
    } catch (err) {
      console.error('Error sending chat message:', err);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-emerald-500/30 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Merchant Loan Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Registered NBFC Lenders & Loan Center
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm mt-1">
              Select verified NBFC institutions, submit your loan requirements, and chat directly with lenders.
            </p>
          </div>

          <button
            onClick={() => handleOpenLoanModal()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            <span>Apply For Loan</span>
          </button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* REGISTERED LENDERS DIRECTORY */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              <span>Available Registered NBFC Lenders ({lenders.length})</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Direct Micro-Credit Underwriting</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Loading registered lenders...</div>
          ) : lenders.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No registered lenders available yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Registered NBFC institutions will appear here once signed up on VyapaarScore.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {lenders.map((lender) => (
                <div
                  key={lender._id || lender.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase">
                        Verified NBFC
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{lender.name}</h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{lender.businessName || 'Authorized Financial Institution'}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{lender.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{lender.phone || '+91 1800 209 0144'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenLoanModal(lender)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Apply & Start Chat</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MY SUBMITTED APPLICATIONS & CHAT THREADS */}
        {myApplications.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-500" />
              <span>My Active Loan Applications ({myApplications.length})</span>
            </h2>

            <div className="space-y-3">
              {myApplications.map((app) => (
                <div
                  key={app._id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-base">
                        {app.lenderId?.name || 'NBFC Lender'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        app.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-950 dark:text-rose-400'
                          : 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-950 dark:text-amber-400'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      Requested: <strong className="text-emerald-600 dark:text-emerald-400">₹{Number(app.requestedAmount || 50000).toLocaleString('en-IN')}</strong> • {app.loanType || 'Working Capital'}
                    </div>

                    {app.messages && app.messages.length > 0 && (
                      <div className="text-[11px] text-slate-400 italic mt-1 line-clamp-1">
                        Latest message: "{app.messages[app.messages.length - 1].text}"
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveAppChat(app)}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-all shrink-0"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open Live Chat ({app.messages?.length || 0})</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* LOAN APPLICATION REQUIREMENT FORM MODAL */}
      {showLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                  <span>Enter Loan Requirement</span>
                </h3>
                <p className="text-xs text-slate-500">Apply to NBFC Lender with VyapaarScore Credit Report</p>
              </div>
              <button
                onClick={() => setShowLoanModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLoan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Registered Lender</label>
                <select
                  value={selectedLender?._id || ''}
                  onChange={(e) => setSelectedLender(lenders.find((l) => (l._id || l.id) === e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {lenders.map((l) => (
                    <option key={l._id || l.id} value={l._id || l.id}>
                      {l.name} ({l.businessName || 'NBFC'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Loan Type</label>
                  <select
                    value={loanForm.loanType}
                    onChange={(e) => setLoanForm({ ...loanForm, loanType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Working Capital">Working Capital</option>
                    <option value="Inventory Restocking">Inventory Restocking</option>
                    <option value="Equipment Purchase">Equipment Purchase</option>
                    <option value="Store Expansion">Store Expansion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Amount Needed (₹)</label>
                  <input
                    type="number"
                    value={loanForm.amount}
                    onChange={(e) => setLoanForm({ ...loanForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    min="5000"
                    max="500000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Purpose of Loan</label>
                <input
                  type="text"
                  placeholder="e.g. Festival inventory purchase & supplier payments"
                  value={loanForm.purpose}
                  onChange={(e) => setLoanForm({ ...loanForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Message to Lender</label>
                <textarea
                  rows="2"
                  placeholder="Introduce your business to the lender..."
                  value={loanForm.initialMsg}
                  onChange={(e) => setLoanForm({ ...loanForm, initialMsg: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-900 dark:text-cyan-200">Attach Official VyapaarScore PDF Report</span>
                </div>
                <input
                  type="checkbox"
                  checked={loanForm.attachPdf}
                  onChange={(e) => setLoanForm({ ...loanForm, attachPdf: e.target.checked })}
                  className="w-4 h-4 accent-cyan-600 rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoanModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{applying ? 'Sending Application...' : 'Transmit & Start Chat'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MERCHANT–LENDER LIVE CHAT MODAL */}
      {activeAppChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col h-[520px] relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeAppChat.lenderId?.name || 'NBFC Lender'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Loan Request: ₹{Number(activeAppChat.requestedAmount || 50000).toLocaleString('en-IN')} ({activeAppChat.loanType || 'Working Capital'})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveAppChat(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {activeAppChat.messages && activeAppChat.messages.length > 0 ? (
                activeAppChat.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'merchant' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1.5 ${
                        msg.sender === 'merchant'
                          ? 'bg-cyan-600 text-white rounded-br-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-[10px] opacity-75 uppercase">
                        {msg.sender === 'merchant' ? 'You (Merchant)' : 'Lender'}
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                      
                      {msg.attachPdf && (
                        <div className="mt-2 p-2 rounded-lg bg-black/20 text-white flex items-center gap-2 text-[11px] font-bold">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>Attached: VyapaarScore_CreditReport.pdf</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">No messages yet. Send a message to start conversation!</div>
              )}
            </div>

            {/* Send Message Footer */}
            <form onSubmit={handleSendChatMessage} className="border-t border-slate-200 dark:border-slate-800 pt-3 shrink-0 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type message or ask question to lender..."
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />

                <button
                  type="button"
                  onClick={() => setChatAttachPdf(!chatAttachPdf)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    chatAttachPdf
                      ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 border-cyan-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  }`}
                  title="Attach VyapaarScore PDF Report"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {chatAttachPdf && (
                <div className="text-[11px] text-cyan-500 font-bold flex items-center gap-1">
                  <Paperclip className="w-3.3 h-3" />
                  <span>VyapaarScore PDF Credit Report will be attached to this message</span>
                </div>
              )}
            </form>

          </div>
        </div>
      )}

    </Layout>
  );
};

export default LenderMarketplace;
