import { Router } from "express";
import { validateDto } from "../shared/middlewares/DtoValidator.middleware";
import { CartItemDTO, UpdateCartItemDTO } from "../dtos/cart.DTO";
import { ICartController } from "../controllers/cart.controller";
import { container } from "../di/container";

/**
 * Factory function that creates and configures the router for shopping cart-related endpoints.
 * It resolves the cart controller from the dependency injection container and maps
 * controller methods to specific API routes.
 *
 * @returns The configured Express Router for the shopping cart.
 */
export const cartRouter = (): Router => {
  const router = Router();
  // Resolve the cart controller from the DI container.
  const controller = container.resolve<ICartController>("CartController");

  /**
   * @route GET /api/cart/:userId
   * @description Retrieves the contents of a specific user's cart.
   * @access Private (User can get their own cart, or Admin)
   */
  router.get("/:userId", (req, res) => controller.getCart(req, res));

  /**
   * @route POST /api/cart/items
   * @description Adds a new item to the cart.
   * @middleware validateDto(CartItemDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.post("/items", validateDto(CartItemDTO), (req, res) =>
    controller.addItem(req, res)
  );

  /**
   * @route PUT /api/cart/items/:itemId
   * @description Updates the quantity of an item in the cart.
   * @middleware validateDto(UpdateCartItemDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.put("/items/:itemId", validateDto(UpdateCartItemDTO), (req, res) =>
    controller.updateItem(req, res)
  );

  /**
   * @route DELETE /api/cart/items/:itemId
   * @description Removes a single item from the cart.
   * @access Private (Authenticated User)
   */
  router.delete("/items/:itemId", (req, res) =>
    controller.removeItem(req, res)
  );

  /**
   * @route DELETE /api/cart/:userId
   * @description Clears all items from a user's cart.
   * @access Private (Authenticated User)
   */
  router.delete("/:userId", (req, res) => controller.clearCart(req, res));

  return router;
};
