import { Request, Response } from "express";
import { ICartService } from "../services/cart.service";
import logger from "../utils/logger";

export interface ICartController {
  getCart(req: Request, res: Response): Promise<Response>;
  addItem(req: Request, res: Response): Promise<Response>;
  updateItem(req: Request, res: Response): Promise<Response>;
  removeItem(req: Request, res: Response): Promise<Response>;
  clearCart(req: Request, res: Response): Promise<Response>;
}

export function cartController(service: ICartService): ICartController {
  return {
    getCart: async (req, res) => {
      try {
        const { userId } = req.params;
        const result = await service.getCart(userId);
        if (!result.success) {
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Cart fetched for user: ${userId}`);
        return res.status(200).json(result.cart);
      } catch (err) {
        logger.error(`Error fetching cart: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    addItem: async (req, res) => {
      try {
        const result = await service.addItemToCart(req.body);
        if (!result.success) {
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Item added to cart: ${result.item?._id}`);
        return res.status(201).json(result.item);
      } catch (err) {
        logger.error(`Error adding item to cart: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    updateItem: async (req, res) => {
      try {
        const { itemId } = req.params;
        const result = await service.updateItemInCart(itemId, req.body);
        if (!result.success) {
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Cart item updated: ${itemId}`);
        return res.status(200).json(result.item);
      } catch (err) {
        logger.error(`Error updating cart item: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    removeItem: async (req, res) => {
      try {
        const { itemId } = req.params;
        const result = await service.removeItemFromCart(itemId);
        if (!result.success) {
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Cart item removed: ${itemId}`);
        return res.status(200).json({ message: "Item removed from cart" });
      } catch (err) {
        logger.error(`Error removing cart item: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },

    clearCart: async (req, res) => {
      try {
        const { userId } = req.params;
        const result = await service.clearUserCart(userId);
        if (!result.success) {
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Cart cleared for user: ${userId}`);
        return res.status(200).json({ message: "Cart cleared" });
      } catch (err) {
        logger.error(`Error clearing cart: ${err}`);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
  };
}
