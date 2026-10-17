import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface WatermarkBadgeProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showVerifiedText?: boolean;
  className?: string;
}

export const WatermarkBadge: React.FC<WatermarkBadgeProps> = ({
  position = 'bottom-right',
  size = 'sm',
  showVerifiedText = true,
  className = ''
}) => {
  const positionClasses = {
    'top-left': 'top-2.5 left-2.5',
    'top-right': 'top-2.5 right-2.5',
    'bottom-left': 'bottom-2.5 left-2.5',
    'bottom-right': 'bottom-2.5 right-2.5',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };

  const sizeClasses = {
    xs: {
      wrap: 'px-2 py-0.5 text-[9px] gap-1',
      icon: 'w-2.5 h-2.5',
      logo: 'h-2.5'
    },
    sm: {
      wrap: 'px-2.5 py-1 text-[10.5px] gap-1.5',
      icon: 'w-3 h-3',
      logo: 'h-3.5'
    },
    md: {
      wrap: 'px-3 py-1.5 text-xs gap-2',
      icon: 'w-3.5 h-3.5',
      logo: 'h-4'
    },
    lg: {
      wrap: 'px-4 py-2 text-sm gap-2.5',
      icon: 'w-4 h-4',
      logo: 'h-5'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <div
      className={`absolute ${positionClasses[position]} z-10 pointer-events-none select-none inline-flex items-center rounded-lg bg-slate-950/75 backdrop-blur-md border border-white/20 text-white font-medium shadow-lg transition-opacity ${currentSize.wrap} ${className}`}
    >
      <div className="flex items-center gap-1 font-black tracking-tight">
        <span>ri<span className="text-amber-400">8</span>click</span>
      </div>
      <div className="w-px h-3 bg-white/30" />
      <div className="flex items-center gap-1 text-emerald-400 font-semibold">
        <ShieldCheck className={`${currentSize.icon} shrink-0`} />
        {showVerifiedText && <span className="tracking-wide">Verified</span>}
      </div>
    </div>
  );
};

export default WatermarkBadge;
