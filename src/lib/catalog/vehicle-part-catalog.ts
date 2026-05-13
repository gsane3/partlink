import type { DecodedVehicle } from '@/components/inventory/vin-import/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PriceMode = 'fixed' | 'on_request' | 'hidden'
export type DemandTier = 'high' | 'medium' | 'low'

export interface VehicleFilter {
  fuel?: string[]       // match if vehicle.fuel is in this list
  yearMin?: number
  yearMax?: number
}

export interface CatalogCategory {
  id: string
  name: string
}

export interface CatalogPartEntry {
  id: string
  name: string
  catalogCategoryId: string   // for accordion grouping in wizard step 4
  inventoryCategoryId: string // maps to CATEGORIES in constants (for GeneratedPart.categoryId)
  defaultPriceMode: PriceMode
  suggestedPrice?: number
  demandTier: DemandTier
  requiresInspection?: boolean
  requiresPartNumber?: boolean
  safetyCritical?: boolean
  appliesTo?: VehicleFilter   // only include if vehicle matches
  excludeIf?: VehicleFilter   // exclude if vehicle matches
}

// ─── Catalog categories (for accordion display in step 4) ─────────────────────

export const PART_CATALOG_CATEGORIES: CatalogCategory[] = [
  { id: 'engine_main',     name: 'Κινητήρας & περιφερειακά' },
  { id: 'transmission',    name: 'Σασμάν & μετάδοση' },
  { id: 'exhaust',         name: 'Εξάτμιση & αντιρρύπανση' },
  { id: 'suspension',      name: 'Αναρτήσεις' },
  { id: 'brakes',          name: 'Φρένα' },
  { id: 'steering',        name: 'Τιμόνι & διεύθυνση' },
  { id: 'body_ext',        name: 'Φανοποιία εξωτερικά' },
  { id: 'lighting',        name: 'Φανάρια & φωτισμός' },
  { id: 'glass',           name: 'Τζάμια & καθρέφτες' },
  { id: 'doors',           name: 'Πόρτες / παράθυρα' },
  { id: 'interior',        name: 'Εσωτερικό / σαλόνι' },
  { id: 'electrical',      name: 'Ηλεκτρικά & ηλεκτρονικά' },
  { id: 'infotainment',    name: 'Infotainment / ήχος' },
  { id: 'climate',         name: 'Κλιματισμός / θέρμανση' },
  { id: 'wipers',          name: 'Υαλοκαθαριστήρες' },
  { id: 'airbags',         name: 'Αερόσακοι & ασφάλεια' },
  { id: 'wheels',          name: 'Ζάντες / ελαστικά / τροχοί' },
  { id: 'fuel',            name: 'Καύσιμο / ρεζερβουάρ' },
  { id: 'hybrid_ev',       name: 'Hybrid / Electric' },
]

// ─── Fuel helpers ─────────────────────────────────────────────────────────────

const DIESEL_ONLY: VehicleFilter = { fuel: ['Diesel'] }
const PETROL_ONLY: VehicleFilter = { fuel: ['Βενζίνη'] }
const HYBRID_EV:   VehicleFilter = { fuel: ['Υβριδικό', 'Ηλεκτρικό'] }

// ─── Catalog — ~130 parts ─────────────────────────────────────────────────────

export const VEHICLE_PART_CATALOG: CatalogPartEntry[] = [

  // ── Κινητήρας & περιφερειακά ─────────────────────────────────────────────────
  { id: 'e01', name: 'Κινητήρας',                       catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 800,  demandTier: 'high' },
  { id: 'e02', name: 'Κεφαλή κινητήρα',                 catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 250,  demandTier: 'high' },
  { id: 'e03', name: 'Τουρμπίνα',                       catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 320,  demandTier: 'high', requiresInspection: true },
  { id: 'e04', name: 'Ψυγείο νερού',                    catalogCategoryId: 'engine_main', inventoryCategoryId: 'cooling',      defaultPriceMode: 'fixed',      suggestedPrice: 110,  demandTier: 'high' },
  { id: 'e05', name: 'Αντλία νερού',                    catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 45,   demandTier: 'medium' },
  { id: 'e06', name: 'Αντλία λαδιού',                   catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 55,   demandTier: 'medium' },
  { id: 'e07', name: 'Τέντωρας / οδηγός χρονισμού',    catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 50,   demandTier: 'medium' },
  { id: 'e08', name: 'Πολλαπλή εισαγωγής',              catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 120,  demandTier: 'medium', appliesTo: PETROL_ONLY },
  { id: 'e09', name: 'Πολλαπλή εξαγωγής',              catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 80,   demandTier: 'medium' },
  { id: 'e10', name: 'Ψυγείο λαδιού',                   catalogCategoryId: 'engine_main', inventoryCategoryId: 'cooling',      defaultPriceMode: 'fixed',      suggestedPrice: 65,   demandTier: 'medium' },
  { id: 'e11', name: 'Αισθητήρας μάζας αέρα (MAF)',     catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 55,   demandTier: 'medium' },
  { id: 'e12', name: 'Αισθητήρας λάμδα',               catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 40,   demandTier: 'medium' },
  { id: 'e13', name: 'Πεταλούδα γκαζιού',               catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 60,   demandTier: 'medium', appliesTo: PETROL_ONLY },
  { id: 'e14', name: 'Φυσητήρας (Intercooler)',         catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 120,  demandTier: 'medium' },
  { id: 'e15', name: 'Carter / Κάρτερ κινητήρα',        catalogCategoryId: 'engine_main', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 95,   demandTier: 'low' },

  // ── Σασμάν & μετάδοση ────────────────────────────────────────────────────────
  { id: 't01', name: 'Σασμάν',                          catalogCategoryId: 'transmission', inventoryCategoryId: 'transmission', defaultPriceMode: 'fixed',     suggestedPrice: 350,  demandTier: 'high' },
  { id: 't02', name: 'Κόνταξ αριστερό',                catalogCategoryId: 'transmission', inventoryCategoryId: 'transmission', defaultPriceMode: 'fixed',     suggestedPrice: 65,   demandTier: 'high' },
  { id: 't03', name: 'Κόνταξ δεξί',                    catalogCategoryId: 'transmission', inventoryCategoryId: 'transmission', defaultPriceMode: 'fixed',     suggestedPrice: 65,   demandTier: 'high' },
  { id: 't04', name: 'Διαφορικό',                       catalogCategoryId: 'transmission', inventoryCategoryId: 'transmission', defaultPriceMode: 'on_request', suggestedPrice: 180, demandTier: 'medium' },
  { id: 't05', name: 'Σύμπλεκτης',                     catalogCategoryId: 'transmission', inventoryCategoryId: 'transmission', defaultPriceMode: 'fixed',     suggestedPrice: 80,   demandTier: 'medium' },
  { id: 't06', name: 'Τράβερσα κινητήρα',              catalogCategoryId: 'transmission', inventoryCategoryId: 'transmission', defaultPriceMode: 'fixed',     suggestedPrice: 55,   demandTier: 'medium' },
  { id: 't07', name: 'Άξονας μεσαίος (propshaft)',      catalogCategoryId: 'transmission', inventoryCategoryId: 'transmission', defaultPriceMode: 'on_request', demandTier: 'low' },

  // ── Εξάτμιση & αντιρρύπανση ──────────────────────────────────────────────────
  { id: 'x01', name: 'Καταλύτης',                       catalogCategoryId: 'exhaust', inventoryCategoryId: 'exhaust',      defaultPriceMode: 'fixed',      suggestedPrice: 180,  demandTier: 'high' },
  { id: 'x02', name: 'Φίλτρο σωματιδίων DPF',          catalogCategoryId: 'exhaust', inventoryCategoryId: 'exhaust',      defaultPriceMode: 'fixed',      suggestedPrice: 350,  demandTier: 'high', requiresInspection: true, appliesTo: DIESEL_ONLY },
  { id: 'x03', name: 'Σιγαστήρας (μεσαίος / πίσω)',    catalogCategoryId: 'exhaust', inventoryCategoryId: 'exhaust',      defaultPriceMode: 'fixed',      suggestedPrice: 120,  demandTier: 'medium' },
  { id: 'x04', name: 'EGR βαλβίδα',                    catalogCategoryId: 'exhaust', inventoryCategoryId: 'engine',       defaultPriceMode: 'fixed',      suggestedPrice: 75,   demandTier: 'medium', appliesTo: DIESEL_ONLY },
  { id: 'x05', name: 'AdBlue δεξαμενή',                catalogCategoryId: 'exhaust', inventoryCategoryId: 'exhaust',      defaultPriceMode: 'fixed',      suggestedPrice: 85,   demandTier: 'medium', appliesTo: DIESEL_ONLY },
  { id: 'x06', name: 'Μανιφόλδ εξαγωγής / προκαταλύτης', catalogCategoryId: 'exhaust', inventoryCategoryId: 'exhaust',   defaultPriceMode: 'fixed',      suggestedPrice: 95,   demandTier: 'medium' },

  // ── Αναρτήσεις ───────────────────────────────────────────────────────────────
  { id: 's01', name: 'Αμορτισέρ εμπρός δεξί',          catalogCategoryId: 'suspension', inventoryCategoryId: 'suspension',  defaultPriceMode: 'fixed',     suggestedPrice: 85,   demandTier: 'high' },
  { id: 's02', name: 'Αμορτισέρ εμπρός αριστερό',       catalogCategoryId: 'suspension', inventoryCategoryId: 'suspension',  defaultPriceMode: 'fixed',     suggestedPrice: 85,   demandTier: 'high' },
  { id: 's03', name: 'Αμορτισέρ πίσω δεξί',             catalogCategoryId: 'suspension', inventoryCategoryId: 'suspension',  defaultPriceMode: 'fixed',     suggestedPrice: 75,   demandTier: 'high' },
  { id: 's04', name: 'Αμορτισέρ πίσω αριστερό',         catalogCategoryId: 'suspension', inventoryCategoryId: 'suspension',  defaultPriceMode: 'fixed',     suggestedPrice: 75,   demandTier: 'high' },
  { id: 's05', name: 'Ψαλίδι εμπρός δεξί (wishbone)',   catalogCategoryId: 'suspension', inventoryCategoryId: 'suspension',  defaultPriceMode: 'fixed',     suggestedPrice: 90,   demandTier: 'medium' },
  { id: 's06', name: 'Ψαλίδι εμπρός αριστερό',          catalogCategoryId: 'suspension', inventoryCategoryId: 'suspension',  defaultPriceMode: 'fixed',     suggestedPrice: 90,   demandTier: 'medium' },
  { id: 's07', name: 'Ελατήριο εμπρός',                 catalogCategoryId: 'suspension', inventoryCategoryId: 'suspension',  defaultPriceMode: 'fixed',     suggestedPrice: 45,   demandTier: 'medium' },
  { id: 's08', name: 'Ελατήριο πίσω',                   catalogCategoryId: 'suspension', inventoryCategoryId: 'suspension',  defaultPriceMode: 'fixed',     suggestedPrice: 40,   demandTier: 'medium' },
  { id: 's09', name: 'Αξονάρι πίσω',                    catalogCategoryId: 'suspension', inventoryCategoryId: 'suspension',  defaultPriceMode: 'on_request', suggestedPrice: 120, demandTier: 'medium' },

  // ── Φρένα ─────────────────────────────────────────────────────────────────────
  { id: 'b01', name: 'Δαγκάνα εμπρός δεξιά',            catalogCategoryId: 'brakes', inventoryCategoryId: 'brakes',        defaultPriceMode: 'fixed',     suggestedPrice: 65,   demandTier: 'high', requiresInspection: true, safetyCritical: true },
  { id: 'b02', name: 'Δαγκάνα εμπρός αριστερή',         catalogCategoryId: 'brakes', inventoryCategoryId: 'brakes',        defaultPriceMode: 'fixed',     suggestedPrice: 65,   demandTier: 'high', requiresInspection: true, safetyCritical: true },
  { id: 'b03', name: 'Δαγκάνα πίσω δεξιά',              catalogCategoryId: 'brakes', inventoryCategoryId: 'brakes',        defaultPriceMode: 'fixed',     suggestedPrice: 55,   demandTier: 'high', requiresInspection: true, safetyCritical: true },
  { id: 'b04', name: 'Δαγκάνα πίσω αριστερή',           catalogCategoryId: 'brakes', inventoryCategoryId: 'brakes',        defaultPriceMode: 'fixed',     suggestedPrice: 55,   demandTier: 'high', requiresInspection: true, safetyCritical: true },
  { id: 'b05', name: 'Αντλία φρένων (master cylinder)',  catalogCategoryId: 'brakes', inventoryCategoryId: 'brakes',        defaultPriceMode: 'fixed',     suggestedPrice: 75,   demandTier: 'medium', safetyCritical: true },
  { id: 'b06', name: 'Μονάδα ABS / ESP',                 catalogCategoryId: 'brakes', inventoryCategoryId: 'brakes',        defaultPriceMode: 'fixed',     suggestedPrice: 120,  demandTier: 'medium', requiresInspection: true },
  { id: 'b07', name: 'Σερβοφρένο',                       catalogCategoryId: 'brakes', inventoryCategoryId: 'brakes',        defaultPriceMode: 'fixed',     suggestedPrice: 75,   demandTier: 'medium', safetyCritical: true },
  { id: 'b08', name: 'Τύμπανο πίσω φρένου',             catalogCategoryId: 'brakes', inventoryCategoryId: 'brakes',        defaultPriceMode: 'fixed',     suggestedPrice: 45,   demandTier: 'low' },

  // ── Τιμόνι & διεύθυνση ───────────────────────────────────────────────────────
  { id: 'st01', name: 'Κιβώτιο διεύθυνσης',            catalogCategoryId: 'steering', inventoryCategoryId: 'other',        defaultPriceMode: 'fixed',     suggestedPrice: 150,  demandTier: 'high' },
  { id: 'st02', name: 'Αντλία υδραυλικού τιμονιού',    catalogCategoryId: 'steering', inventoryCategoryId: 'other',        defaultPriceMode: 'fixed',     suggestedPrice: 85,   demandTier: 'medium' },
  { id: 'st03', name: 'Μπαρέτα τιμονιού',              catalogCategoryId: 'steering', inventoryCategoryId: 'other',        defaultPriceMode: 'fixed',     suggestedPrice: 45,   demandTier: 'medium' },
  { id: 'st04', name: 'Τιμόνι οδηγού',                 catalogCategoryId: 'steering', inventoryCategoryId: 'interior',     defaultPriceMode: 'fixed',     suggestedPrice: 55,   demandTier: 'medium' },
  { id: 'st05', name: 'Ρεζερβουάρ υδραυλικού',         catalogCategoryId: 'steering', inventoryCategoryId: 'other',        defaultPriceMode: 'fixed',     suggestedPrice: 25,   demandTier: 'low' },

  // ── Φανοποιία εξωτερικά ──────────────────────────────────────────────────────
  { id: 'bo01', name: 'Προφυλακτήρας εμπρός',           catalogCategoryId: 'body_ext', inventoryCategoryId: 'body',         defaultPriceMode: 'fixed',     suggestedPrice: 65,   demandTier: 'high' },
  { id: 'bo02', name: 'Προφυλακτήρας πίσω',             catalogCategoryId: 'body_ext', inventoryCategoryId: 'body',         defaultPriceMode: 'fixed',     suggestedPrice: 55,   demandTier: 'high' },
  { id: 'bo03', name: 'Κάπο',                            catalogCategoryId: 'body_ext', inventoryCategoryId: 'body',         defaultPriceMode: 'fixed',     suggestedPrice: 120,  demandTier: 'high' },
  { id: 'bo04', name: 'Καπό πορτμπαγκάζ',               catalogCategoryId: 'body_ext', inventoryCategoryId: 'body',         defaultPriceMode: 'fixed',     suggestedPrice: 95,   demandTier: 'high' },
  { id: 'bo05', name: 'Φτερό εμπρός δεξί',              catalogCategoryId: 'body_ext', inventoryCategoryId: 'body',         defaultPriceMode: 'fixed',     suggestedPrice: 75,   demandTier: 'high' },
  { id: 'bo06', name: 'Φτερό εμπρός αριστερό',          catalogCategoryId: 'body_ext', inventoryCategoryId: 'body',         defaultPriceMode: 'fixed',     suggestedPrice: 75,   demandTier: 'high' },
  { id: 'bo07', name: 'Φτερό πίσω δεξί',                catalogCategoryId: 'body_ext', inventoryCategoryId: 'body',         defaultPriceMode: 'fixed',     suggestedPrice: 65,   demandTier: 'medium' },
  { id: 'bo08', name: 'Φτερό πίσω αριστερό',            catalogCategoryId: 'body_ext', inventoryCategoryId: 'body',         defaultPriceMode: 'fixed',     suggestedPrice: 65,   demandTier: 'medium' },
  { id: 'bo09', name: 'Σχάρα προφυλακτήρα εμπρός',     catalogCategoryId: 'body_ext', inventoryCategoryId: 'body',         defaultPriceMode: 'fixed',     suggestedPrice: 35,   demandTier: 'medium' },
  { id: 'bo10', name: 'Ποδιά κινητήρα / under cover',   catalogCategoryId: 'body_ext', inventoryCategoryId: 'body',         defaultPriceMode: 'fixed',     suggestedPrice: 30,   demandTier: 'low' },
  { id: 'bo11', name: 'Ανεμοθραύστης οροφής (spoiler)', catalogCategoryId: 'body_ext', inventoryCategoryId: 'body',         defaultPriceMode: 'fixed',     suggestedPrice: 45,   demandTier: 'low' },

  // ── Φανάρια & φωτισμός ───────────────────────────────────────────────────────
  { id: 'li01', name: 'Φανάρι εμπρός δεξί',             catalogCategoryId: 'lighting', inventoryCategoryId: 'lighting',     defaultPriceMode: 'fixed',     suggestedPrice: 80,   demandTier: 'high' },
  { id: 'li02', name: 'Φανάρι εμπρός αριστερό',         catalogCategoryId: 'lighting', inventoryCategoryId: 'lighting',     defaultPriceMode: 'fixed',     suggestedPrice: 80,   demandTier: 'high' },
  { id: 'li03', name: 'Φανάρι πίσω δεξί',               catalogCategoryId: 'lighting', inventoryCategoryId: 'lighting',     defaultPriceMode: 'fixed',     suggestedPrice: 55,   demandTier: 'high' },
  { id: 'li04', name: 'Φανάρι πίσω αριστερό',           catalogCategoryId: 'lighting', inventoryCategoryId: 'lighting',     defaultPriceMode: 'fixed',     suggestedPrice: 55,   demandTier: 'high' },
  { id: 'li05', name: 'Φανάρι ομίχλης εμπρός',          catalogCategoryId: 'lighting', inventoryCategoryId: 'lighting',     defaultPriceMode: 'fixed',     suggestedPrice: 30,   demandTier: 'medium' },
  { id: 'li06', name: 'Μπάρα LED / DRL εμπρός δεξιά',   catalogCategoryId: 'lighting', inventoryCategoryId: 'lighting',     defaultPriceMode: 'fixed',     suggestedPrice: 40,   demandTier: 'medium' },
  { id: 'li07', name: 'Μπάρα LED / DRL εμπρός αριστερή',catalogCategoryId: 'lighting', inventoryCategoryId: 'lighting',     defaultPriceMode: 'fixed',     suggestedPrice: 40,   demandTier: 'medium' },
  { id: 'li08', name: 'Φωτεινός συνδυασμός πίνακα',     catalogCategoryId: 'lighting', inventoryCategoryId: 'electrical',   defaultPriceMode: 'fixed',     suggestedPrice: 55,   demandTier: 'medium' },

  // ── Τζάμια & καθρέφτες ───────────────────────────────────────────────────────
  { id: 'gl01', name: 'Παρμπρίζ',                       catalogCategoryId: 'glass', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 120,  demandTier: 'high' },
  { id: 'gl02', name: 'Τζάμι πίσω',                     catalogCategoryId: 'glass', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 75,   demandTier: 'medium' },
  { id: 'gl03', name: 'Καθρέφτης δεξιός',               catalogCategoryId: 'glass', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 45,   demandTier: 'high' },
  { id: 'gl04', name: 'Καθρέφτης αριστερός',            catalogCategoryId: 'glass', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 45,   demandTier: 'high' },
  { id: 'gl05', name: 'Τζάμι πόρτας εμπρός δεξί',       catalogCategoryId: 'glass', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 35,   demandTier: 'medium' },
  { id: 'gl06', name: 'Τζάμι πόρτας εμπρός αριστερό',   catalogCategoryId: 'glass', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 35,   demandTier: 'medium' },
  { id: 'gl07', name: 'Τζάμι πόρτας πίσω δεξί',         catalogCategoryId: 'glass', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 30,   demandTier: 'low' },
  { id: 'gl08', name: 'Τζάμι πόρτας πίσω αριστερό',     catalogCategoryId: 'glass', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 30,   demandTier: 'low' },

  // ── Πόρτες / παράθυρα / μηχανισμοί ──────────────────────────────────────────
  { id: 'do01', name: 'Πόρτα εμπρός δεξιά',             catalogCategoryId: 'doors', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 150,  demandTier: 'high' },
  { id: 'do02', name: 'Πόρτα εμπρός αριστερή',          catalogCategoryId: 'doors', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 150,  demandTier: 'high' },
  { id: 'do03', name: 'Πόρτα πίσω δεξιά',               catalogCategoryId: 'doors', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 130,  demandTier: 'high' },
  { id: 'do04', name: 'Πόρτα πίσω αριστερή',            catalogCategoryId: 'doors', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 130,  demandTier: 'high' },
  { id: 'do05', name: 'Μοτέρ παραθύρου εμπρός δεξί',   catalogCategoryId: 'doors', inventoryCategoryId: 'electrical',      defaultPriceMode: 'fixed',     suggestedPrice: 35,   demandTier: 'medium' },
  { id: 'do06', name: 'Μοτέρ παραθύρου εμπρός αριστερό',catalogCategoryId: 'doors', inventoryCategoryId: 'electrical',     defaultPriceMode: 'fixed',     suggestedPrice: 35,   demandTier: 'medium' },
  { id: 'do07', name: 'Κλειδαριά πόρτας',               catalogCategoryId: 'doors', inventoryCategoryId: 'electrical',      defaultPriceMode: 'fixed',     suggestedPrice: 40,   demandTier: 'medium' },
  { id: 'do08', name: 'Χερούλι πόρτας εξωτερικό',       catalogCategoryId: 'doors', inventoryCategoryId: 'body',            defaultPriceMode: 'fixed',     suggestedPrice: 25,   demandTier: 'medium' },

  // ── Εσωτερικό / σαλόνι ───────────────────────────────────────────────────────
  { id: 'in01', name: 'Κάθισμα οδηγού',                 catalogCategoryId: 'interior', inventoryCategoryId: 'interior',     defaultPriceMode: 'fixed',     suggestedPrice: 80,   demandTier: 'medium' },
  { id: 'in02', name: 'Κάθισμα συνοδηγού',              catalogCategoryId: 'interior', inventoryCategoryId: 'interior',     defaultPriceMode: 'fixed',     suggestedPrice: 70,   demandTier: 'medium' },
  { id: 'in03', name: 'Πίνακας οργάνων / ταμπλό',       catalogCategoryId: 'interior', inventoryCategoryId: 'interior',     defaultPriceMode: 'fixed',     suggestedPrice: 95,   demandTier: 'medium' },
  { id: 'in04', name: 'Ζώνη ασφαλείας εμπρός δεξιά',   catalogCategoryId: 'interior', inventoryCategoryId: 'interior',     defaultPriceMode: 'fixed',     suggestedPrice: 45,   demandTier: 'medium', safetyCritical: true },
  { id: 'in05', name: 'Ζώνη ασφαλείας εμπρός αριστερή',catalogCategoryId: 'interior', inventoryCategoryId: 'interior',     defaultPriceMode: 'fixed',     suggestedPrice: 45,   demandTier: 'medium', safetyCritical: true },
  { id: 'in06', name: 'Χειριστήρια κλιματισμού / κεντρικό',catalogCategoryId: 'interior', inventoryCategoryId: 'interior', defaultPriceMode: 'fixed',     suggestedPrice: 55,   demandTier: 'medium' },
  { id: 'in07', name: 'Σύστημα keyless / μονάδα comfort',catalogCategoryId: 'interior', inventoryCategoryId: 'electrical',  defaultPriceMode: 'fixed',     suggestedPrice: 75,   demandTier: 'medium' },
  { id: 'in08', name: 'Εσωτερικός καθρέφτης οροφής',   catalogCategoryId: 'interior', inventoryCategoryId: 'interior',     defaultPriceMode: 'fixed',     suggestedPrice: 25,   demandTier: 'low' },

  // ── Ηλεκτρικά & ηλεκτρονικά ─────────────────────────────────────────────────
  { id: 'el01', name: 'Εγκέφαλος κινητήρα (ECU)',       catalogCategoryId: 'electrical', inventoryCategoryId: 'electrical',  defaultPriceMode: 'fixed',    suggestedPrice: 280,  demandTier: 'high', requiresPartNumber: true },
  { id: 'el02', name: 'Εγκέφαλος σώματος (BCM)',        catalogCategoryId: 'electrical', inventoryCategoryId: 'electrical',  defaultPriceMode: 'fixed',    suggestedPrice: 120,  demandTier: 'medium', requiresPartNumber: true },
  { id: 'el03', name: 'Μίζα',                           catalogCategoryId: 'electrical', inventoryCategoryId: 'electrical',  defaultPriceMode: 'fixed',    suggestedPrice: 38,   demandTier: 'high' },
  { id: 'el04', name: 'Δυναμό / Αλτερνατέρ',           catalogCategoryId: 'electrical', inventoryCategoryId: 'electrical',  defaultPriceMode: 'fixed',    suggestedPrice: 55,   demandTier: 'high' },
  { id: 'el05', name: 'Μπαταρία 12V',                   catalogCategoryId: 'electrical', inventoryCategoryId: 'electrical',  defaultPriceMode: 'fixed',    suggestedPrice: 45,   demandTier: 'medium' },
  { id: 'el06', name: 'Αισθητήρας ABS εμπρός',          catalogCategoryId: 'electrical', inventoryCategoryId: 'electrical',  defaultPriceMode: 'fixed',    suggestedPrice: 40,   demandTier: 'medium' },
  { id: 'el07', name: 'Κουτί ασφαλειών / relays',       catalogCategoryId: 'electrical', inventoryCategoryId: 'electrical',  defaultPriceMode: 'fixed',    suggestedPrice: 65,   demandTier: 'medium' },
  { id: 'el08', name: 'Καλωδίωση κινητήρα / wiring harness', catalogCategoryId: 'electrical', inventoryCategoryId: 'electrical', defaultPriceMode: 'on_request', suggestedPrice: 95, demandTier: 'medium' },
  { id: 'el09', name: 'Διακόπτης παραθύρου εμπρός',    catalogCategoryId: 'electrical', inventoryCategoryId: 'electrical',  defaultPriceMode: 'fixed',    suggestedPrice: 30,   demandTier: 'medium' },
  { id: 'el10', name: 'Αισθητήρας στροφαλοφόρου',      catalogCategoryId: 'electrical', inventoryCategoryId: 'engine',      defaultPriceMode: 'fixed',    suggestedPrice: 35,   demandTier: 'medium' },

  // ── Infotainment / ήχος ──────────────────────────────────────────────────────
  { id: 'if01', name: 'Ραδιόφωνο / Head unit',          catalogCategoryId: 'infotainment', inventoryCategoryId: 'electrical', defaultPriceMode: 'fixed',    suggestedPrice: 80,   demandTier: 'medium' },
  { id: 'if02', name: 'Οθόνη navigation / multimedia',  catalogCategoryId: 'infotainment', inventoryCategoryId: 'electrical', defaultPriceMode: 'fixed',    suggestedPrice: 150,  demandTier: 'medium', requiresPartNumber: true },
  { id: 'if03', name: 'Ηχεία (σετ)',                    catalogCategoryId: 'infotainment', inventoryCategoryId: 'electrical', defaultPriceMode: 'fixed',    suggestedPrice: 35,   demandTier: 'low' },
  { id: 'if04', name: 'Κεραία GPS / ραδίου',            catalogCategoryId: 'infotainment', inventoryCategoryId: 'electrical', defaultPriceMode: 'fixed',    suggestedPrice: 20,   demandTier: 'low' },

  // ── Κλιματισμός / θέρμανση ───────────────────────────────────────────────────
  { id: 'cl01', name: 'Κομπρεσέρ κλιματισμού',          catalogCategoryId: 'climate', inventoryCategoryId: 'cooling',       defaultPriceMode: 'fixed',     suggestedPrice: 150,  demandTier: 'high', requiresInspection: true },
  { id: 'cl02', name: 'Εβαπορατέρ κλιματισμού',        catalogCategoryId: 'climate', inventoryCategoryId: 'cooling',       defaultPriceMode: 'on_request', suggestedPrice: 95,  demandTier: 'medium' },
  { id: 'cl03', name: 'Θερμαντικό σώμα / heater core',  catalogCategoryId: 'climate', inventoryCategoryId: 'cooling',       defaultPriceMode: 'fixed',     suggestedPrice: 75,   demandTier: 'medium' },
  { id: 'cl04', name: 'Μοτέρ ανεμιστήρα καλοριφέρ',    catalogCategoryId: 'climate', inventoryCategoryId: 'cooling',       defaultPriceMode: 'fixed',     suggestedPrice: 45,   demandTier: 'medium' },
  { id: 'cl05', name: 'Ψυγείο κλιματισμού',             catalogCategoryId: 'climate', inventoryCategoryId: 'cooling',       defaultPriceMode: 'fixed',     suggestedPrice: 80,   demandTier: 'medium' },

  // ── Υαλοκαθαριστήρες / πλύσιμο ──────────────────────────────────────────────
  { id: 'wi01', name: 'Μοτέρ υαλοκαθαριστήρα εμπρός',  catalogCategoryId: 'wipers', inventoryCategoryId: 'electrical',    defaultPriceMode: 'fixed',     suggestedPrice: 45,   demandTier: 'medium' },
  { id: 'wi02', name: 'Μοτέρ υαλοκαθαριστήρα πίσω',   catalogCategoryId: 'wipers', inventoryCategoryId: 'electrical',    defaultPriceMode: 'fixed',     suggestedPrice: 35,   demandTier: 'low' },
  { id: 'wi03', name: 'Ρεζερβουάρ νερού υαλοκ.',        catalogCategoryId: 'wipers', inventoryCategoryId: 'body',          defaultPriceMode: 'fixed',     suggestedPrice: 25,   demandTier: 'low' },

  // ── Αερόσακοι & ασφάλεια ─────────────────────────────────────────────────────
  { id: 'ab01', name: 'Αερόσακος οδηγού',               catalogCategoryId: 'airbags', inventoryCategoryId: 'interior',     defaultPriceMode: 'fixed',     suggestedPrice: 90,   demandTier: 'high', requiresInspection: true, safetyCritical: true },
  { id: 'ab02', name: 'Αερόσακος συνοδηγού',            catalogCategoryId: 'airbags', inventoryCategoryId: 'interior',     defaultPriceMode: 'fixed',     suggestedPrice: 90,   demandTier: 'high', requiresInspection: true, safetyCritical: true },
  { id: 'ab03', name: 'Airbag κουρτίνα δεξιά',          catalogCategoryId: 'airbags', inventoryCategoryId: 'interior',     defaultPriceMode: 'fixed',     suggestedPrice: 75,   demandTier: 'high', requiresInspection: true, safetyCritical: true },
  { id: 'ab04', name: 'Airbag κουρτίνα αριστερή',       catalogCategoryId: 'airbags', inventoryCategoryId: 'interior',     defaultPriceMode: 'fixed',     suggestedPrice: 75,   demandTier: 'high', requiresInspection: true, safetyCritical: true },
  { id: 'ab05', name: 'Αερόσακος πλαϊνός εμπρός (side)',catalogCategoryId: 'airbags', inventoryCategoryId: 'interior',     defaultPriceMode: 'fixed',     suggestedPrice: 65,   demandTier: 'medium', requiresInspection: true, safetyCritical: true },
  { id: 'ab06', name: 'Μονάδα SRS / airbag control unit',catalogCategoryId: 'airbags', inventoryCategoryId: 'electrical',  defaultPriceMode: 'fixed',     suggestedPrice: 120,  demandTier: 'high', requiresInspection: true, safetyCritical: true },

  // ── Ζάντες / ελαστικά / τροχοί ───────────────────────────────────────────────
  { id: 'wh01', name: 'Ζάντες αλουμινίου (σετ 4)',      catalogCategoryId: 'wheels', inventoryCategoryId: 'wheels',        defaultPriceMode: 'fixed',     suggestedPrice: 180,  demandTier: 'medium' },
  { id: 'wh02', name: 'Ρεζέρβα',                        catalogCategoryId: 'wheels', inventoryCategoryId: 'wheels',        defaultPriceMode: 'fixed',     suggestedPrice: 45,   demandTier: 'low' },
  { id: 'wh03', name: 'Αισθητήρας πίεσης ελαστικών (TPMS)', catalogCategoryId: 'wheels', inventoryCategoryId: 'electrical', defaultPriceMode: 'fixed', suggestedPrice: 25, demandTier: 'low' },

  // ── Καύσιμο / ρεζερβουάρ ─────────────────────────────────────────────────────
  { id: 'fu01', name: 'Δεξαμενή καυσίμου',              catalogCategoryId: 'fuel', inventoryCategoryId: 'other',           defaultPriceMode: 'fixed',     suggestedPrice: 85,   demandTier: 'medium' },
  { id: 'fu02', name: 'Αντλία καυσίμου',                catalogCategoryId: 'fuel', inventoryCategoryId: 'engine',          defaultPriceMode: 'fixed',     suggestedPrice: 55,   demandTier: 'high' },
  { id: 'fu03', name: 'Αντλία υψηλής πίεσης diesel',   catalogCategoryId: 'fuel', inventoryCategoryId: 'engine',          defaultPriceMode: 'fixed',     suggestedPrice: 280,  demandTier: 'high', requiresInspection: true, appliesTo: DIESEL_ONLY },
  { id: 'fu04', name: 'Μπεκ πετρελαίου (injector)',     catalogCategoryId: 'fuel', inventoryCategoryId: 'engine',          defaultPriceMode: 'fixed',     suggestedPrice: 90,   demandTier: 'high', requiresInspection: true, appliesTo: DIESEL_ONLY },
  { id: 'fu05', name: 'Πολλαπλασιαστές (spark plugs coils)', catalogCategoryId: 'fuel', inventoryCategoryId: 'electrical', defaultPriceMode: 'fixed',    suggestedPrice: 40,   demandTier: 'medium', appliesTo: PETROL_ONLY },

  // ── Hybrid / Electric ─────────────────────────────────────────────────────────
  { id: 'hv01', name: 'Μπαταρία υψηλής τάσης (HV battery)', catalogCategoryId: 'hybrid_ev', inventoryCategoryId: 'electrical', defaultPriceMode: 'on_request', demandTier: 'high', requiresInspection: true, appliesTo: HYBRID_EV },
  { id: 'hv02', name: 'Inverter / PCU',                  catalogCategoryId: 'hybrid_ev', inventoryCategoryId: 'electrical', defaultPriceMode: 'on_request', demandTier: 'high', requiresInspection: true, appliesTo: HYBRID_EV },
  { id: 'hv03', name: 'DC-DC Converter',                 catalogCategoryId: 'hybrid_ev', inventoryCategoryId: 'electrical', defaultPriceMode: 'on_request', demandTier: 'medium', appliesTo: HYBRID_EV },
  { id: 'hv04', name: 'Charging port / inlet',           catalogCategoryId: 'hybrid_ev', inventoryCategoryId: 'electrical', defaultPriceMode: 'on_request', demandTier: 'high', appliesTo: HYBRID_EV },
]

// ─── Filter function ──────────────────────────────────────────────────────────

export function getRelevantPartsForVehicle(vehicle: DecodedVehicle): CatalogPartEntry[] {
  return VEHICLE_PART_CATALOG.filter((part) => {
    // Exclude if vehicle matches excludeIf condition
    if (part.excludeIf?.fuel && part.excludeIf.fuel.includes(vehicle.fuel)) return false
    if (part.excludeIf?.yearMin && vehicle.year < part.excludeIf.yearMin) return false
    if (part.excludeIf?.yearMax && vehicle.year > part.excludeIf.yearMax) return false

    // Include only if vehicle matches appliesTo condition
    if (part.appliesTo) {
      if (part.appliesTo.fuel && !part.appliesTo.fuel.includes(vehicle.fuel)) return false
      if (part.appliesTo.yearMin && vehicle.year < part.appliesTo.yearMin) return false
      if (part.appliesTo.yearMax && vehicle.year > part.appliesTo.yearMax) return false
    }

    return true
  })
}
