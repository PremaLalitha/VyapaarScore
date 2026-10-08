import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  FileText,
  Phone,
  Mail,
  XCircle,
  Clock,
  Eye,
  X,
  TrendingUp,
  ShieldCheck,
  UserCheck,
  ShieldAlert,
  Store,
  Activity
} from 'lucide-react';

const AdminLenders = () => {
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLender, setSelectedLender] = useState(null);

  const fetchLenders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/lenders');
      if (res.data.success) {
        setLenders(res.data.lenders || []);
      }
    } catch (err) {
      console.error('Error fetching admin lenders directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLenders();
  }, []);

  const filteredLenders = lenders.filter((l) => {
    return (
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalLendersCount = lenders.length;
  const totalAppsReviewed = lenders.reduce((sum, l) => sum + (l.totalReviewed || 0), 0);
  const totalApprovedApps = lenders.reduce((sum, l) => sum + (l.approvedCount || 0), 0);
  const totalRejectedApps = lenders.reduce((sum, l) => sum + (l.rejectedCount || 0), 0);
  const overallApprovalRate = totalAppsReviewed > 0 ? Math.round((totalApprovedApps / totalAppsReviewed) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/80 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-amber-500/30 text-slate-900 dark:text-white shadow-md dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>Platform Admin Lender Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Registered NBFC Lenders Directory
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              Complete registration profile details, authorized contacts, and underwriting performance metrics for all registered NBFC lenders.
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
              to="/admin/merchants"
              className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              <span>Merchants Directory</span>
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
            <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Registered Lenders</span>
              <Building2 className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : totalLendersCount}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Verified NBFC Institutions</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Reviewed Applications</span>
              <FileText className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
              {loading ? '...' : totalAppsReviewed}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Underwritten loan requests</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Approved Micro-Loans</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {loading ? '...' : totalApprovedApps}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Capital granted to merchants</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-sky-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Approval Rate %</span>
              <TrendingUp className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
              {loading ? '...' : `${overallApprovalRate}%`}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Overall platform conversion</div>
          </div>
        </div>

        {/* Directory Table Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-500" />
                <span>Verified NBFC Lenders Directory ({filteredLenders.length})</span>
              </h3>
              <p className="text-xs text-slate-500">Full registration details & contact info for authorized micro-credit underwriters</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search NBFC or lender name..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Loading NBFC lender profiles...</div>
          ) : filteredLenders.length === 0 ? (
            <div className="py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              No matching NBFC lender profiles found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">NBFC Institution & Brand</th>
                    <th className="p-3.5 whitespace-nowrap">Registered Contact Email</th>
                    <th className="p-3.5 whitespace-nowrap">Helpline Contact</th>
                    <th className="p-3.5 whitespace-nowrap">Reviewed</th>
                    <th className="p-3.5 whitespace-nowrap">Approved</th>
                    <th className="p-3.5 whitespace-nowrap">Rejected</th>
                    <th className="p-3.5 whitespace-nowrap">Pending</th>
                    <th className="p-3.5 whitespace-nowrap">Joined Date</th>
                    <th className="p-3.5 rounded-r-xl text-right whitespace-nowrap">Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredLenders.map((l) => (
                    <tr key={l._id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                      <td className="p-3.5 font-medium">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {l.name}
                        </div>
                        <div className="text-slate-500 text-[11px] font-semibold">{l.businessName}</div>
                      </td>

                      <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{l.email}</span>
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{l.phone}</span>
                        </div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                          <FileText className="w-3.5 h-3.5 text-amber-500" />
                          <span>{l.totalReviewed} Apps</span>
                        </span>
                      </td>

                      <td className="p-3.5 whitespace-nowrap font-extrabold text-emerald-600 dark:text-emerald-400">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{l.approvedCount}</span>
                        </span>
                      </td>

                      <td className="p-3.5 whitespace-nowrap font-extrabold text-rose-600 dark:text-rose-400">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-700">
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>{l.rejectedCount}</span>
                        </span>
                      </td>

                      <td className="p-3.5 whitespace-nowrap font-bold text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{l.pendingCount}</span>
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-500 whitespace-nowrap">
                        {new Date(l.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLender(l)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-sm inline-flex items-center gap-1.5 transition-all"
                          title="View full registration profile & underwriting applications"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FULL LENDER PROFILE & AUDIT MODAL */}
        {selectedLender && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-500/40 text-amber-600 dark:text-amber-400 font-black flex items-center justify-center text-xl">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {selectedLender.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{selectedLender.businessName}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLender(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Registration Information Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Registered Profile & Account Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block">Registered Email Address</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm mt-0.5 block">{selectedLender.email}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block">Support Helpline Phone</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">{selectedLender.phone}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block">Account ID (MongoDB Ref)</span>
                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 block">{selectedLender._id}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 font-medium block">Verification Status</span>
                      <span className="font-bold text-emerald-500 text-xs mt-0.5 block">Verified NBFC Institution</span>
                    </div>
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Underwriting Performance Metrics */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Underwriting Performance Summary</h4>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-700">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase block">Total Reviewed</span>
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400">{selectedLender.totalReviewed}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase block">Approved Loans</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{selectedLender.approvedCount}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-700">
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase block">Rejected History</span>
                    <span className="text-lg font-black text-rose-600 dark:text-rose-400">{selectedLender.rejectedCount}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-700">
                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 uppercase block">Pending Review</span>
                    <span className="text-lg font-black text-sky-600 dark:text-sky-400">{selectedLender.pendingCount}</span>
                  </div>
                </div>
              </div>

              {/* List of Applications Underwritten */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Merchant Applications Handled ({selectedLender.applications?.length || 0})</h4>
                
                {selectedLender.applications && selectedLender.applications.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedLender.applications.map((app, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{app.merchantBusiness} ({app.merchantName})</div>
                          <div className="text-[11px] text-slate-500 font-mono">{app.merchantEmail}</div>
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
                    No loan applications processed by this lender yet.
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedLender(null)}
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

export default AdminLenders;
