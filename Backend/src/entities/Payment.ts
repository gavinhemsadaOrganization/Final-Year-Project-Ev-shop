import { Schema, model, Document, Types } from "mongoose";
import { PaymentStatus, PaymentMethod, PaymentType } from "../shared/enum/enum";

/**
 * Represents a payment transaction in the database.
 * Each document logs the details of a payment associated with an order.
 */
export interface IPayment extends Document {
  /** The unique identifier for the payment document. */
  _id: Types.ObjectId;
  /** The ID of the `Order` this payment is for. */
  order_id: Types.ObjectId;
  /** The payment method used (e.g., 'visa', 'mastercard'). This field is optional. */
  payment_method?: PaymentMethod;
  /** The purpose of the payment (e.g., 'purchase', 'lease'). */
  payment_type: PaymentType;
  /** The total monetary amount of the payment. */
  amount: number;
  /** The portion of the total amount that constitutes tax. This field is optional. */
  tax_amount?: number;
  /** The current status of the payment (e.g., 'confirmed', 'failed'). */
  status: PaymentStatus;
  /** The unique transaction ID from the external payment gateway (e.g., Stripe, Khalti). */
  payment_id: string;
}

/**
 * Mongoose schema for the Payment collection.
 */
const PaymentSchema = new Schema<IPayment>(
  {
    /** A reference to the `Order` document this payment is associated with. */
    order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    /** The payment method used, controlled by the `PaymentMethod` enum. */
    payment_method: { type: String, enum: Object.values(PaymentMethod) },
    /** The type or purpose of the payment, controlled by the `PaymentType` enum. */
    payment_type: {
      type: String,
      enum: Object.values(PaymentType),
      required: true,
    },
    /** The total amount of the payment, which is required. */
    amount: { type: Number, required: true },
    /** The tax portion of the amount. */
    tax_amount: { type: Number },
    /** The current status of the payment, controlled by the `PaymentStatus` enum. */
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
    /**
     * The external transaction identifier provided by the payment gateway.
     * This is crucial for reconciliation and refunds.
     */
    payment_id: { type: String },
  },
  { timestamps: true }
);

/**
 * Creates indexes on key fields to optimize common query performance.
 * - `order_id`: To quickly find the payment for a specific order.
 * - `payment_method`: To analyze payment methods used.
 * - `payment_type`: To analyze payment purposes.
 * - `status`: To efficiently filter payments by their status (e.g., find all failed payments).
 */
PaymentSchema.index({ order_id: 1 });
PaymentSchema.index({ payment_method: 1 });
PaymentSchema.index({ payment_type: 1 });
PaymentSchema.index({ status: 1 });

/**
 * The Mongoose model for the Payment collection.
 */
export const Payment = model<IPayment>("Payment", PaymentSchema);
