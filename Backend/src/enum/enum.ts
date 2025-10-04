export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  SELLER = "seller",
  FINANCE = "finance",
}

export enum NotificationType {
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  APPLICATION_APPROVED = 'APPLICATION_APPROVED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  SELLER_APPLICATION_APPROVED = 'SELLER_APPLICATION_APPROVED',
  SELLER_APPLICATION_REJECTED = 'SELLER_APPLICATION_REJECTED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash'
}

export enum PaymentType {
  PURCHASE = 'purchase',
  REFUND = 'refund',
  PARTIAL_REFUND = 'partial_refund'
}

export enum PaymentStatus {
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review',
  Complete = 'complete'
}

export enum ReviewType{
  PRODUCT = 'product',
  SERVICE = 'service',
}

export enum VehicleCondition {
  NEW = 'new',
  USED = 'used'
}

export enum ListingType {
  SALE = 'sale',
  LEASE = 'lease'
}

export enum TestDriveBookingStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  completed = 'completed',
}