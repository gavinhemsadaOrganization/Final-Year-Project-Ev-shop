import { Request, Response } from "express";
import { IPaymentService } from "../services/payment.service";
import logger from "../utils/logger";

export interface IPaymentController {
  createPayment(req: Request, res: Response): Promise<Response>;
  getPaymentById(req: Request, res: Response): Promise<Response>;
  getPaymentByOrderId(req: Request, res: Response): Promise<Response>;
  getAllPayments(req: Request, res: Response): Promise<Response>;
  updatePayment(req: Request, res: Response): Promise<Response>;
  deletePayment(req: Request, res: Response): Promise<Response>;
}

export function paymentController(
  service: IPaymentService
): IPaymentController {
  const handleResult = (res: Response, result: { success: boolean; [key: string]: any; error?: string }, successStatus: number = 200) => {
    if (!result.success) {
      const statusCode = result.error?.includes("not found") ? 404 : 400;
      logger.warn(result.error);
      return res.status(statusCode).json({ message: result.error });
    }
    const dataKey = Object.keys(result).find(k => k !== 'success' && k !== 'error');
    logger.info(`Operation successful. Data key: ${dataKey}`);
    return res.status(successStatus).json(dataKey ? result[dataKey] : { message: "Operation successful" });
  };

  const handleError = (res: Response, error: unknown, operation: string) => {
    logger.error(`Error during ${operation}: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  };

  return {
    createPayment: async (req, res) => {
      try {
        const result = await service.createPayment(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createPayment");
      }
    },
    getPaymentById: async (req, res) => {
      try {
        const result = await service.getPaymentById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getPaymentById");
      }
    },
    getPaymentByOrderId: async (req, res) => {
      try {
        const result = await service.getPaymentByOrderId(req.params.orderId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getPaymentByOrderId");
      }
    },
    getAllPayments: async (req, res) => {
      try {
        const result = await service.getAllPayments(req.query);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllPayments");
      }
    },
    updatePayment: async (req, res) => {
      try {
        const result = await service.updatePayment(req.params.id, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updatePayment");
      }
    },
    deletePayment: async (req, res) => {
      try {
        const result = await service.deletePayment(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deletePayment");
      }
    },
  };
}







