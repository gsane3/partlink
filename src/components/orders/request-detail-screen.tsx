'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PriceInput } from '@/components/forms/price-input'
import { PageContainer } from '@/components/layout/page-container'
import { formatDate, formatPrice } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { findBuyerRequestById } from '@/lib/mock-data/buyer-requests'
import type { BuyerRequest, RequestStatus } from '@/lib/mock-data/buyer-requests'
import { SELLER_STATUS_CONFIG } from '@/lib/requests/status'
import { DELIVERY_PREFERENCE_LABELS } from '@/lib/requests/delivery'
import { buildBaseActivityEvents } from '@/lib/requests/activity'
import type { RequestActivityEvent } from '@/lib/requests/activity'
import { RequestActivityTimeline } from '@/components/orders/request-activity-timeline'
import { buildBaseRequestMessages } from '@/lib/requests/messages'
import type { RequestMessage } from '@/lib/requests/messages'
import { RequestMessageThread } from '@/components/orders/request-message-thread'

// ─── Constants ────────────────────────────────────────────────────────────────

// ─── Layout helpers ───────────────────────────────────────────────────────────

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
      <span className="text-sm text-slate-500 flex-shrink-0 w-32">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right flex-1 min-w-0">{children}</span>
    </div>
  )
}

// ─── Not found ────────────────────────────────────────────────────────────────

function RequestNotFound() {
  return (
    <PageContainer>
      <div className="py-16 text-center max-w-sm mx-auto">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Το αίτημα δεν βρέθηκε</h2>
        <p className="text-sm text-slate-500 mb-6">Μπορεί να έχει αφαιρεθεί ή να μην υπάρχει στο demo.</p>
        <Link
          href={ROUTES.SELLER.ORDERS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Επιστροφή στα αιτήματα
        </Link>
      </div>
    </PageContainer>
  )
}

// ─── Detail content (all hooks here) ─────────────────────────────────────────

type ActivePanel = 'price' | 'reply' | null

function RequestDetailContent({ request }: { request: BuyerRequest }) {
  const [status,         setStatus]         = useState<RequestStatus>(request.status)
  const [priceSent,      setPriceSent]      = useState<number | undefined>(request.priceSent)
  const [activePanel,    setActivePanel]    = useState<ActivePanel>(null)
  const [priceInput,     setPriceInput]     = useState('')
  const [priceMsg,       setPriceMsg]       = useState('')
  const [replyText,      setReplyText]      = useState('')
  const [successNote,    setSuccessNote]    = useState<string | null>(null)
  const [localEvents,    setLocalEvents]    = useState<RequestActivityEvent[]>([])
  const [localMessages,  setLocalMessages]  = useState<RequestMessage[]>([])
  const eventCounter = useRef(0)
  const msgCounter   = useRef(0)

  const addEvent = (event: Omit<RequestActivityEvent, 'id'>) => {
    eventCounter.current += 1
    setLocalEvents((prev) => [...prev, { ...event, id: `local-${eventCounter.current}` }])
  }

  const addMessage = (msg: Omit<RequestMessage, 'id'>) => {
    msgCounter.current += 1
    setLocalMessages((prev) => [...prev, { ...msg, id: `msg-${msgCounter.current}` }])
  }

  const showActions = status !== 'completed'
  const hasPrice    = request.partPrice > 0
  const { label: statusLabel, variant: statusVariant } = SELLER_STATUS_CONFIG[status]

  const showToast = (msg: string) => {
    setSuccessNote(msg)
    setTimeout(() => setSuccessNote(null), 3000)
  }

  const openPanel = (p: ActivePanel) => {
    setActivePanel(p)
    setPriceInput('')
    setPriceMsg('')
    setReplyText('')
  }

  const handleMarkAvailable = () => {
    setStatus('in_progress')
    addEvent({ title: 'Διαθεσιμότητα επιβεβαιώθηκε', description: 'Το αίτημα σημειώθηκε ως σε εξέλιξη.', tone: 'success' })
    showToast('Ο αγοραστής θα ενημερωθεί για διαθεσιμότητα.')
  }

  const handleMarkUnavailable = () => {
    setStatus('completed')
    setActivePanel(null)
    addEvent({ title: 'Δεν είναι διαθέσιμο', description: 'Το αίτημα ολοκληρώθηκε ως μη διαθέσιμο.', tone: 'warning' })
  }

  const handleSubmitPrice = () => {
    const price = parseFloat(priceInput) || 0
    if (price <= 0) return
    setPriceSent(price)
    setStatus('in_progress')
    setActivePanel(null)
    addEvent({ title: 'Τιμή στάλθηκε', description: `Στάλθηκε τιμή ${price.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })} στον αγοραστή.`, tone: 'info' })
    showToast('Η τιμή στάλθηκε για το demo.')
  }

  const handleSubmitReply = () => {
    if (!replyText.trim()) return
    const text = replyText.trim()
    setActivePanel(null)
    addMessage({ author: 'seller', authorLabel: 'Πωλητής', body: text })
    addEvent({ title: 'Απάντηση στάλθηκε', description: text, tone: 'info' })
    showToast('Η απάντηση στάλθηκε για το demo.')
  }

  const allEvents   = [...buildBaseActivityEvents(request), ...localEvents]
  const allMessages = [...buildBaseRequestMessages(request), ...localMessages]

  // Primary CTA: show "Αποστολή τιμής" only when no price has been sent yet and status needs it
  const needsPriceAction = priceSent === undefined && status === 'needs_price'
  const primaryCta    = needsPriceAction ? 'Αποστολή τιμής' : 'Απάντηση'
  const primaryAction = () => openPanel(needsPriceAction ? 'price' : 'reply')

  return (
    <>
      {/* Toast */}
      {successNote && (
        <div className="fixed top-16 left-0 right-0 z-40 flex justify-center px-4 pt-3 pointer-events-none">
          <div className="bg-green-600 text-white text-sm font-medium rounded-xl px-5 py-3 shadow-lg">
            {successNote}
          </div>
        </div>
      )}

      <div className="pb-44 lg:pb-10">
        <PageContainer>

          {/* Header */}
          <div className="mb-5">
            <Link
              href={ROUTES.SELLER.ORDERS}
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Αιτήματα
            </Link>

            <h1 className="text-xl font-bold text-slate-900 mb-1">{request.partName}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={statusVariant}>{statusLabel}</Badge>
              <span className="text-sm text-slate-500">{request.buyerCompany}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-400 font-mono">{request.id}</span>
            </div>
          </div>

          <div className="space-y-4 max-w-2xl">

            {/* A. Request summary */}
            <InfoCard title="Αίτημα">
              <div className="space-y-0">
                <InfoRow label="Ανταλλακτικό">{request.partName}</InfoRow>
                <InfoRow label="SKU"><span className="font-mono text-xs">{request.partSku}</span></InfoRow>
                <InfoRow label="Τιμή">
                  {hasPrice ? (
                    <span className="font-semibold">{formatPrice(request.partPrice)}</span>
                  ) : (
                    <span className="text-amber-700 font-semibold bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 text-xs">Χωρίς τιμή</span>
                  )}
                </InfoRow>
                {request.donorVehicle && (
                  <InfoRow label="Όχημα">{request.donorVehicle}</InfoRow>
                )}
                <InfoRow label="Παραλαβή">{DELIVERY_PREFERENCE_LABELS[request.delivery]}</InfoRow>
                <InfoRow label="Ημερομηνία">{formatDate(request.createdAt)}</InfoRow>
                <InfoRow label="Κατάσταση"><Badge variant={statusVariant}>{statusLabel}</Badge></InfoRow>
              </div>
            </InfoCard>

            {/* B. Sent-price confirmation card */}
            {priceSent !== undefined && (
              <div className="bg-white border border-blue-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm font-semibold text-blue-900">Η τιμή στάλθηκε</p>
                </div>
                <div className="px-4 py-4">
                  <p className="text-sm text-slate-600 mb-3">
                    Ο αγοραστής θα δει την τιμή και μπορεί να την αποδεχτεί για το επόμενο βήμα.
                  </p>
                  <div className="space-y-0">
                    <InfoRow label="Ανταλλακτικό">{request.partName}</InfoRow>
                    <InfoRow label="Τιμή που στάλθηκε">
                      <span className="font-bold text-blue-700">{formatPrice(priceSent)}</span>
                    </InfoRow>
                    <InfoRow label="Αγοραστής">{request.buyerCompany}</InfoRow>
                    <InfoRow label="Παραλαβή">{DELIVERY_PREFERENCE_LABELS[request.delivery]}</InfoRow>
                  </div>
                  {request.delivery === 'shipping' && (
                    <p className="text-xs text-slate-600 border-t border-slate-100 mt-3 pt-3">
                      Ο αγοραστής έχει δηλώσει αποστολή.
                    </p>
                  )}
                  {request.delivery === 'pickup' && (
                    <p className="text-xs text-slate-600 border-t border-slate-100 mt-3 pt-3">
                      Ο αγοραστής προτιμά παραλαβή από κατάστημα.
                    </p>
                  )}
                  {request.delivery === 'unknown' && (
                    <p className="text-xs text-slate-600 border-t border-slate-100 mt-3 pt-3">
                      Ο τρόπος παραλαβής θα συμφωνηθεί με τον αγοραστή.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* C. Buyer card */}
            <InfoCard title="Αγοραστής">
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-slate-900">{request.buyerCompany}</p>
                {request.buyerContact && (
                  <p className="text-sm text-slate-600">{request.buyerContact}</p>
                )}
                <p className="text-sm text-slate-600">{request.buyerPhone}</p>
                <p className="text-sm text-slate-600">{request.buyerEmail}</p>
                <p className="text-sm text-slate-500">{request.buyerCity}</p>
              </div>
            </InfoCard>

            {/* D. Message thread */}
            <RequestMessageThread messages={allMessages} perspective="seller" />

            {/* D. Compatibility warning */}
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-800 leading-relaxed">
                Πριν επιβεβαιώσεις, έλεγξε OEM / VIN ή ρώτα τον αγοραστή για στοιχεία οχήματος.
              </p>
            </div>

            {/* E. Activity timeline */}
            <RequestActivityTimeline events={allEvents} />

            {/* F. Seller actions */}
            {showActions && (
              <>
                {/* Availability buttons — unique to inline (not in sticky bar) */}
                {activePanel === null && (status === 'new' || status === 'needs_price') && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleMarkAvailable}
                      className="h-12 rounded-xl border-2 border-green-400 bg-green-50 text-sm font-semibold text-green-800 hover:bg-green-100 transition-colors"
                    >
                      Διαθέσιμο
                    </button>
                    <button
                      type="button"
                      onClick={handleMarkUnavailable}
                      className="h-12 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      Δεν είναι διαθέσιμο
                    </button>
                  </div>
                )}
                {activePanel === 'price' ? (
                  /* Price panel */
                  <div className="bg-white border border-blue-200 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 border-b border-blue-100">
                      <p className="text-sm font-semibold text-blue-900">Αποστολή τιμής</p>
                      <button type="button" onClick={() => setActivePanel(null)} className="text-xs font-medium text-blue-500 hover:text-blue-700">Ακύρωση</button>
                    </div>
                    <div className="px-4 py-4 space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-700 mb-1 block">Τιμή<span className="text-red-500 ml-0.5">*</span></label>
                        <PriceInput value={priceInput} onChange={(e) => setPriceInput(e.target.value)} placeholder="0" className="h-11" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-700 mb-1 block">Μήνυμα <span className="font-normal text-slate-400">(προαιρετικό)</span></label>
                        <textarea
                          value={priceMsg}
                          onChange={(e) => setPriceMsg(e.target.value)}
                          placeholder="π.χ. Η τιμή ισχύει μέχρι 31/05."
                          rows={2}
                          className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 resize-none text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <Button type="button" variant="primary" fullWidth onClick={handleSubmitPrice} className="h-11" disabled={!priceInput || parseFloat(priceInput) <= 0}>
                        Αποστολή τιμής
                      </Button>
                    </div>
                  </div>
                ) : activePanel === 'reply' ? (
                  /* Reply panel */
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">Απάντηση</p>
                      <button type="button" onClick={() => setActivePanel(null)} className="text-xs font-medium text-slate-500 hover:text-slate-700">Ακύρωση</button>
                    </div>
                    <div className="px-4 py-4 space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Γράψε την απάντησή σου..."
                        rows={3}
                        className="w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 resize-none text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button type="button" variant="primary" fullWidth onClick={handleSubmitReply} className="h-11" disabled={!replyText.trim()}>
                        Αποστολή απάντησης
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </PageContainer>
      </div>

      {/* Sticky bottom bar */}
      {showActions && activePanel === null && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-60 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3">
          <div className="flex gap-2.5 max-w-2xl mx-auto">
            <Link
              href={ROUTES.SELLER.ORDERS}
              className="flex-shrink-0 inline-flex items-center gap-1 h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Πίσω
            </Link>
            <Button type="button" variant="primary" fullWidth onClick={primaryAction} className="h-11 gap-1.5">
              {primaryCta}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Public export ────────────────────────────────────────────────────────────

export function RequestDetailScreen({ requestId }: { requestId: string }) {
  const request = findBuyerRequestById(requestId)
  if (!request) return <RequestNotFound />
  return <RequestDetailContent request={request} />
}
