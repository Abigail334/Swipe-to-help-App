import React, { useState } from 'react';
import { Mail, Shield, Trash2, Download, Check } from 'lucide-react';

interface SupportModalProps {
  onClose: () => void;
}

export function SupportModal({ onClose }: SupportModalProps) {
  const [tab, setTab] = useState<'support' | 'gdpr'>('support');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      setSubmitted(true);
    } catch (e) {
      console.error('Support ticket failed', e);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch('/api/user/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user_demo_123' })
      });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'swipetohelp_gdpr_data_export.json';
      a.click();
      setExportSuccess(true);
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to permanently delete your account and associated personal data?')) {
      try {
        await fetch('/api/user/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'user_demo_123' })
        });
        alert('Account and data successfully purged.');
        onClose();
      } catch (e) {
        console.error('Delete failed', e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('support')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${tab === 'support' ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              Contact Support
            </button>
            <button
              onClick={() => setTab('gdpr')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${tab === 'gdpr' ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              GDPR & Privacy
            </button>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            ✕
          </button>
        </div>

        {tab === 'support' ? (
          submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Message Received</h4>
              <p className="text-xs text-slate-400">Our support team will respond to your email within 24 hours.</p>
              <button onClick={onClose} className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-semibold">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSupportSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Message / Issue</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-rose-600 transition-colors"
              >
                Send Support Request
              </button>
            </form>
          )
        ) : (
          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">GDPR Data Rights</h4>
            <p>You have full control over your personal data stored on SwipeToHelp.</p>
            
            <button
              onClick={handleExportData}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-200"
            >
              <Download className="w-4 h-4" /> Export My Data (JSON)
            </button>
            {exportSuccess && <p className="text-emerald-500 text-center">Data export downloaded successfully!</p>}

            <button
              onClick={handleDeleteAccount}
              className="w-full py-2.5 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-rose-100"
            >
              <Trash2 className="w-4 h-4" /> Permanently Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
