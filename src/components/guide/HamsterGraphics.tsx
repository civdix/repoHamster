'use client';

import React from 'react';

// 1. Hamster Speech & Thought Cloud
interface HamsterSpeechCloudProps {
  children: React.ReactNode;
  variant?: 'speech' | 'thought';
  tailPosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'left' | 'right';
  accent?: 'lime' | 'purple' | 'amber';
  className?: string;
  badge?: string;
}

export function HamsterSpeechCloud({
  children,
  variant = 'speech',
  tailPosition = 'bottom-left',
  accent = 'lime',
  className = '',
  badge,
}: HamsterSpeechCloudProps) {
  const accentBorder = {
    lime: 'border-[var(--yellow-bright)]/60 shadow-[var(--yellow-glow)] text-[var(--gh-text)]',
    purple: 'border-[var(--yellow-primary)]/60 shadow-[var(--yellow-glow)] text-[var(--gh-text)]',
    amber: 'border-[var(--yellow-bright)]/60 shadow-[var(--yellow-glow)] text-[var(--gh-text)]',
  }[accent];

  const badgeColor = {
    lime: 'bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] border-[var(--amber-badge-border)]',
    purple: 'bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] border-[var(--amber-badge-border)]',
    amber: 'bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] border-[var(--amber-badge-border)]',
  }[accent];

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Speech/Thought bubble container */}
      <div
        className={`relative z-10 rounded-2xl bg-[var(--gh-bg-secondary)] border-2 ${accentBorder} p-4 sm:p-5 backdrop-blur-md`}
      >
        {badge && (
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border mb-2 ${badgeColor}`}
          >
            <span>🐹</span>
            <span>{badge}</span>
          </div>
        )}
        <div className="text-xs sm:text-sm leading-relaxed font-sans">{children}</div>

        {/* Thought bubbles (if thought variant) */}
        {variant === 'thought' && (
          <div className="absolute -bottom-3 left-6 flex gap-1 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--gh-bg-secondary)] border-2 border-[var(--yellow-bright)]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gh-bg-secondary)] border-2 border-[var(--yellow-primary)]" />
          </div>
        )}

        {/* Speech tail (if speech variant) */}
        {variant === 'speech' && tailPosition === 'bottom-left' && (
          <svg
            className="absolute -bottom-3 left-6 w-5 h-4 overflow-visible"
            viewBox="0 0 20 16"
            fill="none"
          >
            <path
              d="M 0 0 L 6 14 L 14 0 Z"
              fill="var(--gh-bg-secondary)"
              stroke="var(--yellow-bright)"
              strokeWidth="2"
            />
            {/* Mask seam */}
            <line x1="1" y1="0" x2="13" y2="0" stroke="var(--gh-bg-secondary)" strokeWidth="3" />
          </svg>
        )}

        {variant === 'speech' && tailPosition === 'bottom-right' && (
          <svg
            className="absolute -bottom-3 right-6 w-5 h-4 overflow-visible"
            viewBox="0 0 20 16"
            fill="none"
          >
            <path
              d="M 6 0 L 14 14 L 20 0 Z"
              fill="var(--gh-bg-secondary)"
              stroke="var(--yellow-bright)"
              strokeWidth="2"
            />
            <line x1="7" y1="0" x2="19" y2="0" stroke="var(--gh-bg-secondary)" strokeWidth="3" />
          </svg>
        )}

        {variant === 'speech' && tailPosition === 'left' && (
          <svg
            className="absolute -left-3 top-5 w-4 h-5 overflow-visible"
            viewBox="0 0 16 20"
            fill="none"
          >
            <path
              d="M 16 0 L 2 7 L 16 14 Z"
              fill="var(--gh-bg-secondary)"
              stroke="var(--yellow-bright)"
              strokeWidth="2"
            />
            <line x1="16" y1="1" x2="16" y2="13" stroke="var(--gh-bg-secondary)" strokeWidth="3" />
          </svg>
        )}

        {variant === 'speech' && tailPosition === 'right' && (
          <svg
            className="absolute -right-3 top-5 w-4 h-5 overflow-visible"
            viewBox="0 0 16 20"
            fill="none"
          >
            <path
              d="M 0 0 L 14 7 L 0 14 Z"
              fill="var(--gh-bg-secondary)"
              stroke="var(--yellow-bright)"
              strokeWidth="2"
            />
            <line x1="0" y1="1" x2="0" y2="13" stroke="var(--gh-bg-secondary)" strokeWidth="3" />
          </svg>
        )}
      </div>
    </div>
  );
}

// 2. Hand-Drawn Glowing Highlight Circle / Indicator
interface DrawnHighlightCircleProps {
  children: React.ReactNode;
  color?: 'lime' | 'purple' | 'amber' | 'rose';
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  dashed?: boolean;
}

export function DrawnHighlightCircle({
  children,
  color = 'lime',
  label,
  labelPosition = 'top',
  className = '',
  dashed = false,
}: DrawnHighlightCircleProps) {
  const strokeColor = {
    lime: 'var(--yellow-bright)',
    purple: 'var(--yellow-primary)',
    amber: 'var(--yellow-bright)',
    rose: 'var(--status-error)',
  }[color];

  const labelBg = {
    lime: 'bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] border-[var(--amber-badge-border)]',
    purple: 'bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] border-[var(--amber-badge-border)]',
    amber: 'bg-[var(--amber-badge-bg)] text-[var(--amber-badge-text)] border-[var(--amber-badge-border)]',
    rose: 'bg-[var(--status-error-bg)] text-[var(--status-error)] border-[var(--status-error-border)]',
  }[color];

  return (
    <div className={`relative inline-flex items-center justify-center p-2.5 ${className}`}>
      {/* Hand-drawn organic SVG circle frame */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 100 60"
      >
        <defs>
          <filter id={`glow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={strokeColor} floodOpacity="0.6" />
          </filter>
        </defs>
        {/* Hand-drawn wavy oval with slight tilt */}
        <path
          d="M 12,30 C 10,12 30,5 52,6 C 76,7 95,14 96,30 C 97,46 78,54 50,55 C 22,56 10,48 12,30 Z"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={dashed ? '7 4' : 'none'}
          filter={`url(#glow-${color})`}
          className="animate-pulse"
        />
        {/* Subtle secondary wobble stroke for sketched look */}
        <path
          d="M 14,28 C 11,14 32,7 54,7 C 78,8 94,15 94,29 C 94,44 76,52 48,53 C 24,54 13,46 14,28 Z"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />
      </svg>

      {/* Content inside the circle */}
      <div className="relative z-10">{children}</div>

      {/* Optional hand-drawn callout label */}
      {label && (
        <span
          className={`absolute z-20 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-md whitespace-nowrap ${labelBg} ${
            labelPosition === 'top'
              ? '-top-3 left-1/2 -translate-x-1/2'
              : labelPosition === 'bottom'
              ? '-bottom-3 left-1/2 -translate-x-1/2'
              : labelPosition === 'left'
              ? 'top-1/2 -left-3 -translate-y-1/2 -translate-x-full'
              : 'top-1/2 -right-3 -translate-y-1/2 translate-x-full'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// 3. Hand-Drawn Flow & Indicator Curved Arrows
interface CurvedDrawnArrowProps {
  direction?: 'down-right' | 'up-right' | 'down-left' | 'up-left' | 'arc-right' | 'arc-left';
  color?: 'lime' | 'purple' | 'amber';
  label?: string;
  className?: string;
}

export function CurvedDrawnArrow({
  direction = 'down-right',
  color = 'lime',
  label,
  className = '',
}: CurvedDrawnArrowProps) {
  const strokeColor = {
    lime: 'var(--yellow-bright)',
    purple: 'var(--yellow-primary)',
    amber: 'var(--yellow-bright)',
  }[color];

  const markerId = `arrowhead-${color}-${direction}`;

  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}>
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill={strokeColor} />
          </marker>
        </defs>

        {/* Dynamic Curved Path according to direction */}
        {direction === 'down-right' && (
          <path
            d="M 15 15 C 35 10, 65 25, 85 65"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 3"
            markerEnd={`url(#${markerId})`}
          />
        )}

        {direction === 'up-right' && (
          <path
            d="M 15 65 C 35 60, 65 45, 85 15"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 3"
            markerEnd={`url(#${markerId})`}
          />
        )}

        {direction === 'down-left' && (
          <path
            d="M 85 15 C 65 10, 35 25, 15 65"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 3"
            markerEnd={`url(#${markerId})`}
          />
        )}

        {direction === 'arc-right' && (
          <path
            d="M 10 40 Q 50 10, 90 40"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            markerEnd={`url(#${markerId})`}
          />
        )}

        {direction === 'arc-left' && (
          <path
            d="M 90 40 Q 50 10, 10 40"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            markerEnd={`url(#${markerId})`}
          />
        )}
      </svg>

      {/* Label on the curve */}
      {label && (
        <span
          className="absolute text-[10px] font-mono font-bold bg-[var(--gh-bg)] px-2 py-0.5 rounded-full border border-[var(--gh-border)] shadow-sm text-[var(--gh-text)]"
          style={{ color: strokeColor }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// 4. Mascot Callout Box (Combining Mascot + Speech Cloud + Indicator)
interface HamsterMascotCalloutProps {
  title: string;
  message: string;
  stepNumber?: number;
  highlightText?: string;
  className?: string;
}

export function HamsterMascotCallout({
  title,
  message,
  stepNumber,
  highlightText,
  className = '',
}: HamsterMascotCalloutProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--amber-badge-border)] bg-[var(--amber-badge-bg)]/40 p-4 sm:p-5 flex items-start gap-4 ${className}`}
    >
      <div className="shrink-0 flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-[var(--gh-bg)] border border-[var(--yellow-primary)]/50 flex items-center justify-center text-xl shadow-[var(--yellow-glow)]">
          🐹
        </div>
        {stepNumber && (
          <span className="mt-1 text-[10px] font-mono font-bold text-[var(--yellow-bright)]">
            STEP 0{stepNumber}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-[var(--gh-text)] tracking-wide">{title}</h4>
          {highlightText && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--amber-badge-bg)] text-[var(--yellow-bright)] border border-[var(--amber-badge-border)]">
              {highlightText}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-[var(--gh-text-secondary)] leading-relaxed font-sans">{message}</p>
      </div>
    </div>
  );
}
