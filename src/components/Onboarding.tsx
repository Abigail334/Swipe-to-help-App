import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Heart, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: 'Welcome to SwipeToHelp',
      subtitle: 'Direct Bill Pay Community',
      description: 'Empowering communities to help neighbors in financial need by directly paying essential bills.',
      icon: <Sparkles className="w-10 h-10 text-rose-500" />,
      badge: 'Step 1 of 3'
    },
    {
      title: 'AI Privacy & Anti-Fraud Shield',
      subtitle: '100% Secure & Verified',
      description: 'Gemini AI automatically scrubs sensitive PII (account numbers, home addresses, barcodes) and runs anti-fraud checks on every uploaded bill.',
      icon: <ShieldCheck className="w-10 h-10 text-emerald-500" />,
      badge: 'Step 2 of 3'
    },
    {
      title: 'Swipe Right to Pay',
      subtitle: 'Direct to Biller',
      description: 'Browse the Tinder-style card stack. Swipe right to pay in full or in part. Money goes directly to utility providers and medical centers.',
      icon: <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />,
      badge: 'Step 3 of 3'
    },
  ];

  const currentSlide = slides[step];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6"
      >
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
          <span>{currentSlide.badge}</span>
          <button onClick={onComplete} className="hover:text-slate-600 dark:hover:text-slate-200">Skip Intro</button>
        </div>

        <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center mx-auto shadow-inner">
          {currentSlide.icon}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">{currentSlide.subtitle}</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{currentSlide.title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-2">
            {currentSlide.description}
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 py-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-rose-500' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (step < slides.length - 1) {
              setStep(step + 1);
            } else {
              onComplete();
            }
          }}
          className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform"
        >
          <span>{step === slides.length - 1 ? 'Start Helping Now' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
