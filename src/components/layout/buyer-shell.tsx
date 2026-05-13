'use client'

import { usePathname } from 'next/navigation'
import { DesktopSidebar, type NavItem } from './desktop-sidebar'
import { MobileBottomNav, type MobileNavItem } from './mobile-bottom-nav'
import { TopBar, TopBarIconButton } from './top-bar'
import type { ReactNode } from 'react'

const BUYER_NAV: NavItem[] = [
  {
    label: 'Αγορά',
    href: '/buyer/marketplace',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    label: 'Αναζήτηση VIN',
    href: '/buyer/vin-search',
    exact: true,
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    label: 'Αιτήματα',
    href: '/buyer/orders',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    label: 'Μηνύματα',
    href: '/buyer/chats',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
]

const BUYER_BOTTOM_NAV: NavItem[] = [
  {
    label: 'Προφίλ',
    href: '/buyer/profile',
    exact: true,
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

const BUYER_MOBILE_NAV: MobileNavItem[] = [
  {
    label: 'Αγορά',
    href: '/buyer/marketplace',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    label: 'VIN',
    href: '/buyer/vin-search',
    exact: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    label: 'Αιτήματα',
    href: '/buyer/orders',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    label: 'Μηνύματα',
    href: '/buyer/chats',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: 'Προφίλ',
    href: '/buyer/profile',
    exact: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

const PAGE_TITLES: Record<string, string> = {
  '/buyer': 'Αρχική',
  '/buyer/marketplace': 'Αγορά',
  '/buyer/vin-search': 'Αναζήτηση VIN',
  '/buyer/orders': 'Αιτήματα',
  '/buyer/chats': 'Μηνύματα',
  '/buyer/profile': 'Προφίλ μου',
}

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/buyer/orders/')) return 'Αίτημα'
  if (pathname.startsWith('/buyer/marketplace/')) return 'Ανταλλακτικό'
  return 'Partlink'
}

export function BuyerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const title = getTitle(pathname)

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DesktopSidebar navItems={BUYER_NAV} bottomItems={BUYER_BOTTOM_NAV} />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar
          title={title}
          left={
            <span className="text-sm font-bold text-slate-900 lg:hidden">Partlink</span>
          }
          right={
            <TopBarIconButton label="Ειδοποιήσεις">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </TopBarIconButton>
          }
        />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      </div>

      <MobileBottomNav items={BUYER_MOBILE_NAV} />
    </div>
  )
}
