import { PublicNavbar } from '@/components/layout/public-navbar'
import { PartPhotoPlaceholder } from '@/components/ui/part-photo-placeholder'
import Link from 'next/link'

// ─── Static demo listings for hero preview ────────────────────────────────────

const DEMO_LISTINGS = [
  { name: 'Τουρμπίνα N47', vehicle: 'BMW E90 320d · 2007', category: 'engine',      price: '450€',  condition: 'Πολύ καλό' },
  { name: 'Φανάρι εμπρός δεξί', vehicle: 'Mercedes W204 · 2010', category: 'lighting',  price: '95€',   condition: 'Καλό' },
  { name: 'Σασμάν αυτόματο', vehicle: 'BMW E90 320d · 2007', category: 'transmission', price: '1.100€', condition: 'Ελεγμένο' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">

        {/* ── Hero — two-column on lg ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-center mb-16">

          {/* Left: text + CTAs */}
          <div className="max-w-xl">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
              Partlink — Ανταλλακτικά αυτοκινήτων
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Βρες και πούλα μεταχειρισμένα ανταλλακτικά πιο γρήγορα.
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Το Partlink οργανώνει το stock της μάντρας και βοηθά συνεργεία και ιδιώτες να βρίσκουν διαθέσιμα ανταλλακτικά σε όλη την Ελλάδα.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/marketplace"
                className="h-11 px-6 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center"
              >
                Αναζήτηση ανταλλακτικών
              </Link>
              <Link
                href="/register"
                className="h-11 px-6 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center"
              >
                Εγγραφή πωλητή
              </Link>
            </div>
          </div>

          {/* Right: marketplace preview (desktop only) */}
          <div className="hidden lg:block">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Mini header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Marketplace</p>
                <span className="text-xs text-slate-400">{DEMO_LISTINGS.length} ανταλλακτικά</span>
              </div>

              {/* Mini listing cards */}
              <div className="divide-y divide-slate-100">
                {DEMO_LISTINGS.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 p-3">
                    {/* Category thumbnail */}
                    <PartPhotoPlaceholder
                      categoryId={item.category}
                      className="w-16 h-12 rounded-lg flex-shrink-0"
                      showLabel={false}
                    />
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{item.vehicle}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.condition}</p>
                    </div>
                    {/* Price */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-slate-900 tabular-nums">{item.price}</p>
                      <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Αίτημα →</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-xs text-slate-500">Επαλυθευμένοι πωλητές · Stock σε πραγματικό χρόνο</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Πωλητές', desc: 'Οργανώστε το stock σας με SKU και QR label ανά ανταλλακτικό.', href: '/seller' },
            { title: 'Αγοραστές', desc: 'Βρείτε ανταλλακτικά με VIN, part number ή κατηγορία.', href: '/buyer/marketplace' },
            { title: 'Διαχείριση', desc: 'Επαλήθευση πωλητών, παρακολούθηση αιτημάτων.', href: '/admin' },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm hover:border-slate-300 transition-all group"
            >
              <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{card.title}</p>
              <p className="mt-1 text-sm text-slate-500">{card.desc}</p>
            </Link>
          ))}
        </div>

      </main>
    </div>
  )
}
