import { Request, Response } from "express";
import { ICartService } from "./cart.service";
import { handleResult, handleError } from "../../shared/utils/Respons.util";

/**
 * Defines the contract for the cart controller, specifying methods for handling HTTP requests related to the shopping cart.
 */
export interface ICartController {
  /**
   * Handles the HTTP request to get the contents of a user's cart.
   * @param req - The Express request object, containing the user ID in `req.params`.
   * @param res - The Express response object.
   */
  getCart(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to add a new item to the cart.
   * @param req - The Express request object, containing item data in the body.
   * @param res - The Express response object.
   */
  addItem(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to update the quantity of an item in the cart.
   * @param req - The Express request object, containing the item ID and update data.
   * @param res - The Express response object.
   */
  updateItem(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to remove an item from the cart.
   * @param req - The Express request object, containing the item ID in `req.params`.
   * @param res - The Express response object.
   */
  removeItem(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to clear all items from a user's cart.
   * @param req - The Express request object, containing the user ID in `req.params`.
   * @param res - The Express response object.
   */
  clearCart(req: Request, res: Response): Promise<Response>;
}

/**
 * Factory function to create an instance of the cart controller.
 * It encapsulates the logic for handling API requests related to the shopping cart.
 *
 * @param service - The cart service dependency that contains the business logic.
 * @returns An implementation of the ICartController interface.
 */
export function cartController(service: ICartService): ICartController {
  return {
    /**
     * Retrieves the full cart details for a specific user.
     */
    getCart: async (req, res) => {
      try {
        const { userId } = req.params;
        const result = await service.getCart(userId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getCart");
      }
    },

    /**
     * Adds a new item to a user's cart.
     */
    addItem: async (req, res) => {
      try {
        const result = await service.addItemToCart(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "addItem");
      }
    },

    /**
     * Updates the quantity of an existing item in the cart.
     */
    updateItem: async (req, res) => {
      try {
        const { itemId } = req.params;
        const result = await service.updateItemInCart(itemId, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateItem");
      }
    },

    /**
     * Removes a single item from the cart.
     */
    removeItem: async (req, res) => {
      try {
        const { itemId } = req.params;
        const result = await service.removeItemFromCart(itemId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "removeItem");
      }
    },

    /**
     * Removes all items from a user's cart.
     */
    clearCart: async (req, res) => {
      try {
        const { userId } = req.params;
        const result = await service.clearUserCart(userId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "clearCart");
      }
    },
  };
}
