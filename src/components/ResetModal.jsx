import React, { useEffect } from 'react';

export default function ResetModal({ isOpen, onConfirm, onCancel }) {
  // Listen for Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onCancel}
      />
      
      {/* Modal Dialog Body */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-slide-up">
        {/* Warning Icon Banner */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold leading-6 text-slate-900">
              Reset Journey Map?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Text Context */}
        <div className="space-y-3 mb-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to clear the entire user journey map? This will delete all phases and empty all Journey Lens fields.
          </p>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
            The board will revert back to its clean state with three blank phases.
          </div>
        </div>

        {/* Actions Button Bar */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all duration-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-550 hover:to-red-450 border border-rose-500/20 rounded-xl shadow-md hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-200"
            onClick={onConfirm}
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
}
