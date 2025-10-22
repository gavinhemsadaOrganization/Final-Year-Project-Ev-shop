import { Schema, model, Document, Types } from "mongoose";

/**
 * Represents a single item within a user's shopping cart.
 * Each document links a specific vehicle listing to a cart with a specified quantity.
 */
export interface ICartItem extends Document {
  /** The unique identifier for the cart item document. */
  _id: Types.ObjectId;
  /** The ID of the `Cart` document this item belongs to. */
  cart_id: Types.ObjectId;
  /** The ID of the `VehicleListing` being added to the cart. */
  listing_id: Types.ObjectId;
  /**
   * The ID of the `Order` this item becomes part of after checkout.
   * This field is optional and is populated when the cart is converted to an order.
   */
  order_id?: Types.ObjectId;
  /** The quantity of this specific listing in the cart. */
  quantity: number;
}

/**
 * Mongoose schema for the CartItem collection.
 */
const CartItemSchema = new Schema<ICartItem>(
  {
    /** A reference to the parent `Cart` document. */
    cart_id: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    /** A reference to the `VehicleListing` document. */
    listing_id: {
      type: Schema.Types.ObjectId,
      ref: "VehicleListing",
      required: true,
    },
    /** An optional reference to the `Order` document, linking the item post-purchase. */
    order_id: { type: Schema.Types.ObjectId, ref: "Order" },
    /** The number of units of the listing in the cart. Must be at least 1. */
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

/**
 * Creates indexes on key fields to optimize common query performance.
 * - `cart_id`: To quickly find all items in a specific cart.
 * - `listing_id`: To find all carts containing a specific listing.
 * - `order_id`: To find all items associated with a specific order after checkout.
 */
CartItemSchema.index({ cart_id: 1 });
CartItemSchema.index({ listing_id: 1 });
CartItemSchema.index({ order_id: 1 });

/**
 * The Mongoose model for the CartItem collection.
 */
export const CartItem = model<ICartItem>("CartItem", CartItemSchema);
