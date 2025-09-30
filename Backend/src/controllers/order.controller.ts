import { Request, Response } from "express";
import { IOrderService } from "../services/order.service";
import logger from "../utils/logger";

export interface IOrderController {
  createOrder(req: Request, res: Response): Promise<Response>;
  getOrderById(req: Request, res: Response): Promise<Response>;
  getOrdersByUserId(req: Request, res: Response): Promise<Response>;
  getOrdersBySellerId(req: Request, res: Response): Promise<Response>;
  updateOrder(req: Request, res: Response): Promise<Response>;
  cancelOrder(req: Request, res: Response): Promise<Response>;
}

export function orderController(service: IOrderService): IOrderController {
  const handleResult = (
    res: Response,
    result: { success: boolean; [key: string]: any; error?: string },
    successStatus: number = 200
  ) => {
    if (!result.success) {
      const statusCode = result.error?.includes("not found") ? 404 : 400;
      logger.warn(result.error);
      return res.status(statusCode).json({ message: result.error });
    }
    const dataKey = Object.keys(result).find(
      (k) => k !== "success" && k !== "error"
    );
    logger.info(`Operation successful. Data key: ${dataKey}`);
    return res
      .status(successStatus)
      .json(dataKey ? result[dataKey] : { message: "Operation successful" });
  };

  const handleError = (res: Response, error: unknown, operation: string) => {
    logger.error(`Error during ${operation}: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  };

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
