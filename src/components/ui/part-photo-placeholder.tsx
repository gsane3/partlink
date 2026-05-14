import type { CSSProperties } from 'react'

// ─── Category visual config ───────────────────────────────────────────────────

type Visual = { gradient: string; stroke: string; paths: string[]; label: string }

const VISUALS: Record<string, Visual> = {
  engine: {
    gradient: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
    stroke: '#94a3b8',
    paths: [
      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    ],
    label: 'Κινητήρας',
  },
  lighting: {
    gradient: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
    stroke: '#fde68a',
    paths: [
      'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    ],
    label: 'Φωτισμός',
  },
  body: {
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a5f 100%)',
    stroke: '#93c5fd',
    paths: [
      'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z',
      'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1',
    ],
    label: 'Αμάξωμα',
  },
  transmission: {
    gradient: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
    stroke: '#6ee7b7',
    paths: [
      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    ],
    label: 'Σασμάν',
  },
  suspension: {
    gradient: 'linear-gradient(135deg, #6d28d9 0%, #3b0764 100%)',
    stroke: '#c4b5fd',
    paths: [
      'M12 3v18M5 8h14M5 16h14',
    ],
    label: 'Ανάρτηση',
  },
  brakes: {
    gradient: 'linear-gradient(135deg, #be123c 0%, #7f1d1d 100%)',
    stroke: '#fda4af',
    paths: [
      'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z',
      'M12 7a5 5 0 100 10A5 5 0 0012 7z',
      'M12 10a2 2 0 100 4 2 2 0 000-4z',
    ],
    label: 'Φρένα',
  },
  interior: {
    gradient: 'linear-gradient(135deg, #57534e 0%, #292524 100%)',
    stroke: '#d6d3d1',
    paths: [
      'M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z',
      'M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2',
    ],
    label: 'Εσωτερικό',
  },
  electrical: {
    gradient: 'linear-gradient(135deg, #a16207 0%, #451a03 100%)',
    stroke: '#fde68a',
    paths: ['M13 10V3L4 14h7v7l9-11h-7z'],
    label: 'Ηλεκτρικά',
  },
  wheels: {
    gradient: 'linear-gradient(135deg, #3f3f46 0%, #18181b 100%)',
    stroke: '#a1a1aa',
    paths: [
      'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
      'M12 17a5 5 0 100-10 5 5 0 000 10z',
      'M12 14a2 2 0 100-4 2 2 0 000 4z',
    ],
    label: 'Ζάντες',
  },
  cooling: {
    gradient: 'linear-gradient(135deg, #0e7490 0%, #164e63 100%)',
    stroke: '#a5f3fc',
    paths: [
      'M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364',
    ],
    label: 'Ψύξη',
  },
  exhaust: {
    gradient: 'linear-gradient(135deg, #c2410c 0%, #431407 100%)',
    stroke: '#fdba74',
    paths: ['M5 12h14M12 5l7 7-7 7'],
    label: 'Εξάτμιση',
  },
}

const DEFAULT_VISUAL: Visual = {
  gradient: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
  stroke: '#94a3b8',
  paths: ['M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'],
  label: 'Ανταλλακτικό',
}

export function getPartVisual(categoryId: string): Visual {
  return VISUALS[categoryId] ?? DEFAULT_VISUAL
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PartPhotoPlaceholderProps {
  categoryId: string
  className?: string
  style?: CSSProperties
  showLabel?: boolean
}

export function PartPhotoPlaceholder({
  categoryId,
  className = '',
  style,
  showLabel = true,
}: PartPhotoPlaceholderProps) {
  const v = getPartVisual(categoryId)
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
      style={{ background: v.gradient, ...style }}
    >
      <svg
        className="w-9 h-9"
        fill="none"
        viewBox="0 0 24 24"
        stroke={v.stroke}
        strokeWidth={1.25}
        aria-hidden="true"
      >
        {v.paths.map((d, i) => (
          <path key={i} strokeLinecap="round" strokeLinejoin="round" d={d} />
        ))}
      </svg>
      {showLabel && (
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: v.stroke, opacity: 0.55 }}
        >
          {v.label}
        </span>
      )}
    </div>
  )
}
