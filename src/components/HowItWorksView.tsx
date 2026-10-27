import React from 'react';
import { Upload, ShieldCheck, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HowItWorksProps {
  onClose: () => void;
}

export function HowItWorksView({ onClose }: HowItWorksProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">How SwipeToHelp Works</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-start p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0 font-bold">1</div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Upload Your Bill</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Take a photo or upload a PDF of an essential utility, medical, rent, or school bill.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0 font-bold">2</div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Privacy & Anti-Fraud Scrub</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Gemini AI automatically detects and hides account numbers, full addresses, and barcodes, encrypting originals securely.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0 font-bold">3</div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Swipe Right to Pay</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Donors review bills in the Tinder-style swipe feed and pay in full or in part via OPay Connect directly to billers.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl text-xs font-semibold shadow-md"
        >
          Got It, Let's Go
        </button>
      </div>
    </div>
  );
}
