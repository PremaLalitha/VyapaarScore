import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Trash2, 
  Check
} from 'lucide-react';

const Upload = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState('image');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [smsText, setSmsText] = useState('');

  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [error, setError] = useState('');

  const [editData, setEditData] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    counterparty: '',
    type: 'credit',
    category: 'Sales',
  });
  const [saving, setSaving] = useState(false);

  const sampleSMSList = [
    'Received Rs.1,500.00 from Ramesh Store via UPI (Ref No 40982312) on 04-Sep-2026.',
    'Paid Rs 450.00 to Kumar Kirana & Provisions for supplies on 03-Sep-2026. A/c debited.',
    'INR 2,800.00 credited to a/c XXXXX1234 by PhonePe Merchant Order #9921.',
  ];

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const isImg = file.type.match(/image.*/);
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      if (!isImg && !isPdf) {
        setError('Please upload a valid image file (PNG, JPG, WEBP) or PDF bank statement document.');
        return;
      }
      setSelectedFile(file);
      if (isImg) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview('pdf');
      }
      setError('');
    }
  };

  const handleParse = async () => {
    setError('');
    if (tab === 'image' && !selectedFile) {
      setError('Please select or drag an image screenshot or PDF document first.');
      return;
    }
    if (tab === 'sms' && !smsText.trim()) {
      setError('Please paste bank SMS text first.');
      return;
    }

    try {
      setParsing(true);
      setParseResult(null);

      const formData = new FormData();
      if (tab === 'image') {
        formData.append('document', selectedFile);
      } else {
        formData.append('smsText', smsText);
      }

      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': tab === 'image' ? 'multipart/form-data' : 'application/json',
        },
      });

      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setParseResult(data);
        setEditData({
          amount: data.amount || 0,
          date: data.date || new Date().toISOString().split('T')[0],
          counterparty: data.counterparty || 'Unknown Merchant',
          type: data.type || 'credit',
          category: data.category || 'Sales',
        });
      }
    } catch (err) {
      console.error('OCR Parsing Error:', err);
      setError(err.response?.data?.message || 'Document parsing failed. Please check your image clarity or try SMS text.');
    } finally {
      setParsing(false);
    }
  };

  const handleConfirmSave = async () => {
    try {
      setSaving(true);
      setError('');

      const payload = {
        transactions: [{
          ...editData,
          source: tab === 'image' ? (selectedFile?.name?.endsWith('.pdf') ? 'pdf_document' : 'ocr_image') : 'sms_text',
          rawText: parseResult?.rawText || smsText,
          fileName: selectedFile?.name || '',
        }]
      };

      const res = await axios.post('/api/upload/confirm', payload);
      if (res.data.success) {
        navigate('/transactions');
      }
    } catch (err) {
      console.error('Confirm Save Error:', err);
      setError(err.response?.data?.message || 'Failed to save transaction to ledger.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>AI Document & PDF Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Upload Payment Records & PDF Statements</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Upload PhonePe/GPay/Paytm screenshots, PDF bank statements, e-invoices, or paste bank SMS text for instant AI extraction.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-fit">
          <button
            onClick={() => { setTab('image'); setError(''); setParseResult(null); }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'image'
                ? 'bg-gradient-to-r from-cyan-600 to-sky-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>UPI Screenshot / PDF Statement</span>
          </button>
          <button
            onClick={() => { setTab('sms'); setError(''); setParseResult(null); }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'sms'
                ? 'bg-gradient-to-r from-cyan-600 to-sky-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Bank SMS Text</span>
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: IMAGE / PDF UPLOAD */}
        {tab === 'image' && (
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                imagePreview
                  ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20'
                  : 'border-slate-300 dark:border-slate-800 hover:border-cyan-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
            >
              {imagePreview ? (
                <div className="space-y-4">
                  {imagePreview === 'pdf' ? (
                    <div className="p-6 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-500/30 max-w-sm mx-auto flex flex-col items-center">
                      <FileText className="w-12 h-12 text-cyan-600 dark:text-cyan-400 mb-2" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">PDF Document Attached</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{selectedFile?.name}</span>
                    </div>
                  ) : (
                    <img
                      src={imagePreview}
                      alt="Uploaded UPI receipt preview"
                      className="max-h-64 mx-auto rounded-xl border border-slate-300 dark:border-slate-700 shadow-md object-contain"
                    />
                  )}
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{selectedFile?.name}</span>
                    <button
                      onClick={() => { setSelectedFile(null); setImagePreview(null); setParseResult(null); }}
                      className="p-1 text-slate-400 hover:text-red-500"
                      title="Remove document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-sm">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      Drag & drop your UPI screenshot or PDF bank statement here
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Supports PhonePe, Google Pay, Paytm screenshots & PDF bank statements (PNG, JPG, WEBP, PDF up to 10MB)
                    </p>
                  </div>

                  <label className="inline-block px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 cursor-pointer transition-colors">
                    Browse File (Image or PDF)
                    <input
                      type="file"
                      accept="image/*,.pdf,application/pdf"
                      onChange={handleFileDrop}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <button
              onClick={handleParse}
              disabled={parsing || !selectedFile}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-sky-600 hover:from-cyan-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {parsing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Running AI OCR & PDF Extraction...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Extract Payment & Bank Details via AI</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 2: SMS TEXT PARSER */}
        {tab === 'sms' && (
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Paste Bank SMS Alert Text
              </label>
              <textarea
                rows={4}
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                placeholder="e.g. Received Rs.1,500.00 from Ramesh Store via UPI (Ref No 40982312) on 04-Sep-2026."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Quick Preset Samples */}
            <div>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold block mb-2">Try Sample Bank SMS Presets:</span>
              <div className="flex flex-wrap gap-2">
                {sampleSMSList.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSmsText(sample)}
                    className="text-xs bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-left transition-colors"
                  >
                    Sample #{i + 1}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleParse}
              disabled={parsing || !smsText.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-sky-600 hover:from-cyan-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {parsing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Parsing SMS Text...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Parse Bank SMS Text</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* PARSED RESULT & EDIT SECTION */}
        {parseResult && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 rounded-2xl p-6 shadow-lg dark:shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Extracted Transaction Details</h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
                Review & Edit
              </span>
            </div>

            {/* Extracted Raw Text */}
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
              <span className="text-slate-500 font-bold block uppercase tracking-wider">Raw Extracted Text:</span>
              <p className="text-slate-800 dark:text-slate-300 break-words">{parseResult.rawText}</p>
            </div>

            {/* Editable Fields Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold text-base focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Type (Direction)
                </label>
                <select
                  value={editData.type}
                  onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="credit">Credit (Sales Inflow +)</option>
                  <option value="debit">Debit (Expense Outflow -)</option>
                </select>
              </div>

              {/* Counterparty */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Counterparty / Merchant
                </label>
                <input
                  type="text"
                  value={editData.counterparty}
                  onChange={(e) => setEditData({ ...editData, counterparty: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Sales">Sales (Customer Inflow)</option>
                  <option value="Supplies">Supplies & Wholesale</option>
                  <option value="Utilities">Utilities & Bills</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Transaction Date
                </label>
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

            </div>

            {/* Confirm Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setParseResult(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving to Ledger...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Looks Correct - Save to Ledger</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </Layout>
  );
};

export default Upload;
