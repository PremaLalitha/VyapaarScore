import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Receipt, 
  UserCog, 
  Building2, 
  ShieldAlert,
  FileCheck,
  GitBranch,
  Store,
  MessageSquare
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  let navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Loan Marketplace', path: '/lenders-marketplace', icon: Building2 },
    { name: 'Upload & Parse', path: '/upload', icon: UploadCloud },
    { name: 'Transactions Ledger', path: '/transactions', icon: Receipt },
    { name: 'Profile & Settings', path: '/profile', icon: UserCog },
  ];

  if (user?.role === 'lender') {
    navItems = [
      { name: 'Lender Dashboard', path: '/lender', icon: Building2 },
      { name: 'Applications & Messages', path: '/lender/messages', icon: MessageSquare },
      { name: 'Shared Reports', path: '/lender/reports', icon: FileCheck },
      { name: 'Profile & Settings', path: '/profile', icon: UserCog },
    ];
  } else if (user?.role === 'admin') {
    navItems = [
      { name: 'Admin Control Panel', path: '/admin', icon: ShieldAlert },
      { name: 'Merchants Directory', path: '/admin/merchants', icon: Store },
      { name: 'Lenders Directory', path: '/admin/lenders', icon: Building2 },
      { name: 'Full Flow & Architecture', path: '/admin/flow', icon: GitBranch },
      { name: 'All Transactions', path: '/transactions', icon: Receipt },
      { name: 'Profile & Settings', path: '/profile', icon: UserCog },
    ];
  }

  return (
    <aside className="w-full md:w-64 bg-white/60 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800/80 p-4 flex flex-col justify-between shrink-0 transition-colors">
      <div className="space-y-6">
        <div>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
            {user?.role === 'admin' ? 'Admin Controls' : user?.role === 'lender' ? 'Lender Controls' : 'Merchant Portal'}
          </div>
          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-cyan-500/10 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="text-[11px] text-slate-500 dark:text-slate-500">
          VyapaarScore &copy; 2026 AI Fintech
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
