import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { 
  Store, 
  Search, 
  Download, 
  CheckCircle2, 
  CreditCard,
  Phone,
  Mail,
  Receipt,
  Eye,
  X,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  ShieldAlert,
  Activity
} from 'lucide-react';

const AdminMerchants = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState('All');
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/merchants');
      if (res.data.success) {
        setMerchants(res.data.merchants || []);
      }
    } catch (err) {
      console.error('Error fetching admin merchants directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const handleDownloadPDF = (merchantId) => {
    const token = localStorage.getItem('token');
    window.open(`/api/reports/pdf?token=${token}&merchantId=${merchantId}`, '_blank');
  };

  const filteredMerchants = merchants.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());

    const score = m.scoreData?.score || 300;
    let matchesScore = true;
    if (scoreFilter === '750+') matchesScore = score >= 750;
    else if (scoreFilter === '680-749') matchesScore = score >= 680 && score < 750;
    else if (scoreFilter === '<680') matchesScore = score < 680;

    return matchesSearch && matchesScore;
  });

  const totalMerchantsCount = merchants.length;
  const totalTransactionsCount = merchants.reduce((sum, m) => sum + (m.transactionCount || 0), 0);
  const scoredMerchantsCount = merchants.filter((m) => (m.scoreData?.score || 300) > 300 || m.transactionCount > 0).length;
  const totalCreditLimitLimit = merchants.reduce((sum, m) => sum + (m.scoreData?.creditLimitEstimate || 25000), 0);

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/80 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-cyan-500/30 text-slate-900 dark:text-white shadow-md dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Store className="w-4 h-4" />
              <span>Platform Admin Merchant Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Merchant Directory & Credit Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              Complete registration profile details, verified cashflow metrics, VyapaarScores, and submitted loan application histories.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <Link
              to="/admin"
              className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>User Control</span>
            </Link>
            <Link
              to="/admin/lenders"
              className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>NBFC Lenders</span>
            </Link>
            <Link
              to="/admin/flow"
              className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4" />
              <span>System Flow</span>
            </Link>
          </div>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Registered MSMEs</span>
              <Store className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : totalMerchantsCount}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Kirana & micro-business accounts</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Receipts Parsed</span>
              <Receipt className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {loading ? '...' : totalTransactionsCount}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Dual OCR ledger entries</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Scored Profiles</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-amber-500">
              {loading ? '...' : scoredMerchantsCount}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Active VyapaarScore ratings</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-sky-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Est. Credit Lines</span>
              <TrendingUp className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">
              ₹{loading ? '0' : Number(totalCreditLimitLimit).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Calculated borrowing capacity</div>
          </div>
        </div>

        {/* Directory Table Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-cyan-500" />
                <span>Registered MSME Merchants Directory ({filteredMerchants.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Full profile registration details & credit analytics for registered Kirana stores</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
            <div className="py-12 text-center text-slate-500 font-medium">Loading merchant profiles...</div>
          ) : filteredMerchants.length === 0 ? (
            <div className="py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              No matching merchant profiles found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Merchant & Business</th>
                    <th className="p-3.5 whitespace-nowrap">Registered Contact</th>
                    <th className="p-3.5 whitespace-nowrap">Receipt Txns</th>
                    <th className="p-3.5 whitespace-nowrap">VyapaarScore</th>
                    <th className="p-3.5 whitespace-nowrap">Risk Grade</th>
                    <th className="p-3.5 whitespace-nowrap">Est. Credit Line</th>
                    <th className="p-3.5 whitespace-nowrap">Applications</th>
                    <th className="p-3.5 whitespace-nowrap">Joined Date</th>
                    <th className="p-3.5 rounded-r-xl text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredMerchants.map((m) => {
                    const score = m.scoreData?.score || 300;
                    return (
                      <tr key={m._id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                        <td className="p-3.5 font-medium">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {m.businessName}
                          </div>
                          <div className="text-slate-500 text-[11px] font-semibold">{m.name}</div>
                        </td>

                        <td className="p-3.5 space-y-0.5 text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{m.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{m.phone}</span>
                          </div>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                            <Receipt className="w-3.5 h-3.5 text-cyan-500" />
                            <span>{m.transactionCount} Recs</span>
                          </span>
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
                            {m.scoreData?.riskGrade || 'Tier D'}
                          </span>
                        </td>

                        <td className="p-3.5 font-bold text-slate-900 dark:text-slate-200 whitespace-nowrap">
                          ₹{Number(m.scoreData?.creditLimitEstimate || 25000).toLocaleString('en-IN')}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                            {m.applications?.length || 0} Loans
                          </span>
                        </td>

                        <td className="p-3.5 text-slate-500 whitespace-nowrap">
                          {new Date(m.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>

                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedMerchant(m)}
                              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                              title="Inspect full merchant profile, cashflow & credit score breakdown"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
                            </button>

                            <button
                              onClick={() => handleDownloadPDF(m._id)}
                              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700"
                              title="Download Official PDF Report"
                            >
                              <Download className="w-4 h-4" />
                            </button>
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

        {/* FULL MERCHANT PROFILE & CREDIT AUDIT MODAL */}
        {selectedMerchant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/40 text-cyan-600 dark:text-cyan-400 font-black flex items-center justify-center text-xl">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {selectedMerchant.businessName}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{selectedMerchant.name}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMerchant(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Registration Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Registered Profile & Account Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block">Registered Email Address</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm mt-0.5 block">{selectedMerchant.email}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block">Contact Phone Number</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">{selectedMerchant.phone}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block">Merchant ID (MongoDB Ref)</span>
                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 block">{selectedMerchant._id}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 font-medium block">Account Status</span>
                      <span className="font-bold text-emerald-500 text-xs mt-0.5 block">Verified Kirana Merchant</span>
                    </div>
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* VyapaarScore & Cashflow Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Credit Analytics & VyapaarScore Rating</h4>
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/30 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-cyan-300 uppercase font-bold tracking-wider">VyapaarScore Index</span>
                    <div className="text-3xl font-black text-cyan-400 mt-0.5">
                      {selectedMerchant.scoreData?.score || 300} / 900
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Risk Tier: <strong className="text-amber-400">{selectedMerchant.scoreData?.riskGrade || 'Tier D'}</strong>
                    </div>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
                    <span className="text-xs text-slate-400 uppercase font-bold block">Estimated Micro-Credit Line</span>
                    <div className="text-2xl font-black text-emerald-400 mt-0.5">
                      ₹{Number(selectedMerchant.scoreData?.creditLimitEstimate || 25000).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Based on {selectedMerchant.transactionCount} parsed receipts</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase block">Total Sales (Inflow)</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      ₹{Number(selectedMerchant.scoreData?.breakdown?.totalInflow || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-700">
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase block">Total Expenses (Outflow)</span>
                    <span className="text-sm font-black text-rose-600 dark:text-rose-400 mt-0.5 block">
                      ₹{Number(selectedMerchant.scoreData?.breakdown?.totalOutflow || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-700">
                    <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 uppercase block">Net Cashflow</span>
                    <span className="text-sm font-black text-cyan-600 dark:text-cyan-400 mt-0.5 block">
                      ₹{Number(selectedMerchant.scoreData?.breakdown?.netCashflow || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submitted Loan Applications */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Submitted Loan Applications ({selectedMerchant.applications?.length || 0})</h4>
                
                {selectedMerchant.applications && selectedMerchant.applications.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedMerchant.applications.map((app, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{app.lenderName}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{app.loanType || 'Working Capital'}</div>
                        </div>

                        <div className="text-right">
                          <div className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            ₹{Number(app.requestedAmount).toLocaleString('en-IN')}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase inline-block mt-0.5 ${
                            app.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                              : app.status === 'rejected'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No loan applications submitted by this merchant yet.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleDownloadPDF(selectedMerchant._id)}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Credit Report</span>
                </button>

                <button
                  onClick={() => setSelectedMerchant(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs"
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

export default AdminMerchants;
