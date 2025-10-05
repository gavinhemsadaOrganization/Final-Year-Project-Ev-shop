import { Types } from "mongoose";
import { Cart, ICart } from "../models/Cart";
import { CartItem, ICartItem } from "../models/CartItem";
import { withErrorHandling } from "../utils/CustomException";

export interface ICartRepository {
  findCartByUserId(userId: string): Promise<ICart | null>;
  createCart(userId: string): Promise<ICart | null>;
  findCartItems(cartId: string): Promise<ICartItem[] | null>;
  findCartItemByListing(
    cartId: string,
    listingId: string
  ): Promise<ICartItem | null>;
  addCartItem(
    cartId: string,
    listingId: string,
    quantity: number
  ): Promise<ICartItem | null>;
  updateCartItem(itemId: string, quantity: number): Promise<ICartItem | null>;
  removeCartItem(itemId: string): Promise<boolean | null>;
  clearCart(cartId: string): Promise<boolean | null>;
}

export const CartRepository: ICartRepository = {
  findCartByUserId: withErrorHandling(async (userId: string) =>
    Cart.findOne({ user_id: new Types.ObjectId(userId) })
  ),

  createCart: withErrorHandling(async (userId: string) => {
    const cart = new Cart({ user_id: new Types.ObjectId(userId) });
    return await cart.save();
  }),

  findCartItems: withErrorHandling(async (cartId: string) =>
    CartItem.find({ cart_id: new Types.ObjectId(cartId) })
      .populate("listing_id")
      .exec()
  ),

  findCartItemByListing: withErrorHandling(
    async (cartId: string, listingId: string) =>
      CartItem.findOne({
        cart_id: new Types.ObjectId(cartId),
        listing_id: new Types.ObjectId(listingId),
      })
  ),

  addCartItem: withErrorHandling(
    async (cartId: string, listingId: string, quantity: number) => {
      const cartItem = new CartItem({
        cart_id: new Types.ObjectId(cartId),
        listing_id: new Types.ObjectId(listingId),
        quantity,
      });
      return await cartItem.save();
    }
  ),

  updateCartItem: withErrorHandling(async (itemId: string, quantity: number) =>
    CartItem.findByIdAndUpdate(itemId, { quantity }, { new: true })
  ),

  removeCartItem: withErrorHandling(async (itemId: string) => {
    const result = await CartItem.findByIdAndDelete(itemId);
    return result !== null;
  }),

  clearCart: withErrorHandling(async (cartId: string) => {
    const result = await CartItem.deleteMany({
      cart_id: new Types.ObjectId(cartId),
    });
    return result.deletedCount > 0;
  }),
};
