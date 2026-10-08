import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { 
  ShieldAlert, 
  Users, 
  Receipt, 
  Award, 
  CheckCircle2, 
  Search, 
  UserCheck, 
  RefreshCw,
  X,
  Activity,
  Lock,
  Globe,
  Key,
  Building2,
  CreditCard,
  TrendingUp,
  Clock,
  Server,
  ShieldCheck,
  LogOut
} from 'lucide-react';

const AdminPanel = () => {
  const [data, setData] = useState({ stats: null, users: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState('');
  const [showFlowDetails, setShowFlowDetails] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/users');
      if (res.data.success) {
        setData({
          stats: res.data.stats,
          users: res.data.users || [],
        });
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      setMessage('');
      const res = await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setMessage(`Successfully updated role for ${res.data.user.email} to ${newRole.toUpperCase()}`);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Role change error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = data.users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.businessName && u.businessName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'All' || u.role === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="bg-white dark:bg-gradient-to-r dark:from-amber-950 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-amber-500/30 text-slate-900 dark:text-white shadow-md dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Platform Administration Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              System Admin Panel
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              Manage registered platform users, assign Merchant / Lender / Admin roles, and monitor system metrics.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <Link
              to="/admin/merchants"
              className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>Merchant Directory</span>
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

        {/* Success Message Banner */}
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

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Registered Users</span>
              <Users className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : data.stats?.totalUsers || 0}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              {data.stats?.merchantsCount || 0} Merchants • {data.stats?.lendersCount || 0} Lenders
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-500 uppercase">Transactions Analyzed</span>
              <Receipt className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {loading ? '...' : data.stats?.totalTransactions || 0}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">OCR parsed ledger records</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-500 uppercase">Scores Generated</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-amber-500">
              {loading ? '...' : data.stats?.scoresGenerated || 0}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Scored merchant accounts</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-500 uppercase">Active Lenders</span>
              <UserCheck className="w-5 h-5 text-sky-500" />
            </div>
            <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
              {loading ? '...' : data.stats?.lendersCount || 0}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Capital partners</div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Registered Users & Role Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Change user role between Merchant, Lender, and System Admin
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Merchant">Merchant</option>
                <option value="Lender">Lender</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading user accounts...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No matching user accounts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">User & Business</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Current Role</th>
                    <th className="p-3.5">Verified</th>
                    <th className="p-3.5">Joined Date</th>
                    <th className="p-3.5 rounded-r-xl text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                      <td className="p-3.5 font-medium">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</div>
                        <div className="text-slate-500 text-[11px]">{u.businessName || 'N/A'}</div>
                      </td>

                      <td className="p-3.5 font-mono text-slate-800 dark:text-slate-200">{u.email}</td>

                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-500 text-slate-950'
                            : u.role === 'lender'
                            ? 'bg-sky-500 text-white'
                            : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Yes</span>
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        {u.role === 'merchant' && (
                          <button
                            onClick={() => {
                              const token = localStorage.getItem('token');
                              window.open(`/api/reports/pdf?token=${token}&merchantId=${u._id}`, '_blank');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 font-bold text-xs hover:bg-cyan-200"
                            title="Download Merchant PDF Report"
                          >
                            PDF Report
                          </button>
                        )}
                        <select
                          value={u.role}
                          disabled={updatingId === u._id}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                        >
                          <option value="merchant">Set to Merchant</option>
                          <option value="lender">Set to Lender</option>
                          <option value="admin">Set to Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* 15-STEP COMPLETE ADMIN FULL FLOW PANEL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Platform Architecture & Access Control</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                VyapaarScore – Complete Admin Full Flow
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Platform Administration, Monitoring, User Management & Role-Based Access Control
              </p>
            </div>

            <button
              onClick={() => setShowFlowDetails(!showFlowDetails)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-all shrink-0 border border-slate-300 dark:border-slate-700 flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-amber-500" />
              <span>{showFlowDetails ? 'Collapse 15-Step Flow' : 'Expand 15-Step Full Flow'}</span>
            </button>
          </div>

          {showFlowDetails && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Security Decision Branching Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900/5 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Admin Security & Access Guard Branching</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Enforces JWT signature verification and role-level authorization before rendering admin tools.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700">
                    Role = Admin → Access Granted
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-700">
                    Role ≠ Admin → 403 Forbidden
                  </span>
                </div>
              </div>

              {/* 15 Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* 1 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 01</span>
                    <Globe className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">1. Admin Visits VyapaarScore</h4>
                  <p className="text-[11px] text-slate-500">Landing Page & Login options navigation.</p>
                </div>

                {/* 2 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 02</span>
                    <Key className="w-4 h-4 text-amber-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">2. Admin Login Form</h4>
                  <p className="text-[11px] text-slate-500">Email, Password & Admin Portal Tab selection.</p>
                </div>

                {/* 3 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 03</span>
                    <Lock className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">3. Admin Role Verification</h4>
                  <p className="text-[11px] text-slate-500">JWT Auth & Admin Role Check (Grant / 403 Forbidden).</p>
                </div>

                {/* 4 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 04</span>
                    <Users className="w-4 h-4 text-cyan-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">4. Admin Dashboard Overview</h4>
                  <p className="text-[11px] text-slate-500">KPI metrics: Total Users, Merchants, Lenders, Txns & Scores.</p>
                </div>

                {/* 5 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 05</span>
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">5. User Management Panel</h4>
                  <p className="text-[11px] text-slate-500">Users table: ID, Name, Email, Role, Verification & Actions.</p>
                </div>

                {/* 6 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 06</span>
                    <Receipt className="w-4 h-4 text-amber-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">6. Merchant Management Panel</h4>
                  <p className="text-[11px] text-slate-500">Kirana Store accounts, OCR ledgers & VyapaarScores.</p>
                </div>

                {/* 7 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 07</span>
                    <Building2 className="w-4 h-4 text-sky-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">7. Lender Management Panel</h4>
                  <p className="text-[11px] text-slate-500">Registered NBFCs, authorized persons & review metrics.</p>
                </div>

                {/* 8 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 08</span>
                    <ShieldAlert className="w-4 h-4 text-purple-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">8. Role & Access Management</h4>
                  <p className="text-[11px] text-slate-500">Role controls (Merchant / Lender / Admin) with Update Role API.</p>
                </div>

                {/* 9 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 09</span>
                    <CreditCard className="w-4 h-4 text-cyan-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">9. Loan Application Monitoring</h4>
                  <p className="text-[11px] text-slate-500">Track application statuses (Pending, Approved, Rejected).</p>
                </div>

                {/* 10 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 10</span>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">10. Transaction & Score Monitoring</h4>
                  <p className="text-[11px] text-slate-500">Dual OCR receipt processing & cashflow statistics.</p>
                </div>

                {/* 11 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 11</span>
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">11. Reports & Analytics</h4>
                  <p className="text-[11px] text-slate-500">System growth charts, score tiers & approval ratios.</p>
                </div>

                {/* 12 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 12</span>
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">12. Security Audit Logs</h4>
                  <p className="text-[11px] text-slate-500">Timestamped security audit trail & activity log records.</p>
                </div>

                {/* 13 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 13</span>
                    <Server className="w-4 h-4 text-sky-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">13. System Monitoring</h4>
                  <p className="text-[11px] text-slate-500">Active users, API online status, DB connection & 2FA status.</p>
                </div>

                {/* 14 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 14</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">14. Admin Profile & Settings</h4>
                  <p className="text-[11px] text-slate-500">Profile info, security credentials & platform settings.</p>
                </div>

                {/* 15 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">STEP 15</span>
                    <LogOut className="w-4 h-4 text-rose-500" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">15. Secure Logout</h4>
                  <p className="text-[11px] text-slate-500">Clears JWT token session & redirects back to Login.</p>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* System Activity & Security Log */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span>Platform Security & Activity Audit Log</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">System Admin Auth Guard</span>
              <span className="text-emerald-500 font-bold">Active (premalalitha08@gmail.com)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">2FA Email OTP Verification</span>
              <span className="text-emerald-500 font-bold">Enforced for All Users</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">OCR Receipt Scanning Engine</span>
              <span className="text-cyan-500 font-bold">PaddleOCR (Python) + Tesseract.js Dual Engine</span>
            </div>
          </div>
        </div>

      </div>

    </Layout>
  );
};

export default AdminPanel;
