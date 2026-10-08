import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  User,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Store,
  Building2
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 'merchant' | 'lender' | 'admin'
  const [stakeholderRole, setStakeholderRole] = useState('merchant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const handleRoleTabChange = (role) => {
    setStakeholderRole(role);
    setError('');
    setUnverifiedEmail('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUnverifiedEmail('');

    if (!email || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const loginMode = stakeholderRole === 'admin' ? 'admin' : 'user';
      const res = await login(email, password, loginMode, stakeholderRole);
      
      if (res.success && res.user) {
        // Navigate directly to the corresponding stakeholder page
        if (res.user.role === 'admin' || stakeholderRole === 'admin') {
          navigate('/admin', { replace: true });
        } else if (res.user.role === 'lender' || stakeholderRole === 'lender') {
          navigate('/lender', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      console.error('Login Error:', err);
      const errRes = err.response?.data;
      if (errRes?.requiresVerification) {
        setUnverifiedEmail(errRes.email || email);
        if (errRes.devOtp) setDevOtp(errRes.devOtp);
        
        navigate('/verify-otp', {
          state: {
            email: errRes.email || email,
            devOtp: errRes.devOtp,
            message: errRes.message || `2FA Verification code sent to ${errRes.email || email}. Enter code to log in.`,
          },
        });
      } else {
        setError(errRes?.message || 'Invalid email or password. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRedirect = () => {
    navigate('/verify-otp', {
      state: {
        email: unverifiedEmail || email,
        devOtp: devOtp,
        message: 'Enter the verification code to finish signing in.',
      },
    });
  };

  const getHeaderIcon = () => {
    if (stakeholderRole === 'admin') return <ShieldAlert className="w-6 h-6" />;
    if (stakeholderRole === 'lender') return <Building2 className="w-6 h-6" />;
    return <Store className="w-6 h-6" />;
  };

  const getTitleText = () => {
    if (stakeholderRole === 'admin') return 'System Admin Portal';
    if (stakeholderRole === 'lender') return 'NBFC Lender Portal';
    return 'Merchant Sign In';
  };

  const getSubtitleText = () => {
    if (stakeholderRole === 'admin') return 'Restricted control panel for platform administrators';
    if (stakeholderRole === 'lender') return 'Review micro-business credit reports and approve loans';
    return 'Access your credit score, OCR receipt uploads & cashflow ledger';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl dark:shadow-cyan-950/40">
          
          {/* STAKEHOLDER CHOICE TABS */}
          <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl mb-6 border border-slate-200 dark:border-slate-800 gap-1">
            <button
              type="button"
              onClick={() => handleRoleTabChange('merchant')}
              className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                stakeholderRole === 'merchant'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Merchant</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('lender')}
              className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                stakeholderRole === 'lender'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Lender</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('admin')}
              className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                stakeholderRole === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 border ${
              stakeholderRole === 'admin'
                ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                : stakeholderRole === 'lender'
                ? 'bg-sky-100 dark:bg-sky-950/80 border-sky-300 dark:border-sky-700 text-sky-600 dark:text-sky-400'
                : 'bg-cyan-100 dark:bg-cyan-950/80 border-cyan-300 dark:border-cyan-700 text-cyan-600 dark:text-cyan-400'
            }`}>
              {getHeaderIcon()}
            </div>
            
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {getTitleText()}
            </h1>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {getSubtitleText()}
            </p>
          </div>

          {/* Unverified Account Banner */}
          {unverifiedEmail ? (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-200 text-sm space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-300">Email Verification Required</p>
                  <p className="text-xs text-amber-800 dark:text-amber-200/80 mt-0.5">
                    Your account <strong className="text-slate-900 dark:text-white">{unverifiedEmail}</strong> requires OTP verification before logging in.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerifyRedirect}
                className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Verify Email with OTP</span>
              </button>
            </div>
          ) : error ? (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mail.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-11 pr-11 py-3 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 py-3.5 px-4 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                stakeholderRole === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25'
                  : stakeholderRole === 'lender'
                  ? 'bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-600 hover:from-sky-500 hover:to-cyan-500 text-white shadow-sky-500/25'
                  : 'bg-gradient-to-r from-cyan-600 via-sky-500 to-sky-600 hover:from-cyan-500 hover:to-sky-400 text-white shadow-cyan-500/25'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>
                    Sign In as {stakeholderRole === 'admin' ? 'Admin' : stakeholderRole === 'lender' ? 'Lender' : 'Merchant'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
              Sign Up
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Login;
