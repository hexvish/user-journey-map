import React, { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-white/95 border-emerald-500/20 text-slate-800 shadow-lg',
      progressBg: 'bg-emerald-550',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    error: {
      bg: 'bg-white/95 border-rose-500/20 text-slate-800 shadow-lg',
      progressBg: 'bg-rose-550',
      icon: (
        <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    info: {
      bg: 'bg-white/95 border-sky-500/20 text-slate-800 shadow-lg',
      progressBg: 'bg-sky-550',
      icon: (
        <svg className="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 flex flex-col min-w-[320px] max-w-sm rounded-xl border backdrop-blur-md shadow-2xl animate-slide-in-right ${config.bg}`}
      role="alert"
    >
      <div className="flex items-center gap-3 p-4">
        {config.icon}
        <span className="text-sm font-medium text-slate-700">{message}</span>
        <button 
          onClick={onClose}
          className="ml-auto text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Progress countdown indicator */}
      <div className="h-1 w-full bg-slate-100 rounded-b-xl overflow-hidden">
        <div 
          className={`h-full transition-all duration-30 ease-linear ${config.progressBg}`} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
