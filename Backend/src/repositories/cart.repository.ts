import { Types } from "mongoose";
import { Cart, ICart } from "../models/Cart";
import { CartItem, ICartItem } from "../models/CartItem";

export interface ICartRepository {
  findCartByUserId(userId: string): Promise<ICart | null>;
  createCart(userId: string): Promise<ICart>;
  findCartItems(cartId: string): Promise<ICartItem[]>;
  findCartItemByListing(
    cartId: string,
    listingId: string
  ): Promise<ICartItem | null>;
  addCartItem(
    cartId: string,
    listingId: string,
    quantity: number
  ): Promise<ICartItem>;
  updateCartItem(itemId: string, quantity: number): Promise<ICartItem | null>;
  removeCartItem(itemId: string): Promise<boolean>;
  clearCart(cartId: string): Promise<boolean>;
}

export const CartRepository: ICartRepository = {
  findCartByUserId: async (userId: string) => {
    return await Cart.findOne({ user_id: new Types.ObjectId(userId) });
  },

  createCart: async (userId: string) => {
    const cart = new Cart({ user_id: new Types.ObjectId(userId) });
    return await cart.save();
  },

  findCartItems: async (cartId: string) => {
    return await CartItem.find({ cart_id: new Types.ObjectId(cartId) })
      .populate("listing_id")
      .exec();
  },

  findCartItemByListing: async (cartId: string, listingId: string) => {
    return await CartItem.findOne({
      cart_id: new Types.ObjectId(cartId),
      listing_id: new Types.ObjectId(listingId),
    });
  },

  addCartItem: async (cartId: string, listingId: string, quantity: number) => {
    const cartItem = new CartItem({
      cart_id: new Types.ObjectId(cartId),
      listing_id: new Types.ObjectId(listingId),
      quantity,
    });
    return await cartItem.save();
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    return await CartItem.findByIdAndUpdate(
      itemId,
      { quantity },
      { new: true }
    );
  },

  removeCartItem: async (itemId: string) => {
    const result = await CartItem.findByIdAndDelete(itemId);
    return result !== null;
  },

  clearCart: async (cartId: string) => {
    const result = await CartItem.deleteMany({
      cart_id: new Types.ObjectId(cartId),
    });
    return result.deletedCount > 0;
  },
};
