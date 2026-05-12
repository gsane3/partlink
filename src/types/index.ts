export type UserRole =
  | 'seller_owner'
  | 'seller_employee'
  | 'buyer_owner'
  | 'buyer_employee'
  | 'admin'

export type PartStatus =
  | 'draft'
  | 'available'
  | 'reserved'
  | 'sold'
  | 'shipped'
  | 'delivered'
  | 'returned'
  | 'deleted'

export type PartCondition =
  | 'excellent'
  | 'very_good'
  | 'good'
  | 'fair'
  | 'for_repair'
  | 'tested'
  | 'untested'

export type VerificationStatus =
  | 'registered'
  | 'submitted'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_more_info'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'dispatched'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'

export type PaymentMethod = 'card' | 'cash_on_delivery' | 'bank_transfer'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type DeliveryMethod = 'courier' | 'pickup'

export type DocumentType = 'receipt' | 'invoice'

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed'

export interface User {
  id: string
  email: string
  role: UserRole
  fullName: string
  phone: string
  createdAt: string
}

export interface Seller {
  id: string
  userId: string
  businessName: string
  afm: string
  doy: string
  phone: string
  address: string
  city: string
  postalCode: string
  website?: string
  verificationStatus: VerificationStatus
  createdAt: string
}

export interface Buyer {
  id: string
  userId: string
  fullName: string
  companyName?: string
  phone: string
  email: string
  shippingAddress: string
  city: string
  postalCode: string
  documentPreference: DocumentType
  afm?: string
  doy?: string
  profession?: string
  createdAt: string
}

export interface VerificationRequest {
  id: string
  sellerId: string
  businessName: string
  afm: string
  doy: string
  phone: string
  address: string
  website?: string
  status: VerificationStatus
  submittedAt: string
  reviewedAt?: string
  reviewNote?: string
}

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  engine?: string
  fuel?: string
  vin?: string
}

export interface PartPhoto {
  id: string
  partId: string
  url: string
  isPrimary: boolean
}

export interface Part {
  id: string
  sellerId: string
  sku: string
  vehicle: Vehicle
  partName: string
  categoryId: string
  condition: PartCondition
  price: number
  description?: string
  quantity: number
  status: PartStatus
  isPublished: boolean
  photos: PartPhoto[]
  qrCodeId?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface QRCode {
  id: string
  partId: string
  sellerId: string
  sku: string
  value: string
  printedAt?: string
  createdAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  partId: string
  part: Part
  quantity: number
  priceAtOrder: number
}

export interface Payment {
  id: string
  orderId: string
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  paidAt?: string
}

export interface InvoiceDocument {
  id: string
  orderId: string
  type: DocumentType
  companyName?: string
  afm?: string
  doy?: string
  profession?: string
  billingAddress?: string
  issuedAt?: string
}

export interface Shipment {
  id: string
  orderId: string
  method: DeliveryMethod
  trackingNumber?: string
  carrier?: string
  dispatchedAt?: string
  deliveredAt?: string
  qrScannedAt?: string
}

export interface Order {
  id: string
  buyerId: string
  sellerId: string
  items: OrderItem[]
  status: OrderStatus
  payment?: Payment
  shipment?: Shipment
  invoiceDocument?: InvoiceDocument
  totalAmount: number
  createdAt: string
  updatedAt: string
}

export interface ChatThread {
  id: string
  buyerId: string
  sellerId: string
  partId?: string
  orderId?: string
  lastMessageAt: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  threadId: string
  senderId: string
  body: string
  sentAt: string
}

export interface Sale {
  id: string
  orderId: string
  partId: string
  sellerId: string
  buyerId: string
  amount: number
  soldAt: string
}

export interface Dispute {
  id: string
  orderId: string
  raisedByUserId: string
  reason: string
  status: DisputeStatus
  createdAt: string
  resolvedAt?: string
}

export interface AdminAction {
  id: string
  adminUserId: string
  targetType: 'seller' | 'buyer' | 'part' | 'order' | 'dispute' | 'verification'
  targetId: string
  action: string
  note?: string
  createdAt: string
}
