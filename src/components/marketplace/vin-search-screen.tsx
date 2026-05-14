'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn, formatPrice } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ConditionBadge } from '@/components/inventory/condition-badge'
import { CATEGORIES } from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import { getMarketplaceParts } from '@/lib/data/marketplace'
import { scorePartSearch } from '@/lib/search/part-search'
import type { Part, Seller } from '@/types'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DecodedBuyerVehicle {
  make: string
  model: string
  year: number
  engine?: string
  fuel?: string
  vin?: string
  confidence: 'known_vin' | 'manual'
}

type VehicleMatchType = 'exact_donor' | 'vehicle_match'

interface ScoredPart {
  part: Part
  seller: Seller | undefined
  score: number
  matchType: VehicleMatchType
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const DEMO_VINS = [
  { vin: 'WBA3A5C56DF589213', label: 'BMW E90 320d 2013' },
  { vin: 'W0L000051T2123456', label: 'Opel Astra H 1.6 2005' },
  { vin: 'WVWZZZ1KZ7W123456', label: 'VW Golf 5 1.9 TDI 2007' },
]

const KNOWN_VINS: Record<string, Omit<DecodedBuyerVehicle, 'vin' | 'confidence'>> = {
  'WBA3A5C56DF589213': { make: 'BMW',  model: 'E90 320d',       year: 2013, engine: 'N47D20', fuel: 'Diesel' },
  'W0L000051T2123456': { make: 'Opel', model: 'Astra H 1.6',   year: 2005, engine: 'Z16XEP', fuel: 'Βενζίνη' },
  'WVWZZZ1KZ7W123456': { make: 'VW',   model: 'Golf 5 1.9 TDI', year: 2007, engine: 'BKC',    fuel: 'Diesel' },
}

const MATCH_LABELS: Record<VehicleMatchType, { label: string; cls: string }> = {
  exact_donor:   { label: 'Ίδιο donor μοντέλο', cls: 'bg-blue-50 text-blue-700 border border-blue-200' },
  vehicle_match: { label: 'Πιθανή συμβατότητα', cls: 'bg-slate-50 text-slate-600 border border-slate-200' },
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function decodeBuyerVin(vin: string): DecodedBuyerVehicle | null {
  const upper = vin.trim().toUpperCase()
  const known = KNOWN_VINS[upper]
  if (known) return { ...known, vin: upper, confidence: 'known_vin' }
  return null
}

function maskVin(vin: string): string {
  if (vin.length < 8) return vin
  return vin.slice(0, 4) + '·'.repeat(vin.length - 7) + vin.slice(-3)
}

function classifyMatch(partMake: string, partModel: string, vehicle: DecodedBuyerVehicle): VehicleMatchType {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '')
  if (norm(partMake) !== norm(vehicle.make)) return 'vehicle_match'
  const searchTokens = vehicle.model.toLowerCase().split(/\s+/)
  const partModelLow = partModel.toLowerCase()
  const modelMatches = searchTokens.some((t) => t.length >= 3 && partModelLow.includes(t))
  return modelMatches ? 'exact_donor' : 'vehicle_match'
}

function getCategoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id
}

function searchByVehicle(vehicle: DecodedBuyerVehicle): ScoredPart[] {
  const allItems = getMarketplaceParts()
  const query = [vehicle.make, vehicle.model, vehicle.engine ?? ''].filter(Boolean).join(' ')
  return allItems
    .map(({ part, seller }) => ({
      part,
      seller,
      score: scorePartSearch(part, query, {
        sellerName: seller?.businessName,
        sellerCity: seller?.city,
      }),
      matchType: classifyMatch(part.vehicle.make, part.vehicle.model, vehicle),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
}

// ─── Vehicle match card ────────────────────────────────────────────────────────

function VehicleMatchCard({ part, seller, matchType }: {
  part: Part
  seller: Seller | undefined
  matchType: VehicleMatchType
}) {
  const hasPrice = part.price > 0
  const { label: matchLabel, cls: matchCls } = MATCH_LABELS[matchType]

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-sm transition-all">
      {/* Photo placeholder */}
      <div className="bg-slate-100 h-36 flex items-center justify-center text-slate-300 flex-shrink-0">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div>
          <p className="text-base font-semibold text-slate-900 leading-snug line-clamp-2">{part.partName}</p>
          <p className="text-sm text-slate-500 mt-0.5">
            {part.vehicle.make} {part.vehicle.model} {part.vehicle.year}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400">{getCategoryName(part.categoryId)}</span>
          <span className="text-slate-200">·</span>
          <ConditionBadge condition={part.condition} />
          <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap', matchCls)}>
            {matchLabel}
          </span>
        </div>

        {seller && (
          <p className="text-xs text-slate-400">{seller.businessName}{seller.city ? ` · ${seller.city}` : ''}</p>
        )}

        <p className="text-[11px] text-amber-700 italic">Έλεγξε OEM ή ρώτα τον πωλητή.</p>

        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-slate-100">
          <div>
            {hasPrice ? (
              <p className="text-lg font-bold text-slate-900 tabular-nums">{formatPrice(part.price)}</p>
            ) : (
              <p className="text-sm font-medium text-slate-500 italic">Κατόπιν ζήτησης</p>
            )}
          </div>
          <Link
            href={ROUTES.PART_DETAIL(part.id)}
            className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors flex-shrink-0"
          >
            Δες λεπτομέρειες
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Main screen ───────────────────────────────────────────────────────────────

export function VinSearchScreen() {
  const [mode, setMode] = useState<'vin' | 'manual'>('vin')
  const [vinInput, setVinInput] = useState('')
  const [vinError, setVinError] = useState<string | null>(null)
  const [unknownVin, setUnknownVin] = useState(false)
  const [manualMake, setManualMake] = useState('')
  const [manualModel, setManualModel] = useState('')
  const [manualYear, setManualYear] = useState('')
  const [manualEngine, setManualEngine] = useState('')
  const [vehicle, setVehicle] = useState<DecodedBuyerVehicle | null>(null)
  const [results, setResults] = useState<ScoredPart[]>([])
  const [searched, setSearched] = useState(false)

  const handleVinSearch = () => {
    setVinError(null)
    setUnknownVin(false)
    const trimmed = vinInput.trim()
    if (trimmed.length !== 17) {
      setVinError('Ο VIN πρέπει να έχει ακριβώς 17 χαρακτήρες.')
      return
    }
    const decoded = decodeBuyerVin(trimmed)
    if (!decoded) {
      setUnknownVin(true)
      setVinError('Δεν αναγνωρίστηκε αυτόματα. Συμπλήρωσε χειροκίνητα.')
      setMode('manual')
      return
    }
    setVehicle(decoded)
    setResults(searchByVehicle(decoded))
    setSearched(true)
  }

  const handleManualSearch = () => {
    setVinError(null)
    if (!manualMake.trim() || !manualModel.trim()) {
      setVinError('Συμπλήρωσε τουλάχιστον μάρκα και μοντέλο.')
      return
    }
    const yearNum = parseInt(manualYear) || new Date().getFullYear()
    const v: DecodedBuyerVehicle = {
      make: manualMake.trim(),
      model: manualModel.trim(),
      year: yearNum,
      engine: manualEngine.trim() || undefined,
      confidence: 'manual',
    }
    setVehicle(v)
    setResults(searchByVehicle(v))
    setSearched(true)
  }

  const handleReset = () => {
    setVehicle(null)
    setResults([])
    setSearched(false)
    setVinError(null)
    setUnknownVin(false)
  }

  const handleSearch = mode === 'vin' ? handleVinSearch : handleManualSearch

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-24 space-y-5">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Αναζήτηση με VIN ή όχημα</h1>
        <p className="text-sm text-slate-500">Βρες ανταλλακτικά που μπορεί να ταιριάζουν στο αυτοκίνητό σου.</p>
      </div>

      {/* ── Safety card ── */}
      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p className="text-xs font-semibold text-amber-900 mb-0.5">Συμβατότητα</p>
          <p className="text-xs text-amber-800 leading-relaxed">
            Η συμβατότητα πρέπει να επιβεβαιώνεται με OEM, VIN ή τον πωλητή πριν την αγορά.
          </p>
        </div>
      </div>

      {/* ── Mode toggle ── */}
      <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white">
        {(['vin', 'manual'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setVinError(null); setUnknownVin(false) }}
            className={cn(
              'flex-1 h-11 text-sm font-medium transition-colors',
              mode === m ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            )}
          >
            {m === 'vin' ? 'VIN' : 'Χειροκίνητα'}
          </button>
        ))}
      </div>

      {/* ── VIN input ── */}
      {mode === 'vin' && (
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700">Αριθμός VIN</label>
              <span className={cn('text-xs font-mono font-semibold tabular-nums',
                vinInput.length === 17 ? 'text-green-600' : 'text-slate-400')}>
                {vinInput.length}/17
              </span>
            </div>
            <Input
              value={vinInput}
              onChange={(e) => {
                setVinInput(e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, ''))
                setVinError(null)
                setUnknownVin(false)
              }}
              placeholder="π.χ. WBA3A5C56DF589213"
              className={cn('font-mono text-base h-12 tracking-widest uppercase',
                vinInput.length === 17 && !vinError ? 'border-green-400' : '')}
              maxLength={17}
              autoCapitalize="characters"
              spellCheck={false}
            />
            <p className="text-xs text-slate-400 mt-1">Ο VIN έχει 17 χαρακτήρες.</p>
          </div>

          {/* Demo chips */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Demo — δοκίμασε με:</p>
            <div className="space-y-1.5">
              {DEMO_VINS.map((d) => (
                <button
                  key={d.vin}
                  type="button"
                  onClick={() => { setVinInput(d.vin); setVinError(null); setUnknownVin(false) }}
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
      )}

      {/* ── Manual input ── */}
      {mode === 'manual' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Μάρκα<span className="text-red-500 ml-0.5">*</span>
            </label>
            <Input value={manualMake} onChange={(e) => { setManualMake(e.target.value); setVinError(null) }}
              placeholder="π.χ. BMW" className="h-11" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Μοντέλο<span className="text-red-500 ml-0.5">*</span>
            </label>
            <Input value={manualModel} onChange={(e) => { setManualModel(e.target.value); setVinError(null) }}
              placeholder="π.χ. E90 320d" className="h-11" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Έτος</label>
            <Input value={manualYear}
              onChange={(e) => setManualYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="π.χ. 2007" className="h-11" inputMode="numeric" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Κινητήρας</label>
            <Input value={manualEngine} onChange={(e) => setManualEngine(e.target.value)}
              placeholder="π.χ. N47D20" className="h-11 font-mono" />
          </div>
          {unknownVin && (
            <div className="col-span-2">
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Ο VIN δεν αναγνωρίστηκε αυτόματα. Συμπλήρωσε τα στοιχεία χειροκίνητα.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Error ── */}
      {vinError && !unknownVin && (
        <p className="text-sm text-red-600 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {vinError}
        </p>
      )}

      {/* ── Search button ── */}
      {!searched && (
        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={handleSearch}
          className="h-12 text-base gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Αναζήτηση
        </Button>
      )}

      {/* ── Results area ── */}
      {searched && vehicle && (
        <>
          {/* Vehicle result card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Αυτοκίνητο αναζήτησης</p>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Αλλαγή
              </button>
            </div>
            <div className="px-4 py-3.5 space-y-1.5">
              <p className="text-sm font-semibold text-slate-900">
                {vehicle.make} {vehicle.model} {vehicle.year}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                {vehicle.engine && <span>Κινητήρας: <span className="font-mono text-slate-700">{vehicle.engine}</span></span>}
                {vehicle.fuel && <span>{vehicle.fuel}</span>}
                {vehicle.vin && (
                  <span>VIN: <span className="font-mono tracking-wider">{maskVin(vehicle.vin)}</span></span>
                )}
              </div>
              <p className="text-xs text-amber-700 mt-1.5">
                Θα εμφανιστούν ανταλλακτικά που σχετίζονται με αυτό το όχημα. Επιβεβαίωσε πάντα συμβατότητα πριν την αγορά.
              </p>
            </div>
          </div>

          {/* Results */}
          {results.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl py-14 text-center px-4">
              <p className="text-sm font-medium text-slate-700 mb-1">Δεν βρέθηκαν ανταλλακτικά</p>
              <p className="text-xs text-slate-400 mb-5">Δοκίμασε άλλο μοντέλο ή αναζήτησε απευθείας στο marketplace.</p>
              <Link
                href={ROUTES.MARKETPLACE}
                className="inline-flex items-center gap-1.5 h-10 px-5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Άνοιγμα Marketplace
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">
                  {results.length} αποτελέσματα
                  <span className="font-normal text-slate-500 ml-1.5">
                    για {vehicle.make} {vehicle.model}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map(({ part, seller, matchType }) => (
                  <VehicleMatchCard key={part.id} part={part} seller={seller} matchType={matchType} />
                ))}
              </div>

              {/* Marketplace CTA */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <p className="text-xs text-slate-400 text-center">Δες περισσότερα ανταλλακτικά από όλους τους πωλητές:</p>
                <Link
                  href={ROUTES.MARKETPLACE}
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Δες όλα στο Marketplace
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
