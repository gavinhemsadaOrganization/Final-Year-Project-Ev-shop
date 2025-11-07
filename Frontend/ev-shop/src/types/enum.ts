/**
 * Defines the roles a user can have within the system.
 */
export const UserRole = {
  ADMIN: "admin",
  USER: "user",
  SELLER: "seller",
  FINANCE: "finance",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Defines the types of notifications that can be sent to users.
 */
export const NotificationType = {
  ORDER_CONFIRMED: "ORDER_CONFIRMED",
  ORDER_CANCELLED: "ORDER_CANCELLED",
  BOOKING_CONFIRMED: "BOOKING_CONFIRMED",
  BOOKING_CANCELLED: "BOOKING_CANCELLED",
  APPLICATION_APPROVED: "APPLICATION_APPROVED",
  APPLICATION_REJECTED: "APPLICATION_REJECTED",
  SELLER_APPLICATION_APPROVED: "SELLER_APPLICATION_APPROVED",
  SELLER_APPLICATION_REJECTED: "SELLER_APPLICATION_REJECTED",
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

/**
 * Defines the supported payment card methods.
 */
export const PaymentMethod = {
  VISA: "visa",
  MASTERCARD: "mastercard",
  AMERICAN_EXPRESS: "american_express",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

/**
 * Defines the purpose of a payment transaction.
 */
export const PaymentType = {
  EV_PURCHASE: "purchase",
  EV_LEASE: "lease",
  EV_TEST_DRIVE: "test_drive",
} as const;
export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

/**
 * Defines the status of a payment transaction.
 */
export const PaymentStatus = {
  CONFIRMED: "confirmed",
  FAILED: "failed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

/**
 * Defines the status of a customer's order.
 */
export const OrderStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

/**
 * Defines the status of a financing application.
 */
export const ApplicationStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  UNDER_REVIEW: "under_review",
  COMPLETED: "completed",
} as const;
export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

/**
 * Defines the type of entity that a review is for.
 */
export const ReviewType = {
  PRODUCT: "product",
  SERVICE: "service",
} as const;
export type ReviewType = (typeof ReviewType)[keyof typeof ReviewType];

/**
 * Defines the condition of a listed vehicle.
 */
export const VehicleCondition = {
  NEW: "new",
  USED: "used",
} as const;
export type VehicleCondition = (typeof VehicleCondition)[keyof typeof VehicleCondition];

/**
 * Defines the type of vehicle listing.
 */
export const ListingType = {
  SALE: "sale",
  LEASE: "lease",
} as const;
export type ListingType = (typeof ListingType)[keyof typeof ListingType];

/**
 * Defines the status of a test drive booking.
 */
export const TestDriveBookingStatus = {
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const;
export type TestDriveBookingStatus = (typeof TestDriveBookingStatus)[keyof typeof TestDriveBookingStatus];

/**
 * Defines the status of a vehicle listing.
 */
export const ListingStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SOLD: "sold",
} as const;
export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];
