import React, { useState, useEffect } from 'react';

export function CookieConsent() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('swipetohelp_cookie_consent');
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('swipetohelp_cookie_consent', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 dark:bg-slate-950/95 text-white p-4 backdrop-blur-md border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-xs text-slate-300 max-w-2xl">
        We use privacy-friendly analytics (Plausible) and essential cookies to ensure secure billing and smooth app performance. No tracking or ad cookies are used.
      </p>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleAccept}
          className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition-colors"
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
