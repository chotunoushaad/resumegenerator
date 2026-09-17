'use client';

import React from 'react';
import { Check, ZoomIn, ZoomOut, Maximize2, Type, AlignJustify } from 'lucide-react';
import {
  TemplateCategory,
  TemplateId,
  TemplateConfig,
} from '@/types/template';
import { CATEGORIES, TEMPLATES, ACCENT_PRESETS } from '@/lib/templates-config';

interface PreviewControlsProps {
  selectedTemplate: TemplateId;
  setSelectedTemplate: (id: TemplateId) => void;
  activeCategory: TemplateCategory;
  setActiveCategory: (cat: TemplateCategory) => void;
  accent: string;
  setAccent: (hex: string) => void;
  accent2?: string;
  setAccent2?: (hex: string) => void;
  hasCustomAccent: boolean;
  onResetAccent: () => void;
  scale: number;
  setScale: (scale: number) => void;
  autoFit: boolean;
  setAutoFit: (fit: boolean) => void;
  showPageBreakGuide: boolean;
  setShowPageBreakGuide: (show: boolean) => void;
  fontSizeOption: 'sm' | 'base' | 'lg';
  setFontSizeOption: (size: 'sm' | 'base' | 'lg') => void;
  densityOption: 'compact' | 'normal' | 'relaxed';
  setDensityOption: (density: 'compact' | 'normal' | 'relaxed') => void;
}

export function PreviewControls({
  selectedTemplate,
  setSelectedTemplate,
  activeCategory,
  setActiveCategory,
  accent,
  setAccent,
  accent2,
  setAccent2,
  hasCustomAccent,
  onResetAccent,
  scale,
  setScale,
  autoFit,
  setAutoFit,
  showPageBreakGuide,
  setShowPageBreakGuide,
  fontSizeOption,
  setFontSizeOption,
  densityOption,
  setDensityOption,
}: PreviewControlsProps) {
  const currentTemplate = TEMPLATES[selectedTemplate];

  const handleCategorySelect = (catId: TemplateCategory) => {
    setActiveCategory(catId);
    const category = CATEGORIES.find((c) => c.id === catId);
    if (category && !category.variants.includes(selectedTemplate)) {
      setSelectedTemplate(category.variants[0]);
    }
  };

  return (
    <div className="bg-white border-b border-stone-200 px-4 md:px-6 pt-3 pb-2.5 space-y-2.5 no-print">
      {/* Top Row: Category Tabs & Zoom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-2">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3 py-1.5 text-xs uppercase tracking-[0.14em] font-medium whitespace-nowrap rounded-md transition-all ${
                  active
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2 text-stone-600 text-xs">
          <button
            type="button"
            onClick={() => {
              setAutoFit(false);
              setScale(Math.max(0.4, scale - 0.1));
            }}
            className="p-1.5 hover:bg-stone-100 rounded text-stone-600 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] w-10 text-center text-stone-500">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => {
              setAutoFit(false);
              setScale(Math.min(1.4, scale + 0.1));
            }}
            className="p-1.5 hover:bg-stone-100 rounded text-stone-600 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAutoFit(!autoFit)}
            className={`px-2 py-1 text-[11px] font-medium rounded flex items-center gap-1 border transition-colors ${
              autoFit
                ? 'bg-stone-100 border-stone-300 text-stone-900'
                : 'border-transparent hover:bg-stone-100 text-stone-500'
            }`}
          >
            <Maximize2 className="w-3 h-3" /> Fit
          </button>

          <span className="text-stone-300 mx-0.5">|</span>

          {/* Page break boundary toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-stone-500 hover:text-stone-800">
            <input
              type="checkbox"
              checked={showPageBreakGuide}
              onChange={(e) => setShowPageBreakGuide(e.target.checked)}
              className="rounded border-stone-300 text-stone-900 focus:ring-stone-500 w-3.5 h-3.5"
            />
            Page break guide
          </label>
        </div>
      </div>

      {/* Second Row: Variants within category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CATEGORIES.find((c) => c.id === activeCategory)?.variants.map((vId) => {
          const tpl = TEMPLATES[vId];
          const active = vId === selectedTemplate;
          return (
            <button
              key={vId}
              type="button"
              onClick={() => setSelectedTemplate(vId)}
              className={`p-2.5 rounded-lg border text-left transition-all relative ${
                active
                  ? 'border-stone-900 bg-stone-50/80 shadow-xs ring-1 ring-stone-900'
                  : 'border-stone-200 bg-white hover:border-stone-400'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full ring-1 ring-stone-300"
                    style={{ background: tpl.accent }}
                  />
                  <span className="font-semibold text-xs text-stone-900">
                    {tpl.label}
                  </span>
                </div>
                {active && <Check className="w-3.5 h-3.5 text-stone-900" />}
              </div>
              <p className="text-[11px] text-stone-500 leading-tight">
                {tpl.blurb}
              </p>
            </button>
          );
        })}
      </div>

      {/* Third Row: Typography Size & Spacing Density Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-2 text-xs">
        {/* Font Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-500 flex items-center gap-1">
            <Type className="w-3 h-3" /> Font Size
          </span>
          <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-stone-50">
            {(['sm', 'base', 'lg'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setFontSizeOption(size)}
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  fontSizeOption === size
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                {size === 'sm' ? 'Small' : size === 'base' ? 'Normal' : 'Large'}
              </button>
            ))}
          </div>
        </div>

        {/* Spacing / Density Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-500 flex items-center gap-1">
            <AlignJustify className="w-3 h-3" /> Spacing
          </span>
          <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-stone-50">
            {(['compact', 'normal', 'relaxed'] as const).map((den) => (
              <button
                key={den}
                type="button"
                onClick={() => setDensityOption(den)}
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  densityOption === den
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                {den === 'compact' ? 'Compact' : den === 'normal' ? 'Normal' : 'Relaxed'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fourth Row: Accent Color Controls */}
      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs border-t border-stone-100">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-500">
          Accent Color
        </span>

        {/* Native Color Picker & Hex Input */}
        <div className="flex items-center gap-1.5">
          <label className="relative w-5 h-5 rounded-full overflow-hidden border border-stone-300 cursor-pointer shadow-2xs hover:scale-105 transition-transform">
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <span
              className="absolute inset-0 pointer-events-none"
              style={{ background: accent }}
            />
          </label>
          <input
            type="text"
            value={accent.toUpperCase()}
            onChange={(e) => {
              const val = e.target.value.trim();
              if (/^#?[0-9a-fA-F]{0,6}$/.test(val)) {
                setAccent(val.startsWith('#') ? val : `#${val}`);
              }
            }}
            className="w-[5.2rem] px-2 py-0.5 text-[11px] font-mono uppercase border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-700"
          />
        </div>

        {/* Preset Color Swatches */}
        <div className="hidden sm:flex items-center gap-1">
          {ACCENT_PRESETS.map((preset) => {
            const isSelected =
              accent.toLowerCase() === preset.value.toLowerCase();
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => setAccent(preset.value)}
                className={`w-4 h-4 rounded-full border transition-all ${
                  isSelected
                    ? 'border-stone-900 ring-2 ring-stone-900 ring-offset-1 scale-115'
                    : 'border-stone-300 hover:scale-110'
                }`}
                style={{ background: preset.value }}
                title={preset.name}
                aria-label={`Select ${preset.name} accent`}
              />
            );
          })}
        </div>

        {/* Secondary Underline Color (for Trades Operator) */}
        {currentTemplate.accent2 && setAccent2 && (
          <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-stone-200">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-500">
              Underline
            </span>
            <label className="relative w-5 h-5 rounded-full overflow-hidden border border-stone-300 cursor-pointer shadow-2xs">
              <input
                type="color"
                value={accent2 || currentTemplate.accent2}
                onChange={(e) => setAccent2(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span
                className="absolute inset-0 pointer-events-none"
                style={{ background: accent2 || currentTemplate.accent2 }}
              />
            </label>
          </div>
        )}

        {hasCustomAccent && (
          <button
            type="button"
            onClick={onResetAccent}
            className="ml-auto text-[11px] text-stone-500 hover:text-stone-900 underline underline-offset-2 transition-colors"
          >
            Reset Accent
          </button>
        )}
      </div>
    </div>
  );
}
