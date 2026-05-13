'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { FilterChip } from '@/components/forms/filter-chip'
import { SearchInput } from '@/components/forms/search-input'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { formatDate } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { mockBuyerRequests } from '@/lib/mock-data/buyer-requests'
import type { BuyerRequest } from '@/lib/mock-data/buyer-requests'

interface BuyerItem {
  id:              string
  name:            string
  contact?:        string
  requestCount:    number
  activeCount:     number
  needsPriceCount: number
  priceSentCount:  number
  completedCount:  number
  latestActivity:  string
  note:            string
}

function latestDate(reqs: BuyerRequest[]): string {
  return reqs.reduce((max, r) => (r.createdAt > max ? r.createdAt : max), reqs[0].createdAt)
}

function buyerNote(b: { needsPriceCount: number; priceSentCount: number; completedCount: number; activeCount: number }): string {
  if (b.priceSentCount > 0 && b.completedCount === 0) return 'Τιμή από πωλητή — σε παρακολούθηση αποδοχής.'
  if (b.needsPriceCount > 0)                          return 'Αγοραστής που αναμένει τιμή.'
  if (b.completedCount > 0)                           return 'Αγοραστής με ολοκληρωμένο demo αίτημα.'
  return 'Αγοραστής σε αναμονή απάντησης.'
}

// Group by buyerCompany
const buyerMap = new Map<string, { contact?: string; reqs: BuyerRequest[] }>()
for (const req of mockBuyerRequests) {
  const entry = buyerMap.get(req.buyerCompany)
  if (entry) {
    entry.reqs.push(req)
  } else {
    buyerMap.set(req.buyerCompany, { contact: req.buyerContact, reqs: [req] })
  }
}

const allBuyers: BuyerItem[] = [...buyerMap.entries()].map(([name, { contact, reqs }], i) => {
  const active     = reqs.filter((r) => r.status !== 'completed').length
  const needsPrice = reqs.filter((r) => r.status === 'needs_price').length
  const priceSent  = reqs.filter((r) => r.priceSent !== undefined).length
  const completed  = reqs.filter((r) => r.status === 'completed').length
  const item = { needsPriceCount: needsPrice, priceSentCount: priceSent, completedCount: completed, activeCount: active }
  return {
    id:              `buyer-${i}`,
    name,
    contact,
    requestCount:    reqs.length,
    activeCount:     active,
    needsPriceCount: needsPrice,
    priceSentCount:  priceSent,
    completedCount:  completed,
    latestActivity:  latestDate(reqs),
    note:            buyerNote(item),
  }
})

const totalCount      = allBuyers.length
const activeTotal     = allBuyers.reduce((sum, b) => sum + b.activeCount, 0)
const needsPriceTotal = allBuyers.reduce((sum, b) => sum + b.needsPriceCount, 0)
const completedTotal  = allBuyers.reduce((sum, b) => sum + b.completedCount, 0)

type BuyerFilter = 'all' | 'active' | 'needs_price' | 'price_sent' | 'completed'

const FILTER_OPTIONS: { value: BuyerFilter; label: string }[] = [
  { value: 'all',         label: 'Όλοι' },
  { value: 'active',      label: 'Με ενεργά αιτήματα' },
  { value: 'needs_price', label: 'Αναμονή τιμής' },
  { value: 'price_sent',  label: 'Τιμή στάλθηκε' },
  { value: 'completed',   label: 'Demo ολοκληρώσεις' },
]

function matchesFilter(b: BuyerItem, f: BuyerFilter): boolean {
  if (f === 'all')         return true
  if (f === 'active')      return b.activeCount > 0
  if (f === 'needs_price') return b.needsPriceCount > 0
  if (f === 'price_sent')  return b.priceSentCount > 0
  if (f === 'completed')   return b.completedCount > 0
  return true
}

function StatItem({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <span className="flex flex-col items-center">
      <span className={`text-base font-bold tabular-nums ${accent}`}>{value}</span>
      <span className="text-[11px] text-slate-400 leading-tight">{label}</span>
    </span>
  )
}

function BuyerCard({ buyer }: { buyer: BuyerItem }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{buyer.name}</p>
          {buyer.contact && (
            <p className="text-xs text-slate-500 mt-0.5">{buyer.contact}</p>
          )}
        </div>
        <Badge variant="brand">Αγοραστής</Badge>
      </div>

      <p className="text-xs text-slate-500 mb-3">{buyer.note}</p>

      <div className="grid grid-cols-5 gap-2 mb-3 text-center">
        <StatItem label="Σύνολο"  value={buyer.requestCount}    accent="text-slate-700" />
        <StatItem label="Ενεργά"  value={buyer.activeCount}     accent={buyer.activeCount > 0 ? 'text-blue-600' : 'text-slate-500'} />
        <StatItem label="Τιμή;"   value={buyer.needsPriceCount} accent={buyer.needsPriceCount > 0 ? 'text-amber-600' : 'text-slate-500'} />
        <StatItem label="Με τιμή"    value={buyer.priceSentCount}  accent={buyer.priceSentCount > 0 ? 'text-blue-600' : 'text-slate-500'} />
        <StatItem label="Demo"    value={buyer.completedCount}  accent={buyer.completedCount > 0 ? 'text-green-600' : 'text-slate-500'} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">Τελευταία δραστηριότητα: {formatDate(buyer.latestActivity)}</p>
        <Link
          href={ROUTES.BUYER.ORDERS}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Αιτήματα buyer
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default function AdminBuyersPage() {
  const [activeFilter, setActiveFilter] = useState<BuyerFilter>('all')
  const [search, setSearch] = useState('')

  const filtered = allBuyers
    .filter((b) => matchesFilter(b, activeFilter))
    .filter((b) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        b.name.toLowerCase().includes(q) ||
        (b.contact?.toLowerCase().includes(q) ?? false)
      )
    })

  return (
    <PageContainer className="pb-10">
      <SectionHeader
        title="Buyers"
        subtitle="Αγοραστές που συμμετέχουν σε αιτήματα marketplace."
      />

      <DashboardGrid cols={4} className="mb-6">
        <MetricCard label="Σύνολο αγοραστών" value={totalCount} />
        <MetricCard label="Ενεργά αιτήματα"  value={activeTotal} />
        <MetricCard label="Αναμονή τιμής"    value={needsPriceTotal} />
        <MetricCard label="Demo ολοκληρώσεις" value={completedTotal} />
      </DashboardGrid>

      <div className="overflow-x-auto pb-0.5 mb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-1.5 min-w-max pr-4">
          {FILTER_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              selected={activeFilter === opt.value}
              onClick={() => setActiveFilter(opt.value)}
            />
          ))}
        </div>
      </div>
      <SearchInput
        placeholder="Αναζήτηση αγοραστή..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
        className="mb-5"
      />

      <p className="text-xs text-slate-500 mb-3">
        {filtered.length === totalCount
          ? `${totalCount} αγοραστές`
          : `${filtered.length} από ${totalCount} αγοραστές`}
      </p>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-14 text-center">
          <p className="text-sm font-medium text-slate-600">Δεν βρέθηκαν αγοραστές</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((buyer) => (
            <BuyerCard key={buyer.id} buyer={buyer} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
