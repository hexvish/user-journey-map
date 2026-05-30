import React, { useState, useRef, useEffect } from 'react';
import SentimentCurve from './SentimentCurve';

// Auto-growing textarea for smooth vertical expansions
function AutoGrowTextArea({ value, onChange, placeholder, className }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Set to scrollHeight to wrap text perfectly without scrollbars
      textareaRef.current.style.height = `${Math.max(80, textareaRef.current.scrollHeight)}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${className} overflow-hidden w-full bg-transparent text-sm resize-none`}
      rows={3}
    />
  );
}

const emojiOptions = [
  { emoji: '🙂', emotion: 1, label: 'Smile' },
  { emoji: '😊', emotion: 1, label: 'Happy' },
  { emoji: '😀', emotion: 1, label: 'Grin' },
  { emoji: '🥳', emotion: 1, label: 'Celebrate' },
  { emoji: '😍', emotion: 1, label: 'Love' },
  { emoji: '😐', emotion: 0, label: 'Neutral' },
  { emoji: '🤔', emotion: 0, label: 'Think' },
  { emoji: '😮', emotion: 0, label: 'Surprise' },
  { emoji: '🙄', emotion: 0, label: 'Roll Eyes' },
  { emoji: '😑', emotion: 0, label: 'Flat' },
  { emoji: '🙁', emotion: -1, label: 'Frown' },
  { emoji: '😢', emotion: -1, label: 'Cry' },
  { emoji: '😭', emotion: -1, label: 'Loud Cry' },
  { emoji: '😡', emotion: -1, label: 'Angry' },
  { emoji: '😱', emotion: -1, label: 'Scared' },
];

export default function Storyboard({ phases, onUpdatePhase, onDeletePhase, onAddPhase }) {
  const scrollContainerRef = useRef(null);
  const prevPhasesLength = useRef(phases.length);

  // Dynamic centering calculation when columns fit in the container
  const [isCentered, setIsCentered] = useState(false);
  const [activePickerIndex, setActivePickerIndex] = useState(null);

  useEffect(() => {
    const checkCentering = () => {
      const containerWidth = scrollContainerRef.current ? scrollContainerRef.current.clientWidth : window.innerWidth;
      const contentWidth = phases.length * 320 + 180 + 48; // phase columns + add button card + padding
      setIsCentered(contentWidth < containerWidth);
    };

    checkCentering();
    window.addEventListener('resize', checkCentering);
    return () => window.removeEventListener('resize', checkCentering);
  }, [phases.length]);

  // Smooth scroll to the far-right when a new phase is added
  useEffect(() => {
    if (phases.length > prevPhasesLength.current) {
      if (scrollContainerRef.current) {
        // Use a small timeout to let the DOM paint the new column
        setTimeout(() => {
          scrollContainerRef.current.scrollTo({
            left: scrollContainerRef.current.scrollWidth,
            behavior: 'smooth'
          });
        }, 80);
      }
    }
    prevPhasesLength.current = phases.length;
  }, [phases.length]);

  const tiers = [
    {
      id: 'actions',
      label: 'User Actions',
      placeholder: 'What physical/digital activities occur here?',
      styles: 'bg-blue-500/5 border-blue-500/20 text-blue-950 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/10'
    },
    {
      id: 'touchpoints',
      label: 'Touchpoints',
      placeholder: 'Channels, UI nodes, devices, or communication routes...',
      styles: 'bg-purple-500/5 border-purple-500/20 text-purple-950 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/10'
    },
    {
      id: 'thoughts',
      label: 'Thoughts & Quotes',
      placeholder: 'What is the user thinking or saying in this phase?',
      styles: 'bg-teal-500/5 border-teal-500/20 text-teal-950 focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/10 font-serif-italic text-[15px]'
    },
    {
      id: 'painPoints',
      label: 'Pain Points',
      placeholder: 'Friction, delays, UI blockages, or failure points...',
      styles: 'bg-rose-500/5 border-rose-500/20 text-rose-950 focus-within:border-rose-500/50 focus-within:ring-1 focus-within:ring-rose-500/10'
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      placeholder: 'Optimization ideas, automations, or design changes...',
      styles: 'bg-amber-500/5 border-amber-500/20 text-amber-950 focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/10'
    }
  ];

  return (
    <div className="flex flex-col flex-1 w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Scrollable Storyboard Grid */}
      <div 
        ref={scrollContainerRef}
        className={`flex overflow-x-auto custom-scrollbar select-none py-6 scroll-smooth ${
          isCentered ? 'justify-center' : 'justify-start'
        }`}
      >
        <div className="relative flex shrink-0 px-6">
          
          {/* Sentiment curve overlay drawn on top of the sentiment controls */}
          {phases.length > 0 && (
            <div 
              className="absolute left-6 pointer-events-none" 
              style={{ top: '48px', height: '130px', width: `${phases.length * 320}px` }}
            >
              <SentimentCurve phases={phases} />
            </div>
          )}

          {/* Render Columns */}
          {phases.map((phase, index) => (
            <div 
              key={phase.id}
              className="w-[320px] shrink-0 flex flex-col border-r border-slate-100 last:border-r-0 pr-6 select-text"
            >
              {/* Column Header & Phase Title Input */}
              <div className="flex items-center gap-2 h-9 mb-3">
                <input
                  type="text"
                  value={phase.name}
                  onChange={(e) => onUpdatePhase(index, 'name', e.target.value)}
                  placeholder={`Phase ${index + 1}`}
                  className="bg-transparent text-sm font-bold text-slate-800 border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors w-full py-1"
                />
                
                {/* Delete Column trigger */}
                {phases.length > 1 && (
                  <button
                    onClick={() => onDeletePhase(index)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete phase"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Sentiment Controller container (Height matched to SVG mapping) */}
              <div className="relative h-[130px] border border-slate-200 bg-slate-50 rounded-xl mb-6 shadow-inner">
                <div className="absolute left-2.5 top-[14px] text-[10px] uppercase tracking-wider font-semibold text-slate-400 pointer-events-none">
                  Sentiment
                </div>
                
                {/* Vertical Center Track Line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-slate-200 rounded-full" />

                {/* Faint Level Markers */}
                <button
                  type="button"
                  onClick={() => {
                    onUpdatePhase(index, 'emotion', 1);
                    onUpdatePhase(index, 'emoji', '🙂');
                  }}
                  className="absolute top-[18px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-slate-355 bg-slate-100 hover:bg-slate-200 transition-colors z-10 cursor-pointer"
                  title="Move to Positive"
                />

                <button
                  type="button"
                  onClick={() => {
                    onUpdatePhase(index, 'emotion', 0);
                    onUpdatePhase(index, 'emoji', '😐');
                  }}
                  className="absolute top-[56px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-slate-355 bg-slate-100 hover:bg-slate-200 transition-colors z-10 cursor-pointer"
                  title="Move to Neutral"
                />

                <button
                  type="button"
                  onClick={() => {
                    onUpdatePhase(index, 'emotion', -1);
                    onUpdatePhase(index, 'emoji', '🙁');
                  }}
                  className="absolute top-[94px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border border-slate-355 bg-slate-100 hover:bg-slate-200 transition-colors z-10 cursor-pointer"
                  title="Move to Negative"
                />

                {/* Active Emote Circle Button */}
                {(() => {
                  const emoteY = phase.emotion === 1 ? 'top-[10px]' : phase.emotion === -1 ? 'top-[86px]' : 'top-[48px]';
                  const activeEmoji = phase.emoji || (phase.emotion === 1 ? '🙂' : phase.emotion === -1 ? '🙁' : '😐');
                  
                  let ringColor = 'bg-sky-500/20 text-sky-700 border-sky-500/40 shadow-sky-500/10';
                  if (phase.emotion === 1) ringColor = 'bg-emerald-500/20 text-emerald-700 border-emerald-500/40 shadow-emerald-500/10';
                  if (phase.emotion === -1) ringColor = 'bg-rose-500/20 text-rose-700 border-rose-500/40 shadow-rose-500/10';

                  return (
                    <button
                      type="button"
                      onClick={() => setActivePickerIndex(activePickerIndex === index ? null : index)}
                      className={`absolute ${emoteY} left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 z-20 bg-white border scale-110 shadow-md ${ringColor} hover:scale-120 cursor-pointer`}
                      title="Select Emote"
                    >
                      <span className="text-[19px] leading-none select-none">{activeEmoji}</span>
                    </button>
                  );
                })()}

                {/* Emoji popover picker */}
                {activePickerIndex === index && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-[calc(50%+24px)] bg-white border border-slate-200/90 rounded-2xl shadow-xl p-3 z-30 flex flex-col gap-2.5 w-[190px] select-text">
                    <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Select Emote
                      </span>
                      <button
                        type="button"
                        onClick={() => setActivePickerIndex(null)}
                        className="text-slate-400 hover:text-slate-650 text-xs font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto custom-scrollbar">
                      {/* Positive Section */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider text-left">Positive</span>
                        <div className="grid grid-cols-5 gap-1">
                          {emojiOptions.filter(o => o.emotion === 1).map(opt => (
                            <button
                              key={opt.emoji}
                              type="button"
                              onClick={() => {
                                onUpdatePhase(index, 'emoji', opt.emoji);
                                onUpdatePhase(index, 'emotion', 1);
                                setActivePickerIndex(null);
                              }}
                              className="hover:bg-slate-100 p-1.5 rounded text-lg transition-colors leading-none flex items-center justify-center cursor-pointer"
                              title={opt.label}
                            >
                              {opt.emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Neutral Section */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-bold text-sky-600 uppercase tracking-wider text-left">Neutral</span>
                        <div className="grid grid-cols-5 gap-1">
                          {emojiOptions.filter(o => o.emotion === 0).map(opt => (
                            <button
                              key={opt.emoji}
                              type="button"
                              onClick={() => {
                                onUpdatePhase(index, 'emoji', opt.emoji);
                                onUpdatePhase(index, 'emotion', 0);
                                setActivePickerIndex(null);
                              }}
                              className="hover:bg-slate-100 p-1.5 rounded text-lg transition-colors leading-none flex items-center justify-center cursor-pointer"
                              title={opt.label}
                            >
                              {opt.emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Negative Section */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-bold text-rose-600 uppercase tracking-wider text-left">Negative</span>
                        <div className="grid grid-cols-5 gap-1">
                          {emojiOptions.filter(o => o.emotion === -1).map(opt => (
                            <button
                              key={opt.emoji}
                              type="button"
                              onClick={() => {
                                onUpdatePhase(index, 'emoji', opt.emoji);
                                onUpdatePhase(index, 'emotion', -1);
                                setActivePickerIndex(null);
                              }}
                              className="hover:bg-slate-100 p-1.5 rounded text-lg transition-colors leading-none flex items-center justify-center cursor-pointer"
                              title={opt.label}
                            >
                              {opt.emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Qualitative tracking tiers */}
              <div className="flex flex-col gap-4">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`flex flex-col gap-1.5 p-3 rounded-xl border transition-all duration-200 ${tier.styles}`}
                  >
                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      {tier.label}
                    </label>
                    <AutoGrowTextArea
                      value={phase[tier.id] || ''}
                      onChange={(e) => onUpdatePhase(index, tier.id, e.target.value)}
                      placeholder={tier.placeholder}
                      className="text-slate-800 placeholder-slate-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add Phase Action Card */}
          <div className="w-[180px] shrink-0 flex items-start pt-[44px]">
            <button
              onClick={onAddPhase}
              className="group w-full h-[130px] rounded-xl border border-dashed border-slate-200 hover:border-indigo-500/50 bg-slate-50/50 hover:bg-slate-100/50 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:shadow-md hover:shadow-indigo-500/5"
            >
              <div className="w-8 h-8 rounded-lg bg-white group-hover:bg-indigo-50/50 text-slate-400 group-hover:text-indigo-600 border border-slate-200 group-hover:border-indigo-500/35 flex items-center justify-center text-lg transition-all duration-300 font-medium shadow-sm">
                +
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600">
                Add Phase
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
