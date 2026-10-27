import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  X, 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Filter, 
  Award, 
  FileText, 
  Camera, 
  Moon, 
  Sun, 
  RotateCcw,
  Check,
  AlertTriangle,
  Flag,
  ShieldAlert,
  HelpCircle,
  LifeBuoy,
  Home,
  Activity,
  Zap,
  ShoppingCart,
  BookOpen,
  Folder
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Onboarding } from './components/Onboarding';
import { CheckoutModal } from './components/CheckoutModal';
import { ImpactWall } from './components/ImpactWall';
import { RequesterDashboard } from './components/RequesterDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HowItWorksView } from './components/HowItWorksView';
import { LegalModal } from './components/LegalModal';
import { CookieConsent } from './components/CookieConsent';
import { SupportModal } from './components/SupportModal';
import { authService } from './services/authService';
import { Bill, UserProfile } from './types';
import { validateFileType } from './utils/validation';

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

const categoryConfig: Record<string, { color: string; bgGradient: string; icon: any }> = {
  rent: { color: 'text-violet-500', bgGradient: 'from-violet-500 to-purple-600', icon: Home },
  medical: { color: 'text-rose-500', bgGradient: 'from-rose-500 to-pink-600', icon: Activity },
  utilities: { color: 'text-amber-500', bgGradient: 'from-amber-400 to-yellow-500', icon: Zap },
  groceries: { color: 'text-teal-500', bgGradient: 'from-teal-400 to-emerald-500', icon: ShoppingCart },
  education: { color: 'text-blue-500', bgGradient: 'from-blue-500 to-indigo-600', icon: BookOpen },
  other: { color: 'text-orange-500', bgGradient: 'from-orange-400 to-amber-600', icon: Folder },
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTab, setCurrentTab] = useState<'feed' | 'upload' | 'impact' | 'mybills' | 'admin'>('feed');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const [bills, setBills] = useState<Bill[]>([]);
  const [impactData, setImpactData] = useState<{ totalRaised: number; totalFundedCount: number; totalBillsCount: number; contributions: any[] }>({ totalRaised: 0, totalFundedCount: 0, totalBillsCount: 0, contributions: [] });
  const [loading, setLoading] = useState(true);

  // Modals
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'terms' | 'privacy' | 'refunds' | null>(null);
  const [showSupport, setShowSupport] = useState(false);

  // Swipe Feed State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAmountRange, setSelectedAmountRange] = useState<string>('all');
  const [checkoutBill, setCheckoutBill] = useState<Bill | null>(null);
  const [successCelebration, setSuccessCelebration] = useState<{ amount: number; biller: string; recipient: string } | null>(null);
  const [reportModalBill, setReportModalBill] = useState<Bill | null>(null);
  const [reportReason, setReportReason] = useState('Suspicious bill details');

  // Motion drag value for swipe tint stamps
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const payOpacity = useTransform(x, [20, 150], [0, 1]);
  const skipOpacity = useTransform(x, [-150, -20], [1, 0]);

  // Upload & AI Extraction State
  const [uploadStep, setUploadStep] = useState<'select' | 'analyzing' | 'review'>('select');
  const [extractedData, setExtractedData] = useState<{
    billerName: string;
    amountDue: number;
    dueDate: string;
    category: 'utilities' | 'medical' | 'rent' | 'education' | 'emergency' | 'other';
    suggestedStory: string;
    piiDetected: string[];
    fraudRiskScore: number;
    isVerified: boolean;
  } | null>(null);
  const [customFirstName, setCustomFirstName] = useState('');
  const [customStory, setCustomStory] = useState('');
  const [isSubmittingBill, setIsSubmittingBill] = useState(false);
  const [userUploadedIds, setUserUploadedIds] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const seenOnboarding = localStorage.getItem('swipetohelp_onboarded');
    if (!seenOnboarding) {
      setShowOnboarding(true);
    }
    setUser(authService.getCurrentUser());
    fetchBills();
    fetchImpact();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch('/api/bills');
      const data = await res.json();
      setBills(data);
    } catch (e) {
      console.error('Failed to fetch bills', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchImpact = async () => {
    try {
      const res = await fetch('/api/impact');
      const data = await res.json();
      setImpactData(data);
    } catch (e) {
      console.error('Failed to fetch impact', e);
    }
  };

  const filteredBills = bills.filter(bill => {
    if (bill.status === 'funded' || bill.status === 'flagged') return false;
    if (selectedCategory !== 'all' && bill.category !== selectedCategory) return false;
    if (selectedAmountRange === 'under50' && bill.amount >= 50) return false;
    if (selectedAmountRange === '50to200' && (bill.amount < 50 || bill.amount > 200)) return false;
    if (selectedAmountRange === 'over200' && bill.amount <= 200) return false;
    return true;
  });

  const activeBill = filteredBills[currentIndex % Math.max(1, filteredBills.length)];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!activeBill) return;
    if (direction === 'right') {
      setCheckoutBill(activeBill);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePaymentSuccess = (amount: number, biller: string, recipient: string) => {
    setSuccessCelebration({ amount, biller, recipient });
    setCheckoutBill(null);
    fetchBills();
    fetchImpact();
    setCurrentIndex(prev => prev + 1);
    if (user) {
      user.donatedTotal += amount;
      user.billsHelpedCount += 1;
    }
  };

  const handleReportBill = async () => {
    if (!reportModalBill) return;
    try {
      await fetch(`/api/bills/${reportModalBill.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason })
      });
      setReportModalBill(null);
      fetchBills();
      alert('Bill reported successfully. Thank you for keeping SwipeToHelp safe!');
    } catch (e) {
      console.error('Failed to report bill', e);
    }
  };

  const handleSimulateUpload = async (sampleType: 'medical' | 'utilities' | 'rent') => {
    setUploadError(null);
    setUploadStep('analyzing');

    const sampleTexts = {
      medical: 'PACIFIC HILLS MEDICAL CENTER\nPatient: Johnathan Doe SSN: ***-**-1234\nAccount #: PHM-99482-X\nDate: Oct 20, 2026\nDescription: Emergency Room Co-pay & Lab Work\nAmount Due: $145.00\nDue Date: 2026-11-20\nAddress: 742 Evergreen Terrace, Springfield',
      utilities: 'METRO POWER & LIGHT CO.\nCustomer: Mary Smith\nAccount: 4892-0019-883\nService Address: 124 Grand Ave, Apt 4B\nStatement Date: Oct 22, 2026\nTotal Amount Due: $210.50\nDue Date: 2026-11-05\nBarcode: ||||| | |||| |||||| |||',
      rent: 'SUNSET APARTMENTS LLC\nTenant: Robert Johnson\nUnit 302, 888 Ocean Drive\nInvoice #: RENT-2026-NOV\nDue Date: 2026-11-01\nBalance Due: $350.00 (Partial Assistance Requested)',
    };

    try {
      const res = await fetch('/api/extract-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textDescription: sampleTexts[sampleType], mimeType: 'image/jpeg' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Extraction failed');
      setExtractedData(data);
      setCustomStory(data.suggestedStory || '');
      setCustomFirstName(user?.displayName.split(' ')[0] || 'A friend');
      setUploadStep('review');
    } catch (e: any) {
      console.error('Extraction error', e);
      setUploadError(e.message || 'Failed to extract bill');
      setUploadStep('select');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFileType(file.type)) {
      setUploadError('Invalid file type. Please upload a JPEG, PNG, WEBP image or PDF.');
      return;
    }

    setUploadError(null);
    setUploadStep('analyzing');

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const res = await fetch('/api/extract-bill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType: file.type })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Extraction failed');
        setExtractedData(data);
        setCustomStory(data.suggestedStory || '');
        setCustomFirstName(user?.displayName.split(' ')[0] || 'A friend');
        setUploadStep('review');
      } catch (err: any) {
        setUploadError(err.message || 'Failed to analyze uploaded file.');
        setUploadStep('select');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFinalSubmitBill = async () => {
    if (!extractedData) return;
    setIsSubmittingBill(true);
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || 'user_demo_123',
          firstName: customFirstName || 'Anonymous',
          billerName: extractedData.billerName,
          amount: extractedData.amountDue,
          dueDate: extractedData.dueDate,
          category: extractedData.category,
          story: customStory || extractedData.suggestedStory,
          isVerified: extractedData.isVerified,
          fraudRiskScore: extractedData.fraudRiskScore,
          originalImageEncrypted: 'sensitive_original_bill_pii_data'
        })
      });
      const newBill = await res.json();
      if (!res.ok) throw new Error(newBill.error || 'Failed to create bill');
      setUserUploadedIds(prev => [newBill.id, ...prev]);
      await fetchBills();
      setIsSubmittingBill(false);
      setCurrentTab('feed');
      setUploadStep('select');
      setExtractedData(null);
    } catch (e: any) {
      console.error('Failed to submit bill', e);
      setUploadError(e.message || 'Failed to submit bill');
      setIsSubmittingBill(false);
    }
  };

  const CategoryIcon = activeBill ? (categoryConfig[activeBill.category]?.icon || Folder) : Folder;
  const catStyle = activeBill ? (categoryConfig[activeBill.category] || categoryConfig.other) : categoryConfig.other;

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col justify-between relative overflow-hidden ${darkMode ? 'dark bg-[#0F0A1F] text-slate-100' : 'bg-gradient-to-br from-[#fff1f2] via-[#fae8ff] to-[#f0fdf4] text-slate-900'}`}>
      
      {/* FLOATING JOYFUL BLOBS */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-blob animation-delay-4000 pointer-events-none" />

      {showOnboarding && (
        <Onboarding onComplete={() => {
          localStorage.setItem('swipetohelp_onboarded', 'true');
          setShowOnboarding(false);
        }} />
      )}

      {showHowItWorks && (
        <HowItWorksView onClose={() => setShowHowItWorks(false)} />
      )}

      {legalModalTab && (
        <LegalModal initialTab={legalModalTab} onClose={() => setLegalModalTab(null)} />
      )}

      {showSupport && (
        <SupportModal onClose={() => setShowSupport(false)} />
      )}

      <CookieConsent />

      <div className="relative z-10">
        {/* TOP APP BAR */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCurrentTab('feed')}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight font-heading bg-gradient-to-r from-[#FF4D6D] to-[#7C3AED] bg-clip-text text-transparent">
                  SwipeToHelp
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                  Direct Bill Pay Community
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-bold font-heading">
              <button 
                onClick={() => setCurrentTab('feed')} 
                className={`transition-colors hover:text-[#FF4D6D] ${currentTab === 'feed' ? 'text-[#FF4D6D]' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Swipe Feed
              </button>
              <button 
                onClick={() => setCurrentTab('upload')} 
                className={`transition-colors hover:text-[#FF4D6D] ${currentTab === 'upload' ? 'text-[#FF4D6D]' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Upload Bill
              </button>
              <button 
                onClick={() => setCurrentTab('impact')} 
                className={`transition-colors hover:text-[#FF4D6D] ${currentTab === 'impact' ? 'text-[#FF4D6D]' : 'text-slate-600 dark:text-slate-300'}`}
              >
                My Impact
              </button>
              <button 
                onClick={() => setCurrentTab('mybills')} 
                className={`transition-colors hover:text-[#FF4D6D] ${currentTab === 'mybills' ? 'text-[#FF4D6D]' : 'text-slate-600 dark:text-slate-300'}`}
              >
                My Bills
              </button>
              <button 
                onClick={() => setCurrentTab('admin')} 
                className={`transition-colors hover:text-[#FF4D6D] flex items-center gap-1 ${currentTab === 'admin' ? 'text-[#FF4D6D]' : 'text-slate-600 dark:text-slate-300'}`}
              >
                <ShieldAlert className="w-4 h-4" /> Admin
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform shadow-sm"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>

              <button 
                onClick={() => setCurrentTab('upload')}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF4D6D] to-[#7C3AED] text-white rounded-2xl text-xs font-bold font-heading shadow-lg shadow-rose-500/25 hover:scale-105 transition-transform"
              >
                <Upload className="w-4 h-4" />
                <span>Get Help</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTAINER */}
        <main className="max-w-4xl mx-auto px-4 py-6 pb-28 md:pb-12" role="region" aria-label="Main content">
          
          {/* TAB 1: SWIPE FEED */}
          {currentTab === 'feed' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-3xl border border-white/40 dark:border-slate-800 shadow-md">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-xs font-bold font-heading text-slate-400 px-2 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Category:
                  </span>
                  {['all', 'utilities', 'medical', 'rent', 'education', 'emergency'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); }}
                      aria-label={`Filter by ${cat}`}
                      className={`px-3.5 py-2 text-xs font-bold font-heading rounded-2xl capitalize transition-all whitespace-nowrap shrink-0 ${
                        selectedCategory === cat 
                          ? 'bg-[#FF4D6D] text-white shadow-md shadow-rose-500/30 scale-105' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 overflow-x-auto">
                  <span className="text-xs font-bold font-heading text-slate-400 px-2">Amount:</span>
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'under50', label: '< $50' },
                    { id: '50to200', label: '$50-$200' },
                    { id: 'over200', label: '$200+' }
                  ].map(range => (
                    <button
                      key={range.id}
                      onClick={() => { setSelectedAmountRange(range.id); setCurrentIndex(0); }}
                      aria-label={`Filter amount ${range.label}`}
                      className={`px-3 py-2 text-xs font-bold font-heading rounded-2xl transition-all whitespace-nowrap shrink-0 ${
                        selectedAmountRange === range.id 
                          ? 'bg-[#7C3AED] text-white shadow-md shadow-violet-500/30' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SWIPE STACK */}
              <div className="relative w-full max-w-md mx-auto h-[560px] flex items-center justify-center">
                {loading ? (
                  <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                    <div className="w-12 h-12 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-sm font-bold font-heading">Loading joy & verified bills...</p>
                  </div>
                ) : filteredBills.length === 0 ? (
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-3xl border border-white/50 dark:border-slate-800 p-8 flex flex-col items-center justify-center text-center shadow-2xl">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-400 to-emerald-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-teal-500/30">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black font-heading text-slate-900 dark:text-slate-100 mb-2">All Caught Up!</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                      You've reviewed all bills in this category. Check back soon or upload a bill for someone in need.
                    </p>
                    <button
                      onClick={() => { setSelectedCategory('all'); setSelectedAmountRange('all'); setCurrentIndex(0); }}
                      className="px-6 py-3 bg-gradient-to-r from-[#FF4D6D] to-[#7C3AED] text-white rounded-2xl text-xs font-bold font-heading shadow-lg shadow-rose-500/30 hover:scale-105 transition-transform flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Reset Filters
                    </button>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {activeBill && (
                      <motion.div
                        key={activeBill.id}
                        style={{ x, rotate }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(_, info) => {
                          if (info.offset.x > 100) handleSwipe('right');
                          else if (info.offset.x < -100) handleSwipe('left');
                        }}
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ x: x.get() > 0 ? 300 : -300, opacity: 0, rotate: x.get() > 0 ? 20 : -20 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[32px] border border-white/60 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between cursor-grab active:cursor-grabbing"
                      >
                        {/* SWIPE STAMPS */}
                        <motion.div style={{ opacity: payOpacity }} className="absolute top-12 right-8 z-30 pointer-events-none border-4 border-emerald-400 text-emerald-400 font-black text-3xl font-heading uppercase px-6 py-2 rounded-2xl rotate-12 shadow-2xl bg-emerald-950/40 backdrop-blur-md">
                          PAY ✨
                        </motion.div>
                        <motion.div style={{ opacity: skipOpacity }} className="absolute top-12 left-8 z-30 pointer-events-none border-4 border-rose-400 text-rose-400 font-black text-3xl font-heading uppercase px-6 py-2 rounded-2xl -rotate-12 shadow-2xl bg-rose-950/40 backdrop-blur-md">
                          SKIP ✕
                        </motion.div>

                        {/* CARD GRADIENT HEADER */}
                        <div className={`p-6 pb-4 bg-gradient-to-r ${catStyle.bgGradient} text-white flex items-center justify-between`}>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-md">
                              <CategoryIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-black font-heading">{activeBill.firstName}</h4>
                                {activeBill.isVerified && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold font-heading text-white bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                                    <ShieldCheck className="w-3.5 h-3.5 text-teal-300" /> Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/80">Due {activeBill.dueDate}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setReportModalBill(activeBill); }}
                              aria-label="Report bill"
                              className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
                              title="Report bill"
                            >
                              <Flag className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-black uppercase font-heading tracking-wider px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md text-white">
                              {activeBill.category}
                            </span>
                          </div>
                        </div>

                        {/* CARD BODY */}
                        <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
                          <div className="space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold font-heading text-slate-400">Biller Provider</span>
                                <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-lg font-bold">OPay Direct Payout</span>
                              </div>
                              <h3 className="text-lg font-black font-heading text-slate-900 dark:text-slate-100 mb-3">{activeBill.billerName}</h3>
                              
                              <div className="flex items-baseline justify-between pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                                <div>
                                  <span className="text-[11px] font-bold font-heading text-slate-400 block">Total Amount Due</span>
                                  <span className="text-3xl font-black font-heading text-[#FF4D6D]">${activeBill.amount.toFixed(2)}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[11px] font-bold font-heading text-slate-400 block">Already Raised</span>
                                  <span className="text-xl font-black font-heading text-slate-700 dark:text-slate-300">${activeBill.raised.toFixed(2)}</span>
                                </div>
                              </div>

                              {/* ANIMATED GRADIENT PROGRESS BAR */}
                              <div className="mt-4 w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
                                <div 
                                  className="bg-gradient-to-r from-[#FF4D6D] via-[#7C3AED] to-[#2DD4BF] h-full rounded-full transition-all duration-500 shadow-sm" 
                                  style={{ width: `${Math.min(100, (activeBill.raised / activeBill.amount) * 100)}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center mt-2 text-xs font-bold font-heading text-slate-400">
                                <span>{Math.round((activeBill.raised / activeBill.amount) * 100)}% Funded</span>
                                <span>{activeBill.donorsCount} Donors</span>
                              </div>
                            </div>

                            <div className="relative pl-4 border-l-4 border-[#FF4D6D]">
                              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                "{activeBill.story}"
                              </p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-400 bg-rose-50/60 dark:bg-rose-950/30 p-3 rounded-2xl border border-rose-100 dark:border-rose-900/40">
                              <Lock className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                              <span>Account numbers & addresses hidden by Gemini PII shield.</span>
                            </div>
                          </div>
                        </div>

                        {/* CARD FOOTER ACTIONS */}
                        <div className="p-5 bg-slate-50/80 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around gap-4">
                          <button
                            onClick={() => handleSwipe('left')}
                            aria-label="Pass or skip this bill"
                            className="flex-1 h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:text-[#FF4D6D] hover:border-rose-300 shadow-md transition-all font-bold font-heading text-sm"
                          >
                            <X className="w-5 h-5 stroke-[3]" />
                            <span>Pass</span>
                          </button>

                          <button
                            onClick={() => handleSwipe('right')}
                            aria-label="Pay or support this bill"
                            className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#7C3AED] text-white font-black font-heading text-sm shadow-xl shadow-rose-500/35 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                          >
                            <Heart className="w-5 h-5 fill-white animate-bounce" />
                            <span>Pay Bill ✨</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              <div className="text-center text-xs font-bold font-heading text-slate-400 flex items-center justify-center gap-6">
                <span>Swipe cards or use Pass / Pay buttons</span>
              </div>

            </div>
          )}

          {/* TAB 2: UPLOAD */}
          {currentTab === 'upload' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-8 border border-white/60 dark:border-slate-800 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#7C3AED] text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black font-heading text-slate-900 dark:text-slate-100">Upload Your Bill</h2>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Gemini AI extracts details, scrubs PII, & encrypts originals.</p>
                  </div>
                </div>

                {uploadError && (
                  <div className="mb-4 bg-rose-50 dark:bg-rose-950 p-4 rounded-2xl border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-600 dark:text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {uploadStep === 'select' && (
                  <div className="space-y-4">
                    <div className="border-3 border-dashed border-rose-300 dark:border-slate-700 rounded-3xl p-8 text-center bg-rose-50/40 dark:bg-slate-800/40 hover:bg-rose-50/70 transition-colors">
                      <Camera className="w-12 h-12 text-[#FF4D6D] mx-auto mb-3" />
                      <h3 className="text-base font-black font-heading text-slate-800 dark:text-slate-200 mb-1">Upload Bill Photo or PDF</h3>
                      <p className="text-xs text-slate-400 mb-4">Supports JPEG, PNG, WEBP, and PDF files.</p>
                      
                      <label className="inline-block px-6 py-3 bg-gradient-to-r from-[#FF4D6D] to-[#7C3AED] text-white rounded-2xl text-xs font-bold font-heading cursor-pointer shadow-lg shadow-rose-500/30 mb-6 hover:scale-105 transition-transform">
                        Browse Files
                        <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handleFileUpload} className="hidden" aria-label="Upload bill file" />
                      </label>

                      <div className="border-t border-slate-200 dark:border-slate-700 pt-5 mt-2">
                        <p className="text-xs font-bold font-heading text-slate-400 mb-3">Or test instantly with pre-loaded samples:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          <button 
                            onClick={() => handleSimulateUpload('utilities')} 
                            className="px-4 py-2 bg-amber-400 text-slate-900 rounded-2xl text-xs font-black font-heading shadow-md hover:scale-105 transition-transform"
                          >
                            ⚡ Electric Bill
                          </button>
                          <button 
                            onClick={() => handleSimulateUpload('medical')} 
                            className="px-4 py-2 bg-[#FF4D6D] text-white rounded-2xl text-xs font-black font-heading shadow-md hover:scale-105 transition-transform"
                          >
                            🏥 Medical Co-pay
                          </button>
                          <button 
                            onClick={() => handleSimulateUpload('rent')} 
                            className="px-4 py-2 bg-[#7C3AED] text-white rounded-2xl text-xs font-black font-heading shadow-md hover:scale-105 transition-transform"
                          >
                            🏠 Rent Notice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {uploadStep === 'analyzing' && (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h3 className="text-lg font-black font-heading text-slate-900 dark:text-slate-100 mb-1">Gemini AI Audit & PII Encryption...</h3>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Scrubbing PII, encrypting original upload, and verifying authenticity.
                    </p>
                  </div>
                )}

                {uploadStep === 'review' && extractedData && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-3xl border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3">
                      <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <h4 className="font-black font-heading text-emerald-900 dark:text-emerald-200 mb-0.5">Securely Encrypted & Scrubbed</h4>
                        <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                          Original PII encrypted (AES-256). Risk Score: {extractedData.fraudRiskScore}/100.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 font-heading">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">Your First Name</label>
                        <input
                          type="text"
                          value={customFirstName}
                          onChange={(e) => setCustomFirstName(e.target.value)}
                          aria-label="Your first name"
                          className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-[#FF4D6D]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">Biller Name</label>
                          <input
                            type="text"
                            value={extractedData.billerName}
                            onChange={(e) => setExtractedData({ ...extractedData, billerName: e.target.value })}
                            aria-label="Biller name"
                            className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-[#FF4D6D]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">Amount Due ($)</label>
                          <input
                            type="number"
                            value={extractedData.amountDue}
                            onChange={(e) => setExtractedData({ ...extractedData, amountDue: parseFloat(e.target.value) || 0 })}
                            aria-label="Amount due"
                            className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-[#FF4D6D]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">Due Date</label>
                          <input
                            type="date"
                            value={extractedData.dueDate}
                            onChange={(e) => setExtractedData({ ...extractedData, dueDate: e.target.value })}
                            aria-label="Due date"
                            className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-[#FF4D6D]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">Category</label>
                          <select
                            value={extractedData.category}
                            onChange={(e: any) => setExtractedData({ ...extractedData, category: e.target.value })}
                            aria-label="Bill category"
                            className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-[#FF4D6D] capitalize"
                          >
                            <option value="utilities">Utilities</option>
                            <option value="medical">Medical</option>
                            <option value="rent">Rent</option>
                            <option value="education">Education</option>
                            <option value="emergency">Emergency</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-500">Short Story (Max 200 chars)</label>
                          <span className={`text-[10px] font-bold ${customStory.length > 200 ? 'text-[#FF4D6D]' : 'text-slate-400'}`}>
                            {customStory.length}/200
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          maxLength={200}
                          value={customStory}
                          onChange={(e) => setCustomStory(e.target.value)}
                          aria-label="Short story"
                          className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-[#FF4D6D]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={() => setUploadStep('select')}
                        className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-bold font-heading hover:bg-slate-200"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleFinalSubmitBill}
                        disabled={isSubmittingBill}
                        className="flex-1 py-3 bg-gradient-to-r from-[#FF4D6D] to-[#7C3AED] text-white rounded-2xl text-xs font-bold font-heading shadow-lg shadow-rose-500/30 hover:scale-105 transition-transform flex items-center justify-center gap-2"
                      >
                        {isSubmittingBill ? 'Publishing...' : 'Publish to Feed ✨'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MY IMPACT */}
          {currentTab === 'impact' && (
            <ImpactWall user={user} impactData={impactData} />
          )}

          {/* TAB 4: MY BILLS */}
          {currentTab === 'mybills' && (
            <RequesterDashboard 
              bills={bills} 
              userUploadedIds={userUploadedIds} 
              onNewBill={() => setCurrentTab('upload')} 
            />
          )}

          {/* TAB 5: ADMIN DASHBOARD */}
          {currentTab === 'admin' && (
            <AdminDashboard currentUser={user} />
          )}

        </main>
      </div>

      {/* FOOTER & LEGAL LINKS */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800 py-6 px-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md mt-12 text-xs font-heading font-bold text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button onClick={() => setShowHowItWorks(true)} className="hover:text-[#FF4D6D] transition-colors">How it works</button>
            <button onClick={() => setLegalModalTab('terms')} className="hover:text-[#FF4D6D] transition-colors">Terms of Service</button>
            <button onClick={() => setLegalModalTab('privacy')} className="hover:text-[#FF4D6D] transition-colors">Privacy Policy</button>
            <button onClick={() => setLegalModalTab('refunds')} className="hover:text-[#FF4D6D] transition-colors">Refund Policy</button>
            <button onClick={() => setShowSupport(true)} className="hover:text-[#FF4D6D] transition-colors flex items-center gap-1">
              <LifeBuoy className="w-3.5 h-3.5" /> Support
            </button>
          </div>
          <p>© 2026 SwipeToHelp. Direct bill payments via OPay Connect.</p>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 h-16 grid grid-cols-5 items-center">
        <button 
          onClick={() => setCurrentTab('feed')}
          aria-label="Swipe feed"
          className={`flex flex-col items-center justify-center py-1 ${currentTab === 'feed' ? 'text-[#FF4D6D] font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-heading font-bold mt-1">Feed</span>
        </button>

        <button 
          onClick={() => setCurrentTab('upload')}
          aria-label="Upload bill"
          className={`flex flex-col items-center justify-center py-1 ${currentTab === 'upload' ? 'text-[#FF4D6D] font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Upload className="w-5 h-5" />
          <span className="text-[10px] font-heading font-bold mt-1">Upload</span>
        </button>

        <button 
          onClick={() => setCurrentTab('impact')}
          aria-label="My impact"
          className={`flex flex-col items-center justify-center py-1 ${currentTab === 'impact' ? 'text-[#FF4D6D] font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] font-heading font-bold mt-1">Impact</span>
        </button>

        <button 
          onClick={() => setCurrentTab('mybills')}
          aria-label="My bills"
          className={`flex flex-col items-center justify-center py-1 ${currentTab === 'mybills' ? 'text-[#FF4D6D] font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-heading font-bold mt-1">Bills</span>
        </button>

        <button 
          onClick={() => setCurrentTab('admin')}
          aria-label="Admin dashboard"
          className={`flex flex-col items-center justify-center py-1 ${currentTab === 'admin' ? 'text-[#FF4D6D] font-bold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-[10px] font-heading font-bold mt-1">Admin</span>
        </button>
      </nav>

      {checkoutBill && (
        <CheckoutModal 
          bill={checkoutBill} 
          onClose={() => setCheckoutBill(null)} 
          onSuccess={handlePaymentSuccess} 
        />
      )}

      {reportModalBill && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[32px] p-6 max-w-sm w-full space-y-4 shadow-2xl border border-white/40 dark:border-slate-800 font-heading"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Flag className="w-5 h-5 text-[#FF4D6D]" /> Report Bill
              </h3>
              <button onClick={() => setReportModalBill(null)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400" aria-label="Close report modal">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Help us maintain community safety. Why are you reporting this bill?
            </p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              aria-label="Reason for reporting bill"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none"
            >
              <option value="Suspicious bill details">Suspicious bill details or amounts</option>
              <option value="Duplicate or fake upload">Duplicate or fake upload</option>
              <option value="Inappropriate story">Inappropriate story or content</option>
              <option value="Other">Other</option>
            </select>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setReportModalBill(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleReportBill}
                className="flex-1 py-2.5 bg-[#FF4D6D] text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-500/25"
              >
                Submit Report
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {successCelebration && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[32px] p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-white/40 dark:border-slate-800 font-heading"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/30">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">Thank You! ✨</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              You successfully contributed <span className="font-black text-[#FF4D6D]">${successCelebration.amount.toFixed(2)}</span> directly to {successCelebration.recipient}'s bill at {successCelebration.biller}.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-xs font-bold text-slate-400">
              🎉 OPay Direct Payout complete! Transaction ID securely recorded.
            </div>
            <button
              onClick={() => setSuccessCelebration(null)}
              className="w-full py-3.5 bg-gradient-to-r from-[#FF4D6D] to-[#7C3AED] text-white rounded-2xl text-xs font-black shadow-lg shadow-rose-500/30"
            >
              Continue Helping ✨
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
