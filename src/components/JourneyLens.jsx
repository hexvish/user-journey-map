import React from 'react';

export default function JourneyLens({ lens, onChange }) {
  const fields = [
    {
      id: 'persona',
      label: 'Persona (Actor)',
      placeholder: 'Describe the user/actor taking the journey...',
      helper: 'e.g., Sarah, a first-time home buyer trying to secure a pre-approved mortgage online.',
      border: 'focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20'
    },
    {
      id: 'scenario',
      label: 'Scenario',
      placeholder: 'Describe the scenario or trigger...',
      helper: 'e.g., Sarah receives a recommendation from a friend, visits the home page, and starts an application.',
      border: 'focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20'
    },
    {
      id: 'goal',
      label: 'User Goal',
      placeholder: 'What is the definitive success criteria?',
      helper: 'e.g., Sarah successfully uploads all financial forms and gets a pre-approval certificate in under 10 minutes.',
      border: 'focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/20'
    }
  ];

  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md backdrop-blur-sm">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
        <span className="text-xl">🎯</span>
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-0">Journey Lens</h2>
          <p className="text-xs text-slate-500">Define the foundational context and criteria of your user storyboard</p>
        </div>
      </div>
      
      {/* Grid that stacks on mobile, 3 columns on medium/large screens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fields.map((field) => (
          <div 
            key={field.id}
            className={`flex flex-col gap-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200/60 transition-all duration-200 ${field.border}`}
          >
            <div className="flex justify-between items-center">
              <label 
                htmlFor={`lens-${field.id}`}
                className="text-xs font-semibold uppercase tracking-wider text-slate-650"
              >
                {field.label}
              </label>
              <span className="text-[10px] text-slate-400">Required</span>
            </div>
            
            <textarea
              id={`lens-${field.id}`}
              value={lens[field.id] || ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-y py-1"
            />
            
            <p className="text-[11px] text-slate-400 leading-normal mt-1 border-t border-slate-200/50 pt-1.5">
              {field.helper}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
