import { Router } from "express";
import { validateDto } from "../../shared/middlewares/DtoValidator.middleware";
import { CreatePaymentDTO } from "../../dtos/payment.DTO";
import { IPaymentController } from "./payment.controller";
import { container } from "../../di/container";

/**
 * Factory function that creates and configures the router for payment-related endpoints.
 * It resolves the payment controller from the dependency injection container and maps
 * controller methods to specific API routes.
 *
 * @returns The configured Express Router for payment processing.
 */
export const paymentRouter = (): Router => {
  const router = Router();
  // Resolve the payment controller from the DI container.
  const controller = container.resolve<IPaymentController>("PaymentController");

  /**
   * @route POST /api/payments/
   * @description Creates a new payment session (e.g., with Stripe or Khalti).
   * @middleware validateDto(CreatePaymentDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.post("/", validateDto(CreatePaymentDTO), (req, res) =>
    controller.createPayment(req, res)
  );

  /**
   * @route POST /api/payments/payment-notify
   * @description Handles webhook notifications from payment gateways to validate a payment.
   * @access Public (Called by external payment services)
   */
  router.post("/payment-notify", (req, res) =>
    controller.validatePayment(req, res)
  );

  /**
   * @route GET /api/payments/payment-status/:id
   * @description Checks the status of a specific payment.
   * @access Private (Authenticated User, Admin)
   */
  router.get("/payment-status/:id", (req, res) =>
    controller.checkPaymentStatus(req, res)
  );

  /**
   * @route GET /api/payments/:id
   * @description Retrieves a single payment by its unique ID.
   * @access Private (Authenticated User, Admin)
   */
  router.get("/:id", (req, res) => controller.getPaymentById(req, res));

  /**
   * @route GET /api/payments/order/:orderId
   * @description Retrieves payment details for a specific order.
   * @access Private (Authenticated User, Admin)
   */
  router.get("/order/:orderId", (req, res) =>
    controller.getPaymentByOrderId(req, res)
  );

  /**
   * @route GET /api/payments/
   * @description Retrieves a list of all payments, with optional filtering.
   * @access Private (Typically restricted to Admins)
   */
  router.get("/", (req, res) => controller.getAllPayments(req, res));

  /**
   * @route PATCH /api/payments/:id
   * @description Updates an existing payment record.
   * @middleware validateDto(CreatePaymentDTO) - Validates the request body.
   * @access Private (Typically restricted to Admins)
   */
  router.patch("/:id", validateDto(CreatePaymentDTO), (req, res) =>
    controller.updatePayment(req, res)
  );

  /**
   * @route DELETE /api/payments/:id
   * @description Deletes a payment record by its unique ID.
   * @access Private (Typically restricted to Admins)
   */
  router.delete("/:id", (req, res) => controller.deletePayment(req, res));

  return router;
};
