import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  ArrowRight,
  UploadCloud,
  Cpu,
  Award,
  CheckCircle2,
  ShieldCheck,
  Store,
  Bike,
  Briefcase,
  Building2,
  Truck,
  FileText,
  Lock,
  PieChart,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Check,
  Zap,
  TrendingUp,
  UserPlus,
  LogIn,
  Layers,
  Sparkles,
  HelpCircle,
  BarChart3,
  ShieldAlert
} from 'lucide-react';

const Landing = () => {
  // State for Contact Form
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Merchant',
    subject: '',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setContactSubmitted(true);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        category: 'Merchant',
        subject: '',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 selection:bg-cyan-500 selection:text-white transition-colors">
      
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-amber-500/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.15]">
            Turn Your <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-amber-500 dark:from-cyan-400 dark:via-sky-300 dark:to-amber-400 bg-clip-text text-transparent">Digital Transactions</span> Into an Official Credit Rating
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            VyapaarScore helps kirana store owners, street vendors, micro-entrepreneurs, and small businesses unlock formal bank credit using AI-powered OCR parsing of PhonePe, GPay, Paytm, bank statements, and invoices.
          </p>

          {/* Primary CTA Buttons (ONLY Log In and Create Account) */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/signup"
              className="w-full sm:w-auto flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-sky-600 hover:from-cyan-500 hover:to-sky-400 text-white font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 group"
            >
              <UserPlus className="w-5 h-5" />
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto flex-1 px-8 py-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-base border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>Log In</span>
            </Link>
          </div>

          {/* Quick Highlights */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-slate-600 dark:text-slate-400 text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero Collateral Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Instant AI Receipt OCR Parsing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Data Security & Privacy</span>
            </div>
          </div>

        </div>
      </section>

      {/* PLATFORM PILLARS STRIP */}
      <section className="bg-slate-100/90 dark:bg-slate-900/60 py-10 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">Smart OCR Extraction</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Parses PhonePe, GPay, Paytm & Bank receipts</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                <PieChart className="w-5 h-5" />
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">300 – 900 Score Rating</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculated from actual business cash flows</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">Mandatory 2FA OTP</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Secure email OTP verification for all users</div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">PDF Scorecard Export</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Download official credit report summary</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: ABOUT THE APPLICATION */}
      <section id="about" className="py-24 relative bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              About VyapaarScore
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
              Bridging the gap between unbanked small merchants and formal financial institutions through transparent, explainable alternative credit scoring.
            </p>
          </div>

          {/* About Main Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Box: The Problem & Solution */}
            <div className="space-y-6">
              <div className="glass-card p-8 rounded-2xl border-l-4 border-l-cyan-500">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  <span>The MSME Credit Problem</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Over 60 million micro and small business owners in India generate consistent daily revenues through UPI QR payments (GPay, PhonePe, Paytm), yet they are routinely rejected by traditional banks due to a lack of formal CIBIL scores, collateral, or audited financial statements.
                </p>
              </div>

              <div className="glass-card p-8 rounded-2xl border-l-4 border-l-emerald-500">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  <span>The VyapaarScore AI Solution</span>
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  VyapaarScore extracts and evaluates real-time cash flow metrics directly from payment screenshots, bank SMS alerts, and GST filings. Our multi-factor AI scoring algorithm computes a trustworthy 300 to 900 credit rating that reflects true business health and repayment ability.
                </p>
              </div>
            </div>

            {/* Right Box: Key Capabilities List */}
            <div className="glass-panel p-8 rounded-2xl space-y-6">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">
                Core Capabilities & Architecture
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 mt-1">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Optical Character Recognition (OCR)</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    Powered by Tesseract OCR, automatically extracting transaction amounts, dates, and sender metadata from raw app screenshots.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-1">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Cash Flow Velocity Engine</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    Analyzes sales consistency, customer retention rates, average order values, and revenue growth over 30 to 180 days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Automated Anomaly & Fraud Shield</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    Detects duplicate transaction submissions, image editing artifacts, and unnatural payment velocity spikes.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: WHO ALL CAN USE THIS APPLICATION */}
      <section id="who-can-use" className="py-24 bg-slate-100/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Who Can Use VyapaarScore?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg">
              Designed specifically for underserved business ecosystems, individual merchants, micro-lenders, and suppliers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Audience 1: Kirana Store Owners */}
            <div className="glass-card p-8 rounded-2xl relative group hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6 shadow-sm">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                Kirana & Retail Store Owners
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Local grocery stores, medical shops, and retail outlets processing daily customer payments through GPay, Paytm, or BharatPe QR stands.
              </p>
              <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Working Capital & Inventory Credit Lines</span>
              </div>
            </div>

            {/* Audience 2: Street Vendors */}
            <div className="glass-card p-8 rounded-2xl relative group hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6 shadow-sm">
                <Bike className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                Street Vendors & Micro-Merchants
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Food stall operators, fruit vendors, and mobile repair technicians earning cash and small UPI payments every day without bank credit histories.
              </p>
              <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Micro Micro-Loans (₹10k - ₹1 Lakh)</span>
              </div>
            </div>

            {/* Audience 3: Freelancers & Home Businesses */}
            <div className="glass-card p-8 rounded-2xl relative group hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 shadow-sm">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                Freelancers & Home Entrepreneurs
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Boutique owners, home bakers, gig workers, and digital creators looking to formalize their digital income streams into verified financial reports.
              </p>
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Verified Income Certificate & Credit Report</span>
              </div>
            </div>

            {/* Audience 4: NBFCs & Lenders */}
            <div className="glass-card p-8 rounded-2xl relative group hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 shadow-sm">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                NBFCs, Banks & Fintech Lenders
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Financial institutions seeking to underwrite new thin-file borrowers with zero collateral using reliable AI cash flow analytics.
              </p>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Instant Risk Underwriting & API Export</span>
              </div>
            </div>

            {/* Audience 5: B2B Wholesalers & Distributors */}
            <div className="glass-card p-8 rounded-2xl relative group hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950 border border-purple-300 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 shadow-sm">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                Wholesalers & Distributors
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Supply chain partners granting buy-now-pay-later (BNPL) inventory credit terms to retail buyers based on verified payment reliability.
              </p>
              <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Trade Credit Assessment</span>
              </div>
            </div>

            {/* Audience 6: Self-Employed Professionals */}
            <div className="glass-card p-8 rounded-2xl relative group hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                Self-Employed Professionals
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Consultants, technicians, and local service providers wanting to track financial health and build long-term credit worthiness.
              </p>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Financial Health Tracking</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: HOW TO USE THIS APPLICATION */}
      <section id="how-to-use" className="py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              How to Use VyapaarScore
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg">
              Get your official credit score in 4 quick and transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="glass-card p-8 rounded-2xl relative flex flex-col justify-between hover:border-cyan-500 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-cyan-500/30">
                  01
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Create Your Account
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Sign up with your mobile number and email. Select your business type (Merchant, Vendor, or Lender) and complete quick OTP verification.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <span>Takes less than 1 minute</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-8 rounded-2xl relative flex flex-col justify-between hover:border-sky-500 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-sky-500/30">
                  02
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Upload Payment Data
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Drag and drop screenshots of your GPay, PhonePe, or Paytm payment histories, bank PDFs, or GST sales receipts directly into our secure portal.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                <span>Drag & Drop or Camera capture</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-8 rounded-2xl relative flex flex-col justify-between hover:border-amber-500 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-amber-500/30">
                  03
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  AI OCR & Scoring Engine
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Tesseract OCR extracts transactions, validates dates and amounts, detects anomalies, and calculates monthly revenue stability.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <span>Automated in seconds</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-card p-8 rounded-2xl relative flex flex-col justify-between hover:border-emerald-500 transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-500/30">
                  04
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  Get & Share Score Report
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Receive your 300-900 VyapaarScore rating, export a verified PDF credit summary, and apply directly for loans with participating lenders.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>Download verified PDF</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: KEY FEATURES & CAPABILITIES */}
      <section id="features" className="py-24 bg-slate-100/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Key Features & Capabilities
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg">
              Core technology, document parsing accuracy, data privacy, and credit score generation mechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="glass-panel p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Smart Multi-Format Ingestion</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Upload PNG, JPG, PDF screenshots of BHIM UPI, Paytm, GPay, PhonePe, bank statements, or GST sales receipts effortlessly.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Dynamic Risk Rating Matrix</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Evaluates revenue volatility, average daily balance, repeat customer ratio, and order frequency to determine credit grade (Low, Medium, High Risk).
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Bank-Grade Encryption</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                All financial documents are protected using 256-bit SSL encryption. We adhere strictly to data privacy standards and never sell user data.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Downloadable PDF Scorecard</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Generate an official, tamper-proof PDF credit evaluation summary complete with QR verification hash ready to present to loan officers.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Explainable AI Insights</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Get clear, actionable recommendations on how to improve your credit score over time (e.g., maintaining a minimum daily UPI balance).
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Lender Integration Portal</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                NBFCs and digital micro-lenders access verified borrower risk metrics with instant automated loan decision capabilities.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: CONTACT PAGE / SECTION */}
      <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Contact Us
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg">
              Have questions about VyapaarScore, lender partnerships, or technical support? Our team is here to help!
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            
            {/* Interactive Contact Form */}
            <div className="glass-panel p-8 rounded-2xl shadow-xl relative">
              
              {contactSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Message Sent Successfully!</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto">
                    Thank you for reaching out to VyapaarScore. Our support team will review your message and reply back within 24 hours.
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    Send Us a Message
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="name@business.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        I am a...
                      </label>
                      <select
                        value={contactForm.category}
                        onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                      >
                        <option value="Merchant">Merchant / Kirana Owner</option>
                        <option value="Vendor">Street Vendor / Freelancer</option>
                        <option value="Lender">NBFC / Bank Lender</option>
                        <option value="Distributor">Wholesaler / Supplier</option>
                        <option value="General">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-sky-600 hover:from-cyan-500 hover:to-sky-400 text-white font-bold text-base shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/90 py-12 text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            
            {/* Col 1: Brand */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Vyapaar<span className="text-amber-500 dark:text-amber-400">Score</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Empowering India's micro-enterprises with AI-driven alternative credit scoring using transaction history & OCR document analysis.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <div className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email 2FA OTP Verified
                </div>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><a href="#about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">About Application</a></li>
                <li><a href="#who-can-use" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Who Can Use</a></li>
                <li><a href="#how-to-use" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">How It Works</a></li>
                <li><a href="#features" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Key Features & Capabilities</a></li>
                <li><a href="#contact" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Col 3: Account Portal */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Account Portal
              </h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><Link to="/login" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Log In to Account</Link></li>
                <li><Link to="/signup" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Sign Up for New Account</Link></li>
                <li><Link to="/forgot-password" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Reset Password</Link></li>
                <li><Link to="/verify-otp" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Verify Email OTP</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-xs text-slate-500">
              &copy; 2026 VyapaarScore Inc. All rights reserved. AI-Driven Credit Scoring Platform for MSMEs.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <span className="hover:text-cyan-600 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-cyan-600 cursor-pointer">Terms of Service</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Landing;
