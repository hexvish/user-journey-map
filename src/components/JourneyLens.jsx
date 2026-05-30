import React, { useState } from 'react';

export default function JourneyLens({
  personas,
  activePersonaId,
  onSelectPersona,
  onAddPersona,
  onDeletePersona,
  onRenamePersona,
  lens,
  onChange
}) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const startEditing = (id, currentName) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const saveRename = (id) => {
    if (editName.trim()) {
      onRenamePersona(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      saveRename(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md backdrop-blur-sm flex flex-col gap-6">
      
      {/* Header and Persona Navigation Tab Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🎯</span>
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-0">Journey Lens</h2>
            <p className="text-xs text-slate-500">Define the foundational context and criteria of your user storyboard</p>
          </div>
        </div>

        {/* Persona Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {personas.map((p) => {
            const isActive = p.id === activePersonaId;
            const isEditing = p.id === editingId;

            return (
              <div
                key={p.id}
                className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-650'
                }`}
              >
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => saveRename(p.id)}
                    onKeyDown={(e) => handleKeyDown(e, p.id)}
                    className="bg-transparent text-white focus:outline-none w-20 border-b border-white/50 text-xs font-bold"
                    autoFocus
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectPersona(p.id)}
                    onDoubleClick={() => startEditing(p.id, p.name)}
                    className="focus:outline-none text-left"
                    title="Double-click to rename"
                  >
                    {p.name}
                  </button>
                )}

                {/* Edit & Delete Actions for individual personas */}
                <div className="flex items-center gap-1">
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => startEditing(p.id, p.name)}
                      className={`p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                        isActive ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                      }`}
                      title="Rename Persona"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}

                  {personas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeletePersona(p.id)}
                      className={`p-0.5 rounded transition-colors ${
                        isActive ? 'text-rose-400 hover:text-rose-350' : 'text-slate-400 hover:text-rose-600'
                      }`}
                      title="Delete Persona"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Persona button */}
          <button
            type="button"
            onClick={onAddPersona}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 text-xs font-bold transition-all duration-150 cursor-pointer"
            title="Create new independent persona"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Persona
          </button>
        </div>
      </div>

      {/* Grid displaying the active persona's inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Persona Description */}
        <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200/60 transition-all duration-200 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20">
          <div className="flex justify-between items-center mb-1">
            <label 
              htmlFor="lens-persona"
              className="text-xs font-semibold uppercase tracking-wider text-slate-650"
            >
              Persona (Actor)
            </label>
            <span className="text-[10px] text-slate-400">Required</span>
          </div>

          <textarea
            id="lens-persona"
            value={lens.persona || ''}
            onChange={(e) => onChange('persona', e.target.value)}
            placeholder="Describe the user/actor taking the journey..."
            rows={3}
            className="bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-y py-1"
          />

          <p className="text-[11px] text-slate-400 leading-normal mt-2 border-t border-slate-200/50 pt-1.5">
            e.g., Sarah, a first-time home buyer trying to secure a pre-approved mortgage online.
          </p>
        </div>

        {/* Column 2: Scenario */}
        <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200/60 transition-all duration-200 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20">
          <div className="flex justify-between items-center">
            <label 
              htmlFor="lens-scenario"
              className="text-xs font-semibold uppercase tracking-wider text-slate-650"
            >
              Scenario
            </label>
            <span className="text-[10px] text-slate-400">Required</span>
          </div>
          
          <textarea
            id="lens-scenario"
            value={lens.scenario || ''}
            onChange={(e) => onChange('scenario', e.target.value)}
            placeholder="Describe the scenario or trigger..."
            rows={3}
            className="bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-y py-1"
          />
          
          <p className="text-[11px] text-slate-400 leading-normal mt-1 border-t border-slate-200/50 pt-1.5">
            e.g., Sarah receives a recommendation from a friend, visits the home page, and starts an application.
          </p>
        </div>

        {/* Column 3: Goal */}
        <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200/60 transition-all duration-200 focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/20">
          <div className="flex justify-between items-center">
            <label 
              htmlFor="lens-goal"
              className="text-xs font-semibold uppercase tracking-wider text-slate-650"
            >
              User Goal
            </label>
            <span className="text-[10px] text-slate-400">Required</span>
          </div>
          
          <textarea
            id="lens-goal"
            value={lens.goal || ''}
            onChange={(e) => onChange('goal', e.target.value)}
            placeholder="What is the definitive success criteria?"
            rows={3}
            className="bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-y py-1"
          />
          
          <p className="text-[11px] text-slate-400 leading-normal mt-1 border-t border-slate-200/50 pt-1.5">
            e.g., Sarah successfully uploads all financial forms and gets a pre-approval certificate in under 10 minutes.
          </p>
        </div>
      </div>
    </section>
  );
}


