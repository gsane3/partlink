import Link from 'next/link'
import { ConditionBadge } from '@/components/inventory/condition-badge'
import { PartPhotoPlaceholder } from '@/components/ui/part-photo-placeholder'
import { CATEGORIES } from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import { formatPrice, cn } from '@/lib/utils'
import type { Part, Seller } from '@/types'
import type { CompatibilityStatus } from '@/components/inventory/vin-import/types'

// ─── Compatibility display config ─────────────────────────────────────────────

const COMPAT_CONFIG: Record<CompatibilityStatus, { label: string; cls: string }> = {
  donor_only:       { label: 'Μόνο donor',    cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
  oem_verified:     { label: 'Με OEM',        cls: 'bg-blue-50 text-blue-700 border border-blue-200' },
  seller_confirmed: { label: 'Επιβεβαιωμένο', cls: 'bg-green-50 text-green-700 border border-green-200' },
}

function getCategoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id
}

// ─── Component ────────────────────────────────────────────────────────────────

interface MarketplacePartCardProps {
  part: Part
  seller: Seller | undefined
  compat: CompatibilityStatus
}

export function MarketplacePartCard({ part, seller, compat }: MarketplacePartCardProps) {
  const hasPrice = part.price > 0
  const { label: compatLabel, cls: compatCls } = COMPAT_CONFIG[compat]

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-sm transition-all">
      {/* Photo placeholder */}
      <PartPhotoPlaceholder categoryId={part.categoryId} className="h-40 w-full flex-shrink-0" />

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Name + vehicle */}
        <div>
          <p className="text-base font-semibold text-slate-900 leading-snug line-clamp-2">
            {part.partName}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">
            {part.vehicle.make} {part.vehicle.model} {part.vehicle.year}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400">{getCategoryName(part.categoryId)}</span>
          <span className="text-slate-200">·</span>
          <ConditionBadge condition={part.condition} />
          <span className={cn(
            'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap',
            compatCls
          )}>
            {compatLabel}
          </span>
        </div>

        {/* Seller */}
        {seller && (
          <p className="text-xs text-slate-400">
            {seller.businessName}{seller.city ? ` · ${seller.city}` : ''}
          </p>
        )}

        {/* Price + CTA */}
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
