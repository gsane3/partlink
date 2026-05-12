import type { Category, PartCondition, PartStatus, OrderStatus, PaymentMethod, DeliveryMethod, DocumentType, VerificationStatus, UserRole } from '@/types'

export const CATEGORIES: Category[] = [
  { id: 'body', slug: 'amaxoma', name: 'Αμάξωμα' },
  { id: 'lighting', slug: 'fotismos', name: 'Φωτισμός' },
  { id: 'engine', slug: 'kinithras', name: 'Κινητήρας' },
  { id: 'transmission', slug: 'sasman', name: 'Σασμάν' },
  { id: 'suspension', slug: 'anartiisi', name: 'Ανάρτηση' },
  { id: 'brakes', slug: 'frena', name: 'Φρένα' },
  { id: 'interior', slug: 'esoteriko', name: 'Εσωτερικό' },
  { id: 'electrical', slug: 'ilektrika', name: 'Ηλεκτρικά' },
  { id: 'wheels', slug: 'zantes-elastika', name: 'Ζάντες / Ελαστικά' },
  { id: 'cooling', slug: 'psyksi-klimatismos', name: 'Ψύξη / Κλιματισμός' },
  { id: 'exhaust', slug: 'exatmisi', name: 'Εξάτμιση' },
  { id: 'other', slug: 'allo', name: 'Άλλο' },
]

export const CONDITION_LABELS: Record<PartCondition, string> = {
  excellent: 'Άριστο',
  very_good: 'Πολύ καλό',
  good: 'Καλό',
  fair: 'Μέτριο',
  for_repair: 'Για επισκευή',
  tested: 'Ελεγμένο',
  untested: 'Χωρίς έλεγχο',
}

export const PART_STATUS_LABELS: Record<PartStatus, string> = {
  draft: 'Πρόχειρο',
  available: 'Διαθέσιμο',
  reserved: 'Κρατημένο',
  sold: 'Πωλήθηκε',
  shipped: 'Απεστάλη',
  delivered: 'Παραδόθηκε',
  returned: 'Επιστράφηκε',
  deleted: 'Διαγράφηκε',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Σε αναμονή',
  confirmed: 'Επιβεβαιωμένη',
  dispatched: 'Εστάλη',
  shipped: 'Σε μεταφορά',
  delivered: 'Παραδόθηκε',
  cancelled: 'Ακυρώθηκε',
  returned: 'Επιστράφηκε',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: 'Κάρτα',
  cash_on_delivery: 'Αντικαταβολή',
  bank_transfer: 'Τραπεζική μεταφορά',
}

export const DELIVERY_METHOD_LABELS: Record<DeliveryMethod, string> = {
  courier: 'Κούριερ',
  pickup: 'Παραλαβή από τη μάντρα',
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  receipt: 'Απόδειξη',
  invoice: 'Τιμολόγιο',
}

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  registered: 'Εγγεγραμμένος',
  submitted: 'Υποβλήθηκε',
  pending: 'Σε εξέταση',
  approved: 'Εγκρίθηκε',
  rejected: 'Απορρίφθηκε',
  needs_more_info: 'Απαιτούνται επιπλέον στοιχεία',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  seller_owner: 'Ιδιοκτήτης μάντρας',
  seller_employee: 'Υπάλληλος μάντρας',
  buyer_owner: 'Αγοραστής',
  buyer_employee: 'Αγοραστής - Υπάλληλος',
  admin: 'Διαχειριστής',
}

export const COPY = {
  HOMEPAGE_TITLE: 'Βρες και πούλα μεταχειρισμένα ανταλλακτικά πιο γρήγορα.',
  HOMEPAGE_SUBTITLE:
    'Το Partlink οργανώνει το stock της μάντρας και βοηθά συνεργεία και ιδιώτες να βρίσκουν διαθέσιμα ανταλλακτικά σε όλη την Ελλάδα.',
  ADD_PART_SUCCESS: 'Το ανταλλακτικό προστέθηκε στο stock και δημοσιεύτηκε στο marketplace.',
  VIN_IMPORT_SUCCESS:
    'Τα επιλεγμένα ανταλλακτικά προστέθηκαν στο stock και είναι διαθέσιμα στο marketplace.',
  MARKETPLACE_SEARCH_PLACEHOLDER: 'Αναζήτησε ανταλλακτικό, part number ή μοντέλο',
  QR_SCAN_FAILED: 'Δεν αναγνωρίστηκε το QR. Βεβαιώσου ότι είναι καθαρό και δοκίμασε ξανά.',
  EMPTY_ORDERS: 'Δεν υπάρχουν ακόμα παραγγελίες.',
  EMPTY_INVENTORY: 'Δεν υπάρχουν ακόμα ανταλλακτικά στο stock.',
  EMPTY_CHATS: 'Δεν υπάρχουν ακόμα μηνύματα.',
} as const
