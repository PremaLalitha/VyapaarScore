import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  ShieldAlert, 
  Activity, 
  Lock, 
  Globe, 
  Key, 
  Users, 
  UserCheck, 
  Receipt, 
  Building2, 
  CreditCard, 
  TrendingUp, 
  Award, 
  Clock, 
  Server, 
  ShieldCheck, 
  LogOut,
  GitBranch,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const AdminFlow = () => {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      id: 1,
      title: '1. Admin Visits VyapaarScore',
      icon: Globe,
      color: 'text-slate-400',
      tag: 'PUBLIC LANDING',
      desc: 'Landing Page & Login options navigation.',
      details: 'Admin accesses the public landing page (/) and navigates to the login page (/login) to select the System Admin Portal tab.'
    },
    {
      id: 2,
      title: '2. Admin Login Form',
      icon: Key,
      color: 'text-amber-500',
      tag: 'AUTHENTICATION',
      desc: 'Email, Password & Admin Portal Tab selection.',
      details: 'Admin enters authorized credentials (e.g. premalalitha08@gmail.com / admin123) under the System Admin tab.'
    },
    {
      id: 3,
      title: '3. Admin Role Verification',
      icon: Lock,
      color: 'text-emerald-500',
      tag: 'SECURITY GUARD',
      desc: 'JWT Auth & Admin Role Check (Grant / 403 Forbidden).',
      details: 'Backend validates JWT signature and verifies user.role === "admin". If true, access granted; otherwise returns 403 Forbidden.'
    },
    {
      id: 4,
      title: '4. Admin Dashboard Overview',
      icon: Users,
      color: 'text-cyan-500',
      tag: 'METRICS KPI',
      desc: 'KPI metrics: Total Users, Merchants, Lenders, Txns & Scores.',
      details: 'Displays real-time system metrics: Total Users, Merchants Count, Active Lenders, Analyzed Transactions, and Generated Scores.'
    },
    {
      id: 5,
      title: '5. User Management Panel',
      icon: UserCheck,
      color: 'text-emerald-500',
      tag: 'USER DIRECTORY',
      desc: 'Users table: ID, Name, Email, Role, Verification & Actions.',
      details: 'Complete user account table with search, role filtering, verification status, and merchant PDF report download tools.'
    },
    {
      id: 6,
      title: '6. Merchant Management Panel',
      icon: Receipt,
      color: 'text-amber-500',
      tag: 'MSME ACCOUNTS',
      desc: 'Kirana Store accounts, OCR ledgers & VyapaarScores.',
      details: 'Audit small business accounts, uploaded bill receipts, monthly inflow totals, and generated VyapaarScores.'
    },
    {
      id: 7,
      title: '7. Lender Management Panel',
      icon: Building2,
      color: 'text-sky-500',
      tag: 'NBFC DIRECTORY',
      desc: 'Registered NBFCs, authorized persons & review metrics.',
      details: 'Monitor 5 pre-seeded registered NBFC lender accounts, contact persons, reviewed applications, approvals, and rejections.'
    },
    {
      id: 8,
      title: '8. Role & Access Management',
      icon: ShieldAlert,
      color: 'text-purple-500',
      tag: 'RBAC CONTROL',
      desc: 'Role controls (Merchant / Lender / Admin) with Update Role API.',
      details: 'Re-assign user roles on-the-fly between Merchant, Lender, and System Admin via PUT /api/admin/users/:id/role.'
    },
    {
      id: 9,
      title: '9. Loan Application Monitoring',
      icon: CreditCard,
      color: 'text-cyan-500',
      tag: 'UNDERWRITING',
      desc: 'Track application statuses (Pending, Approved, Rejected).',
      details: 'Monitor merchant loan requests sent to NBFC lenders with live application status badging.'
    },
    {
      id: 10,
      title: '10. Transaction & Score Monitoring',
      icon: TrendingUp,
      color: 'text-emerald-500',
      tag: 'DUAL OCR LEDGER',
      desc: 'Dual OCR receipt processing & cashflow statistics.',
      details: 'Audit gross inflows, expense outflows, net cashflow margins, and PaddleOCR/Tesseract.js parsing outputs.'
    },
    {
      id: 11,
      title: '11. Reports & Analytics',
      icon: Award,
      color: 'text-amber-500',
      tag: 'PLATFORM CHARTS',
      desc: 'System growth charts, score tiers & approval ratios.',
      details: 'Visual overview of credit score distribution (Tier A to D), transaction volumes, and loan approval ratios.'
    },
    {
      id: 12,
      title: '12. Security Audit Logs',
      icon: Clock,
      color: 'text-slate-400',
      tag: 'SECURITY LOGS',
      desc: 'Timestamped security audit trail & activity log records.',
      details: 'Monitors platform actions: User registrations, role changes, PDF report generations, and loan underwriting decisions.'
    },
    {
      id: 13,
      title: '13. System Monitoring',
      icon: Server,
      color: 'text-sky-500',
      tag: 'HEALTH CHECKS',
      desc: 'Active users, API online status, DB connection & 2FA status.',
      details: 'Verifies platform health: Node Express Server, MongoDB database connection, 2FA OTP mailer, and Dual OCR engines.'
    },
    {
      id: 14,
      title: '14. Admin Profile & Settings',
      icon: ShieldCheck,
      color: 'text-emerald-500',
      tag: 'ADMIN CONTROL',
      desc: 'Profile info, security credentials & platform settings.',
      details: 'Manage administrator email, password updates, theme toggles, and security preferences.'
    },
    {
      id: 15,
      title: '15. Secure Logout',
      icon: LogOut,
      color: 'text-rose-500',
      tag: 'SESSION TERMINATE',
      desc: 'Clears JWT token session & redirects back to Login.',
      details: 'Wipes localStorage authentication tokens and redirects admin back to public login portal.'
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="bg-white dark:bg-gradient-to-r dark:from-amber-950 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-amber-500/30 text-slate-900 dark:text-white shadow-md dark:shadow-xl">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <GitBranch className="w-4 h-4" />
            <span>Dedicated Admin System Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            VyapaarScore – Complete Admin Full Flow
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Platform Administration, System Monitoring, User Management & Role-Based Access Control
          </p>
        </div>

        {/* Security Guard & Branching Banner */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Admin Authorization & Security Branching
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enforces JWT signature validation and role-level authorization middleware.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700">
                Role = Admin → Access Granted
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-700">
                Role ≠ Admin → 403 Forbidden
              </span>
            </div>
          </div>
        </div>

        {/* 15 Steps Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              <span>Complete 15-Step Admin Flow Architecture</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Click any step to view full specifications</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((step) => {
              const Icon = step.icon;
              const isSelected = activeStep?.id === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(isSelected ? null : step)}
                  className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase">
                        STEP {step.id < 10 ? `0${step.id}` : step.id}
                      </span>
                      <Icon className={`w-5 h-5 ${step.color}`} />
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-amber-600 dark:text-amber-400 uppercase tracking-wider">{step.tag}</span>
                    <span className="text-slate-400 hover:text-slate-200 flex items-center gap-1">
                      Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Step Details Modal */}
        {activeStep && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/40 text-white space-y-3 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-amber-400">{activeStep.title} (Specification Detail)</h3>
              </div>
              <button
                onClick={() => setActiveStep(null)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Close Specification
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-7">{activeStep.details}</p>
          </div>
        )}

        {/* Audit Log Box */}
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

export default AdminFlow;
