import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Smartphone,
  FileText,
  Camera,
  Building2,
  UserCheck,
  QrCode,
  Search,
  ArrowRight,
  Lock,
  RefreshCw,
  Sliders,
  Download,
  Eye,
  X,
  ChevronRight,
  CreditCard,
  Percent,
  BadgeCheck,
  Briefcase,
  MapPin,
  Activity,
  Sparkles,
  Clock,
  ArrowUpRight,
  PieChart,
  Users,
  Check,
  Mail,
  Phone,
  Store,
  Award,
  HelpCircle,
  LogOut,
  Upload,
  BarChart3,
  SlidersHorizontal,
  Shield,
  ShieldCheck,
  Key,
  LogIn,
  UserPlus,
  ShoppingBag,
  Globe,
  Layers,
  ChevronDown
} from 'lucide-react';

// Mock Indian Merchant & Applicant Data for Underwriter Portal
const MOCK_APPLICANTS = [
  {
    id: 'APP-8942',
    name: 'Rajesh Kumar',
    shopName: 'Rajesh Kirana & General Store',
    category: 'Grocery / Kirana',
    location: 'T. Nagar, Chennai, TN',
    pincode: '600017',
    upiVpa: 'rajesh.kirana@oksbi',
    mobile: '+91 98401 23456',
    turnover: 78500,
    operatingDays: 26,
    creditScore: 742,
    maxEligibleLoan: 35000,
    requestedAmount: 30000,
    riskLevel: 'Low',
    riskColor: 'emerald',
    tamperCheck: 'Passed (99.8% Authentic)',
    shapFactors: [
      { factor: 'Daily UPI Sales Stability', impact: '+42 pts', positive: true, detail: 'Consistent 26 active operating days/month' },
      { factor: 'Zero Payment Bounce Rate', impact: '+28 pts', positive: true, detail: 'No failed customer transactions in 90 days' },
      { factor: 'High Customer Retention', impact: '+15 pts', positive: true, detail: '64% repeat payment customer VPAs' },
      { factor: 'Seasonal Rain Impact', impact: '-15 pts', positive: false, detail: '12% volume drop during heavy monsoon week' }
    ],
    cashflowHistory: [
      { day: 'Day 1-15', inflow: 38400, outflow: 12000 },
      { day: 'Day 16-30', inflow: 40100, outflow: 14500 },
      { day: 'Day 31-45', inflow: 39800, outflow: 11200 },
      { day: 'Day 46-60', inflow: 42500, outflow: 13000 },
      { day: 'Day 61-75', inflow: 37200, outflow: 10800 },
      { day: 'Day 76-90', inflow: 44100, outflow: 15200 }
    ]
  },
  {
    id: 'APP-7631',
    name: 'Priya Sundaram',
    shopName: 'Sri Amman Tailoring & Boutique',
    category: 'Apparel / Tailor',
    location: 'Mylapore, Chennai, TN',
    pincode: '600004',
    upiVpa: 'amman.boutique@paytm',
    mobile: '+91 97902 88123',
    turnover: 52000,
    operatingDays: 24,
    creditScore: 688,
    maxEligibleLoan: 25000,
    requestedAmount: 20000,
    riskLevel: 'Medium',
    riskColor: 'amber',
    tamperCheck: 'Passed (98.2% Authentic)',
    shapFactors: [
      { factor: 'Festival Order Surge', impact: '+35 pts', positive: true, detail: 'Peak inflows during Diwali/Pongal months' },
      { factor: 'QR Code Longevity', impact: '+20 pts', positive: true, detail: 'Active BharatPe QR for 18+ months' },
      { factor: 'Weekend Concentration', impact: '-18 pts', positive: false, detail: '70% sales concentrated on Sat-Sun' }
    ],
    cashflowHistory: [
      { day: 'Day 1-15', inflow: 22400, outflow: 8000 },
      { day: 'Day 16-30', inflow: 29600, outflow: 9500 },
      { day: 'Day 31-45', inflow: 21000, outflow: 7200 },
      { day: 'Day 46-60', inflow: 31500, outflow: 10200 },
      { day: 'Day 61-75', inflow: 24200, outflow: 8100 },
      { day: 'Day 76-90', inflow: 28000, outflow: 9000 }
    ]
  }
];

const PRELOADED_UPI_SCREENSHOTS = [
  { id: 1, title: 'PhonePe QR Receipt', amount: '₹1,450', sender: 'Suresh V (via PhonePe)', date: 'Today, 11:24 AM', utr: '425910839201', app: 'PhonePe', status: 'Verified' },
  { id: 2, title: 'Google Pay Store QR', amount: '₹820', sender: 'Meena R (via GPay)', date: 'Today, 10:15 AM', utr: '425908172635', app: 'GPay', status: 'Verified' },
  { id: 3, title: 'Paytm Business Soundbox', amount: '₹3,200', sender: 'Kannan Traders (via Paytm)', date: 'Yesterday, 06:40 PM', utr: '425890123849', app: 'Paytm', status: 'Verified' }
];

export default function VikasPayApp() {
  // Navigation & View State: 'landing' or 'dashboard'
  const [currentView, setCurrentView] = useState('landing');
  const [activeRole, setActiveRole] = useState('borrower'); // 'borrower', 'agent', 'lender', 'admin'

  // Modal State: null, 'register', 'login', 'admin_login'
  const [authModal, setAuthModal] = useState(null);

  // Auth Form Input States
  const [selectedRole, setSelectedRole] = useState('borrower');
  const [modalStep, setModalStep] = useState('form'); // 'form', 'otp'
  const [userEmail, setUserEmail] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  // Admin Specific Auth State
  const CONSTANT_ADMIN_EMAIL = 'admin@vikaspay.in';
  const CONSTANT_ADMIN_PASS = 'Admin@2026';
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');

  // Stakeholder Registration Profile State
  const [profileData, setProfileData] = useState({
    fullName: 'Rajesh Kumar',
    mobile: '+91 98401 23456',
    // Merchant
    businessName: 'Rajesh Kirana & General Store',
    category: 'Kirana / Grocery',
    upiVpa: 'rajesh.kirana@oksbi',
    address: 'No. 42, North Usman Road, T. Nagar, Chennai - 600017',
    // Agent
    agencyName: 'TN Financial Inclusion BC Services',
    agentCode: 'AGT-TN-9842',
    pincode: '600017',
    // Lender
    institution: 'HDFC Capital & NBFC Partner',
    rbiRegNo: 'N-14.03291',
    empId: 'HDFC-UW-904',
    sanctionLimit: '5000000'
  });

  // Borrower Interactive Pipeline States
  const [smsSyncedCount, setSmsSyncedCount] = useState(142);
  const [isSyncingSms, setIsSyncingSms] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([...PRELOADED_UPI_SCREENSHOTS]);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [loanRequestAmount, setLoanRequestAmount] = useState(30000);
  const [loanTenor, setLoanTenor] = useState(90);
  const [loanSubmitted, setLoanSubmitted] = useState(false);

  // Lender Portal States
  const [selectedApplicant, setSelectedApplicant] = useState(MOCK_APPLICANTS[0]);
  const [structuringAmount, setStructuringAmount] = useState(MOCK_APPLICANTS[0].requestedAmount);
  const [structuringTenor, setStructuringTenor] = useState(90);

  // Field Agent States
  const [capturedPhoto, setCapturedPhoto] = useState(false);
  const [agentVerificationSuccess, setAgentVerificationSuccess] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Handlers for Registration & Login
  const handleStartRegister = (role = 'borrower') => {
    setSelectedRole(role);
    setModalStep('form');
    setOtpCode('');
    setOtpError('');
    setAuthModal('register');
  };

  const handleStartLogin = () => {
    setModalStep('form');
    setOtpCode('');
    setOtpError('');
    setAuthModal('login');
  };

  const handleStartAdminLogin = () => {
    setAdminEmailInput('');
    setAdminPassInput('');
    setAdminAuthError('');
    setModalStep('credentials'); // 'credentials', 'otp'
    setOtpCode('');
    setAuthModal('admin_login');
  };

  // Submit User Registration Form -> Send OTP
  const handleSubmitRegisterForm = (e) => {
    e.preventDefault();
    if (!userEmail || !userEmail.includes('@')) {
      showNotification('Please enter a valid email');
      return;
    }
    setModalStep('otp');
    showNotification(`6-Digit OTP sent to ${userEmail}! Use test code 123456`);
  };

  // Verify OTP for User Registration / Login
  const handleVerifyUserOtp = (e) => {
    e.preventDefault();
    if (otpCode !== '123456' && otpCode !== '654321') {
      setOtpError('Invalid OTP code. Please enter 123456 for testing.');
      return;
    }
    setOtpError('');
    setAuthModal(null);
    setActiveRole(selectedRole);
    setCurrentView('dashboard');
    showNotification(`Successfully authenticated as ${selectedRole.toUpperCase()}!`);
  };

  // Admin Credentials Submit -> Send OTP to admin email
  const handleAdminCredentialsSubmit = (e) => {
    e.preventDefault();
    if (adminEmailInput.toLowerCase() !== CONSTANT_ADMIN_EMAIL || adminPassInput !== CONSTANT_ADMIN_PASS) {
      setAdminAuthError(`Invalid Admin credentials! Use ${CONSTANT_ADMIN_EMAIL} / ${CONSTANT_ADMIN_PASS}`);
      return;
    }
    setAdminAuthError('');
    setModalStep('otp');
    showNotification(`Security OTP sent to ${CONSTANT_ADMIN_EMAIL}! Use test code 123456`);
  };

  // Admin OTP Verification
  const handleVerifyAdminOtp = (e) => {
    e.preventDefault();
    if (otpCode !== '123456') {
      setOtpError('Invalid Admin OTP code. Use test code 123456.');
      return;
    }
    setOtpError('');
    setAuthModal(null);
    setActiveRole('admin');
    setCurrentView('dashboard');
    showNotification('Admin Security Clear! Executive Console unlocked.');
  };

  // Reviewer Quick-Fill Persona Bypass
  const handleReviewerQuickFill = (role) => {
    setSelectedRole(role);
    setActiveRole(role);
    setCurrentView('dashboard');
    setAuthModal(null);
    if (role === 'borrower') {
      setProfileData((prev) => ({
        ...prev,
        fullName: 'Rajesh Kumar',
        mobile: '+91 98401 23456',
        businessName: 'Rajesh Kirana & General Store',
        category: 'Kirana / Grocery',
        upiVpa: 'rajesh.kirana@oksbi',
        address: 'No. 42, North Usman Road, T. Nagar, Chennai'
      }));
    } else if (role === 'agent') {
      setProfileData((prev) => ({
        ...prev,
        fullName: 'Sundararajan M',
        mobile: '+91 98402 77112',
        agencyName: 'Tamil Nadu Fin Inclusion BC',
        agentCode: 'AGT-TN-9842',
        pincode: '600017'
      }));
    } else if (role === 'lender') {
      setProfileData((prev) => ({
        ...prev,
        fullName: 'Ananya Kapoor',
        mobile: '+91 99300 44100',
        institution: 'HDFC Bank Micro-Lending Division',
        rbiRegNo: 'RBI-NBFC-2024-912',
        empId: 'HDFC-UW-8821',
        sanctionLimit: '10000000'
      }));
    }
    showNotification(`Quick-Filled as ${role.toUpperCase()}. Dashboard loaded!`);
  };

  // Calculations
  const calculateDailyAutoPay = (amount, tenor) => {
    const interest = amount * 0.08;
    return Math.round((amount + interest) / tenor);
  };

  // OCR simulation
  const triggerOcrPipeline = () => {
    setIsProcessingOcr(true);
    setProcessingStep(1);
    setTimeout(() => {
      setProcessingStep(2);
      setTimeout(() => {
        setProcessingStep(3);
        setTimeout(() => {
          setIsProcessingOcr(false);
          setProcessingStep(0);
          showNotification('OCR & ELA Forensic Audit complete! Verified receipts added.');
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 select-none">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-500 text-slate-950 font-semibold text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 fill-slate-950" />
          {toastMessage}
        </div>
      )}

      {/* Main Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
            <Zap className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-emerald-400">
                VikasPay
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                AI Credit Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">Cash-Flow Micro-Lending for Indian Merchants</p>
          </div>
        </div>

        {/* Landing Page Nav Anchor Links */}
        {currentView === 'landing' && (
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#about" className="hover:text-emerald-400 transition-colors">About Platform</a>
            <a href="#benefits" className="hover:text-emerald-400 transition-colors">Why & Benefits</a>
            <a href="#stakeholders" className="hover:text-emerald-400 transition-colors">Who Can Use</a>
          </nav>
        )}

        {/* Header CTAs & Auth Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentView === 'dashboard' ? (
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-full pl-3 pr-2 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-200 capitalize">{profileData.fullName}</span>
              <span className="text-[10px] bg-slate-700 text-emerald-300 font-mono px-2 py-0.5 rounded-full uppercase">
                {activeRole}
              </span>
              <button
                onClick={() => setCurrentView('landing')}
                className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors ml-1"
                title="Return to Landing Page"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleStartAdminLogin}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Admin Portal
              </button>
              <button
                onClick={handleStartLogin}
                className="text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Login
              </button>
              <button
                onClick={() => handleStartRegister('borrower')}
                className="text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" /> Create Account
              </button>
            </>
          )}
        </div>
      </header>

      {/* ========================================================================================= */}
      {/* VIEW A: COMPREHENSIVE LANDING PAGE */}
      {/* ========================================================================================= */}
      {currentView === 'landing' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-20">
          {/* HERO SECTION */}
          <section className="relative pt-6 pb-12 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
              <Sparkles className="w-4 h-4 fill-emerald-400" /> Instant Micro-Credit for Kirana Stores & Small Vendors
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Turn Daily UPI Receipts into <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Instant Credit Profiles
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              VikasPay uses AI OCR, ELA forensic anti-tamper verification, and SHAP explainability to evaluate Kirana stores, tailors, and street vendors based on daily digital payment cash-flows—no CIBIL score or tax returns needed.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleStartRegister('borrower')}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-all"
              >
                Get Started as Borrower <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleStartRegister('lender')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold px-6 py-3.5 rounded-2xl transition-all flex items-center gap-2"
              >
                Join as Lender / Underwriter <Building2 className="w-4 h-4 text-indigo-400" />
              </button>
            </div>

            {/* Platform Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">₹4.2 Cr+</div>
                <div className="text-xs text-slate-400 mt-1">Disbursed Volume</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">99.4%</div>
                <div className="text-xs text-slate-400 mt-1">ELA Tamper Check</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">12+</div>
                <div className="text-xs text-slate-400 mt-1">Bank & NBFC Partners</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">98.1%</div>
                <div className="text-xs text-slate-400 mt-1">UPI AutoPay Success</div>
              </div>
            </div>
          </section>

          {/* SECTION 2: ABOUT THE PLATFORM */}
          <section id="about" className="scroll-mt-24 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                About VikasPay Engine
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-4 mb-4">
                Bridging India's $300 Billion Credit Gap Through Digital Cash-Flow Velocity
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-6">
                Over 63 million micro-merchants in India process billions of rupees every day through PhonePe, GPay, Paytm, and BharatPe QR codes. Yet, when they need working capital to buy stock, traditional banks reject them for lacking audited financial statements or CIBIL histories.
              </p>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-8">
                VikasPay solves this by converting daily digital payment receipts and bank SMS into an alternative credit profile ("Financial Passport"). Repayments are automatically collected via daily UPI AutoPay micro-deductions matching merchant daily cash inflows.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">No CIBIL or ITR Required</h4>
                    <p className="text-xs text-slate-400 mt-1">Evaluated purely on operating days and QR payment stability.</p>
                  </div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Daily Micro-Repayments</h4>
                    <p className="text-xs text-slate-400 mt-1">Automatic ₹100–₹300 daily AutoPay debits prevent monthly EMI defaults.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: WHY & BENEFITS */}
          <section id="benefits" className="scroll-mt-24 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                Why VikasPay
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-3">Tailored Benefits for Every Stakeholder</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">Designed from the ground up for merchants, underwriter banks, and field verification agents.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: For Borrowers */}
              <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-6 rounded-3xl transition-all space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">For Kirana & Micro-Vendors</h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Instant micro-loans up to ₹50,000</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Easy upload of PhonePe / GPay QR receipts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Auto-sync device payment SMS alerts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Hassle-free daily UPI AutoPay micro-deduction</li>
                </ul>
              </div>

              {/* Card 2: For Lenders */}
              <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 p-6 rounded-3xl transition-all space-y-4">
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">For Banks & NBFC Underwriters</h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> ELA Forensic Anti-Tamper fake screenshot detection</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> SHAP AI explainability (+/- scoring drivers)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> 90-day cash-flow velocity charts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400" /> Instant sanctioning & daily tenor tuning</li>
                </ul>
              </div>

              {/* Card 3: For Field Agents */}
              <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-3xl transition-all space-y-4">
                <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">For Field Agents & DSA Partners</h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Geo-tagged live shop photo capture</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Physical merchant QR standee validation</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Generate Verified Merchant Badges</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Seamless pincode-assigned audit queue</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 4: WHO CAN USE THIS APPLICATION */}
          <section id="stakeholders" className="scroll-mt-24 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                Target Stakeholders
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-3">Who Can Use VikasPay?</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">Empowering India's grassroots entrepreneurs and financial institutions.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                <ShoppingBag className="w-6 h-6 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Kirana & Grocery Stores</h4>
                <p className="text-xs text-slate-400">Neighborhood general stores accepting daily customer UPI payments.</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                <Store className="w-6 h-6 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Street Food & Vendors</h4>
                <p className="text-xs text-slate-400">Juice stalls, tea vendors, and snack counters processing high QR volume.</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                <Briefcase className="w-6 h-6 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">BC & DSA Field Agents</h4>
                <p className="text-xs text-slate-400">Ground agents carrying out physical shop audits and QR code verifications.</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                <Building2 className="w-6 h-6 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Bank Credit Officers</h4>
                <p className="text-xs text-slate-400">Underwriters evaluating micro-loans with SHAP AI risk metrics.</p>
              </div>
            </div>
          </section>

          {/* SECTION 5: FOOTER CTA BANNER */}
          <section className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/20 rounded-3xl p-8 sm:p-12 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to Experience Cash-Flow Lending?</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">Create an account as a Borrower, Field Agent, or Lender Underwriter to test the end-to-end interactive dashboard.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => handleStartRegister('borrower')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition-all"
              >
                Create Account Now
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================================================= */}
      {/* VIEW B: AUTHENTICATED DASHBOARDS */}
      {/* ========================================================================================= */}
      {currentView === 'dashboard' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          {/* BORROWER DASHBOARD */}
          {activeRole === 'borrower' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    Borrower Financial Passport
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">{profileData.businessName}</h1>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-emerald-400" /> {profileData.address} | VPA: <span className="font-mono text-emerald-300">{profileData.upiVpa}</span>
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Device SMS Sync</div>
                    <div className="text-xl font-extrabold text-emerald-400 font-mono">{smsSyncedCount} Alerts</div>
                  </div>
                  <button
                    onClick={() => {
                      setIsSyncingSms(true);
                      setTimeout(() => {
                        setSmsSyncedCount((prev) => prev + 18);
                        setIsSyncingSms(false);
                        showNotification('Synced 18 new HDFC/GPay credit SMS alerts!');
                      }, 1000);
                    }}
                    disabled={isSyncingSms}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 p-2.5 rounded-xl transition-all"
                  >
                    <RefreshCw className={`w-5 h-5 ${isSyncingSms ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Financial Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Monthly Turnover</div>
                  <div className="text-2xl font-extrabold text-white font-mono">₹78,500</div>
                  <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs last month
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Active Operating Days</div>
                  <div className="text-2xl font-extrabold text-white font-mono">26 Days/mo</div>
                  <div className="text-xs text-slate-400 mt-1">High business consistency</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div className="text-xs font-semibold text-slate-400 uppercase mb-1">VikasScore Credit Rating</div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">742 / 900</div>
                  <div className="text-xs text-emerald-400 mt-1">Low Risk Category</div>
                </div>

                <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/30">
                  <div className="text-xs font-semibold text-emerald-300 uppercase mb-1">Eligible Micro-Loan</div>
                  <div className="text-2xl font-extrabold text-emerald-300 font-mono">₹35,000</div>
                  <div className="text-xs text-slate-300 mt-1">Pre-approved via UPI AutoPay</div>
                </div>
              </div>

              {/* Ingestion & Loan Request Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Upload className="w-5 h-5 text-emerald-400" /> UPI Receipt & Soundbox Ingestion
                    </h3>
                    <button
                      onClick={triggerOcrPipeline}
                      disabled={isProcessingOcr}
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-xl font-medium transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Run OCR & Forensic Audit
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center transition-colors bg-slate-950/50 mb-6 cursor-pointer"
                       onClick={triggerOcrPipeline}>
                    <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-300">Drag & Drop transaction receipts here or browse</p>
                    <p className="text-[10px] text-slate-500 mt-1">Auto-checked with ELA Anti-Tamper Forensics</p>
                  </div>

                  {isProcessingOcr && (
                    <div className="bg-slate-950 border border-emerald-500/40 p-4 rounded-2xl mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" /> AI OCR & Anti-Tamper Pipeline Active
                        </span>
                        <span className="text-xs font-mono text-slate-400">Step {processingStep} of 3</span>
                      </div>
                      <div className="space-y-2">
                        <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${processingStep >= 1 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                          <span>1. OCR Character & UTR Extraction</span>
                          {processingStep >= 1 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${processingStep >= 2 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                          <span>2. ELA (Error Level Analysis) Pixel Forensic Check</span>
                          {processingStep >= 2 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${processingStep >= 3 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                          <span>3. Bank Statement & UPI UTR Deduplication</span>
                          {processingStep >= 3 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ingested Receipt Logs</div>
                    {uploadedFiles.map((item) => (
                      <div key={item.id} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">
                            {item.app[0]}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{item.title}</div>
                            <div className="text-[10px] text-slate-400">{item.sender} • UTR: {item.utr}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-400 font-mono">{item.amount}</div>
                          <span className="inline-block px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-400" /> Apply Instant Loan
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">Automated daily repayments via UPI AutoPay</p>

                  {loanSubmitted ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                      <h4 className="text-base font-bold text-white">Loan Request Submitted!</h4>
                      <p className="text-xs text-slate-300">
                        Application <span className="font-mono text-emerald-400">#APP-8942</span> for ₹{loanRequestAmount.toLocaleString('en-IN')} routed to Underwriters.
                      </p>
                      <button
                        onClick={() => setLoanSubmitted(false)}
                        className="text-xs text-emerald-400 hover:underline block mx-auto pt-2"
                      >
                        Modify Loan Request
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-semibold text-slate-300 uppercase">Loan Amount</label>
                          <span className="text-lg font-bold text-emerald-400 font-mono">₹{loanRequestAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <input
                          type="range"
                          min="5000"
                          max="35000"
                          step="1000"
                          value={loanRequestAmount}
                          onChange={(e) => setLoanRequestAmount(Number(e.target.value))}
                          className="w-full accent-emerald-500 bg-slate-950 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Daily AutoPay Deduction:</span>
                          <span className="font-mono font-bold text-emerald-400">₹{calculateDailyAutoPay(loanRequestAmount, loanTenor)} / day</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Tenor:</span>
                          <span className="font-mono text-slate-200">{loanTenor} Days</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setLoanSubmitted(true);
                          showNotification('Loan request sent to Underwriter queue!');
                        }}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
                      >
                        Submit Application <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LENDER PORTAL */}
          {activeRole === 'lender' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                    Underwriter Portal
                  </span>
                  <h1 className="text-2xl font-bold text-white mt-2">{profileData.institution}</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Emp ID: <span className="font-mono text-indigo-300">{profileData.empId}</span></p>
                </div>
                <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl text-right">
                  <div className="text-xs text-slate-400">Sanction Pool</div>
                  <div className="text-lg font-extrabold text-indigo-400 font-mono">₹50,00,000</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" /> Applicant Queue
                  </h3>
                  {MOCK_APPLICANTS.map((applicant) => (
                    <div
                      key={applicant.id}
                      onClick={() => setSelectedApplicant(applicant)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedApplicant.id === applicant.id
                          ? 'bg-indigo-950/40 border-indigo-500/50 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-mono font-bold text-indigo-400">{applicant.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {applicant.riskLevel} Risk ({applicant.creditScore})
                        </span>
                      </div>
                      <div className="font-bold text-sm text-white">{applicant.name}</div>
                      <div className="text-xs text-slate-400">{applicant.shopName}</div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedApplicant.name}</h2>
                      <p className="text-xs text-slate-400">{selectedApplicant.shopName} • {selectedApplicant.location}</p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-2xl text-center">
                      <div className="text-[10px] text-slate-400">VikasScore</div>
                      <div className="text-xl font-extrabold text-emerald-400 font-mono">{selectedApplicant.creditScore}</div>
                    </div>
                  </div>

                  {/* SHAP Cards */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">SHAP AI Explainability Factors</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedApplicant.shapFactors.map((shap, idx) => (
                        <div key={idx} className={`p-3 rounded-2xl border text-xs ${shap.positive ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200' : 'bg-rose-500/5 border-rose-500/20 text-rose-200'}`}>
                          <div className="flex justify-between font-bold mb-1">
                            <span>{shap.factor}</span>
                            <span className="font-mono">{shap.impact}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{shap.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification(`Loan APP-8942 Sanctioned & Disbursed!`)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Sanction & Disburse Loan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FIELD AGENT VIEW */}
          {activeRole === 'agent' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                    Field Agent Portal
                  </span>
                  <h1 className="text-2xl font-bold text-white mt-2">{profileData.fullName}</h1>
                  <p className="text-xs text-slate-400">Pincode: {profileData.pincode} | Agency: {profileData.agencyName}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-cyan-400" /> Live Shop Front Audit
                  </h3>
                  <button
                    onClick={() => {
                      setCapturedPhoto(true);
                      showNotification('Live Shop Photo & GPS logged!');
                    }}
                    className="w-full bg-slate-950 border border-dashed border-slate-800 hover:border-cyan-500 p-8 rounded-2xl text-center cursor-pointer"
                  >
                    {capturedPhoto ? (
                      <div className="text-cyan-400 font-bold text-xs flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Store Geo-Location Locked
                      </div>
                    ) : (
                      <div className="text-slate-400 text-xs">Tap to Capture Live Store Photo</div>
                    )}
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-cyan-400" /> Merchant Verification Badge
                  </h3>
                  <button
                    onClick={() => {
                      setAgentVerificationSuccess(true);
                      showNotification('Merchant QR Verified & Badge Active!');
                    }}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" /> Generate Verification Badge
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN CONSOLE */}
          {activeRole === 'admin' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                    Executive Control Console
                  </span>
                  <h1 className="text-2xl font-bold text-white mt-2">Platform Master Admin</h1>
                  <p className="text-xs text-slate-400">Authenticated Admin: <span className="font-mono text-amber-300">{CONSTANT_ADMIN_EMAIL}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">ALL SYSTEMS LIVE</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div className="text-xs text-slate-400">Total Processed Volume</div>
                  <div className="text-2xl font-extrabold text-white font-mono mt-1">₹4.2 Cr</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div className="text-xs text-slate-400">ELA Tamper Accuracy</div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">99.4%</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div className="text-xs text-slate-400">Active Lenders</div>
                  <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">12 Banks</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div className="text-xs text-slate-400">AutoPay Success Rate</div>
                  <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">98.1%</div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ========================================================================================= */}
      {/* AUTHENTICATION MODALS */}
      {/* ========================================================================================= */}

      {/* MODAL 1: ROLE-BASED CREATE ACCOUNT */}
      {authModal === 'register' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setAuthModal(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {modalStep === 'form' ? (
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Create Account</h3>
                <p className="text-xs text-slate-400 mb-4">Select your platform role to fill relevant details</p>

                {/* Role Selector Tabs */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    { id: 'borrower', label: 'Borrower', desc: 'Kirana Store' },
                    { id: 'agent', label: 'Field Agent', desc: 'DSA Partner' },
                    { id: 'lender', label: 'Lender', desc: 'Bank / NBFC' }
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedRole === role.id
                          ? 'bg-emerald-500/10 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold text-xs">{role.label}</div>
                      <div className="text-[10px] text-slate-500">{role.desc}</div>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmitRegisterForm} className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@business.in"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Mobile (+91)</label>
                    <input
                      type="text"
                      required
                      value={profileData.mobile}
                      onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Borrower specific */}
                  {selectedRole === 'borrower' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Shop Name</label>
                        <input
                          type="text"
                          required
                          value={profileData.businessName}
                          onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Primary UPI VPA</label>
                        <input
                          type="text"
                          required
                          value={profileData.upiVpa}
                          onChange={(e) => setProfileData({ ...profileData, upiVpa: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>
                    </>
                  )}

                  {/* Agent specific */}
                  {selectedRole === 'agent' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Partner Agent Code</label>
                        <input
                          type="text"
                          required
                          value={profileData.agentCode}
                          onChange={(e) => setProfileData({ ...profileData, agentCode: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Assigned Pincode</label>
                        <input
                          type="text"
                          required
                          value={profileData.pincode}
                          onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>
                    </>
                  )}

                  {/* Lender specific */}
                  {selectedRole === 'lender' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Institution Name</label>
                        <input
                          type="text"
                          required
                          value={profileData.institution}
                          onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">RBI Reg No</label>
                        <input
                          type="text"
                          required
                          value={profileData.rbiRegNo}
                          onChange={(e) => setProfileData({ ...profileData, rbiRegNo: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all mt-4"
                  >
                    Send Verification Code →
                  </button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleVerifyUserOtp} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-1">Enter Verification Code</h3>
                <p className="text-xs text-slate-400">Sent to <span className="text-emerald-400 font-mono">{userEmail}</span></p>

                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono bg-slate-950 border border-slate-800 rounded-xl py-3 text-white"
                />
                {otpError && <p className="text-xs text-rose-400 font-medium">{otpError}</p>}

                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setOtpCode('123456')}
                    className="text-emerald-400 underline"
                  >
                    Auto-fill Test OTP (123456)
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  Verify OTP & Access Dashboard
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: USER LOGIN */}
      {authModal === 'login' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setAuthModal(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {modalStep === 'form' ? (
              <div>
                <h3 className="text-xl font-bold text-white mb-1">User Login</h3>
                <p className="text-xs text-slate-400 mb-4">Enter registered email address</p>

                <form onSubmit={handleSubmitRegisterForm} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="merchant@kirana.in"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Select Role</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    >
                      <option value="borrower">Borrower (Kirana / Merchant)</option>
                      <option value="agent">Field Agent (DSA / BC)</option>
                      <option value="lender">Lender / Underwriter</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all"
                  >
                    Send OTP →
                  </button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleVerifyUserOtp} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-1">Enter Verification Code</h3>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono bg-slate-950 border border-slate-800 rounded-xl py-3 text-white"
                />
                {otpError && <p className="text-xs text-rose-400 font-medium">{otpError}</p>}
                <button
                  type="button"
                  onClick={() => setOtpCode('123456')}
                  className="text-xs text-emerald-400 underline block"
                >
                  Auto-fill Test OTP (123456)
                </button>
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  Verify & Login
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: DEDICATED ADMIN LOGIN WITH CONSTANT CREDENTIALS + OTP */}
      {authModal === 'admin_login' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setAuthModal(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {modalStep === 'credentials' ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">Admin Master Authentication</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">Enter constant Admin credentials to trigger security OTP</p>

                <form onSubmit={handleAdminCredentialsSubmit} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300 uppercase">Admin Email</label>
                      <button
                        type="button"
                        onClick={() => setAdminEmailInput(CONSTANT_ADMIN_EMAIL)}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        Fill ({CONSTANT_ADMIN_EMAIL})
                      </button>
                    </div>
                    <input
                      type="email"
                      required
                      value={adminEmailInput}
                      onChange={(e) => setAdminEmailInput(e.target.value)}
                      placeholder="admin@vikaspay.in"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300 uppercase">Admin Password</label>
                      <button
                        type="button"
                        onClick={() => setAdminPassInput(CONSTANT_ADMIN_PASS)}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        Fill ({CONSTANT_ADMIN_PASS})
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={adminPassInput}
                      onChange={(e) => setAdminPassInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>

                  {adminAuthError && <p className="text-xs text-rose-400 font-medium">{adminAuthError}</p>}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20"
                  >
                    Authenticate & Request OTP →
                  </button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleVerifyAdminOtp} className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Key className="w-5 h-5 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">Enter Admin Security OTP</h3>
                </div>
                <p className="text-xs text-slate-400">Sent to <span className="text-amber-300 font-mono">{CONSTANT_ADMIN_EMAIL}</span></p>

                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono bg-slate-950 border border-slate-800 rounded-xl py-3 text-white"
                />
                {otpError && <p className="text-xs text-rose-400 font-medium">{otpError}</p>}

                <button
                  type="button"
                  onClick={() => setOtpCode('123456')}
                  className="text-xs text-amber-400 underline block"
                >
                  Auto-fill Test OTP (123456)
                </button>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  Verify Admin OTP & Unlock Console
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* PERSISTENT REVIEWER FLOATING NAVIGATION BAR */}
      {/* ========================================================================================= */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-full p-2 shadow-2xl flex items-center gap-1 sm:gap-2 max-w-[95vw] overflow-x-auto">
        <button
          onClick={() => {
            setCurrentView('landing');
            showNotification('Switched to Landing Page');
          }}
          className={`px-3 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            currentView === 'landing'
              ? 'bg-slate-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Landing Page
        </button>

        <button
          onClick={() => handleReviewerQuickFill('borrower')}
          className={`px-3 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            currentView === 'dashboard' && activeRole === 'borrower'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Store className="w-3.5 h-3.5" /> Borrower (Kirana)
        </button>

        <button
          onClick={() => handleReviewerQuickFill('agent')}
          className={`px-3 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            currentView === 'dashboard' && activeRole === 'agent'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" /> Field Agent (DSA)
        </button>

        <button
          onClick={() => handleReviewerQuickFill('lender')}
          className={`px-3 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            currentView === 'dashboard' && activeRole === 'lender'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Lender Underwriter
        </button>

        <button
          onClick={() => handleReviewerQuickFill('admin')}
          className={`px-3 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            currentView === 'dashboard' && activeRole === 'admin'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Admin Console
        </button>
      </div>
    </div>
  );
}
