'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { FilterChip } from '@/components/forms/filter-chip'
import { cn, formatDate, formatPrice } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { getBuyerRequests } from '@/lib/mock-data/buyer-requests'
import type { BuyerRequest } from '@/lib/mock-data/buyer-requests'
import { BUYER_STATUS_CONFIG, getBuyerRequestHint } from '@/lib/requests/status'
import { DELIVERY_PREFERENCE_LABELS } from '@/lib/requests/delivery'

// ─── Constants ────────────────────────────────────────────────────────────────

type BuyerFilter = 'all' | 'new' | 'in_progress' | 'with_price' | 'completed'

const FILTER_OPTIONS: { value: BuyerFilter; label: string }[] = [
  { value: 'all',         label: 'Όλα' },
  { value: 'new',         label: 'Νέα' },
  { value: 'in_progress', label: 'Σε εξέλιξη' },
  { value: 'with_price',  label: 'Με τιμή' },
  { value: 'completed',   label: 'Ολοκληρωμένα' },
]


function matchesFilter(req: BuyerRequest, f: BuyerFilter): boolean {
  if (f === 'all') return true
  if (f === 'new')         return req.status === 'new' || req.status === 'needs_price'
  if (f === 'in_progress') return req.status === 'in_progress'
  if (f === 'with_price')  return req.priceSent !== undefined || req.partPrice > 0
  if (f === 'completed')   return req.status === 'completed'
  return true
}

// ─── Request card ─────────────────────────────────────────────────────────────

interface RequestCardProps {
  req: BuyerRequest
  msgPanelOpen: boolean
  msgText: string
  onOpenMsg: () => void
  onCloseMsg: () => void
  onMsgChange: (v: string) => void
  onSendMsg: () => void
  onAcceptPrice: () => void
}

function BuyerRequestCard({
  req, msgPanelOpen, msgText,
  onOpenMsg, onCloseMsg, onMsgChange, onSendMsg, onAcceptPrice,
}: RequestCardProps) {
  const { label: statusLabel, variant: statusVariant } = BUYER_STATUS_CONFIG[req.status]
  const hasPrice = req.partPrice > 0

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Card body */}
      <div className="px-4 py-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <Badge variant={statusVariant}>{statusLabel}</Badge>
            <span className="text-sm font-semibold text-slate-900 truncate">{req.partName}</span>
          </div>
          <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(req.createdAt)}</span>
        </div>

        {/* Seller + vehicle */}
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mb-1.5">
          {req.sellerName && (
            <span className="text-xs text-slate-600 font-medium">{req.sellerName}</span>
          )}
          {req.donorVehicle && (
            <span className="text-xs text-slate-400">{req.donorVehicle}</span>
          )}
          <span className="text-xs text-slate-400 font-mono">{req.partSku}</span>
        </div>

        {/* Price info */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {hasPrice ? (
            <span className="text-sm font-semibold text-slate-900 tabular-nums">{formatPrice(req.partPrice)}</span>
          ) : (
            <span className="text-xs text-amber-700 font-medium">Κατόπιν ζήτησης</span>
          )}
          <span className="text-xs text-slate-400">{DELIVERY_PREFERENCE_LABELS[req.delivery]}</span>
        </div>

        {/* Seller response: sent price */}
        {req.priceSent && (
          <div className="flex items-center gap-1.5 mb-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
            <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-xs font-semibold text-green-800">Τιμή πωλητή: {formatPrice(req.priceSent)}</p>
          </div>
        )}

        {/* Seller reply */}
        {req.replyNote && (
          <div className="mb-1.5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
            <p className="text-xs text-blue-800 line-clamp-1">
              <span className="font-semibold">Απάντηση πωλητή:</span> {req.replyNote}
            </p>
          </div>
        )}

        {/* Buyer message preview */}
        <p className="text-xs text-slate-500 italic line-clamp-1">&ldquo;{req.message}&rdquo;</p>

        {/* Lifecycle hint */}
        <p className={cn(
          'text-xs mt-1',
          req.priceSent !== undefined && req.status !== 'completed'
            ? 'font-medium text-green-700'
            : req.status === 'completed' ? 'text-slate-400' : 'text-slate-500'
        )}>
          {getBuyerRequestHint(req)}
        </p>
      </div>

      {/* Action row */}
      {!msgPanelOpen && (
        <div className="border-t border-slate-100 px-4 py-2.5 flex items-center gap-2 flex-wrap">
          <Link
            href={ROUTES.SELLER.ORDER_DETAIL(req.id).replace('/seller/', '/buyer/')}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Άνοιγμα
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={onOpenMsg}
            className="text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Μήνυμα
          </button>
          {req.priceSent && req.status !== 'completed' && (
            <button
              type="button"
              onClick={onAcceptPrice}
              className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors ml-auto"
            >
              Αποδοχή τιμής ✓
            </button>
          )}
        </div>
      )}

      {/* Message panel */}
      {msgPanelOpen && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 space-y-2.5">
          <textarea
            value={msgText}
            onChange={(e) => onMsgChange(e.target.value)}
            placeholder="Γράψε το μήνυμά σου..."
            rows={2}
            className={cn(
              'w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 resize-none',
              'text-slate-900 placeholder:text-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500'
            )}
          />
          <div className="flex gap-2">
            <Button type="button" variant="primary" onClick={onSendMsg} className="h-9 text-xs flex-1" disabled={!msgText.trim()}>
              Αποστολή μηνύματος
            </Button>
            <button type="button" onClick={onCloseMsg} className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2">
              Ακύρωση
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main list ────────────────────────────────────────────────────────────────

export function BuyerRequestList() {
  const [requests, setRequests] = useState<BuyerRequest[]>(getBuyerRequests)
  const [activeFilter, setActiveFilter] = useState<BuyerFilter>('all')
  const [msgPanel, setMsgPanel] = useState<string | null>(null)
  const [msgText, setMsgText] = useState('')
  const [successNote, setSuccessNote] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setSuccessNote(msg)
    setTimeout(() => setSuccessNote(null), 3000)
  }

  const handleAcceptPrice = (id: string) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'completed' } : r))
    showToast('Η τιμή αποδέχτηκε για το demo. Το επόμενο βήμα θα είναι παραλαβή ή αποστολή.')
  }

  const handleSendMsg = (id: string) => {
    if (!msgText.trim()) return
    setMsgPanel(null)
    setMsgText('')
    showToast('Το μήνυμα στάλθηκε για το demo.')
    void id
  }

  // Summary counts
  const newCount = requests.filter((r) => r.status === 'new' || r.status === 'needs_price').length
  const repliedCount = requests.filter((r) => r.priceSent !== undefined || r.replyNote !== undefined).length
  const actionCount = requests.filter((r) => r.priceSent !== undefined && r.status !== 'completed').length

  const filtered = requests.filter((r) => matchesFilter(r, activeFilter))

  return (
    <>
      {/* Toast */}
      {successNote && (
        <div className="fixed top-16 left-0 right-0 z-40 flex justify-center px-4 pt-3 pointer-events-none">
          <div className="bg-green-600 text-white text-sm font-medium rounded-xl px-5 py-3 shadow-lg max-w-sm text-center">
            {successNote}
          </div>
        </div>
      )}

      <PageContainer className="pb-24 lg:pb-10">
        <SectionHeader
          title="Τα αιτήματά μου"
          subtitle="Παρακολούθησε τιμές, διαθεσιμότητα και απαντήσεις από πωλητές."
        />

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Νέα',                value: newCount,     color: 'text-amber-600' },
            { label: 'Με απάντηση',        value: repliedCount, color: 'text-blue-600' },
            { label: 'Χρειάζονται ενέργεια', value: actionCount, color: 'text-green-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl px-3 py-3 text-center">
              <p className={cn('text-2xl font-bold tabular-nums', color)}>{value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter chips */}
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
          {filtered.length === requests.length
            ? `${requests.length} αιτήματα`
            : `${filtered.length} από ${requests.length} αιτήματα`}
        </p>

        {filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl py-14 text-center">
            <p className="text-sm font-medium text-slate-600 mb-1">Δεν υπάρχουν αιτήματα</p>
            <p className="text-xs text-slate-400 mb-4">Τα αιτήματά σου θα εμφανίζονται εδώ.</p>
            {activeFilter !== 'all' && (
              <button type="button" onClick={() => setActiveFilter('all')} className="text-xs font-medium text-blue-600 hover:text-blue-700">
                Καθαρισμός φίλτρου
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => (
              <BuyerRequestCard
                key={req.id}
                req={req}
                msgPanelOpen={msgPanel === req.id}
                msgText={msgText}
                onOpenMsg={() => { setMsgPanel(req.id); setMsgText('') }}
                onCloseMsg={() => setMsgPanel(null)}
                onMsgChange={setMsgText}
                onSendMsg={() => handleSendMsg(req.id)}
                onAcceptPrice={() => handleAcceptPrice(req.id)}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </>
  )
}
