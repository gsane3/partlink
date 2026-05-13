'use client'

import { usePathname } from 'next/navigation'
import { DesktopSidebar, type NavItem } from './desktop-sidebar'
import { MobileBottomNav, type MobileNavItem } from './mobile-bottom-nav'
import { MobileFAB } from './mobile-fab'
import { TopBar, TopBarIconButton } from './top-bar'
import type { ReactNode } from 'react'

const SELLER_NAV: NavItem[] = [
  {
    label: 'Αρχική',
    href: '/seller',
    exact: true,
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Το stock μου',
    href: '/seller/inventory',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'Παραγγελίες',
    href: '/seller/orders',
    badge: 2,
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    label: 'Συνομιλίες',
    href: '/seller/chats',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
]

const SELLER_BOTTOM_NAV: NavItem[] = [
  {
    label: 'Ρυθμίσεις',
    href: '/seller/settings',
    exact: true,
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

const SELLER_MOBILE_NAV: MobileNavItem[] = [
  {
    label: 'Αρχική',
    href: '/seller',
    exact: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Stock',
    href: '/seller/inventory',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'Παραγγελίες',
    href: '/seller/orders',
    badge: 2,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    label: 'Μηνύματα',
    href: '/seller/chats',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
]

const SELLER_FAB_ACTIONS = [
  {
    label: 'Πρόσθεσε ανταλλακτικό',
    href: '/seller/inventory/add',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Εισαγωγή με VIN',
    href: '/seller/inventory/vin-import',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    label: 'Σκάναρε QR',
    href: '/seller/inventory/scan',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
  },
]

const PAGE_TITLES: Record<string, string> = {
  '/seller': 'Αρχική',
  '/seller/mobile': 'Αρχική',
  '/seller/inventory': 'Το stock μου',
  '/seller/inventory/add': 'Πρόσθεσε ανταλλακτικό',
  '/seller/inventory/vin-import': 'Εισαγωγή με VIN',
  '/seller/inventory/scan': 'Σκάναρε QR',
  '/seller/orders': 'Παραγγελίες',
  '/seller/chats': 'Συνομιλίες',
  '/seller/settings': 'Ρυθμίσεις',
}

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/seller/inventory/')) return 'Ανταλλακτικό'
  if (pathname.startsWith('/seller/orders/')) return 'Παραγγελία'
  return 'Partlink'
}

function TopBarRight() {
  return (
    <>
      <TopBarIconButton label="Ειδοποιήσεις">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </TopBarIconButton>
      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
        ΜΠ
      </div>
    </>
  )
}

export function SellerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const title = getTitle(pathname)

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DesktopSidebar navItems={SELLER_NAV} bottomItems={SELLER_BOTTOM_NAV} />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar
          title={title}
          left={
            <span className="text-sm font-bold text-slate-900 lg:hidden">Partlink</span>
          }
          right={<TopBarRight />}
        />
        <main className="flex-1">{children}</main>
      </div>

      <MobileBottomNav items={SELLER_MOBILE_NAV} />
      {!['/seller/inventory/add', '/seller/inventory/vin-import', '/seller/inventory/scan'].includes(pathname) &&
        !(pathname.startsWith('/seller/orders/') && pathname !== '/seller/orders') &&
        !pathname.startsWith('/seller/chats') &&
        !pathname.startsWith('/seller/inventory/vehicles/') && (
        <MobileFAB actions={SELLER_FAB_ACTIONS} />
      )}
    </div>
  )
}
