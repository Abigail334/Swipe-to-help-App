import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, XCircle, Lock, Check } from 'lucide-react';
import { Bill, UserProfile } from '../types';

interface AdminDashboardProps {
  currentUser: UserProfile | null;
}

export function AdminDashboard({ currentUser }: AdminDashboardProps) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(true);

  useEffect(() => {
    fetchAdminBills();
  }, []);

  const fetchAdminBills = async () => {
    try {
      const res = await fetch('/api/bills');
      const data = await res.json();
      setBills(data);
    } catch (e) {
      console.error('Failed to fetch bills for admin', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (billId: string, action: 'approve' | 'reject') => {
    try {
      setBills(prev => prev.map(b => b.id === billId ? { ...b, status: action === 'approve' ? 'active' : 'flagged', isVerified: action === 'approve' } : b));
    } catch (e) {
      console.error('Admin action failed', e);
    }
  };

  if (!isAdminMode) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <Lock className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Restricted Admin Access</h3>
        <p className="text-xs text-slate-400">This area requires administrator credentials.</p>
        <button
          onClick={() => setIsAdminMode(true)}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-semibold"
        >
          Enable Demo Admin Role
        </button>
      </div>
    );
  }

  const flaggedBills = bills.filter(b => b.status === 'flagged' || b.fraudRiskScore > 2);
  const totalRaised = bills.reduce((acc, b) => acc + b.raised, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" /> Admin Moderation Dashboard
            </h2>
            <p className="text-xs text-slate-400">Review flagged bills, monitor fraud scores, and manage platform safety.</p>
          </div>
          <button
            onClick={() => setIsAdminMode(false)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold"
          >
            Exit Admin
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 block">Flagged / Suspicious</span>
            <span className="text-xl font-black text-rose-600">{flaggedBills.length}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 block">Total Platform Volume</span>
            <span className="text-xl font-black text-emerald-600">${totalRaised.toFixed(2)}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 block">Active Bills</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-200">{bills.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Review Flagged & Reported Bills</h3>

        {loading ? (
          <p className="text-xs text-slate-400">Loading bills...</p>
        ) : flaggedBills.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-medium">No flagged bills requiring review. Platform is secure!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bills.map(bill => (
              <div key={bill.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{bill.billerName}</h4>
                    <span className="text-xs font-mono text-rose-500 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                      Fraud Risk: {bill.fraudRiskScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Uploaded by {bill.firstName} · ${bill.amount} · {bill.category}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(bill.id, 'approve')}
                    className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(bill.id, 'reject')}
                    className="px-3 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
