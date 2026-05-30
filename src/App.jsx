import React, { useState } from 'react';
import JourneyLens from './components/JourneyLens';
import Storyboard from './components/Storyboard';
import ResetModal from './components/ResetModal';
import Toast from './components/Toast';
import { generateJourneyMapSvg } from './utils/svgExport';

// Setup default zero state structure
const createDefaultPersona = (id, name) => ({
  id,
  name,
  lens: {
    persona: '',
    scenario: '',
    goal: ''
  },
  phases: [
    {
      id: `phase-${id}-1`,
      name: 'Phase 1',
      emotion: 0,
      actions: '',
      touchpoints: '',
      thoughts: '',
      painPoints: '',
      opportunities: ''
    },
    {
      id: `phase-${id}-2`,
      name: 'Phase 2',
      emotion: 0,
      actions: '',
      touchpoints: '',
      thoughts: '',
      painPoints: '',
      opportunities: ''
    },
    {
      id: `phase-${id}-3`,
      name: 'Phase 3',
      emotion: 0,
      actions: '',
      touchpoints: '',
      thoughts: '',
      painPoints: '',
      opportunities: ''
    }
  ]
});

export default function App() {
  const [personas, setPersonas] = useState([
    createDefaultPersona('persona-1', 'Persona 1')
  ]);
  const [activePersonaId, setActivePersonaId] = useState('persona-1');

  // Derive active persona, lens, and phases
  const activePersonaIndex = personas.findIndex(p => p.id === activePersonaId);
  const activePersona = activePersonaIndex !== -1 ? personas[activePersonaIndex] : personas[0];
  const lens = activePersona.lens;
  const phases = activePersona.phases;

  // Modal and Toast States
  const [showResetModal, setShowResetModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Trigger custom toast notification
  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Lens State Handlers
  const handleUpdateLens = (field, value) => {
    setPersonas((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex(p => p.id === activePersonaId);
      if (idx !== -1) {
        updated[idx] = {
          ...updated[idx],
          lens: {
            ...updated[idx].lens,
            [field]: value
          }
        };
      }
      return updated;
    });
  };

  const handleAddPersona = () => {
    const newId = `persona-${Date.now()}`;
    const newName = `Persona ${personas.length + 1}`;
    const newPersona = createDefaultPersona(newId, newName);
    setPersonas((prev) => [...prev, newPersona]);
    setActivePersonaId(newId);
    triggerToast('New persona created!', 'success');
  };

  const handleDeletePersona = (id) => {
    if (personas.length <= 1) return;
    setPersonas((prev) => {
      const filtered = prev.filter(p => p.id !== id);
      // Switch active persona if deleting the current active one
      if (activePersonaId === id) {
        const deleteIdx = prev.findIndex(p => p.id === id);
        const nextActive = filtered[Math.max(0, deleteIdx - 1)] || filtered[0];
        setActivePersonaId(nextActive.id);
      }
      return filtered;
    });
    triggerToast('Persona deleted.', 'info');
  };

  const handleRenamePersona = (id, newName) => {
    setPersonas((prev) => {
      return prev.map((p) => (p.id === id ? { ...p, name: newName } : p));
    });
  };

  // Phases State Handlers
  const handleUpdatePhase = (index, field, value) => {
    setPersonas((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex(p => p.id === activePersonaId);
      if (idx !== -1) {
        const updatedPhases = [...updated[idx].phases];
        updatedPhases[index] = { ...updatedPhases[index], [field]: value };
        updated[idx] = {
          ...updated[idx],
          phases: updatedPhases
        };
      }
      return updated;
    });
  };

  const handleAddPhase = () => {
    setPersonas((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex(p => p.id === activePersonaId);
      if (idx !== -1) {
        const updatedPhases = [
          ...updated[idx].phases,
          {
            id: `phase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: `Phase ${updated[idx].phases.length + 1}`,
            emotion: 0,
            actions: '',
            touchpoints: '',
            thoughts: '',
            painPoints: '',
            opportunities: ''
          }
        ];
        updated[idx] = {
          ...updated[idx],
          phases: updatedPhases
        };
      }
      return updated;
    });
    triggerToast('Phase added successfully!', 'info');
  };

  const handleDeletePhase = (index) => {
    setPersonas((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex(p => p.id === activePersonaId);
      if (idx !== -1) {
        const currentPhases = updated[idx].phases;
        if (currentPhases.length <= 1) return prev;
        const updatedPhases = currentPhases.filter((_, idx) => idx !== index);
        updated[idx] = {
          ...updated[idx],
          phases: updatedPhases
        };
      }
      return updated;
    });
    triggerToast('Phase deleted successfully!', 'info');
  };

  // Full Reset Confirmation
  const handleResetConfirm = () => {
    setPersonas([createDefaultPersona('persona-1', 'Persona 1')]);
    setActivePersonaId('persona-1');
    setShowResetModal(false);
    triggerToast('Storyboard reset successfully.', 'info');
  };

  // Save map state as a downloadable JSON file
  const handleSaveMap = () => {
    try {
      const dataToSave = {
        // Backwards compatibility for older parsers:
        lens,
        phases,
        // Multi-persona data:
        personas,
        activePersonaId
      };
      const jsonString = JSON.stringify(dataToSave, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'user_journey_map.json';
      
      // Sandbox bypass - attach to body, click natively, remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke the temporary url immediately
      URL.revokeObjectURL(url);
      triggerToast('Journey map saved successfully!', 'success');
    } catch (err) {
      triggerToast(`Save failed: ${err.message}`, 'error');
    }
  };

  // Load map state from a local JSON file (sandbox-compliant trigger)
  const handleLoadMap = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Detailed validation checking against schema
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid JSON format');
        }
        
        let loadedPersonas = [];
        let loadedActiveId = '';

        if (Array.isArray(data.personas)) {
          loadedPersonas = data.personas.map((p, pIdx) => {
            const id = typeof p.id === 'string' && p.id ? p.id : `loaded-persona-${pIdx}-${Date.now()}`;
            const name = typeof p.name === 'string' && p.name ? p.name : `Persona ${pIdx + 1}`;
            
            const lensObj = {
              persona: typeof p.lens?.persona === 'string' ? p.lens.persona : (typeof p.lens?.personas === 'string' ? p.lens.personas : ''),
              scenario: typeof p.lens?.scenario === 'string' ? p.lens.scenario : '',
              goal: typeof p.lens?.goal === 'string' ? p.lens.goal : ''
            };

            const phasesArr = Array.isArray(p.phases) ? p.phases.map((ph, idx) => ({
              id: typeof ph.id === 'string' && ph.id ? ph.id : `loaded-phase-${idx}-${Date.now()}`,
              name: typeof ph.name === 'string' ? ph.name : `Phase ${idx + 1}`,
              emotion: typeof ph.emotion === 'number' && [-1, 0, 1].includes(ph.emotion) ? ph.emotion : 0,
              actions: typeof ph.actions === 'string' ? ph.actions : '',
              touchpoints: typeof ph.touchpoints === 'string' ? ph.touchpoints : '',
              thoughts: typeof ph.thoughts === 'string' ? ph.thoughts : '',
              painPoints: typeof ph.painPoints === 'string' ? ph.painPoints : '',
              opportunities: typeof ph.opportunities === 'string' ? ph.opportunities : ''
            })) : createDefaultPersona(id, name).phases;

            return { id, name, lens: lensObj, phases: phasesArr };
          });

          loadedActiveId = typeof data.activePersonaId === 'string' && data.activePersonaId ? data.activePersonaId : loadedPersonas[0].id;
        } else {
          // Import legacy single-persona file
          const id = 'persona-1';
          const name = data.lens?.persona ? (data.lens.persona.split(',')[0].substring(0, 15) || 'Persona 1') : 'Persona 1';
          
          const lensObj = {
            persona: typeof data.lens?.persona === 'string' ? data.lens.persona : (typeof data.lens?.personas === 'string' ? data.lens.personas : ''),
            scenario: typeof data.lens?.scenario === 'string' ? data.lens.scenario : '',
            goal: typeof data.lens?.goal === 'string' ? data.lens.goal : ''
          };

          const phasesArr = Array.isArray(data.phases) ? data.phases.map((ph, idx) => ({
            id: typeof ph.id === 'string' && ph.id ? ph.id : `loaded-phase-${idx}-${Date.now()}`,
            name: typeof ph.name === 'string' ? ph.name : `Phase ${idx + 1}`,
            emotion: typeof ph.emotion === 'number' && [-1, 0, 1].includes(ph.emotion) ? ph.emotion : 0,
            actions: typeof ph.actions === 'string' ? ph.actions : '',
            touchpoints: typeof ph.touchpoints === 'string' ? ph.touchpoints : '',
            thoughts: typeof ph.thoughts === 'string' ? ph.thoughts : '',
            painPoints: typeof ph.painPoints === 'string' ? ph.painPoints : '',
            opportunities: typeof ph.opportunities === 'string' ? ph.opportunities : ''
          })) : createDefaultPersona(id, name).phases;

          loadedPersonas = [{ id, name, lens: lensObj, phases: phasesArr }];
          loadedActiveId = id;
        }

        if (loadedPersonas.length === 0) {
          throw new Error('No personas could be loaded');
        }

        setPersonas(loadedPersonas);
        setActivePersonaId(loadedActiveId);
        triggerToast('Journey map loaded successfully!', 'success');
      } catch (err) {
        triggerToast(`Load failed: ${err.message}`, 'error');
      }
      // Reset input value to allow uploading the same file multiple times
      e.target.value = null;
    };
    reader.readAsText(file);
  };

  // Export entire map layout as a standalone styled vector SVG file
  const handleExportSvg = () => {
    try {
      const svgString = generateJourneyMapSvg({ lens, phases });
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'user_journey_map.svg';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      triggerToast('SVG vector exported successfully!', 'success');
    } catch (err) {
      triggerToast(`SVG export failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-850 font-sans">
      
      {/* Premium Top Navigation Action Panel */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">🗺️</span>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 select-none">
                Interactive UJM Builder
              </h1>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                User Journey Map &amp; Sentiment Plotter
              </p>
            </div>
          </div>

          {/* Quick Stats & Interactive Actions Bar */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Phase Count Badge */}
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-650">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Phases: {phases.length}
            </span>

            {/* Reset Action */}
            <button
              onClick={() => setShowResetModal(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-550 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-250 rounded-xl transition-all duration-200 bg-white shadow-sm"
              title="Reset layout to template"
            >
              Reset Map
            </button>

            {/* Load JSON Action (Semantic sandbox bypass input) */}
            <div className="relative">
              <input
                type="file"
                id="load-map-input"
                accept=".json"
                onChange={handleLoadMap}
                className="hidden"
              />
              <label
                htmlFor="load-map-input"
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                title="Load JSON map file"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Load Map
              </label>
            </div>

            {/* Save JSON Action */}
            <button
              onClick={handleSaveMap}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all duration-200 inline-flex items-center gap-1.5 shadow-sm"
              title="Save session as JSON file"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Save Map
            </button>

            {/* Export SVG Action */}
            <button
              onClick={handleExportSvg}
              className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-650 hover:to-indigo-550 border border-indigo-500/25 hover:border-indigo-400/30 rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 inline-flex items-center gap-1.5"
              title="Export map as SVG vector graphic"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Export SVG
            </button>

          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-[1600px] w-full mx-auto px-6 py-6 flex flex-col gap-6 flex-1">
        
        {/* Intro Lens Zone */}
        <JourneyLens 
          personas={personas}
          activePersonaId={activePersonaId}
          onSelectPersona={setActivePersonaId}
          onAddPersona={handleAddPersona}
          onDeletePersona={handleDeletePersona}
          onRenamePersona={handleRenamePersona}
          lens={lens}
          onChange={handleUpdateLens}
        />

        {/* Experience Storyboard Grid */}
        <Storyboard
          phases={phases}
          onUpdatePhase={handleUpdatePhase}
          onDeletePhase={handleDeletePhase}
          onAddPhase={handleAddPhase}
        />

      </main>

      {/* Toast Notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}

      {/* Full Reset Modal dialog */}
      <ResetModal
        isOpen={showResetModal}
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetModal(false)}
      />

    </div>
  );
}
