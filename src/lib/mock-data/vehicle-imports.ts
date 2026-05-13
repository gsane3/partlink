import type { VehicleImport, VehiclePartRecord } from '@/components/inventory/vin-import/types'

// Canonical mock vehicle imports — data created by /seller/inventory/vin-import.
// One QR per vehicle (vehicleQrValue). No per-part QR labels.
// When the vehicle QR is scanned, the seller picks which part was removed from the car.

export const mockVehicleImports: VehicleImport[] = [
  {
    vehicleCode: 'VEH-001-8405',
    vehicleQrValue: 'partlink:vehicle:seller-001:VEH-001-8405',
    mileage: 184000,
    importedAt: '2025-01-15',
    vehicle: {
      vin: '4T1BE46K39U361475',
      make: 'Opel',
      model: 'Astra',
      year: 2010,
      engine: 'Z16XER',
      fuel: 'Βενζίνη',
    },
    parts: [
      { templateId: 't01', partName: 'Κινητήρας',              categoryId: 'engine',       condition: 'good',      price: 620, priceMode: 'fixed',      sku: 'PL-001-2001', publishToMarketplace: true  },
      { templateId: 't02', partName: 'Σασμάν',                 categoryId: 'transmission', condition: 'good',      price: 280, priceMode: 'fixed',      sku: 'PL-001-2002', publishToMarketplace: true  },
      { templateId: 't03', partName: 'Εγκέφαλος κινητήρα',     categoryId: 'electrical',   condition: 'good',      price: 195, priceMode: 'fixed',      sku: 'PL-001-2003', publishToMarketplace: false },
      { templateId: 't04', partName: 'Φανάρι εμπρός δεξί',     categoryId: 'lighting',     condition: 'very_good', price: 65,  priceMode: 'fixed',      sku: 'PL-001-2004', publishToMarketplace: true  },
      { templateId: 't05', partName: 'Φανάρι εμπρός αριστερό', categoryId: 'lighting',     condition: 'very_good', price: 65,  priceMode: 'fixed',      sku: 'PL-001-2005', publishToMarketplace: true  },
      { templateId: 't06', partName: 'Προφυλακτήρας εμπρός',   categoryId: 'body',         condition: 'good',      price: 55,  priceMode: 'fixed',      sku: 'PL-001-2006', publishToMarketplace: false },
      { templateId: 't07', partName: 'Καπό',                   categoryId: 'body',         condition: 'good',      price: 95,  priceMode: 'fixed',      sku: 'PL-001-2007', publishToMarketplace: true  },
      { templateId: 't08', partName: 'Πόρτα οδηγού',           categoryId: 'body',         condition: 'good',      price: 130, priceMode: 'fixed',      sku: 'PL-001-2008', publishToMarketplace: true  },
      { templateId: 't09', partName: 'Καθρέφτης δεξιός',       categoryId: 'body',         condition: 'good',      price: 38,  priceMode: 'fixed',      sku: 'PL-001-2009', publishToMarketplace: true  },
      { templateId: 't10', partName: 'Μίζα',                   categoryId: 'electrical',   condition: 'very_good', price: 32,  priceMode: 'fixed',      sku: 'PL-001-2010', publishToMarketplace: true  },
      { templateId: 't11', partName: 'Δυναμό',                  categoryId: 'electrical',   condition: 'good',      price: 55,  priceMode: 'fixed',      sku: 'PL-001-2011', publishToMarketplace: true  },
      { templateId: 't12', partName: 'Ψυγείο νερού',           categoryId: 'cooling',      condition: 'good',      price: 80,  priceMode: 'fixed',      sku: 'PL-001-2012', publishToMarketplace: true  },
    ],
  },
]

export function findMockVehicleImport(vehicleCode: string): VehicleImport | undefined {
  return mockVehicleImports.find((v) => v.vehicleCode === vehicleCode)
}

// Initialises VehiclePartRecord[] from the base GeneratedPart[] for the Vehicle
// Import Detail page. Adds operational fields with sensible defaults, and applies
// demo enrichment for the canonical VEH-001-8405 sample.
export function getInitialVehiclePartRecords(vehicleCode: string): VehiclePartRecord[] | null {
  const imp = findMockVehicleImport(vehicleCode)
  if (!imp) return null

  return imp.parts.map((part): VehiclePartRecord => {
    const base: VehiclePartRecord = {
      ...part,
      status: 'in_vehicle',
      oemNumbers: [],
      aftermarketNumbers: [],
      compatibilityStatus: 'donor_only',
    }

    if (vehicleCode === 'VEH-001-8405') {
      if (part.sku === 'PL-001-2001') {
        return {
          ...base,
          status: 'removed',
          oemNumbers: ['55353999', 'Z16XER-ENZ'],
          compatibilityStatus: 'oem_verified',
        }
      }
      if (part.sku === 'PL-001-2003') {
        return {
          ...base,
          oemNumbers: ['12639834'],
          compatibilityStatus: 'oem_verified',
        }
      }
      if (part.sku === 'PL-001-2007') {
        return { ...base, shelfLocation: 'Ράφι Β-04' }
      }
    }

    return base
  })
}
