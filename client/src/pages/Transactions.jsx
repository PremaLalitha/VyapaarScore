import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { 
  Search, 
  Receipt, 
  ArrowUpRight, 
  ArrowDownRight, 
  Trash2, 
  UploadCloud, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 8,
        search,
        category,
        type,
      };

      const res = await axios.get('/api/transactions', { params });
      if (res.data.success) {
        setTransactions(res.data.transactions || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, category, type]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this transaction entry from your ledger?')) return;
    try {
      const res = await axios.delete(`/api/transactions/${id}`);
      if (res.data.success) {
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Digital Payment Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Parsed Transactions</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Extracted sales & expense history verified from UPI screenshots and SMS alerts.
            </p>
          </div>

          <Link
            to="/upload"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Payment</span>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm dark:shadow-xl">
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search counterparty or text..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
            />
          </form>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">Category:</span>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Categories</option>
                <option value="Sales">Sales</option>
                <option value="Supplies">Supplies</option>
                <option value="Utilities">Utilities</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">Type:</span>
              <select
                value={type}
                onChange={(e) => { setType(e.target.value); setPage(1); }}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Types</option>
                <option value="credit">Credit (+ Inflow)</option>
                <option value="debit">Debit (- Outflow)</option>
              </select>
            </div>

          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Loading ledger records...</p>
            </div>
          ) : transactions.length === 0 ? (
            /* EMPTY STATE */
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Receipt className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No transactions found</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
                {search || category !== 'All' || type !== 'All'
                  ? 'No records match your active search filters. Try resetting your search criteria.'
                  : 'You haven\'t uploaded any payment receipts yet. Upload your UPI screenshots or SMS to populate your ledger.'}
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Payment Screenshot</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Counterparty / Merchant</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                    <th className="py-3.5 px-4 text-center">Source</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Direction Icon */}
                      <td className="py-3.5 px-4">
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          tx.type === 'credit'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/30'
                        }`}>
                          {tx.type === 'credit' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          <span>{tx.type}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Counterparty */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {tx.counterparty}
                      </td>

                      {/* Category Tag */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                          {tx.category}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className={`py-3.5 px-4 text-right font-extrabold text-sm whitespace-nowrap ${
                        tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                          {tx.source === 'ocr_image' ? 'OCR Image' : 'SMS Text'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(tx._id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-950 rounded-lg transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION BAR */}
          {transactions.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div>
                Showing page <strong className="text-slate-900 dark:text-white">{page}</strong> of <strong className="text-slate-900 dark:text-white">{totalPages}</strong> ({total} records total)
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 font-semibold text-slate-800 dark:text-slate-200">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </Layout>
  );
};

export default Transactions;
