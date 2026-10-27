import React, { useState } from 'react';
import { Heart, Award, Users, CheckCircle2, MessageSquare, Sparkles, Share2, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface ImpactWallProps {
  user: UserProfile | null;
  impactData: {
    totalRaised: number;
    totalFundedCount: number;
    totalBillsCount: number;
    contributions: any[];
  };
}

export function ImpactWall({ user, impactData }: ImpactWallProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `I've contributed $${user?.donatedTotal.toFixed(2) || '50.00'} to help pay essential bills directly on SwipeToHelp! Join me in empowering neighbors:`;
  const shareUrl = window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Donor Personal Impact Card */}
      {user && user.role === 'donor' && (
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-wider opacity-90">Donor Impact Summary</span>
              <h3 className="text-xl font-black">{user.displayName}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                aria-label="Share impact"
                className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/20">
            <div>
              <span className="text-xs opacity-80 block">Total Donated</span>
              <span className="text-2xl font-black">${user.donatedTotal.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-xs opacity-80 block">Bills Helped</span>
              <span className="text-2xl font-black">{user.billsHelpedCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Community Stats Hero */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
          <span className="text-[11px] text-slate-400 block mb-1">Total Community Impact</span>
          <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            ${(impactData.totalRaised + 3420).toFixed(0)}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
          <span className="text-[11px] text-slate-400 block mb-1">Bills Fully Funded</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {impactData.totalFundedCount + 48}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center shadow-sm">
          <span className="text-[11px] text-slate-400 block mb-1">Active Donors</span>
          <span className="text-xl sm:text-2xl font-black text-amber-500">1,284</span>
        </div>
      </div>

      {/* Recent Contributions & Thank-You Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-rose-500" /> Donor Thank-You Feed
        </h3>

        <div className="space-y-3">
          {[
            {
              id: 'm-1',
              donorName: 'David K.',
              amount: 75,
              biller: 'City Power & Light',
              recipient: 'Marcus',
              message: 'Happy to help keep the lights on! Stay strong.',
              time: '15 mins ago'
            },
            {
              id: 'm-2',
              donorName: 'Alex Morgan',
              amount: 145,
              biller: 'Metro Health Clinic',
              recipient: 'Sarah',
              message: 'Wishing your family health and peace.',
              time: '1 hour ago'
            },
            {
              id: 'm-3',
              donorName: 'Samantha W.',
              amount: 50,
              biller: 'State University Bookstore',
              recipient: 'David',
              message: 'Good luck with your nursing exams!',
              time: '3 hours ago'
            },
            ...impactData.contributions.map((c: any) => ({
              id: c.id,
              donorName: c.donorName,
              amount: c.amount,
              biller: c.billerName,
              recipient: c.recipientFirstName,
              message: c.message,
              time: 'Just now'
            }))
          ].map((item, idx) => (
            <div key={item.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold text-xs flex items-center justify-center">
                    {item.donorName.charAt(0)}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.donorName}</h4>
                    <p className="text-[10px] text-slate-400">Paid ${item.amount} for {item.recipient}'s {item.biller}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">{item.time}</span>
              </div>
              {item.message && (
                <p className="text-xs text-slate-600 dark:text-slate-300 italic pl-9">
                  "{item.message}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Share Your Impact</h3>
            <p className="text-xs text-slate-500">Inspire friends and neighbors to join the direct bill pay community!</p>

            <div className="space-y-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-800"
              >
                Share on X (Twitter)
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700"
              >
                Share on WhatsApp
              </a>
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-200"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Link Copied!' : 'Copy Share Link'}
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2 bg-transparent text-slate-400 text-xs font-medium hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
