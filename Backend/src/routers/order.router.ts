import { Router } from "express";
import { validateDto } from "../middlewares/DtoValidator.middleware";
import { CreateOrderDTO, UpdateOrderDTO } from "../dtos/order.DTO";
import { IOrderController } from "../controllers/order.controller";
import { container } from "../di/container";

/**
 * Factory function that creates and configures the router for order-related endpoints.
 * It resolves the order controller from the dependency injection container and maps
 * controller methods to specific API routes.
 *
 * @returns The configured Express Router for order management.
 */
export const orderRouter = (): Router => {
  const router = Router();
  // Resolve the order controller from the DI container.
  const controller = container.resolve<IOrderController>("OrderController");

  /**
   * @route POST /api/orders/
   * @description Creates a new order.
   * @middleware validateDto(CreateOrderDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.post("/", validateDto(CreateOrderDTO), (req, res) =>
    controller.createOrder(req, res)
  );

  /**
   * @route GET /api/orders/user/:userId
   * @description Retrieves all orders for a specific user.
   * @access Private (User can get their own orders, or Admin can get any)
   */
  router.get("/user/:userId", (req, res) =>
    controller.getOrdersByUserId(req, res)
  );

  /**
   * @route GET /api/orders/seller/:sellerId
   * @description Retrieves all orders for a specific seller.
   * @access Private (Seller can get their own orders, or Admin can get any)
   */
  router.get("/seller/:sellerId", (req, res) =>
    controller.getOrdersBySellerId(req, res)
  );

  /**
   * @route GET /api/orders/:id
   * @description Retrieves a single order by its unique ID.
   * @access Private (User/Seller involved in the order, or Admin)
   */
  router.get("/:id", (req, res) => controller.getOrderById(req, res));

  /**
   * @route PATCH /api/orders/:id
   * @description Updates an existing order (e.g., to change its status).
   * @middleware validateDto(UpdateOrderDTO) - Validates the request body.
   * @access Private (Seller involved in the order, or Admin)
   */
  router.patch("/:id", validateDto(UpdateOrderDTO), (req, res) =>
    controller.updateOrder(req, res)
  );

  /**
   * @route PATCH /api/orders/:id/cancel
   * @description Cancels an order.
   * @access Private (User who placed the order, or Admin)
   */
  router.patch("/:id/cancel", (req, res) => controller.cancelOrder(req, res));

  return router;
};
