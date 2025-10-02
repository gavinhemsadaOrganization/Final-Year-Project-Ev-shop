import { Request, Response } from "express";
import { IPaymentService } from "../services/payment.service";
import { handleResult, handleError } from "../utils/Respons.util";

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
