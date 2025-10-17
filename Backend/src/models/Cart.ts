import { Schema, model, Document, Types } from "mongoose";

/**
 * Represents a user's shopping cart in the database.
 * This acts as a container for `CartItem` documents.
 */
export interface ICart extends Document {
  /** The unique identifier for the cart document. */
  _id: Types.ObjectId;
  /** The ID of the user who owns this cart. */
  user_id: Types.ObjectId;
}

/**
 * Mongoose schema for the Cart collection.
 */
const CartSchema = new Schema<ICart>(
  {
    /**
     * A reference to the User who owns the cart. This ensures each cart is
     * uniquely associated with one user.
     */
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

/**
 * Creates an index on the `user_id` field to ensure fast lookups of a user's cart.
 */
CartSchema.index({ user_id: 1 });

/**
 * The Mongoose model for the Cart collection.
 */
export const Cart = model<ICart>("Cart", CartSchema);
