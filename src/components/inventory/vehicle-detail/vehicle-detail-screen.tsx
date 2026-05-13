'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { cn, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PriceInput } from '@/components/forms/price-input'
import { CATEGORIES } from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import { findMockVehicleImport, getInitialVehiclePartRecords } from '@/lib/mock-data/vehicle-imports'
import type { VehiclePartRecord, VehiclePartStatus, CompatibilityStatus } from '@/components/inventory/vin-import/types'

// ─── Labels ───────────────────────────────────────────────────────────────────

const VEHICLE_STATUS_LABELS: Record<VehiclePartStatus, string> = {
  in_vehicle:  'Μέσα στο αμάξι',
  removed:     'Βγήκε',
  shelved:     'Στο ράφι',
  sold:        'Πωλήθηκε',
}

// ─── Small badges ─────────────────────────────────────────────────────────────

function VehicleStatusBadge({ status }: { status: VehiclePartStatus }) {
  const cls: Record<VehiclePartStatus, string> = {
    in_vehicle: 'bg-sky-50 text-sky-700 border-sky-200',
    removed:    'bg-amber-50 text-amber-700 border-amber-200',
    shelved:    'bg-purple-50 text-purple-700 border-purple-200',
    sold:       'bg-green-50 text-green-700 border-green-200',
  }
  return (
    <span className={cn('inline-flex text-[10px] font-semibold border rounded-full px-2 py-0.5 leading-none', cls[status])}>
      {VEHICLE_STATUS_LABELS[status]}
    </span>
  )
}

function CompatBadge({ status }: { status: CompatibilityStatus }) {
  if (status === 'donor_only') {
    return <span className="text-[10px] text-slate-400">Μόνο από αυτό το αμάξι</span>
  }
  if (status === 'oem_verified') {
    return <span className="text-[10px] font-semibold text-blue-600">OEM επιβεβαιωμένο</span>
  }
  return <span className="text-[10px] font-semibold text-green-600">Επιβεβαιώθηκε από πωλητή</span>
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-3 text-center">
      <p className={cn('text-2xl font-bold tabular-nums', accent ? 'text-blue-600' : 'text-slate-900')}>
        {value}
      </p>
      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

// ─── Expanded part panel ──────────────────────────────────────────────────────

function PartExpandedPanel({
  part,
  oemDraft,
  onOemDraftChange,
  onMarkRemoved,
  onMarkInVehicle,
  onPriceChange,
  onAddOem,
  onRemoveOem,
  onShelfChange,
  onNotesChange,
}: {
  part: VehiclePartRecord
  oemDraft: string
  onOemDraftChange: (v: string) => void
  onMarkRemoved: () => void
  onMarkInVehicle: () => void
  onPriceChange: (v: string) => void
  onAddOem: () => void
  onRemoveOem: (oem: string) => void
  onShelfChange: (v: string) => void
  onNotesChange: (v: string) => void
}) {
  return (
    <div className="border-t border-slate-100 bg-slate-50/60 px-4 pb-5 pt-4 space-y-4">

      {/* Status action */}
      {part.status === 'in_vehicle' && (
        <button
          type="button"
          onClick={onMarkRemoved}
          className="w-full h-11 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Βγήκε από το αμάξι
        </button>
      )}
      {(part.status === 'removed' || part.status === 'shelved') && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-sm font-medium text-amber-800">
              {VEHICLE_STATUS_LABELS[part.status]}
            </span>
          </div>
          <button
            type="button"
            onClick={onMarkInVehicle}
            className="text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors"
          >
            Αναίρεση
          </button>
        </div>
      )}

      {/* Price */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Τιμή</p>
        <PriceInput
          value={part.price > 0 ? String(part.price) : ''}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="€"
          className="h-10"
        />
        <p className="text-[11px] text-slate-400 mt-1">Κενή τιμή = Κατόπιν ζήτησης</p>
      </div>

      {/* OEM / Part numbers */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
          OEM / Part numbers
        </p>
        <div className="flex gap-2">
          <Input
            value={oemDraft}
            onChange={(e) => onOemDraftChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAddOem()}
            placeholder="π.χ. 55353999"
            className="h-10 font-mono text-sm flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={onAddOem}
            className="flex-shrink-0 h-10 px-3 text-sm"
          >
            Πρόσθεσε
          </Button>
        </div>
        {part.oemNumbers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {part.oemNumbers.map((oem) => (
              <span
                key={oem}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800"
              >
                {oem}
                <button
                  type="button"
                  onClick={() => onRemoveOem(oem)}
                  className="text-slate-400 hover:text-red-500 leading-none transition-colors"
                  aria-label={`Αφαίρεση ${oem}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Shelf location */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Θέση ραφιού</p>
        <Input
          value={part.shelfLocation ?? ''}
          onChange={(e) => onShelfChange(e.target.value)}
          placeholder="π.χ. Ράφι Β-04"
          className="h-10"
        />
      </div>

      {/* Private notes */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Σημειώσεις</p>
        <textarea
          value={part.privateNotes ?? ''}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Εσωτερικές σημειώσεις..."
          rows={2}
          className={cn(
            'w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 resize-none',
            'text-slate-900 placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          )}
        />
      </div>
    </div>
  )
}

// ─── Part row ─────────────────────────────────────────────────────────────────

function PartRow({
  part,
  isExpanded,
  onToggle,
  oemDraft,
  onOemDraftChange,
  onMarkRemoved,
  onMarkInVehicle,
  onPriceChange,
  onAddOem,
  onRemoveOem,
  onShelfChange,
  onNotesChange,
}: {
  part: VehiclePartRecord
  isExpanded: boolean
  onToggle: () => void
  oemDraft: string
  onOemDraftChange: (v: string) => void
  onMarkRemoved: () => void
  onMarkInVehicle: () => void
  onPriceChange: (v: string) => void
  onAddOem: () => void
  onRemoveOem: (oem: string) => void
  onShelfChange: (v: string) => void
  onNotesChange: (v: string) => void
}) {
  return (
    <div className={cn(isExpanded && 'bg-white')}>
      {/* Collapsed header row */}
      <div className="px-4 py-3.5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{part.partName}</p>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              <CompatBadge status={part.compatibilityStatus} />
              {part.priceMode === 'fixed' && part.price > 0 ? (
                <span className="text-xs font-semibold text-slate-700 tabular-nums">€{part.price}</span>
              ) : (
                <span className="text-xs text-slate-500 italic">Κατόπιν ζήτησης</span>
              )}
              {part.oemNumbers.length > 0 && (
                <span className="text-[10px] text-slate-400">{part.oemNumbers.length} OEM</span>
              )}
              {part.shelfLocation && (
                <span className="text-[10px] text-slate-400">{part.shelfLocation}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <VehicleStatusBadge status={part.status} />
            <button
              type="button"
              onClick={onToggle}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label={isExpanded ? 'Σύμπτυξη' : 'Επέκταση'}
            >
              <svg
                className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded panel */}
      {isExpanded && (
        <PartExpandedPanel
          part={part}
          oemDraft={oemDraft}
          onOemDraftChange={onOemDraftChange}
          onMarkRemoved={onMarkRemoved}
          onMarkInVehicle={onMarkInVehicle}
          onPriceChange={onPriceChange}
          onAddOem={onAddOem}
          onRemoveOem={onRemoveOem}
          onShelfChange={onShelfChange}
          onNotesChange={onNotesChange}
        />
      )}
    </div>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function VehicleDetailScreen({ vehicleCode }: { vehicleCode: string }) {
  const vehicleImport = findMockVehicleImport(vehicleCode)
  const [parts, setParts] = useState<VehiclePartRecord[]>(
    () => getInitialVehiclePartRecords(vehicleCode) ?? []
  )
  const [search, setSearch] = useState('')
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [expandedSku, setExpandedSku] = useState<string | null>(null)
  const [oemDrafts, setOemDrafts] = useState<Record<string, string>>({})

  // ─── Not found ──────────────────────────────────────────────────────────────

  if (!vehicleImport) {
    return (
      <div className="px-4 py-16 text-center max-w-sm mx-auto">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Το αυτοκίνητο δεν βρέθηκε</h2>
        <p className="text-sm text-slate-500 mb-6">Κωδικός: <span className="font-mono">{vehicleCode}</span></p>
        <Link
          href={ROUTES.SELLER.INVENTORY}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Αποθήκη
        </Link>
      </div>
    )
  }

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const updatePart = (sku: string, update: Partial<VehiclePartRecord>) => {
    setParts((prev) => prev.map((p) => p.sku === sku ? { ...p, ...update } : p))
  }

  const handleToggleExpand = (sku: string) => {
    setExpandedSku((prev) => prev === sku ? null : sku)
  }

  const handlePriceChange = (sku: string, value: string) => {
    const price = parseFloat(value) || 0
    updatePart(sku, {
      price,
      priceMode: price > 0 ? 'fixed' : 'on_request',
    })
  }

  const handleAddOem = (sku: string) => {
    const draft = (oemDrafts[sku] ?? '').trim()
    if (!draft) return
    const part = parts.find((p) => p.sku === sku)
    if (!part || part.oemNumbers.includes(draft)) return
    const newOems = [...part.oemNumbers, draft]
    updatePart(sku, {
      oemNumbers: newOems,
      compatibilityStatus: 'oem_verified',
    })
    setOemDrafts((prev) => ({ ...prev, [sku]: '' }))
  }

  const handleRemoveOem = (sku: string, oem: string) => {
    const part = parts.find((p) => p.sku === sku)
    if (!part) return
    const newOems = part.oemNumbers.filter((o) => o !== oem)
    updatePart(sku, {
      oemNumbers: newOems,
      compatibilityStatus: newOems.length > 0 ? 'oem_verified' : 'donor_only',
    })
  }

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // ─── Derived state ──────────────────────────────────────────────────────────

  const { vehicle } = vehicleImport

  const stats = {
    total:     parts.length,
    inVehicle: parts.filter((p) => p.status === 'in_vehicle').length,
    removed:   parts.filter((p) => p.status === 'removed' || p.status === 'shelved').length,
    withPrice: parts.filter((p) => p.priceMode === 'fixed' && p.price > 0).length,
    onRequest: parts.filter((p) => p.priceMode === 'on_request' || p.price === 0).length,
    withOem:   parts.filter((p) => p.oemNumbers.length > 0).length,
  }

  const searchTerm = search.toLowerCase().trim()
  const filteredParts = searchTerm
    ? parts.filter((p) => p.partName.toLowerCase().includes(searchTerm))
    : parts

  const groupedCategories = CATEGORIES
    .map((cat) => ({
      ...cat,
      parts: filteredParts.filter((p) => p.categoryId === cat.id),
    }))
    .filter((cat) => cat.parts.length > 0)

  const isSearching = searchTerm.length > 0

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 lg:pb-8">

      {/* Back link */}
      <Link
        href={ROUTES.SELLER.INVENTORY}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Αποθήκη
      </Link>

      {/* Vehicle header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {vehicle.make} {vehicle.model} {vehicle.year}
        </h1>
        <p className="text-sm font-mono text-slate-500 mt-0.5">{vehicleImport.vehicleCode}</p>

        <div className="mt-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Στοιχεία οχήματος</p>
          </div>
          <div className="px-4 py-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">VIN</span>
              <span className="text-xs font-mono text-slate-800">{vehicle.vin}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Κινητήρας</span>
              <span className="text-sm font-semibold text-slate-900 font-mono">{vehicle.engine} · {vehicle.fuel}</span>
            </div>
            {vehicleImport.mileage && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Χιλιόμετρα</span>
                <span className="text-sm font-semibold text-slate-900 tabular-nums">
                  {vehicleImport.mileage.toLocaleString('el-GR')} km
                </span>
              </div>
            )}
            {vehicleImport.importedAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Εισήχθη</span>
                <span className="text-sm text-slate-700">{formatDate(vehicleImport.importedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle QR */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 flex flex-col items-center">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-4">QR αυτοκινήτου</p>
        <div className="p-3 border border-slate-100 rounded-lg bg-white">
          <QRCodeSVG
            value={vehicleImport.vehicleQrValue}
            size={148}
            level="M"
          />
        </div>
        <p className="text-xs font-mono text-slate-500 mt-3 tracking-wider">{vehicleImport.vehicleCode}</p>
        <p className="text-xs text-slate-400 mt-0.5 text-center">
          {vehicle.make} {vehicle.model} {vehicle.year}
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 w-full h-10 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Εκτύπωση QR αυτοκινήτου
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <StatCard label="Σύνολο" value={stats.total} />
        <StatCard label="Μέσα στο αμάξι" value={stats.inVehicle} accent />
        <StatCard label="Βγήκαν" value={stats.removed} />
        <StatCard label="Με τιμή" value={stats.withPrice} />
        <StatCard label="Κατ. ζήτησης" value={stats.onRequest} />
        <StatCard label="Με OEM" value={stats.withOem} />
      </div>

      {/* Compatibility info */}
      <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 mb-6">
        <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-slate-600 leading-relaxed">
          Τα parts έχουν καταχωρηθεί με βάση το αυτοκίνητο προέλευσης. Πρόσθεσε OEM / part number μόνο στα parts που χρειάζονται συμβατότητα με άλλα μοντέλα.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Αναζήτηση ανταλλακτικού..."
          className="pl-9 h-10"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Parts list */}
      {filteredParts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-500">Δεν βρέθηκαν ανταλλακτικά</p>
        </div>
      ) : isSearching ? (
        /* Flat list when searching */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
          {filteredParts.map((part) => (
            <PartRow
              key={part.sku}
              part={part}
              isExpanded={expandedSku === part.sku}
              onToggle={() => handleToggleExpand(part.sku)}
              oemDraft={oemDrafts[part.sku] ?? ''}
              onOemDraftChange={(v) => setOemDrafts((prev) => ({ ...prev, [part.sku]: v }))}
              onMarkRemoved={() => updatePart(part.sku, { status: 'removed' })}
              onMarkInVehicle={() => updatePart(part.sku, { status: 'in_vehicle' })}
              onPriceChange={(v) => handlePriceChange(part.sku, v)}
              onAddOem={() => handleAddOem(part.sku)}
              onRemoveOem={(oem) => handleRemoveOem(part.sku, oem)}
              onShelfChange={(v) => updatePart(part.sku, { shelfLocation: v })}
              onNotesChange={(v) => updatePart(part.sku, { privateNotes: v })}
            />
          ))}
        </div>
      ) : (
        /* Category accordion when not searching */
        <div className="space-y-2">
          {groupedCategories.map((cat) => {
            const isOpen = openCategories.includes(cat.id)
            const inVehicleCount = cat.parts.filter((p) => p.status === 'in_vehicle').length

            return (
              <div key={cat.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {/* Category header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-800">{cat.name}</span>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="text-xs text-slate-500 tabular-nums">
                      {inVehicleCount} μέσα / {cat.parts.length}
                    </span>
                    <svg
                      className={cn('w-4 h-4 text-slate-400 transition-transform', isOpen && 'rotate-180')}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Part rows */}
                {isOpen && (
                  <div className="divide-y divide-slate-100 border-t border-slate-100">
                    {cat.parts.map((part) => (
                      <PartRow
                        key={part.sku}
                        part={part}
                        isExpanded={expandedSku === part.sku}
                        onToggle={() => handleToggleExpand(part.sku)}
                        oemDraft={oemDrafts[part.sku] ?? ''}
                        onOemDraftChange={(v) => setOemDrafts((prev) => ({ ...prev, [part.sku]: v }))}
                        onMarkRemoved={() => updatePart(part.sku, { status: 'removed' })}
                        onMarkInVehicle={() => updatePart(part.sku, { status: 'in_vehicle' })}
                        onPriceChange={(v) => handlePriceChange(part.sku, v)}
                        onAddOem={() => handleAddOem(part.sku)}
                        onRemoveOem={(oem) => handleRemoveOem(part.sku, oem)}
                        onShelfChange={(v) => updatePart(part.sku, { shelfLocation: v })}
                        onNotesChange={(v) => updatePart(part.sku, { privateNotes: v })}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
