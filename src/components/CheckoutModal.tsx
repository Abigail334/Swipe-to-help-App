import React, { useState } from 'react';
import { Heart, X, Check, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { paymentService } from '../services/paymentService';

interface Bill {
  id: string;
  firstName: string;
  billerName: string;
  amount: number;
  raised: number;
  category: string;
}

interface CheckoutModalProps {
  bill: Bill;
  onClose: () => void;
  onSuccess: (amount: number, biller: string, recipient: string) => void;
}

export function CheckoutModal({ bill, onClose, onSuccess }: CheckoutModalProps) {
  const remaining = Math.max(0, bill.amount - bill.raised);
  const [payType, setPayType] = useState<'full' | 'part'>('full');
  const [customPartAmount, setCustomPartAmount] = useState(Math.min(25, remaining));
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountToPay = payType === 'full' ? remaining : customPartAmount;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amountToPay <= 0 || amountToPay > remaining) {
      setError('Please enter a valid payment amount.');
      return;
    }
    setError(null);
    setIsProcessing(true);

    try {
      await paymentService.processPayment({
        billId: bill.id,
        amount: amountToPay,
        paymentType: payType,
        billerName: bill.billerName,
        recipientFirstName: bill.firstName,
        donorName: donorName || 'Anonymous Donor',
        message,
      });

      setIsProcessing(false);
      onSuccess(amountToPay, bill.billerName, bill.firstName);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Secure Direct Bill Pay</h3>
            <p className="text-xs text-slate-400">Supporting {bill.firstName} · {bill.billerName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          
          {/* Payment Type Selector: Pay Full or Pay Part */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">Choose Contribution Option</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayType('full')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  payType === 'full' 
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 shadow-sm' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-sm">Pay Full Balance</div>
                <div className="text-xs opacity-80">${remaining.toFixed(2)} remaining</div>
              </button>

              <button
                type="button"
                onClick={() => setPayType('part')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  payType === 'part' 
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 shadow-sm' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-sm">Pay Part</div>
                <div className="text-xs opacity-80">Custom contribution</div>
              </button>
            </div>
          </div>

          {/* Custom Part Amount Input */}
          {payType === 'part' && (
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Custom Amount ($)</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[10, 25, 50, 100].map(val => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setCustomPartAmount(Math.min(val, remaining))}
                    className={`py-1.5 text-xs font-bold rounded-xl border ${
                      customPartAmount === val ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                max={remaining}
                value={customPartAmount}
                onChange={(e) => setCustomPartAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Your Name / Alias (Optional)</label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="e.g. Generous Neighbor"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Encouraging Message (Optional)</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a kind note..."
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-500 bg-rose-50 dark:bg-rose-950 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>Direct Biller Routing</span>
            </div>
            <p>Funds go directly to the verified utility or medical provider. Payments are simulated in this demo.</p>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white" />
                <span>Confirm Payment of ${amountToPay.toFixed(2)}</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
