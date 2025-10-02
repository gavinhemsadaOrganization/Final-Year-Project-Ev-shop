import { Request, Response } from "express";
import { ICartService } from "../services/cart.service";
import { handleResult, handleError } from "../utils/Respons.util";

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
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getCart");
      }
    },

    addItem: async (req, res) => {
      try {
        const result = await service.addItemToCart(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "addItem");
      }
    },

    updateItem: async (req, res) => {
      try {
        const { itemId } = req.params;
        const result = await service.updateItemInCart(itemId, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateItem");
      }
    },

    removeItem: async (req, res) => {
      try {
        const { itemId } = req.params;
        const result = await service.removeItemFromCart(itemId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "removeItem");
      }
    },

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
