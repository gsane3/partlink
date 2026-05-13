'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { FilterChip } from '@/components/forms/filter-chip'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { formatDate } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { mockBuyerRequests } from '@/lib/mock-data/buyer-requests'
import type { RequestStatus } from '@/lib/mock-data/buyer-requests'
import { SELLER_STATUS_CONFIG } from '@/lib/requests/status'

type Severity = 'low' | 'medium' | 'high'

interface DisputeItem {
  id:            string
  requestId:     string
  type:          string
  severity:      Severity
  buyerCompany:  string
  sellerName:    string
  partName:      string
  requestStatus: RequestStatus
  note:          string
  createdAt:     string
}

// One review item per request. Rule priority:
// completed → demo close | priceSent → price review | needs_price+unknown → delivery | needs_price → delay | new → compatibility
const allItems: DisputeItem[] = mockBuyerRequests.map((req) => {
  let type: string
  let severity: Severity
  let note: string

  if (req.status === 'completed') {
    type     = 'Ολοκληρωμένο demo'
    severity = 'low'
    note     = 'Το αίτημα ολοκληρώθηκε στο demo.'
  } else if (req.priceSent !== undefined) {
    type     = 'Διαφορά στην τιμή'
    severity = 'medium'
    note     = 'Ο πωλητής έστειλε τιμή. Το θέμα παρακολουθείται ως review αποδοχής.'
  } else if (req.status === 'needs_price' && req.delivery === 'unknown') {
    type     = 'Παραλαβή αδιευκρίνιστη'
    severity = 'medium'
    note     = 'Ο τρόπος παραλαβής δεν έχει διευκρινιστεί μεταξύ των μερών.'
  } else if (req.status === 'needs_price') {
    type     = 'Καθυστέρηση τιμής'
    severity = 'high'
    note     = 'Ο αγοραστής ζήτησε τιμή αλλά δεν έχει λάβει απάντηση.'
  } else {
    type     = 'Αβεβαιότητα συμβατότητας'
    severity = req.delivery === 'shipping' ? 'high' : 'medium'
    note     = 'Δεν έχει επιβεβαιωθεί η συμβατότητα του ανταλλακτικού από τον πωλητή.'
  }

  return {
    id:            `dispute-${req.id}`,
    requestId:     req.id,
    type,
    severity,
    buyerCompany:  req.buyerCompany,
    sellerName:    req.sellerName ?? 'Πωλητής',
    partName:      req.partName,
    requestStatus: req.status,
    note,
    createdAt:     req.createdAt,
  }
})

const totalCount     = allItems.length
const highCount      = allItems.filter((i) => i.severity === 'high').length
const monitorCount   = allItems.filter((i) => i.severity === 'high' || i.severity === 'medium').length
const completedCount = allItems.filter((i) => i.requestStatus === 'completed').length

type DisputeFilter = 'all' | 'high' | 'medium' | 'low' | 'completed'

const FILTER_OPTIONS: { value: DisputeFilter; label: string }[] = [
  { value: 'all',       label: 'Όλα' },
  { value: 'high',      label: 'Υψηλή' },
  { value: 'medium',    label: 'Μεσαία' },
  { value: 'low',       label: 'Χαμηλή' },
  { value: 'completed', label: 'Ολοκληρωμένα' },
]

function matchesFilter(item: DisputeItem, f: DisputeFilter): boolean {
  if (f === 'all')       return true
  if (f === 'high')      return item.severity === 'high'
  if (f === 'medium')    return item.severity === 'medium'
  if (f === 'low')       return item.severity === 'low'
  if (f === 'completed') return item.requestStatus === 'completed'
  return true
}

const SEVERITY_VARIANT: Record<Severity, BadgeVariant> = {
  high:   'danger',
  medium: 'warning',
  low:    'muted',
}

const SEVERITY_LABEL: Record<Severity, string> = {
  high:   'Υψηλή',
  medium: 'Μεσαία',
  low:    'Χαμηλή',
}

function DisputeCard({ item }: { item: DisputeItem }) {
  const { label: statusLabel, variant: statusVariant } = SELLER_STATUS_CONFIG[item.requestStatus]

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <Badge variant={SEVERITY_VARIANT[item.severity]}>{SEVERITY_LABEL[item.severity]}</Badge>
          <span className="text-sm font-semibold text-slate-900 truncate">{item.type}</span>
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(item.createdAt)}</span>
      </div>

      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <span className="text-xs font-mono text-slate-400">{item.requestId}</span>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      <p className="text-sm font-medium text-slate-900 truncate mb-0.5">{item.partName}</p>

      <p className="text-xs text-slate-500 mb-2">
        {item.buyerCompany}
        <span className="text-slate-300 mx-1.5">→</span>
        {item.sellerName}
      </p>

      <p className="text-xs text-slate-600 mb-3 leading-relaxed">{item.note}</p>

      <Link
        href={ROUTES.SELLER.ORDER_DETAIL(item.requestId)}
        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        Άνοιγμα αιτήματος seller
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}

export default function AdminDisputesPage() {
  const [activeFilter, setActiveFilter] = useState<DisputeFilter>('all')

  const filtered = allItems.filter((i) => matchesFilter(i, activeFilter))

  return (
    <PageContainer className="pb-10">
      <SectionHeader
        title="Disputes"
        subtitle="Πιθανά θέματα από αιτήματα marketplace."
      />

      <DashboardGrid cols={4} className="mb-6">
        <MetricCard label="Σύνολο θεμάτων"      value={totalCount} />
        <MetricCard label="Υψηλή προτεραιότητα" value={highCount} />
        <MetricCard label="Σε παρακολούθηση"    value={monitorCount} />
        <MetricCard label="Ολοκληρωμένα demo"   value={completedCount} />
      </DashboardGrid>

      <div className="flex gap-1.5 overflow-x-auto pb-0.5 mb-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {FILTER_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={activeFilter === opt.value}
            onClick={() => setActiveFilter(opt.value)}
          />
        ))}
      </div>

      <p className="text-xs text-slate-500 mb-3">
        {filtered.length === totalCount
          ? `${totalCount} θέματα`
          : `${filtered.length} από ${totalCount} θέματα`}
      </p>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-14 text-center">
          <p className="text-sm font-medium text-slate-600">Δεν υπάρχουν θέματα</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <DisputeCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
