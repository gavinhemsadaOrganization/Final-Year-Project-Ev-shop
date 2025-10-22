import { Request, Response } from "express";
import { IPaymentService } from "../services/payment.service";
import { handleResult, handleError } from "../shared/utils/Respons.util";

/**
 * Defines the contract for the payment controller, specifying methods for handling HTTP requests related to payments.
 */
export interface IPaymentController {
  /**
   * Handles the HTTP request to create a new payment session (e.g., with Stripe).
   * @param req - The Express request object, containing payment details in the body.
   * @param res - The Express response object.
   */
  createPayment(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to get a payment by its unique ID.
   * @param req - The Express request object, containing the payment ID in `req.params`.
   * @param res - The Express response object.
   */
  getPaymentById(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to get a payment associated with a specific order ID.
   * @param req - The Express request object, containing the order ID in `req.params`.
   * @param res - The Express response object.
   */
  getPaymentByOrderId(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to validate a payment after the user is redirected from the payment gateway.
   * @param req - The Express request object, containing validation data in `req.params` or `req.body`.
   * @param res - The Express response object.
   */
  validatePayment(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to check the status of a payment.
   * @param req - The Express request object, containing the payment ID in `req.params`.
   * @param res - The Express response object.
   */
  checkPaymentStatus(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to retrieve all payments, with optional filtering via query parameters.
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  getAllPayments(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to update an existing payment record.
   * @param req - The Express request object, containing the payment ID and update data.
   * @param res - The Express response object.
   */
  updatePayment(req: Request, res: Response): Promise<Response>;
  /**
   * Handles the HTTP request to delete a payment record.
   * @param req - The Express request object, containing the payment ID in `req.params`.
   * @param res - The Express response object.
   */
  deletePayment(req: Request, res: Response): Promise<Response>;
}

/**
 * Factory function to create an instance of the payment controller.
 * It encapsulates the logic for handling API requests related to payments.
 *
 * @param service - The payment service dependency that contains the business logic.
 * @returns An implementation of the IPaymentController interface.
 */
export function paymentController(
  service: IPaymentService
): IPaymentController {
  return {
    /**
     * Creates a new payment session.
     */
    createPayment: async (req, res) => {
      try {
        const result = await service.createPayment(req.body);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "createPayment");
      }
    },
    /**
     * Retrieves a single payment by its ID.
     */
    getPaymentById: async (req, res) => {
      try {
        const result = await service.getPaymentById(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getPaymentById");
      }
    },
    /**
     * Retrieves payment details for a specific order.
     */
    getPaymentByOrderId: async (req, res) => {
      try {
        const result = await service.getPaymentByOrderId(req.params.orderId);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getPaymentByOrderId");
      }
    },
    /**
     * Validates a payment after the user returns from the payment gateway.
     */
    validatePayment: async (req, res) => {
      try {
        const result = await service.validatePayment(req.params);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "validatePayment");
      }
    },
    /**
     * Checks the status of a specific payment transaction.
     */
    checkPaymentStatus: async (req, res) => {
      try {
        const result = await service.checkPaymentStatus(req.params.id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "checkPaymentStatus");
      }
    },
    /**
     * Retrieves a list of all payments, with support for query-based filtering.
     */
    getAllPayments: async (req, res) => {
      try {
        const result = await service.getAllPayments(req.query);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "getAllPayments");
      }
    },
    /**
     * Updates an existing payment record.
     */
    updatePayment: async (req, res) => {
      try {
        const result = await service.updatePayment(req.params.id, req.body);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updatePayment");
      }
    },
    /**
     * Deletes a payment record by its ID.
     */
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
