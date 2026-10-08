import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">Authenticating VyapaarScore session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    if (requiredRole === 'admin') {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-500">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">403 Access Denied</h2>
              <p className="text-slate-400 text-sm mt-2">
                You are logged in as <strong className="text-cyan-400 capitalize">{user.role}</strong> ({user.email}). Platform <strong className="text-amber-400 capitalize">{requiredRole}</strong> privileges are required to view this area.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center">
              <button
                onClick={() => {
                  logout();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Log Out & Sign In as Admin</span>
              </button>
              <Link
                to={user.role === 'lender' ? '/lender' : user.role === 'admin' ? '/admin' : '/dashboard'}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                Return to My Portal
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === 'lender') {
      return <Navigate to="/lender" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
