import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { KeyRound, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

const VerifyOTP = () => {
  const { verifyOTP, resendOTP } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';
  const initialDevOtp = location.state?.devOtp || '';
  const initialMsg = location.state?.message || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = useState(initialDevOtp);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(initialMsg);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const getMaskedEmail = (rawEmail) => {
    if (!rawEmail) return 'your registered email';
    const parts = rawEmail.split('@');
    if (parts.length < 2) return rawEmail;
    const name = parts[0];
    const domain = parts[1];
    const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name[0]}***`;
    return `${maskedName}@${domain}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join('');
    if (fullCode.length === 6) {
      submitVerification(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      submitVerification(pastedData);
    }
  };

  const submitVerification = async (codeToSubmit) => {
    if (!email) {
      setError('Missing email address. Please register or log in first.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await verifyOTP(email, codeToSubmit);
      if (res.success && res.user) {
        if (res.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (res.user.role === 'lender') {
          navigate('/lender', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      console.error('OTP Verification Error:', err);
      setError(err.response?.data?.message || 'Verification code failed. Please double check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !email) return;
    try {
      setResending(true);
      setError('');
      setSuccessMsg('');
      const res = await resendOTP(email);
      if (res.success) {
        setSuccessMsg(res.message || 'A new 6-digit code has been sent.');
        if (res.devOtp) setDevOtp(res.devOtp);
        setTimer(60);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl dark:shadow-cyan-950/40">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Verify Your Email</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Enter the 6-digit verification code sent to <br />
              <span className="font-semibold text-cyan-600 dark:text-cyan-300">{getMaskedEmail(email)}</span>
            </p>
          </div>



          {/* Alerts */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && !error && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 6 OTP Single Digit Inputs */}
          <div className="my-8">
            <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-extrabold rounded-xl bg-slate-50 dark:bg-slate-950 border transition-all focus:outline-none ${
                    digit
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 shadow-sm'
                      : 'border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:border-cyan-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={() => submitVerification(otp.join(''))}
            disabled={loading || otp.join('').length < 6}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-sky-600 hover:from-cyan-500 hover:to-sky-400 text-white font-bold text-base shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Timer & Resend */}
          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
            <span>Didn't receive the code?</span>
            {timer > 0 ? (
              <span className="text-slate-500 font-mono text-xs">
                Resend in <strong className="text-slate-800 dark:text-slate-300">{timer}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                <span>Resend Code</span>
              </button>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/signup" className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-400">
              Incorrect email? Change registration email
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default VerifyOTP;
