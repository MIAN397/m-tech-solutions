import React from 'react';

export function LogoIcon({ className = 'w-8 h-8', ...props }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Left Pillar */}
      <rect x="20" y="20" width="14" height="60" rx="4" />
      
      {/* Right Pillar */}
      <rect x="66" y="20" width="14" height="60" rx="4" />
      
      {/* Top Downward Chevron */}
      <path d="M 34 20 L 50 36 L 66 20 L 66 32 L 50 48 L 34 32 Z" />
      
      {/* Bottom Downward Triangle */}
      <path d="M 34 53 H 66 L 50 69 Z" />
    </svg>
  );
}

export function Logo({ className = '', iconClassName = 'w-5 h-5', showText = true }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-9 h-9 rounded-full bg-white/5 border border-border-main flex items-center justify-center shadow-sm">
        <LogoIcon className={`${iconClassName} text-accent`} />
      </div>
      {showText && (
        <span className="font-display font-bold text-lg md:text-xl tracking-tight text-text-main">
          M-Tech <span className="text-accent font-extrabold">Solutions</span>
        </span>
      )}
    </div>
  );
}
