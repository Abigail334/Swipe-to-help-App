import React from 'react';
import { FileText, ShieldCheck, CheckCircle2, Clock, Plus } from 'lucide-react';

interface Bill {
  id: string;
  firstName: string;
  billerName: string;
  amount: number;
  raised: number;
  dueDate: string;
  category: string;
  status: string;
  isVerified: boolean;
}

interface RequesterDashboardProps {
  bills: Bill[];
  userUploadedIds: string[];
  onNewBill: () => void;
}

export function RequesterDashboard({ bills, userUploadedIds, onNewBill }: RequesterDashboardProps) {
  const userBills = bills.filter(b => userUploadedIds.includes(b.id));

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Requester Dashboard</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track your uploaded bills and direct payout progress.</p>
          </div>
          <button
            onClick={onNewBill}
            className="px-3.5 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Bill
          </button>
        </div>

        {userBills.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-4">
            <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Bills Uploaded Yet</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">Upload a photo or PDF of an essential bill to receive community support with AI privacy protection.</p>
            </div>
            <button
              onClick={onNewBill}
              className="px-4 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-semibold"
            >
              Upload a Bill
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userBills.map(bill => (
              <div key={bill.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{bill.billerName}</h4>
                      {bill.isVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">Due {bill.dueDate} · {bill.category}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    bill.status === 'funded' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {bill.status === 'funded' ? 'Fully Funded' : 'Active in Feed'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Raised: ${bill.raised.toFixed(2)}</span>
                    <span className="text-slate-700 dark:text-slate-300">Goal: ${bill.amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (bill.raised / bill.amount) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
