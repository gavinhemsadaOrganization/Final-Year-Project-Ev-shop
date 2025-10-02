import { Request, Response } from "express";
import { IOrderService } from "../services/order.service";
import { handleResult, handleError } from "../utils/Respons.util";

export interface IOrderController {
  createOrder(req: Request, res: Response): Promise<Response>;
  getOrderById(req: Request, res: Response): Promise<Response>;
  getOrdersByUserId(req: Request, res: Response): Promise<Response>;
  getOrdersBySellerId(req: Request, res: Response): Promise<Response>;
  updateOrder(req: Request, res: Response): Promise<Response>;
  cancelOrder(req: Request, res: Response): Promise<Response>;
}

export function orderController(service: IOrderService): IOrderController {
  return {
    createOrder: async (req, res) => {
      try {
        const result = await service.createOrder(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createOrder");
      }
    },
    getOrderById: async (req, res) => {
      try {
        const result = await service.getOrderById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getOrderById");
      }
    },
    getOrdersByUserId: async (req, res) => {
      try {
        const result = await service.getOrdersByUserId(req.params.userId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getOrdersByUserId");
      }
    },
    getOrdersBySellerId: async (req, res) => {
      try {
        const result = await service.getOrdersBySellerId(req.params.sellerId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getOrdersBySellerId");
      }
    },
    updateOrder: async (req, res) => {
      try {
        const result = await service.updateOrder(req.params.id, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updateOrder");
      }
    },
    cancelOrder: async (req, res) => {
      try {
        const result = await service.cancelOrder(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "cancelOrder");
      }
    },
  };
}
