'use client'

import { useState } from 'react'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { FilterChip } from '@/components/forms/filter-chip'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { formatDate } from '@/lib/utils'
import { mockBuyerRequests } from '@/lib/mock-data/buyer-requests'
import type { BuyerRequest } from '@/lib/mock-data/buyer-requests'

type UserRole = 'buyer' | 'seller'

interface UserItem {
  id:             string
  name:           string
  contact?:       string
  role:           UserRole
  typeLabel:      string
  requestCount:   number
  activeCount:    number
  completedCount: number
  latestActivity: string
  note:           string
}

function latestDate(reqs: BuyerRequest[]): string {
  return reqs.reduce((max, r) => (r.createdAt > max ? r.createdAt : max), reqs[0].createdAt)
}

// Group buyers by buyerCompany
const buyerMap = new Map<string, { contact?: string; reqs: BuyerRequest[] }>()
for (const req of mockBuyerRequests) {
  const entry = buyerMap.get(req.buyerCompany)
  if (entry) {
    entry.reqs.push(req)
  } else {
    buyerMap.set(req.buyerCompany, { contact: req.buyerContact, reqs: [req] })
  }
}

// Group sellers by sellerName
const sellerMap = new Map<string, BuyerRequest[]>()
for (const req of mockBuyerRequests) {
  if (!req.sellerName) continue
  const existing = sellerMap.get(req.sellerName)
  if (existing) existing.push(req)
  else sellerMap.set(req.sellerName, [req])
}

const buyerUsers: UserItem[] = [...buyerMap.entries()].map(([name, { contact, reqs }], i) => {
  const active    = reqs.filter((r) => r.status !== 'completed').length
  const completed = reqs.filter((r) => r.status === 'completed').length
  return {
    id:             `buyer-${i}`,
    name,
    contact,
    role:           'buyer',
    typeLabel:      'Αγοραστής',
    requestCount:   reqs.length,
    activeCount:    active,
    completedCount: completed,
    latestActivity: latestDate(reqs),
    note:           completed > 0
      ? 'Αγοραστής με ολοκληρωμένο demo αίτημα.'
      : 'Αγοραστής με ενεργά αιτήματα σε παρακολούθηση.',
  }
})

const sellerUsers: UserItem[] = [...sellerMap.entries()].map(([name, reqs], i) => {
  const active    = reqs.filter((r) => r.status !== 'completed').length
  const completed = reqs.filter((r) => r.status === 'completed').length
  return {
    id:             `seller-${i}`,
    name,
    role:           'seller',
    typeLabel:      'Πωλητής',
    requestCount:   reqs.length,
    activeCount:    active,
    completedCount: completed,
    latestActivity: latestDate(reqs),
    note:           'Πωλητής — αιτήματα αγοραστών σε εξέλιξη.',
  }
})

const allUsers: UserItem[] = [...buyerUsers, ...sellerUsers]

const totalCount   = allUsers.length
const buyerCount   = buyerUsers.length
const sellerCount  = sellerUsers.length
const activeCount  = allUsers.filter((u) => u.activeCount > 0).length

type UserFilter = 'all' | 'buyer' | 'seller' | 'active'

const FILTER_OPTIONS: { value: UserFilter; label: string }[] = [
  { value: 'all',    label: 'Όλοι' },
  { value: 'buyer',  label: 'Αγοραστές' },
  { value: 'seller', label: 'Πωλητές' },
  { value: 'active', label: 'Με ενεργά αιτήματα' },
]

function matchesFilter(user: UserItem, f: UserFilter): boolean {
  if (f === 'all')    return true
  if (f === 'buyer')  return user.role === 'buyer'
  if (f === 'seller') return user.role === 'seller'
  if (f === 'active') return user.activeCount > 0
  return true
}

const ROLE_VARIANT: Record<UserRole, BadgeVariant> = {
  buyer:  'brand',
  seller: 'success',
}

function UserCard({ user }: { user: UserItem }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
          {user.contact && (
            <p className="text-xs text-slate-500 mt-0.5">{user.contact}</p>
          )}
        </div>
        <Badge variant={ROLE_VARIANT[user.role]}>{user.typeLabel}</Badge>
      </div>

      <div className="flex items-center gap-3 flex-wrap mt-2 mb-2 text-xs text-slate-600">
        <span>
          <span className="font-semibold text-slate-900">{user.requestCount}</span> αιτήματα
        </span>
        <span className="text-slate-300">·</span>
        <span>
          <span className={`font-semibold ${user.activeCount > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
            {user.activeCount}
          </span> ενεργά
        </span>
        <span className="text-slate-300">·</span>
        <span>
          <span className={`font-semibold ${user.completedCount > 0 ? 'text-green-600' : 'text-slate-500'}`}>
            {user.completedCount}
          </span> demo
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-1">{user.note}</p>
      <p className="text-xs text-slate-400">Τελευταία δραστηριότητα: {formatDate(user.latestActivity)}</p>
    </div>
  )
}

export default function AdminUsersPage() {
  const [activeFilter, setActiveFilter] = useState<UserFilter>('all')

  const filtered = allUsers.filter((u) => matchesFilter(u, activeFilter))

  return (
    <PageContainer className="pb-10">
      <SectionHeader
        title="Users"
        subtitle="Χρήστες που συμμετέχουν σε αιτήματα marketplace."
      />

      <DashboardGrid cols={4} className="mb-6">
        <MetricCard label="Σύνολο χρηστών"       value={totalCount} />
        <MetricCard label="Αγοραστές"             value={buyerCount} />
        <MetricCard label="Πωλητές"               value={sellerCount} />
        <MetricCard label="Με ενεργά αιτήματα"    value={activeCount} />
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
          ? `${totalCount} χρήστες`
          : `${filtered.length} από ${totalCount} χρήστες`}
      </p>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-14 text-center">
          <p className="text-sm font-medium text-slate-600">Δεν υπάρχουν χρήστες</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
