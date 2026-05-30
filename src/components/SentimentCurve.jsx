import React from 'react';

export default function SentimentCurve({ phases }) {
  const W = 320; // column width
  const H = 130; // sentiment grid height

  // Map emotion values (1, 0, -1) to Y coordinates
  const getYCoordinate = (emotion) => {
    if (emotion === 1) return 30;    // Smile (top)
    if (emotion === -1) return 100;  // Frown (bottom)
    return 65;                       // Neutral (middle)
  };

  // Compile coordinates for each phase
  const points = phases.map((phase, i) => {
    const x = i * W + 148;
    const y = getYCoordinate(phase.emotion);
    return { x, y };
  });

  // Calculate the Cubic Bezier path
  const getCurvePath = () => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      
      // Control points as specified in the PRD
      const cp1X = p0.x + W / 2;
      const cp1Y = p0.y;
      const cp2X = p1.x - W / 2;
      const cp2Y = p1.y;

      path += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const pathD = getCurvePath();

  return (
    <svg 
      className="absolute top-0 left-0 pointer-events-none" 
      style={{ 
        width: `${phases.length * W}px`, 
        height: `${H}px`,
        zIndex: 10
      }}
    >
      <defs>
        {/* Glow filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        {/* Line Gradient */}
        <linearGradient id="curve-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>

      {points.length > 1 && (
        <>
          {/* Secondary glow path */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#curve-gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.3"
            filter="url(#glow)"
          />
          
          {/* Primary curve path */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#curve-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="8, 6"
            className="transition-all duration-300"
          />
        </>
      )}

      {/* Render coordinate connector rings */}
      {points.map((p, index) => (
        <g key={index} className="sentiment-node">
          {/* Inner ring */}
          <circle
            cx={p.x}
            cy={p.y}
            r="8"
            fill="#ffffff"
            stroke="url(#curve-gradient)"
            strokeWidth="2.5"
          />
          {/* Pulser core */}
          <circle
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#14b8a6"
          />
        </g>
      ))}
    </svg>
  );
}
