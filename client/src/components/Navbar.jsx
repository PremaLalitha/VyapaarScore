import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, LogOut, Menu, X, UserPlus, LogIn, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLandingPage = ['/', '/landing'].includes(location.pathname);
  const isPublicPage = ['/', '/landing', '/login', '/signup', '/verify-otp', '/forgot-password'].includes(location.pathname);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (!isLandingPage) {
      navigate('/#' + id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getRoleLabel = (role) => {
    if (role === 'lender') return 'Lender';
    if (role === 'admin') return 'Admin';
    return 'Merchant';
  };

  const getRoleColor = (role) => {
    if (role === 'lender') return 'bg-amber-500/10 border-amber-500/30 text-amber-500 dark:text-amber-300';
    if (role === 'admin') return 'bg-sky-500/10 border-sky-500/30 text-sky-500 dark:text-sky-300';
    return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-300';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link
          to={user ? (user.role === 'admin' ? '/admin' : user.role === 'lender' ? '/lender' : '/dashboard') : '/'}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Vyapaar<span className="text-amber-500 dark:text-amber-400">Score</span>
            </span>
          </div>
        </Link>

        {/* Center Section Links (Landing Page Navigation) */}
        {isPublicPage && !user && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              About App
            </button>
            <button
              onClick={() => scrollToSection('who-can-use')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Who Can Use
            </button>
            <button
              onClick={() => scrollToSection('how-to-use')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              Contact Us
            </button>
          </nav>
        )}

        {/* Right Section: Action Buttons & Theme Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center shadow-sm"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Public Navigation Buttons: Log In & Sign Up */}
          {isPublicPage && !user && (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all border border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Log In</span>
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 via-sky-500 to-sky-600 hover:from-cyan-500 hover:to-sky-400 rounded-xl shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {/* Logged in User Bar */}
          {user && (
            <div className="flex items-center gap-3">
              {user.role === 'merchant' && (
                <Link
                  to="/lenders-marketplace"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all border border-emerald-400/30"
                >
                  <span>Apply For Loan</span>
                </Link>
              )}

              {user.role === 'admin' && (
                <div className="hidden lg:flex items-center gap-2 text-xs font-semibold">
                  <Link
                    to="/admin"
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      location.pathname === '/admin'
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    User Control
                  </Link>
                  <Link
                    to="/admin/merchants"
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      location.pathname === '/admin/merchants'
                        ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/30'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Merchants Directory
                  </Link>
                  <Link
                    to="/admin/lenders"
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      location.pathname === '/admin/lenders'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Lenders Directory
                  </Link>
                  <Link
                    to="/admin/flow"
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      location.pathname === '/admin/flow'
                        ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/30'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Admin Flow
                  </Link>
                </div>
              )}



              <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-slate-700 flex items-center justify-center text-white font-bold text-sm shadow">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-200 leading-tight">{user.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{user.businessName || getRoleLabel(user.role)}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          {isPublicPage && !user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}

        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && isPublicPage && !user && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => scrollToSection('about')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600"
          >
            About App
          </button>
          <button
            onClick={() => scrollToSection('who-can-use')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600"
          >
            Who Can Use
          </button>
          <button
            onClick={() => scrollToSection('how-to-use')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600"
          >
            Contact Us
          </button>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center font-semibold text-white bg-gradient-to-r from-cyan-600 via-sky-500 to-sky-600 rounded-xl shadow-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
