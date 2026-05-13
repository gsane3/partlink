'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PriceInput } from '@/components/forms/price-input'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { FilterChip } from '@/components/forms/filter-chip'
import { cn, formatDate, formatPrice } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { mockBuyerRequests } from '@/lib/mock-data/buyer-requests'
import type { BuyerRequest, RequestStatus } from '@/lib/mock-data/buyer-requests'
import { SELLER_STATUS_CONFIG, getSellerRequestHint } from '@/lib/requests/status'
import { DELIVERY_PREFERENCE_LABELS } from '@/lib/requests/delivery'

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestFilter = 'all' | RequestStatus
type ActionType = 'price' | 'reply'

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { value: RequestFilter; label: string }[] = [
  { value: 'all',          label: 'Όλα' },
  { value: 'new',          label: 'Νέα' },
  { value: 'needs_price',  label: 'Χρειάζονται τιμή' },
  { value: 'in_progress',  label: 'Σε εξέλιξη' },
  { value: 'completed',    label: 'Ολοκληρωμένα' },
]


// ─── Request card ─────────────────────────────────────────────────────────────

interface RequestCardProps {
  req: BuyerRequest
  isExpanded: boolean
  activePanel: ActionType | null
  priceInput: string
  priceMsg: string
  replyText: string
  onToggle: () => void
  onMarkAvailable: () => void
  onMarkUnavailable: () => void
  onOpenPrice: () => void
  onOpenReply: () => void
  onClosePanel: () => void
  onPriceInputChange: (v: string) => void
  onPriceMsgChange: (v: string) => void
  onReplyTextChange: (v: string) => void
  onSubmitPrice: () => void
  onSubmitReply: () => void
}

function RequestCard({
  req,
  isExpanded,
  activePanel,
  priceInput,
  priceMsg,
  replyText,
  onToggle,
  onMarkAvailable,
  onMarkUnavailable,
  onOpenPrice,
  onOpenReply,
  onClosePanel,
  onPriceInputChange,
  onPriceMsgChange,
  onReplyTextChange,
  onSubmitPrice,
  onSubmitReply,
}: RequestCardProps) {
  const { label: statusLabel, variant: statusVariant } = SELLER_STATUS_CONFIG[req.status]
  const hasPrice = req.partPrice > 0

  const showActions = req.status !== 'completed'

  return (
    <div className={cn(
      'bg-white border border-slate-200 rounded-xl overflow-hidden',
      isExpanded && 'ring-1 ring-blue-200 border-blue-200'
    )}>
      {/* ── Collapsed header ── */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <Badge variant={statusVariant}>{statusLabel}</Badge>
            <span className="text-sm font-semibold text-slate-900 truncate">{req.partName}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {hasPrice ? (
              <span className="text-sm font-bold text-slate-900 tabular-nums">{formatPrice(req.partPrice)}</span>
            ) : (
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">Χωρίς τιμή</span>
            )}
            <svg
              className={cn('w-4 h-4 text-slate-400 transition-transform flex-shrink-0', isExpanded && 'rotate-180')}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-700">{req.buyerCompany}</p>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
          {req.donorVehicle && (
            <span className="text-xs text-slate-500">{req.donorVehicle}</span>
          )}
          <span className="text-xs text-slate-400">SKU: {req.partSku}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-400">{formatDate(req.createdAt)}</span>
          <span className="text-slate-200">·</span>
          <span className="text-xs text-slate-400">{DELIVERY_PREFERENCE_LABELS[req.delivery]}</span>
        </div>
        <p className={cn(
          'text-xs mt-1',
          req.status === 'needs_price' ? 'font-medium text-amber-700' :
          req.priceSent !== undefined ? 'text-blue-600' :
          req.status === 'completed' ? 'text-slate-400' :
          'text-slate-600'
        )}>
          {getSellerRequestHint(req)}
        </p>
        {req.message && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">&ldquo;{req.message}&rdquo;</p>
        )}
      </button>

      {/* ── Expanded detail ── */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/40 px-4 py-4 space-y-4">

          {/* Link to full detail page */}
          <div className="flex justify-end">
            <Link
              href={ROUTES.SELLER.ORDER_DETAIL(req.id)}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Άνοιγμα
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Buyer details */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Αγοραστής</p>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              <p className="text-sm font-semibold text-slate-900">{req.buyerCompany}</p>
              {req.buyerContact && (
                <p className="text-xs text-slate-600">{req.buyerContact}</p>
              )}
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                <span>{req.buyerPhone}</span>
                <span>{req.buyerEmail}</span>
                <span>{req.buyerCity}</span>
              </div>
            </div>
          </div>

          {/* Message */}
          {req.message && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Μήνυμα αγοραστή</p>
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
                <p className="text-sm text-slate-700 leading-relaxed">{req.message}</p>
              </div>
            </div>
          )}

          {/* Price sent note */}
          {req.priceSent && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-800">
                Τιμή απεσταλμένη: <span className="font-bold">{formatPrice(req.priceSent)}</span>
              </p>
            </div>
          )}

          {/* Reply sent note */}
          {req.replyNote && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wide mb-1">Απάντηση σταλμένη</p>
              <p className="text-sm text-blue-800 italic">&ldquo;{req.replyNote}&rdquo;</p>
            </div>
          )}

          {/* Compatibility warning */}
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-3">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              Πριν επιβεβαιώσεις, έλεγξε OEM / VIN ή ρώτα τον αγοραστή για στοιχεία οχήματος.
            </p>
          </div>

          {/* ── Action area ── */}
          {showActions && (
            <>
              {activePanel === null ? (
                /* Action buttons */
                <div className="grid grid-cols-2 gap-2">
                  {(req.status === 'new' || req.status === 'needs_price') && (
                    <button
                      type="button"
                      onClick={onMarkAvailable}
                      className="h-11 rounded-xl border-2 border-green-400 bg-green-50 text-sm font-semibold text-green-800 hover:bg-green-100 transition-colors"
                    >
                      Διαθέσιμο
                    </button>
                  )}
                  {(req.status === 'new' || req.status === 'needs_price') && (
                    <button
                      type="button"
                      onClick={onMarkUnavailable}
                      className="h-11 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      Δεν είναι διαθέσιμο
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onOpenPrice}
                    className={cn(
                      'h-11 rounded-xl border-2 text-sm font-semibold transition-colors',
                      req.status === 'needs_price' && !req.priceSent
                        ? 'border-blue-500 bg-blue-600 text-white hover:bg-blue-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    {req.priceSent ? 'Αλλαγή τιμής' : 'Αποστολή τιμής'}
                  </button>
                  <button
                    type="button"
                    onClick={onOpenReply}
                    className="h-11 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Απάντηση
                  </button>
                </div>
              ) : activePanel === 'price' ? (
                /* Price panel */
                <div className="bg-white border border-blue-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 border-b border-blue-100">
                    <p className="text-sm font-semibold text-blue-900">Αποστολή τιμής</p>
                    <button type="button" onClick={onClosePanel} className="text-blue-500 hover:text-blue-700 text-xs font-medium">Ακύρωση</button>
                  </div>
                  <div className="px-4 py-4 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700 mb-1 block">Τιμή<span className="text-red-500 ml-0.5">*</span></label>
                      <PriceInput
                        value={priceInput}
                        onChange={(e) => onPriceInputChange(e.target.value)}
                        placeholder="0"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-700 mb-1 block">Μήνυμα <span className="font-normal text-slate-400">(προαιρετικό)</span></label>
                      <textarea
                        value={priceMsg}
                        onChange={(e) => onPriceMsgChange(e.target.value)}
                        placeholder="π.χ. Η τιμή ισχύει μέχρι 31/05."
                        rows={2}
                        className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 resize-none text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <Button type="button" variant="primary" fullWidth onClick={onSubmitPrice} className="h-11" disabled={!priceInput || parseFloat(priceInput) <= 0}>
                      Αποστολή τιμής
                    </Button>
                  </div>
                </div>
              ) : (
                /* Reply panel */
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">Απάντηση</p>
                    <button type="button" onClick={onClosePanel} className="text-slate-400 hover:text-slate-600 text-xs font-medium">Ακύρωση</button>
                  </div>
                  <div className="px-4 py-4 space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => onReplyTextChange(e.target.value)}
                      placeholder="Γράψε την απάντησή σου..."
                      rows={3}
                      className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 resize-none text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button type="button" variant="primary" fullWidth onClick={onSubmitReply} className="h-11" disabled={!replyText.trim()}>
                      Αποστολή απάντησης
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main inbox ───────────────────────────────────────────────────────────────

export function RequestInbox() {
  const [requests, setRequests] = useState<BuyerRequest[]>(mockBuyerRequests)
  const [activeFilter, setActiveFilter] = useState<RequestFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [actionPanel, setActionPanel] = useState<{ id: string; type: ActionType } | null>(null)
  const [priceInput, setPriceInput] = useState('')
  const [priceMsg, setPriceMsg] = useState('')
  const [replyText, setReplyText] = useState('')
  const [successNote, setSuccessNote] = useState<string | null>(null)

  // ─── Summary counts ──────────────────────────────────────────────────────────
  const newCount        = requests.filter((r) => r.status === 'new').length
  const needsPriceCount = requests.filter((r) => r.status === 'needs_price').length
  const inProgressCount = requests.filter((r) => r.status === 'in_progress').length

  // ─── Filtered list ───────────────────────────────────────────────────────────
  const filtered = requests.filter((r) =>
    activeFilter === 'all' || r.status === activeFilter
  )

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const showToast = (msg: string) => {
    setSuccessNote(msg)
    setTimeout(() => setSuccessNote(null), 3000)
  }

  const updateStatus = (id: string, status: RequestStatus) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
  }

  const openPanel = (id: string, type: ActionType) => {
    setActionPanel({ id, type })
    setPriceInput('')
    setPriceMsg('')
    setReplyText('')
  }

  const closePanel = () => setActionPanel(null)

  const handleMarkAvailable = (id: string) => {
    updateStatus(id, 'in_progress')
    showToast('Ο αγοραστής θα ενημερωθεί για διαθεσιμότητα.')
  }

  const handleMarkUnavailable = (id: string) => {
    updateStatus(id, 'completed')
    closePanel()
  }

  const handleSubmitPrice = (id: string) => {
    const price = parseFloat(priceInput) || 0
    if (price <= 0) return
    setRequests((prev) => prev.map((r) =>
      r.id === id ? { ...r, status: 'in_progress', priceSent: price, priceSentAt: new Date().toISOString() } : r
    ))
    closePanel()
    showToast('Η τιμή στάλθηκε για το demo.')
  }

  const handleSubmitReply = (id: string) => {
    if (!replyText.trim()) return
    setRequests((prev) => prev.map((r) =>
      r.id === id ? { ...r, replyNote: replyText.trim(), replyNoteAt: new Date().toISOString() } : r
    ))
    closePanel()
    showToast('Η απάντηση στάλθηκε για το demo.')
  }

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => prev === id ? null : id)
    if (expandedId !== id) closePanel()
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Success toast */}
      {successNote && (
        <div className="fixed top-16 left-0 right-0 z-40 flex justify-center px-4 pt-3 pointer-events-none">
          <div className="bg-green-600 text-white text-sm font-medium rounded-xl px-5 py-3 shadow-lg">
            {successNote}
          </div>
        </div>
      )}

      <PageContainer className="pb-28 lg:pb-10">
        <SectionHeader
          title="Αιτήματα αγοραστών"
          subtitle="Δες αιτήματα για ανταλλακτικά, τιμές και διαθεσιμότητα."
        />

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Νέα αιτήματα',      value: newCount,        color: 'text-amber-600' },
            { label: 'Χρειάζονται τιμή',  value: needsPriceCount, color: 'text-amber-600' },
            { label: 'Σε εξέλιξη',        value: inProgressCount, color: 'text-blue-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-center">
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

        {/* Results count */}
        <p className="text-xs text-slate-500 mb-3">
          {filtered.length === requests.length
            ? `${requests.length} αιτήματα`
            : `${filtered.length} από ${requests.length} αιτήματα`}
        </p>

        {/* Request list */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl py-14 text-center">
            <p className="text-sm font-medium text-slate-700 mb-1">Δεν υπάρχουν αιτήματα</p>
            <p className="text-xs text-slate-400 mb-4">Τα νέα αιτήματα από αγοραστές θα εμφανίζονται εδώ.</p>
            {activeFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Καθαρισμός φίλτρου
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                isExpanded={expandedId === req.id}
                activePanel={actionPanel?.id === req.id ? actionPanel.type : null}
                priceInput={priceInput}
                priceMsg={priceMsg}
                replyText={replyText}
                onToggle={() => toggleExpand(req.id)}
                onMarkAvailable={() => handleMarkAvailable(req.id)}
                onMarkUnavailable={() => handleMarkUnavailable(req.id)}
                onOpenPrice={() => openPanel(req.id, 'price')}
                onOpenReply={() => openPanel(req.id, 'reply')}
                onClosePanel={closePanel}
                onPriceInputChange={setPriceInput}
                onPriceMsgChange={setPriceMsg}
                onReplyTextChange={setReplyText}
                onSubmitPrice={() => handleSubmitPrice(req.id)}
                onSubmitReply={() => handleSubmitReply(req.id)}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </>
  )
}
