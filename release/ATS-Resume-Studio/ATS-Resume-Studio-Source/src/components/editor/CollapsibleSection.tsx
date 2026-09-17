'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  count?: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({
  title,
  count,
  icon,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-stone-200/80 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 px-1 text-left group hover:bg-stone-50/50 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-600"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-stone-400 group-hover:text-stone-700 transition-colors">{icon}</span>}
          <span className="text-sm font-semibold tracking-wide text-stone-800 group-hover:text-stone-950 font-sans">
            {title}
          </span>
          {typeof count === 'number' && (
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
              {count}
            </span>
          )}
        </div>
        <div className="text-stone-400 group-hover:text-stone-600 transition-colors">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {open && <div className="pb-5 pt-1 space-y-3 px-1">{children}</div>}
    </div>
  );
}
