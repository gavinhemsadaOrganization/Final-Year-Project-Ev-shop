import { Router } from "express";
import { validateDto } from "../../shared/middlewares/DtoValidator.middleware";
import { CartItemDTO, UpdateCartItemDTO } from "../../dtos/cart.DTO";
import { ICartController } from "./cart.controller";
import { container } from "../../di/container";

/**
 * Factory function that creates and configures the router for shopping cart-related endpoints.
 * It resolves the cart controller from the dependency injection container and maps
 * controller methods to specific API routes.
 *
 * @returns The configured Express Router for the shopping cart.
 */
/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */
export const cartRouter = (): Router => {
  const router = Router();
  // Resolve the cart controller from the DI container.
  const controller = container.resolve<ICartController>("CartController");

  /**
   * @swagger
   * /cart/{userId}:
   *   get:
   *     summary: Get user's cart
   *     description: Retrieves the contents of a specific user's cart, including all items.
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user whose cart is to be retrieved.
   *     responses:
   *       '200':
   *         description: An object containing the user's cart data.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CartResponse'
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Forbidden
   *       '404':
   *         description: Cart not found
   *       '500':
   *         description: Internal server error
   */
  // TODO: Add authorization middleware to ensure user can only get their own cart or admin can get any cart.
  router.get("/:userId", (req, res) => controller.getCart(req, res));

  /**
   * @swagger
   * /cart/items:
   *   post:
   *     summary: Add item to cart
   *     description: Adds a new item to the cart. If the item already exists, its quantity is updated.
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CartItemDTO'
   *     responses:
   *       '201':
   *         description: Item added or updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 item:
   *                   $ref: '#/components/schemas/CartItem'
   *       '400':
   *         description: Bad request (validation error, invalid quantity)
   *       '401':
   *         description: Unauthorized
   *       '500':
   *         description: Internal server error
   */
  router.post("/items", validateDto(CartItemDTO), (req, res) =>
    controller.addItem(req, res)
  );

  /**
   * @swagger
   * /cart/items/{itemId}:
   *   put:
   *     summary: Update item quantity in cart
   *     description: Updates the quantity of an item in the cart.
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: itemId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the cart item to update.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCartItemDTO'
   *     responses:
   *       '200':
   *         description: Item quantity updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 item:
   *                   $ref: '#/components/schemas/CartItem'
   *       '400':
   *         description: Bad request (validation error, invalid quantity)
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Cart item not found
   *       '500':
   *         description: Internal server error
   */
  // TODO: Add authorization middleware to ensure user can only update items in their own cart.
  router.put("/items/:itemId", validateDto(UpdateCartItemDTO), (req, res) =>
    controller.updateItem(req, res)
  );

  /**
   * @swagger
   * /cart/items/{itemId}:
   *   delete:
   *     summary: Remove item from cart
   *     description: Removes a single item from the cart.
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: itemId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the cart item to remove.
   *     responses:
   *       '200':
   *         description: Item removed successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Item removed from cart successfully
   *       '401':
   *         description: Unauthorized
   *       '404':
   *         description: Cart item not found
   *       '500':
   *         description: Internal server error
   */
  // TODO: Add authorization middleware to ensure user can only remove items from their own cart.
  router.delete("/items/:itemId", (req, res) =>
    controller.removeItem(req, res)
  );

  /**
   * @swagger
   * /cart/{userId}:
   *   delete:
   *     summary: Clear user's entire cart
   *     description: Removes all items from a specific user's cart.
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user whose cart is to be cleared.
   *     responses:
   *       '200':
   *         description: Cart cleared successfully.
   *       '401':
   *         description: Unauthorized
   *       '403':
   *         description: Forbidden
   *       '404':
   *         description: Cart not found
   *       '500':
   *         description: Internal server error
   */
  // TODO: Add authorization middleware to ensure user can only clear their own cart or admin can clear any cart.
  router.delete("/:userId", (req, res) => controller.clearCart(req, res));

  return router;
};
