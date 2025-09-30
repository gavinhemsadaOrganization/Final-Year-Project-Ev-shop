import { CartItemDTO, UpdateCartItemDTO } from "../dtos/cart.DTO";
import { ICartRepository } from "../repositories/cart.repository";

export interface ICartService {
  getCart(
    userId: string
  ): Promise<{ success: boolean; cart?: any; error?: string }>;
  addItemToCart(
    data: CartItemDTO
  ): Promise<{ success: boolean; item?: any; error?: string }>;
  updateItemInCart(
    itemId: string,
    data: UpdateCartItemDTO
  ): Promise<{ success: boolean; item?: any; error?: string }>;
  removeItemFromCart(
    itemId: string
  ): Promise<{ success: boolean; error?: string }>;
  clearUserCart(userId: string): Promise<{ success: boolean; error?: string }>;
}

export function cartService(cartRepo: ICartRepository): ICartService {
  return {
    getCart: async (userId) => {
      try {
        let cart = await cartRepo.findCartByUserId(userId);
        if (!cart) {
          cart = await cartRepo.createCart(userId);
        }
        const items = await cartRepo.findCartItems(cart._id.toString());
        return { success: true, cart: { ...cart.toObject(), items } };
      } catch (err) {
        return { success: false, error: "Failed to retrieve cart" };
      }
    },

    addItemToCart: async (data) => {
      try {
        let cart = await cartRepo.findCartByUserId(data.user_id);
        if (!cart) {
          cart = await cartRepo.createCart(data.user_id);
        }

        const cartId = cart._id.toString();
        const existingItem = await cartRepo.findCartItemByListing(
          cartId,
          data.listing_id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + data.quantity;
          const updatedItem = await cartRepo.updateCartItem(
            existingItem._id.toString(),
            newQuantity
          );
          return { success: true, item: updatedItem };
        } else {
          const newItem = await cartRepo.addCartItem(
            cartId,
            data.listing_id,
            data.quantity
          );
          return { success: true, item: newItem };
        }
      } catch (err) {
        return { success: false, error: "Failed to add item to cart" };
      }
    },

    updateItemInCart: async (itemId, data) => {
      try {
        if (data.quantity === undefined) {
          return { success: false, error: "Quantity must be provided" };
        }
        const item = await cartRepo.updateCartItem(itemId, data.quantity);
        if (!item) return { success: false, error: "Cart item not found" };
        return { success: true, item };
      } catch (err) {
        return { success: false, error: "Failed to update cart item" };
      }
    },

    removeItemFromCart: async (itemId) => {
      try {
        const success = await cartRepo.removeCartItem(itemId);
        if (!success) return { success: false, error: "Cart item not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to remove cart item" };
      }
    },

    clearUserCart: async (userId) => {
      try {
        const cart = await cartRepo.findCartByUserId(userId);
        if (!cart) return { success: false, error: "Cart not found" };
        await cartRepo.clearCart(cart._id.toString());
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to clear cart" };
      }
    },
  };
}
