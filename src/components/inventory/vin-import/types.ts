import type { PartCondition } from '@/types'
import type { PriceMode } from '@/lib/catalog/vehicle-part-catalog'

export type { PriceMode }

export interface DecodedVehicle {
  vin: string
  make: string
  model: string
  year: number
  engine: string
  fuel: string
}

export interface TemplatePart {
  id: string
  partName: string
  categoryId: string
  suggestedPrice: number
}

export interface GeneratedPart {
  templateId: string
  partName: string
  categoryId: string
  condition: PartCondition
  price: number
  priceMode: PriceMode
  // Internal SKU for inventory lookup/search — not used as a QR label in VIN Import.
  // VIN Import uses a single vehicle-level QR instead.
  sku: string
  publishToMarketplace: boolean
}

// Vehicle-level import record created when a full car is imported.
// One QR label per vehicle, not per part.
//
// Future scan flow: when vehicleQrValue is scanned at the QR scan screen,
// the seller sees vehicle details, the list of linked parts that are still
// in stock, and the action "Ποιο ανταλλακτικό βγήκε;" to mark a specific
// part as removed/sold without scanning that part individually.
export interface VehicleImport {
  vehicleCode: string     // e.g. "VEH-001-8405"
  vehicleQrValue: string  // e.g. "partlink:vehicle:seller-001:VEH-001-8405"
  vehicle: DecodedVehicle
  parts: GeneratedPart[]
  mileage?: number        // km at time of import
  importedAt?: string     // ISO date string
}

// ─── Vehicle part enrichment types (for /seller/inventory/vehicles/[code]) ───

export type VehiclePartStatus = 'in_vehicle' | 'removed' | 'shelved' | 'sold'
export type CompatibilityStatus = 'donor_only' | 'oem_verified' | 'seller_confirmed'

// Runtime state for a part inside the Vehicle Import Detail page.
// Extends GeneratedPart with yard-operation fields (status, OEM numbers, etc.)
// that are populated after the initial import.
export interface VehiclePartRecord extends GeneratedPart {
  status: VehiclePartStatus
  oemNumbers: string[]
  aftermarketNumbers: string[]
  compatibilityStatus: CompatibilityStatus
  shelfLocation?: string
  privateNotes?: string
}
