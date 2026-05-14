'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConditionBadge } from '@/components/inventory/condition-badge'
import { CATEGORIES, CONDITION_LABELS } from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import { formatPrice, cn } from '@/lib/utils'
import { findPartDetail } from '@/lib/mock-data/part-detail'
import { mockParts } from '@/lib/mock-data/parts'
import { mockSellers } from '@/lib/mock-data/sellers'
import { RequestSheet } from './request-sheet'
import { PartPhotoPlaceholder } from '@/components/ui/part-photo-placeholder'
import type { CompatibilityStatus } from '@/components/inventory/vin-import/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id
}

function maskVin(vin: string): string {
  if (!vin || vin.length < 8) return vin
  return vin.slice(0, 4) + '·'.repeat(vin.length - 7) + vin.slice(-3)
}

// ─── Compatibility config ─────────────────────────────────────────────────────

type CompatConfig = {
  borderClass: string
  bgClass: string
  titleClass: string
  textClass: string
  title: string
  text: string
}

const COMPAT_CONFIG: Record<CompatibilityStatus, CompatConfig> = {
  donor_only: {
    borderClass: 'border-amber-200',
    bgClass:     'bg-amber-50',
    titleClass:  'text-amber-900',
    textClass:   'text-amber-800',
    title: 'Συμβατότητα: Μόνο από το donor όχημα',
    text:  'Για άλλα μοντέλα, επιβεβαίωσε με OEM ή με τον πωλητή πριν την αγορά.',
  },
  oem_verified: {
    borderClass: 'border-blue-200',
    bgClass:     'bg-blue-50',
    titleClass:  'text-blue-900',
    textClass:   'text-blue-800',
    title: 'Συμβατότητα βάσει OEM',
    text:  'Έχει καταχωρηθεί εργοστασιακός κωδικός. Επιβεβαίωσε ότι ταιριάζει με το δικό σου όχημα.',
  },
  seller_confirmed: {
    borderClass: 'border-green-200',
    bgClass:     'bg-green-50',
    titleClass:  'text-green-900',
    textClass:   'text-green-800',
    title: 'Συμβατότητα επιβεβαιωμένη από πωλητή',
    text:  'Ο πωλητής έχει δηλώσει συμβατά μοντέλα. Επιβεβαίωσε λεπτομέρειες πριν την αγορά.',
  },
}

// ─── Section card ─────────────────────────────────────────────────────────────

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{title}</p>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 first:pt-0 last:pb-0">
      <span className="text-sm text-slate-500 flex-shrink-0 w-28">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right flex-1 min-w-0">{children}</span>
    </div>
  )
}

// ─── Not found ────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="max-w-sm mx-auto px-4 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Το ανταλλακτικό δεν βρέθηκε</h2>
      <p className="text-sm text-slate-500 mb-6">Μπορεί να μην είναι πλέον διαθέσιμο.</p>
      <Link
        href={ROUTES.MARKETPLACE}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Επιστροφή στο Marketplace
      </Link>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MarketplaceDetail({ partId }: { partId: string }) {
  const [sheetMode, setSheetMode] = useState<'request' | 'message' | null>(null)

  const partInfo = findPartDetail(partId)

  // Seller lookup for regular parts
  const sourcePart = mockParts.find((p) => p.id === partId || p.sku === partId)
  const seller = sourcePart
    ? mockSellers.find((s) => s.id === sourcePart.sellerId)
    : undefined

  // Compatibility — default to donor_only since PartInfo does not carry compat data.
  // When OEM enrichment is added to PartInfo, update this.
  const compatStatus: CompatibilityStatus = 'donor_only'
  const compat = COMPAT_CONFIG[compatStatus]

  if (!partInfo) return <NotFound />

  const hasPrice = partInfo.price > 0
  const ctaLabel = hasPrice ? 'Στείλε αίτημα' : 'Ζήτα τιμή'

  const openSheet = (mode: 'request' | 'message') => setSheetMode(mode)
  const closeSheet = () => setSheetMode(null)

  return (
    <>
      {/* Request / message sheet */}
      {sheetMode !== null && (
        <RequestSheet
          mode={sheetMode}
          partInfo={partInfo}
          sellerName={seller?.businessName}
          onClose={closeSheet}
        />
      )}

      {/* Scrollable content */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-32">

        {/* Back link */}
        <Link
          href={ROUTES.MARKETPLACE}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Marketplace
        </Link>

        {/* ── Hero ── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
          {/* Photo area */}
          <PartPhotoPlaceholder
            categoryId={partInfo.categoryId}
            className="w-full"
            style={{ aspectRatio: '16/9' }}
          />

          {/* Title + price */}
          <div className="px-5 pt-4 pb-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-xl font-bold text-slate-900 leading-snug flex-1">
                {partInfo.partName}
              </h1>
              <div className="flex-shrink-0 text-right">
                {hasPrice ? (
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">
                    {formatPrice(partInfo.price)}
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-slate-600 italic">Κατόπιν ζήτησης</p>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-3">
              {partInfo.donorVehicle
                ? `${partInfo.donorVehicle.make} ${partInfo.donorVehicle.model} ${partInfo.donorVehicle.year}`
                : getCategoryName(partInfo.categoryId)}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <Badge variant="success">Διαθέσιμο</Badge>
              <ConditionBadge condition={partInfo.condition} />
              <Badge variant="default">{getCategoryName(partInfo.categoryId)}</Badge>
            </div>

            {/* Inline CTAs */}
            <div className="flex gap-2.5">
              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={() => openSheet('request')}
                className="h-12 gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {ctaLabel}
              </Button>
              <button
                type="button"
                onClick={() => openSheet('message')}
                className="flex-shrink-0 h-12 w-12 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-center"
                aria-label="Μήνυμα στον πωλητή"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">

          {/* ── 1. Part summary ── */}
          <InfoCard title="Στοιχεία ανταλλακτικού">
            <div className="space-y-0">
              <InfoRow label="Κατηγορία">{getCategoryName(partInfo.categoryId)}</InfoRow>
              <InfoRow label="Κατάσταση">{CONDITION_LABELS[partInfo.condition]}</InfoRow>
              <InfoRow label="SKU"><span className="font-mono text-xs">{partInfo.sku}</span></InfoRow>
              <InfoRow label="Τιμή">
                {hasPrice
                  ? <span className="font-semibold">{formatPrice(partInfo.price)}</span>
                  : <span className="italic text-slate-500">Κατόπιν ζήτησης</span>
                }
              </InfoRow>
              <InfoRow label="Διαθεσιμότητα"><Badge variant="success">Διαθέσιμο</Badge></InfoRow>
            </div>
          </InfoCard>

          {/* ── 2. Donor vehicle card ── */}
          {partInfo.donorVehicle && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Όχημα προέλευσης</p>
              </div>
              <div className="px-4 py-4">
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  Το ανταλλακτικό προέρχεται από αυτό το όχημα.
                </p>
                <div className="space-y-0">
                  <InfoRow label="Μάρκα">{partInfo.donorVehicle.make}</InfoRow>
                  <InfoRow label="Μοντέλο">{partInfo.donorVehicle.model}</InfoRow>
                  <InfoRow label="Έτος">{partInfo.donorVehicle.year}</InfoRow>
                  {partInfo.donorVehicle.engine && (
                    <InfoRow label="Κινητήρας">
                      <span className="font-mono">{partInfo.donorVehicle.engine}</span>
                    </InfoRow>
                  )}
                  {partInfo.donorVehicle.fuel && (
                    <InfoRow label="Καύσιμο">{partInfo.donorVehicle.fuel}</InfoRow>
                  )}
                  {partInfo.donorVehicle.mileage && (
                    <InfoRow label="Χιλιόμετρα">
                      {partInfo.donorVehicle.mileage.toLocaleString('el-GR')} km
                    </InfoRow>
                  )}
                  {partInfo.donorVehicle.vin && (
                    <InfoRow label="VIN">
                      <span className="font-mono text-xs tracking-wider">
                        {maskVin(partInfo.donorVehicle.vin)}
                      </span>
                    </InfoRow>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── 3. Compatibility safety card ── */}
          <div className={cn('border rounded-xl overflow-hidden', compat.borderClass)}>
            <div className={cn('px-4 py-3', compat.bgClass)}>
              <div className="flex items-start gap-2.5">
                <svg className={cn('w-4 h-4 flex-shrink-0 mt-0.5', compat.titleClass.replace('text-', 'text-').replace('900', '600'))} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className={cn('text-sm font-semibold mb-0.5', compat.titleClass)}>
                    {compat.title}
                  </p>
                  <p className={cn('text-xs leading-relaxed', compat.textClass)}>
                    {compat.text}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. OEM / Part numbers ── */}
          <InfoCard title="OEM / Part numbers">
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-slate-500">Δεν έχει καταχωρηθεί OEM κωδικός.</p>
            </div>
          </InfoCard>

          {/* ── 5. Description / notes ── */}
          <InfoCard title="Περιγραφή">
            {partInfo.description ? (
              <p className="text-sm text-slate-700 leading-relaxed">{partInfo.description}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">Δεν υπάρχει αναλυτική περιγραφή ακόμα.</p>
            )}
          </InfoCard>

          {/* ── 6. Seller trust card ── */}
          <InfoCard title="Πωλητής">
            {seller ? (
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{seller.businessName}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{seller.city}</p>
                  </div>
                  {seller.verificationStatus === 'approved' && (
                    <Badge variant="success">Επαλυθευμένος</Badge>
                  )}
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Επαγγελματίας πωλητής
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Έλεγχος διαθεσιμότητας πριν την αγορά
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-slate-900">Επαγγελματίας πωλητής</p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Έλεγχος διαθεσιμότητας πριν την αγορά
                </p>
              </div>
            )}
          </InfoCard>

          {/* ── 7. Compatibility check placeholder ── */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Έλεγχος συμβατότητας</p>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-200 rounded px-1.5 py-0.5">Σύντομα</span>
            </div>
            <div className="px-4 py-4">
              <p className="text-sm text-slate-500 leading-relaxed">
                Σύντομα θα μπορείς να ελέγχεις με VIN ή OEM αν ταιριάζει στο όχημά σου.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Sticky bottom action bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <div className="flex-shrink-0">
            {hasPrice ? (
              <p className="text-xl font-bold text-slate-900 tabular-nums">{formatPrice(partInfo.price)}</p>
            ) : (
              <p className="text-sm font-medium text-slate-500 italic">Κατόπιν ζήτησης</p>
            )}
          </div>

          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={() => openSheet('request')}
            className="h-11 gap-1.5"
          >
            {ctaLabel}
          </Button>

          <button
            type="button"
            onClick={() => openSheet('message')}
            className="flex-shrink-0 h-11 w-11 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-center"
            aria-label="Μήνυμα"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
