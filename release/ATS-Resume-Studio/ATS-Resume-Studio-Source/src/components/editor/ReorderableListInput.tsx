'use client';

import React from 'react';
import { Plus, X, ArrowUp, ArrowDown } from 'lucide-react';

interface ReorderableListInputProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  helperText?: string;
}

const fieldClass =
  'w-full px-2.5 py-1.5 text-xs sm:text-sm border border-stone-300 rounded bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition-colors font-sans';
const labelClass =
  'block text-[11px] uppercase tracking-wider text-stone-600 mb-1 font-medium font-sans';

export function ReorderableListInput({
  label,
  items,
  onChange,
  placeholder = 'Add item',
  helperText,
}: ReorderableListInputProps) {
  const update = (idx: number, val: string) => {
    const next = [...items];
    next[idx] = val;
    onChange(next);
  };

  const add = () => {
    onChange([...items, '']);
  };

  const remove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const next = [...items];
    const temp = next[idx - 1];
    next[idx - 1] = next[idx];
    next[idx] = temp;
    onChange(next);
  };

  const moveDown = (idx: number) => {
    if (idx >= items.length - 1) return;
    const next = [...items];
    const temp = next[idx + 1];
    next[idx + 1] = next[idx];
    next[idx] = temp;
    onChange(next);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className={labelClass}>{label}</label>
        {helperText && <span className="text-[10px] text-stone-400">{helperText}</span>}
      </div>

      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <input
              type="text"
              className={fieldClass}
              value={item}
              onChange={(e) => update(idx, e.target.value)}
              placeholder={placeholder}
            />

            {/* Move Up */}
            <button
              type="button"
              onClick={() => moveUp(idx)}
              disabled={idx === 0}
              className="p-1.5 text-stone-400 hover:text-stone-700 disabled:opacity-30 disabled:hover:text-stone-400 rounded hover:bg-stone-100 transition-colors"
              title="Move Up"
              aria-label="Move item up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

            {/* Move Down */}
            <button
              type="button"
              onClick={() => moveDown(idx)}
              disabled={idx === items.length - 1}
              className="p-1.5 text-stone-400 hover:text-stone-700 disabled:opacity-30 disabled:hover:text-stone-400 rounded hover:bg-stone-100 transition-colors"
              title="Move Down"
              aria-label="Move item down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            {/* Remove */}
            <button
              type="button"
              onClick={() => remove(idx)}
              className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
              title="Remove Item"
              aria-label="Remove item"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="text-xs text-stone-600 hover:text-stone-950 font-medium flex items-center gap-1 px-2.5 py-1 rounded border border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-100 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add {label.toLowerCase()}
        </button>
      </div>
    </div>
  );
}
