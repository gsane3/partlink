// Mock buyer requests — simulates what arrives when buyers submit from Marketplace Part Detail.
// Mirrors the MOCK_BUYER profile in request-sheet.tsx and the mock parts / vehicle imports.

export type RequestStatus = 'new' | 'needs_price' | 'in_progress' | 'completed'
export type DeliveryPreference = 'pickup' | 'shipping' | 'unknown'

export interface BuyerRequest {
  id: string
  // Part info (denormalised from marketplace)
  partId: string
  partName: string
  partSku: string
  partPrice: number        // 0 = on_request / needs_price
  donorVehicle?: string    // e.g. "BMW E90 320d 2007"
  sellerName?: string      // display name of the seller
  // Buyer profile
  buyerCompany: string
  buyerContact?: string
  buyerPhone: string
  buyerEmail: string
  buyerCity: string
  // Request body
  message: string
  delivery: DeliveryPreference
  // State
  status: RequestStatus
  createdAt: string
  priceSent?: number      // set when seller sends a price
  priceSentAt?: string
  replyNote?: string      // set when seller sends a reply
  replyNoteAt?: string
}

export const mockBuyerRequests: BuyerRequest[] = [
  // ── Νέο: priced part ─────────────────────────────────────────────────────────
  {
    id: 'req-001',
    partId: 'part-001',
    partName: 'Τουρμπίνα N47',
    partSku: 'PL-001-0001',
    partPrice: 450,
    donorVehicle: 'BMW E90 320d 2007',
    sellerName: 'Μάντρα Παπαδόπουλος',
    buyerCompany: 'Papadopoulos Auto Parts',
    buyerContact: 'Γιώργος Παπαδόπουλος',
    buyerPhone: '69 0000 0000',
    buyerEmail: 'buyer@example.com',
    buyerCity: 'Αθήνα',
    message: 'Ενδιαφέρομαι για το ανταλλακτικό. Είναι διαθέσιμο;',
    delivery: 'shipping',
    status: 'new',
    createdAt: '2026-05-13T09:30:00Z',
  },

  // ── Νέο: second priced part ───────────────────────────────────────────────────
  {
    id: 'req-002',
    partId: 'part-007',
    partName: 'Σασμάν αυτόματο 6 σχέσεων',
    partSku: 'PL-001-0005',
    partPrice: 1100,
    donorVehicle: 'BMW E90 320d 2007',
    sellerName: 'Μάντρα Παπαδόπουλος',
    buyerCompany: 'Συνεργείο Κωνσταντίνου',
    buyerContact: 'Κωνσταντίνος Νικολάου',
    buyerPhone: '69 1111 2222',
    buyerEmail: 'kostas@synergeia.gr',
    buyerCity: 'Πειραιάς',
    message: 'Ενδιαφέρομαι. Είναι σε καλή κατάσταση; Πόσα χιλιόμετρα έχει;',
    delivery: 'pickup',
    status: 'new',
    createdAt: '2026-05-12T14:20:00Z',
  },

  // ── Χρειάζεται τιμή: VIN-import part (price=0 simulation) ────────────────────
  {
    id: 'req-003',
    partId: 'PL-001-2001',
    partName: 'Κινητήρας Opel Astra',
    partSku: 'PL-001-2001',
    partPrice: 0,
    donorVehicle: 'Opel Astra 2010',
    sellerName: 'Μάντρα Παπαδόπουλος',
    buyerCompany: 'AutoFix Βούλα',
    buyerContact: 'Δήμος Αλεξίου',
    buyerPhone: '69 3333 4444',
    buyerEmail: 'dimos@autofix.gr',
    buyerCity: 'Βούλα',
    message: 'Ενδιαφέρομαι για το ανταλλακτικό. Μπορείτε να μου στείλετε τιμή;',
    delivery: 'unknown',
    status: 'needs_price',
    createdAt: '2026-05-11T10:15:00Z',
  },

  // ── Σε εξέλιξη: seller already confirmed available ───────────────────────────
  {
    id: 'req-004',
    partId: 'part-002',
    partName: 'Φανάρι εμπρός δεξί',
    partSku: 'PL-001-0002',
    partPrice: 95,
    donorVehicle: 'Mercedes-Benz C220 CDI W204 2010',
    sellerName: 'Μάντρα Παπαδόπουλος',
    buyerCompany: 'Ανδρέου Service',
    buyerContact: 'Ανδρέας Ανδρέου',
    buyerPhone: '69 5555 6666',
    buyerEmail: 'andreas@service.gr',
    buyerCity: 'Νίκαια',
    message: 'Το χρειάζομαι επειγόντως. Μπορείτε να στείλετε;',
    delivery: 'shipping',
    status: 'in_progress',
    createdAt: '2026-05-10T16:45:00Z',
    priceSent: 95,
    priceSentAt: '2026-05-10T18:20:00Z',
    replyNote: 'Διαθέσιμο. Αποστολή σε 2-3 εργάσιμες μέρες με ACS.',
    replyNoteAt: '2026-05-10T18:22:00Z',
  },

  // ── Ολοκληρωμένο: seller marked unavailable ───────────────────────────────────
  {
    id: 'req-005',
    partId: 'part-003',
    partName: 'ECU / Εγκέφαλος κινητήρα',
    partSku: 'PL-001-0003',
    partPrice: 320,
    donorVehicle: 'VW Golf 5 1.9 TDI 2005',
    sellerName: 'Μάντρα Παπαδόπουλος',
    buyerCompany: 'Papadopoulos Auto Parts',
    buyerContact: 'Γιώργος Παπαδόπουλος',
    buyerPhone: '69 0000 0000',
    buyerEmail: 'buyer@example.com',
    buyerCity: 'Αθήνα',
    message: 'Είναι ακόμα διαθέσιμο; Χρειάζεται ο κωδικός BKC.',
    delivery: 'pickup',
    status: 'completed',
    createdAt: '2026-05-09T11:00:00Z',
  },

  // ── Χρειάζεται τιμή: second example ──────────────────────────────────────────
  {
    id: 'req-006',
    partId: 'part-005',
    partName: 'Αερόσακος οδηγού',
    partSku: 'PL-001-0004',
    partPrice: 0,
    donorVehicle: 'Opel Astra H 1.6 2005',
    sellerName: 'Μάντρα Παπαδόπουλος',
    buyerCompany: 'Γαλλάκης Service',
    buyerContact: 'Μιχάλης Γαλλάκης',
    buyerPhone: '69 7777 8888',
    buyerEmail: 'michalis@gallakis.gr',
    buyerCity: 'Κορωπί',
    message: 'Ενδιαφέρομαι για το ανταλλακτικό. Μπορείτε να μου στείλετε τιμή;',
    delivery: 'shipping',
    status: 'needs_price',
    createdAt: '2026-05-08T08:30:00Z',
  },
]

export function getBuyerRequests(): BuyerRequest[] {
  return mockBuyerRequests
}

export function findBuyerRequestById(id: string): BuyerRequest | undefined {
  return mockBuyerRequests.find((r) => r.id === id)
}
