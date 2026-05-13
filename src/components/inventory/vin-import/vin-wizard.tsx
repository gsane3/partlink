'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { cn, generateSKU } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PriceInput } from '@/components/forms/price-input'
import { ROUTES } from '@/lib/routes'
import type { PartCondition } from '@/types'
import {
  PART_CATALOG_CATEGORIES,
  getRelevantPartsForVehicle,
} from '@/lib/catalog/vehicle-part-catalog'
import type { CatalogPartEntry, PriceMode } from '@/lib/catalog/vehicle-part-catalog'
import { decodeVin } from './mock-vehicles'
import type { DecodedVehicle, GeneratedPart } from './types'

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_LABELS = ['Φωτογραφία', 'VIN', 'Όχημα', 'Ανταλλακτικά', 'Έλεγχος'] as const

const DEMO_VINS = [
  { vin: 'WBA3A5C56DF589213', label: 'BMW E90 320d 2013' },
  { vin: 'VSSZZZ6KZ7R125943', label: 'VW Golf 5 1.9 TDI 2007' },
  { vin: 'WDD2040022F123456', label: 'Mercedes C-Class W204 2015' },
  { vin: 'W0L000051T2123456', label: 'Opel Astra H 1.6 2005' },
]

// ─── Progress indicator ───────────────────────────────────────────────────────

function StepProgress({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <div className="flex gap-1 mb-2">
        {STEP_LABELS.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i + 1 <= step ? 'bg-blue-600' : 'bg-slate-200'
            )}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Βήμα {step} από {STEP_LABELS.length} — {STEP_LABELS[step - 1]}
      </p>
    </div>
  )
}

// ─── Shared: error banner ─────────────────────────────────────────────────────

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-5 flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-sm text-red-700">{message}</p>
    </div>
  )
}

// ─── Step 1: Car photo (required) ─────────────────────────────────────────────

function CarPhotoStep({
  photo,
  onSet,
  onClear,
}: {
  photo: string | null
  onSet: (url: string) => void
  onClear: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onSet(URL.createObjectURL(file))
    e.target.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleChange}
      />

      {!photo ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-colors mb-4"
          style={{ aspectRatio: '16/9' }}
        >
          <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="text-center px-4">
            <p className="text-sm font-semibold text-slate-700">Τράβηξε φωτογραφία του αυτοκινήτου</p>
            <p className="text-xs text-red-500 mt-0.5">Υποχρεωτικό</p>
          </div>
        </button>
      ) : (
        <div className="relative rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-black/75 transition-colors"
          >
            Αλλαγή
          </button>
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        Η φωτογραφία βοηθά να εντοπίζεις το αυτοκίνητο στο stock σου
      </p>
    </div>
  )
}

// ─── Step 2: VIN entry ────────────────────────────────────────────────────────

function VinEntryStep({
  vin,
  onChange,
}: {
  vin: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      {/* Scanner placeholder */}
      <div
        className="relative w-full bg-slate-900 rounded-2xl overflow-hidden mb-6"
        style={{ aspectRatio: '4/3' }}
      >
        <span className="absolute top-6 left-6 w-8 h-8 border-t-[3px] border-l-[3px] border-white/70 rounded-tl-sm" />
        <span className="absolute top-6 right-6 w-8 h-8 border-t-[3px] border-r-[3px] border-white/70 rounded-tr-sm" />
        <span className="absolute bottom-6 left-6 w-8 h-8 border-b-[3px] border-l-[3px] border-white/70 rounded-bl-sm" />
        <span className="absolute bottom-6 right-6 w-8 h-8 border-b-[3px] border-r-[3px] border-white/70 rounded-br-sm" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <svg className="w-14 h-14 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.9} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <p className="text-sm font-medium text-white/60">Σκάναρε barcode VIN</p>
          <p className="text-xs text-white/30">Κάμερα μη διαθέσιμη σε αυτή την έκδοση</p>
        </div>
      </div>

      {/* Manual entry */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-slate-700">Εισαγωγή VIN χειροκίνητα</label>
          <span className={cn(
            'text-xs font-mono font-semibold tabular-nums',
            vin.length === 17 ? 'text-green-600' : 'text-slate-400'
          )}>
            {vin.length}/17
          </span>
        </div>
        <Input
          value={vin}
          onChange={(e) => onChange(e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, ''))}
          placeholder="π.χ. WBA3A5C56DF589213"
          className={cn(
            'font-mono text-base h-12 tracking-widest uppercase',
            vin.length === 17 ? 'border-green-400 focus:ring-green-500' : ''
          )}
          maxLength={17}
          autoCapitalize="characters"
          spellCheck={false}
        />
      </div>

      {/* Demo VIN chips */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Demo — Δοκίμασε με:
        </p>
        <div className="space-y-1.5">
          {DEMO_VINS.map((d) => (
            <button
              key={d.vin}
              type="button"
              onClick={() => onChange(d.vin)}
              className="w-full flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">{d.label}</p>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{d.vin}</p>
              </div>
              <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 3: Vehicle confirmation + mileage ───────────────────────────────────

function VehicleConfirmStep({
  vehicle,
  mileage,
  onMileage,
}: {
  vehicle: DecodedVehicle
  mileage: string
  onMileage: (v: string) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-green-800">VIN αναγνωρίστηκε</p>
          <p className="text-xs font-mono text-green-600 mt-0.5">{vehicle.vin}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-5">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Στοιχεία οχήματος</p>
        </div>
        <div className="px-4 py-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Μάρκα / Μοντέλο</span>
            <span className="text-sm font-semibold text-slate-900">{vehicle.make} {vehicle.model}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Έτος</span>
            <span className="text-sm font-semibold text-slate-900">{vehicle.year}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Κινητήρας</span>
            <span className="text-sm font-semibold text-slate-900 font-mono">{vehicle.engine}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Καύσιμο</span>
            <span className="text-sm font-semibold text-slate-900">{vehicle.fuel}</span>
          </div>
        </div>
      </div>

      {/* Mileage — required */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
          Χιλιόμετρα αυτοκινήτου<span className="text-red-500 ml-0.5">*</span>
        </label>
        <Input
          type="text"
          inputMode="numeric"
          value={mileage}
          onChange={(e) => onMileage(e.target.value.replace(/\D/g, ''))}
          placeholder="π.χ. 184000"
          className="h-12 text-base"
        />
        <p className="text-xs text-slate-400 mt-1.5">
          Καταγράφεται για το ιστορικό του αυτοκινήτου
        </p>
      </div>
    </div>
  )
}

// ─── Step 4: Parts and prices (accordion, closed by default) ──────────────────

function PartsAndPricesStep({
  vehicle,
  catalogParts,
  selectedIds,
  prices,
  onToggle,
  onSelectAll,
  onSelectNone,
  onPrice,
}: {
  vehicle: DecodedVehicle
  catalogParts: CatalogPartEntry[]
  selectedIds: string[]
  prices: Record<string, string>
  onToggle: (id: string) => void
  onSelectAll: () => void
  onSelectNone: () => void
  onPrice: (id: string, price: string) => void
}) {
  const grouped = PART_CATALOG_CATEGORIES
    .map((cat) => ({
      ...cat,
      parts: catalogParts.filter((p) => p.catalogCategoryId === cat.id),
    }))
    .filter((cat) => cat.parts.length > 0)

  // All categories closed by default
  const [openIds, setOpenIds] = useState<string[]>([])

  const toggleCategory = (id: string) => {
    setOpenIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  return (
    <div>
      {/* Vehicle badge */}
      <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2.5 mb-4">
        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        <span className="text-sm font-medium text-slate-700">
          {vehicle.make} {vehicle.model} {vehicle.year} · {vehicle.fuel}
        </span>
      </div>

      {/* Select all / none */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{selectedIds.length}</span>
          {' '}από {catalogParts.length} επιλεγμένα
        </p>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onSelectAll} className="text-xs font-medium text-blue-600 hover:text-blue-700">
            Όλα
          </button>
          <span className="text-slate-200">|</span>
          <button type="button" onClick={onSelectNone} className="text-xs font-medium text-slate-500 hover:text-slate-700">
            Καμία
          </button>
        </div>
      </div>

      {/* Category accordion */}
      <div className="space-y-2">
        {grouped.map((cat) => {
          const catSelected = cat.parts.filter((p) => selectedIds.includes(p.id))
          const isOpen = openIds.includes(cat.id)
          const allSelected = catSelected.length === cat.parts.length
          const someSelected = catSelected.length > 0 && !allSelected

          return (
            <div key={cat.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              {/* Category header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={cn(
                    'w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center',
                    allSelected ? 'bg-blue-600 border-blue-600' :
                    someSelected ? 'bg-blue-100 border-blue-400' :
                    'bg-white border-slate-300'
                  )}>
                    {allSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {someSelected && (
                      <div className="w-2 h-0.5 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 truncate">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className={cn(
                    'text-xs font-semibold tabular-nums',
                    catSelected.length > 0 ? 'text-blue-600' : 'text-slate-400'
                  )}>
                    {catSelected.length}/{cat.parts.length}
                  </span>
                  <svg
                    className={cn('w-4 h-4 text-slate-400 transition-transform', isOpen && 'rotate-180')}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Parts list with inline price inputs */}
              {isOpen && (
                <div className="divide-y divide-slate-100 border-t border-slate-100">
                  {cat.parts.map((part) => {
                    const isSelected = selectedIds.includes(part.id)
                    return (
                      <div key={part.id} className={cn(isSelected && 'bg-blue-50/40')}>
                        <button
                          type="button"
                          onClick={() => onToggle(part.id)}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-50/80"
                        >
                          <div className={cn(
                            'w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors',
                            isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'
                          )}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className={cn(
                                'text-sm font-medium',
                                isSelected ? 'text-slate-900' : 'text-slate-500'
                              )}>
                                {part.name}
                              </p>
                              {part.requiresInspection && (
                                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1 py-0.5 leading-none">
                                  Έλεγχος
                                </span>
                              )}
                              {part.demandTier === 'high' && (
                                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1 py-0.5 leading-none">
                                  Υψηλή ζήτηση
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Show suggested price hint when not selected */}
                          {!isSelected && part.suggestedPrice && (
                            <p className="text-xs text-slate-400 tabular-nums flex-shrink-0">
                              €{part.suggestedPrice}
                            </p>
                          )}
                        </button>

                        {/* Price input — visible only when selected */}
                        {isSelected && (
                          <div className="px-4 pb-3.5 pl-12">
                            <PriceInput
                              value={prices[part.id] ?? ''}
                              onChange={(e) => onPrice(part.id, e.target.value)}
                              placeholder="€"
                              className="h-10"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 5: Review ───────────────────────────────────────────────────────────

function ReviewStep({
  vehicle,
  mileage,
  catalogParts,
  selectedIds,
  prices,
}: {
  vehicle: DecodedVehicle
  mileage: string
  catalogParts: CatalogPartEntry[]
  selectedIds: string[]
  prices: Record<string, string>
}) {
  const selected = catalogParts.filter((p) => selectedIds.includes(p.id))
  const fixedParts = selected.filter((p) => (parseFloat(prices[p.id] ?? '') || 0) > 0)
  const onRequestParts = selected.filter((p) => !((parseFloat(prices[p.id] ?? '') || 0) > 0))
  const totalFixedValue = fixedParts.reduce(
    (sum, p) => sum + (parseFloat(prices[p.id] ?? '') || 0),
    0
  )

  return (
    <div className="space-y-4">
      {/* Vehicle + mileage */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Όχημα</p>
        </div>
        <div className="px-4 py-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Μάρκα / Μοντέλο</span>
            <span className="text-sm font-semibold text-slate-900">{vehicle.make} {vehicle.model} {vehicle.year}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Κινητήρας</span>
            <span className="text-sm font-semibold text-slate-900 font-mono">{vehicle.engine} · {vehicle.fuel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Χιλιόμετρα</span>
            <span className="text-sm font-semibold text-slate-900 tabular-nums">
              {parseInt(mileage).toLocaleString('el-GR')} km
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">VIN</span>
            <span className="text-xs font-mono text-slate-700">{vehicle.vin}</span>
          </div>
        </div>
      </div>

      {/* Parts breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Ανταλλακτικά ({selected.length})
          </p>
        </div>
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-700">Σταθερή τιμή</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 tabular-nums">
                {fixedParts.length} τεμ.
              </span>
              {totalFixedValue > 0 && (
                <span className="text-xs text-slate-500 tabular-nums">
                  €{totalFixedValue.toLocaleString('el-GR')}
                </span>
              )}
            </div>
          </div>
          {onRequestParts.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-sm text-slate-700">Κατόπιν ζήτησης</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 tabular-nums">
                {onRequestParts.length} τεμ.
              </span>
            </div>
          )}
        </div>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Δημοσιεύονται</p>
          <p className="text-sm font-bold text-blue-600 tabular-nums">{selected.length} ανταλλακτικά</p>
        </div>
      </div>

      {/* On-request note */}
      {onRequestParts.length > 0 && (
        <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-slate-500 leading-relaxed">
            Τα ανταλλακτικά χωρίς τιμή θα δημοσιευτούν ως <strong>Κατόπιν ζήτησης</strong>.
          </p>
        </div>
      )}

      {/* Vehicle QR model note */}
      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        <p className="text-xs text-blue-700 leading-relaxed">
          Θα δημιουργηθεί ένα QR για το αυτοκίνητο. Τα ανταλλακτικά θα συνδεθούν κάτω από αυτό.
        </p>
      </div>
    </div>
  )
}

// ─── Step 6: Success ──────────────────────────────────────────────────────────

function SuccessStep({
  vehicle,
  parts,
  vehicleCode,
  vehicleQrValue,
  onReset,
}: {
  vehicle: DecodedVehicle
  parts: GeneratedPart[]
  vehicleCode: string
  vehicleQrValue: string
  onReset: () => void
}) {
  const fixedCount = parts.filter((p) => p.priceMode === 'fixed').length
  const onRequestCount = parts.filter((p) => p.priceMode === 'on_request').length

  return (
    <div className="pt-4 pb-12">
      {/* Hero */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Η εισαγωγή ολοκληρώθηκε</h2>
        <p className="text-sm text-slate-500 mt-1">
          {vehicle.make} {vehicle.model} {vehicle.year}
        </p>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">{parts.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">στο stock</p>
          </div>
          {fixedCount > 0 && (
            <>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{fixedCount}</p>
                <p className="text-xs text-slate-500 mt-0.5">με τιμή</p>
              </div>
            </>
          )}
          {onRequestCount > 0 && (
            <>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-600">{onRequestCount}</p>
                <p className="text-xs text-slate-500 mt-0.5">κατόπιν ζήτησης</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Vehicle QR — one QR for the whole car */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4 flex flex-col items-center">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-4">QR αυτοκινήτου</p>
        <div className="p-3 border border-slate-100 rounded-lg bg-white">
          <QRCodeSVG
            value={vehicleQrValue}
            size={160}
            level="M"
          />
        </div>
        <p className="text-xs font-mono text-slate-500 mt-3 tracking-wider">{vehicleCode}</p>
        <p className="text-xs text-slate-400 mt-0.5 text-center">
          {vehicle.make} {vehicle.model} {vehicle.year}
        </p>
      </div>

      {/* Helper copy */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5 mb-5">
        <p className="text-sm text-blue-800 leading-relaxed">
          Κόλλησε αυτό το QR στο αυτοκίνητο ή στη θέση του. Όταν αφαιρείς ανταλλακτικό, σκανάρεις αυτό το QR και επιλέγεις ποιο part βγήκε.
        </p>
      </div>

      {/* Actions — visible before the long parts list */}
      <div className="space-y-2.5 mb-6">
        <Link
          href={ROUTES.SELLER.VEHICLE_DETAIL(vehicleCode)}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10" />
          </svg>
          Άνοιγμα αυτοκινήτου
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="w-full h-11 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Εκτύπωση QR αυτοκινήτου
        </button>

        <Link
          href={ROUTES.SELLER.INVENTORY}
          className="w-full h-11 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Δες το stock
        </Link>

        <button
          type="button"
          onClick={onReset}
          className="w-full h-11 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          + Εισαγωγή άλλου αυτοκινήτου
        </button>
      </div>

      {/* Parts summary — no per-part QR labels */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Ανταλλακτικά στο stock ({parts.length})
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {parts.map((part) => (
            <div key={part.sku} className="flex items-center gap-3 px-4 py-3">
              <p className="text-sm font-medium text-slate-900 truncate flex-1">{part.partName}</p>
              {part.priceMode === 'fixed' ? (
                <p className="text-sm font-semibold text-slate-900 flex-shrink-0 tabular-nums">€{part.price}</p>
              ) : (
                <p className="text-xs text-slate-500 flex-shrink-0 italic">Κατόπιν ζήτησης</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6

export function VinWizard() {
  const [step, setStep] = useState<WizardStep>(1)
  const [carPhoto, setCarPhoto] = useState<string | null>(null)
  const [vin, setVin] = useState('')
  const [isDecoding, setIsDecoding] = useState(false)
  const [vehicle, setVehicle] = useState<DecodedVehicle | null>(null)
  const [mileage, setMileage] = useState('')
  const [catalogParts, setCatalogParts] = useState<CatalogPartEntry[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [generatedParts, setGeneratedParts] = useState<GeneratedPart[]>([])
  // Vehicle-level QR — one code per imported car, not per part
  const [vehicleCode, setVehicleCode] = useState('')
  const [vehicleQrValue, setVehicleQrValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isSuccess = step === 6

  const togglePart = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
    setError(null)
  }

  const validate = (): string | null => {
    if (step === 1 && !carPhoto) return 'Πρόσθεσε φωτογραφία του αυτοκινήτου'
    if (step === 2 && vin.length !== 17) return 'Ο VIN πρέπει να έχει ακριβώς 17 χαρακτήρες'
    if (step === 3 && (!mileage || parseInt(mileage) <= 0)) return 'Συμπλήρωσε τα χιλιόμετρα'
    if (step === 4 && selectedIds.length === 0) return 'Επίλεξε τουλάχιστον ένα ανταλλακτικό'
    return null
  }

  const handleDecode = () => {
    setIsDecoding(true)
    setTimeout(() => {
      const decoded = decodeVin(vin)
      const parts = getRelevantPartsForVehicle(decoded)
      // All relevant parts selected by default — seller deselects what they don't have
      const defaultPrices = Object.fromEntries(
        parts.map((p) => [p.id, p.suggestedPrice ? String(p.suggestedPrice) : ''])
      )
      setCatalogParts(parts)
      setSelectedIds(parts.map((p) => p.id))
      setPrices(defaultPrices)
      setVehicle(decoded)
      setIsDecoding(false)
      setStep(3)
    }, 800)
  }

  const handlePublish = () => {
    const selected = catalogParts.filter((p) => selectedIds.includes(p.id))
    const base = Date.now() % 10000
    const suffix = String(base).padStart(4, '0')

    // One vehicle-level QR for the whole car.
    // Scanning opens vehicle context → seller picks which linked part was removed.
    const code = `VEH-001-${suffix}`
    const qrValue = `partlink:vehicle:seller-001:${code}`

    const parts: GeneratedPart[] = selected.map((part, i) => {
      const parsedPrice = parseFloat(prices[part.id] ?? '') || 0
      const priceMode: PriceMode = parsedPrice > 0 ? 'fixed' : 'on_request'
      return {
        templateId: part.id,
        partName: part.name,
        categoryId: part.inventoryCategoryId,
        condition: 'untested' as PartCondition,
        price: parsedPrice,
        priceMode,
        // Internal SKU for inventory lookup — not a printable QR label in VIN Import
        sku: generateSKU('seller-001', (base + i) % 10000),
        publishToMarketplace: true,
      }
    })

    setVehicleCode(code)
    setVehicleQrValue(qrValue)
    setGeneratedParts(parts)
    setStep(6)
  }

  const goNext = () => {
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    if (step === 2) { handleDecode(); return }
    if (step === 5) { handlePublish(); return }
    setStep((s) => (s + 1) as WizardStep)
  }

  const goBack = () => {
    setError(null)
    setStep((s) => (s - 1) as WizardStep)
  }

  const reset = () => {
    setStep(1)
    setCarPhoto(null)
    setVin('')
    setVehicle(null)
    setMileage('')
    setCatalogParts([])
    setSelectedIds([])
    setPrices({})
    setGeneratedParts([])
    setVehicleCode('')
    setVehicleQrValue('')
    setError(null)
  }

  const primaryLabel = () => {
    if (step === 2) return 'Αποκωδικοποίηση VIN'
    if (step === 3) return 'Επιβεβαίωση'
    if (step === 4) return `Συνέχεια · ${selectedIds.length} επιλεγμένα`
    if (step === 5) return `Δημοσίευση ${selectedIds.length} ανταλλακτικών`
    return 'Συνέχεια'
  }

  const isLastStep = step === 5

  return (
    <>
      {/* Scrollable content */}
      <div className={cn('px-4 py-6', isSuccess ? 'pb-10' : 'pb-40 lg:pb-32')}>
        {isSuccess ? (
          <SuccessStep
            vehicle={vehicle!}
            parts={generatedParts}
            vehicleCode={vehicleCode}
            vehicleQrValue={vehicleQrValue}
            onReset={reset}
          />
        ) : (
          <>
            <StepProgress step={step} />

            {step === 1 && (
              <>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Φωτογραφία αυτοκινήτου</h2>
                <p className="text-sm text-slate-500 mb-6">Τράβηξε φωτογραφία του αυτοκινήτου που ξηλώνεις</p>
                <CarPhotoStep
                  photo={carPhoto}
                  onSet={setCarPhoto}
                  onClear={() => setCarPhoto(null)}
                />
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Αναγνώριση VIN</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Σκάναρε ή πληκτρολόγησε τον αριθμό VIN (17 χαρακτήρες)
                </p>
                <VinEntryStep
                  vin={vin}
                  onChange={(v) => { setVin(v); setError(null) }}
                />
              </>
            )}

            {step === 3 && vehicle && (
              <>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Επιβεβαίωση οχήματος</h2>
                <p className="text-sm text-slate-500 mb-6">Έλεγξε τα στοιχεία και συμπλήρωσε τα χιλιόμετρα</p>
                <VehicleConfirmStep
                  vehicle={vehicle}
                  mileage={mileage}
                  onMileage={(v) => { setMileage(v); setError(null) }}
                />
              </>
            )}

            {step === 4 && vehicle && (
              <>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Ανταλλακτικά και τιμές</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Αποεπίλεξε ό,τι δεν υπάρχει. Άφησε κενή τιμή για κατόπιν ζήτησης.
                </p>
                <PartsAndPricesStep
                  vehicle={vehicle}
                  catalogParts={catalogParts}
                  selectedIds={selectedIds}
                  prices={prices}
                  onToggle={togglePart}
                  onSelectAll={() => setSelectedIds(catalogParts.map((p) => p.id))}
                  onSelectNone={() => { setSelectedIds([]); setError(null) }}
                  onPrice={(id, price) => {
                    setPrices((prev) => ({ ...prev, [id]: price }))
                  }}
                />
              </>
            )}

            {step === 5 && vehicle && (
              <>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Έλεγχος</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Βεβαιώσου ότι όλα είναι σωστά πριν τη δημοσίευση
                </p>
                <ReviewStep
                  vehicle={vehicle}
                  mileage={mileage}
                  catalogParts={catalogParts}
                  selectedIds={selectedIds}
                  prices={prices}
                />
              </>
            )}

            {error && <ErrorBanner message={error} />}
          </>
        )}
      </div>

      {/* Fixed bottom action bar */}
      {!isSuccess && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-60 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3 flex gap-3">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={goBack}
              className="flex-shrink-0 gap-1"
              disabled={isDecoding}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Πίσω
            </Button>
          ) : (
            <Link
              href={ROUTES.SELLER.INVENTORY}
              className="flex-shrink-0 inline-flex items-center gap-1 h-10 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Ακύρωση
            </Link>
          )}

          <Button
            variant="primary"
            onClick={goNext}
            fullWidth
            loading={isDecoding}
            disabled={step === 2 && vin.length !== 17}
            className="h-11 gap-1.5"
          >
            {isDecoding ? (
              'Αναγνώριση...'
            ) : isLastStep ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {primaryLabel()}
              </>
            ) : (
              <>
                {primaryLabel()}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </Button>
        </div>
      )}
    </>
  )
}
