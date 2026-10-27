import React, { useState } from 'react';
import { Shield, FileText, RefreshCw } from 'lucide-react';

interface LegalModalProps {
  initialTab?: 'terms' | 'privacy' | 'refunds';
  onClose: () => void;
}

export function LegalModal({ initialTab = 'terms', onClose }: LegalModalProps) {
  const [tab, setTab] = useState<'terms' | 'privacy' | 'refunds'>(initialTab);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('terms')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${tab === 'terms' ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setTab('privacy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${tab === 'privacy' ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setTab('refunds')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${tab === 'refunds' ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              Refund Policy
            </button>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {tab === 'terms' && (
            <>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Terms of Service</h3>
              <p>Welcome to SwipeToHelp. By accessing or using our platform, you agree to abide by these Terms of Service. All donations and payments are routed directly to verified utility, medical, and educational billers.</p>
              <p>Users are strictly prohibited from submitting fraudulent bills or tampering with documentation. Accounts violating our terms will be permanently banned.</p>
            </>
          )}

          {tab === 'privacy' && (
            <>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Privacy Policy</h3>
              <p>Your privacy is paramount. SwipeToHelp uses Gemini AI to automatically scrub and redact all Personally Identifiable Information (PII) including account numbers, home addresses, and barcodes before public display.</p>
              <p>Original unredacted bills are encrypted using AES-256 and securely stored. We comply fully with GDPR data export and deletion requirements.</p>
            </>
          )}

          {tab === 'refunds' && (
            <>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Refund Policy</h3>
              <p>Because funds are paid directly to institutional billers on behalf of requesters, direct contributions are generally final once disbursed.</p>
              <p>In the event of a flagged bill or billing error, refunds can be requested within 14 days by contacting our support team with your transaction ID.</p>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-xs font-semibold shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  );
}
