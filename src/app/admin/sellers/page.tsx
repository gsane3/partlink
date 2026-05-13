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

interface SellerItem {
  id:              string
  name:            string
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

// Group by sellerName
const sellerMap = new Map<string, BuyerRequest[]>()
for (const req of mockBuyerRequests) {
  const name = req.sellerName
  if (!name) continue
  const list = sellerMap.get(name)
  if (list) list.push(req)
  else sellerMap.set(name, [req])
}

const allSellers: SellerItem[] = [...sellerMap.entries()].map(([name, reqs], i) => {
  const active     = reqs.filter((r) => r.status !== 'completed').length
  const needsPrice = reqs.filter((r) => r.status === 'needs_price').length
  const priceSent  = reqs.filter((r) => r.priceSent !== undefined).length
  const completed  = reqs.filter((r) => r.status === 'completed').length
  return {
    id:              `seller-${i}`,
    name,
    requestCount:    reqs.length,
    activeCount:     active,
    needsPriceCount: needsPrice,
    priceSentCount:  priceSent,
    completedCount:  completed,
    latestActivity:  latestDate(reqs),
    note:            needsPrice > 0
      ? `${needsPrice} αιτήματα περιμένουν τιμή — παρακολούθηση.`
      : `Πωλητής με ${active} ενεργά αιτήματα σε εξέλιξη.`,
  }
})

const totalCount     = allSellers.length
const activeTotal    = allSellers.reduce((sum, s) => sum + s.activeCount, 0)
const needsPriceTotal = allSellers.reduce((sum, s) => sum + s.needsPriceCount, 0)
const priceSentTotal  = allSellers.reduce((sum, s) => sum + s.priceSentCount, 0)

type SellerFilter = 'all' | 'active' | 'needs_price' | 'price_sent' | 'completed'

const FILTER_OPTIONS: { value: SellerFilter; label: string }[] = [
  { value: 'all',         label: 'Όλοι' },
  { value: 'active',      label: 'Με ενεργά αιτήματα' },
  { value: 'needs_price', label: 'Αναμονή τιμής' },
  { value: 'price_sent',  label: 'Τιμή στάλθηκε' },
  { value: 'completed',   label: 'Demo ολοκληρώσεις' },
]

function matchesFilter(s: SellerItem, f: SellerFilter): boolean {
  if (f === 'all')         return true
  if (f === 'active')      return s.activeCount > 0
  if (f === 'needs_price') return s.needsPriceCount > 0
  if (f === 'price_sent')  return s.priceSentCount > 0
  if (f === 'completed')   return s.completedCount > 0
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

function SellerCard({ seller }: { seller: SellerItem }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{seller.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{seller.note}</p>
        </div>
        <Badge variant="success">Πωλητής</Badge>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-3 text-center">
        <StatItem label="Σύνολο"        value={seller.requestCount}    accent="text-slate-700" />
        <StatItem label="Ενεργά"        value={seller.activeCount}     accent={seller.activeCount > 0 ? 'text-blue-600' : 'text-slate-500'} />
        <StatItem label="Αναμονή"         value={seller.needsPriceCount} accent={seller.needsPriceCount > 0 ? 'text-amber-600' : 'text-slate-500'} />
        <StatItem label="Με τιμή"           value={seller.priceSentCount}  accent={seller.priceSentCount > 0 ? 'text-blue-600' : 'text-slate-500'} />
        <StatItem label="Demo"          value={seller.completedCount}  accent={seller.completedCount > 0 ? 'text-green-600' : 'text-slate-500'} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">Τελευταία δραστηριότητα: {formatDate(seller.latestActivity)}</p>
        <Link
          href={ROUTES.SELLER.ORDERS}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Αιτήματα seller
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default function AdminSellersPage() {
  const [activeFilter, setActiveFilter] = useState<SellerFilter>('all')
  const [search, setSearch] = useState('')

  const filtered = allSellers
    .filter((s) => matchesFilter(s, activeFilter))
    .filter((s) => {
      if (!search.trim()) return true
      return s.name.toLowerCase().includes(search.toLowerCase())
    })

  return (
    <PageContainer className="pb-10">
      <SectionHeader
        title="Sellers"
        subtitle="Πωλητές που συμμετέχουν σε αιτήματα marketplace."
      />

      <DashboardGrid cols={4} className="mb-6">
        <MetricCard label="Σύνολο πωλητών" value={totalCount} />
        <MetricCard label="Ενεργά αιτήματα" value={activeTotal} />
        <MetricCard label="Αναμονή τιμής"   value={needsPriceTotal} />
        <MetricCard label="Τιμή στάλθηκε"   value={priceSentTotal} />
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
        placeholder="Αναζήτηση πωλητή..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
        className="mb-5"
      />

      <p className="text-xs text-slate-500 mb-3">
        {filtered.length === totalCount
          ? `${totalCount} πωλητές`
          : `${filtered.length} από ${totalCount} πωλητές`}
      </p>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-14 text-center">
          <p className="text-sm font-medium text-slate-600">Δεν βρέθηκαν πωλητές</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((seller) => (
            <SellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
