import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function generateSKU(sellerId: string, partIndex: number): string {
  const sellerPart = sellerId.split('-').pop()?.padStart(3, '0') ?? '000'
  const index = String(partIndex).padStart(4, '0')
  return `PL-${sellerPart}-${index}`
}

export function generateQRValue(sku: string, sellerId: string, partId: string): string {
  return `partlink:${sellerId}:${partId}:${sku}`
}
