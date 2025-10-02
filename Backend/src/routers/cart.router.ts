import { Router } from "express";
import { container } from "tsyringe";
import { validateDto } from "../middlewares/DtoValidator.middleware";
import { CartItemDTO, UpdateCartItemDTO } from "../dtos/cart.DTO";
import { ICartController } from "../controllers/cart.controller";
import "../di/cart.di";

export const cartRouter = (): Router => {
  const router = Router();
  const controller = container.resolve<ICartController>("CartController");

  router.get("/:userId", (req, res) => controller.getCart(req, res));
  router.post("/items", validateDto(CartItemDTO), (req, res) =>
    controller.addItem(req, res)
  );
  router.put("/items/:itemId", validateDto(UpdateCartItemDTO), (req, res) =>
    controller.updateItem(req, res)
  );

  router.delete("/items/:itemId", (req, res) =>
    controller.removeItem(req, res)
  );
  router.delete("/:userId", (req, res) => controller.clearCart(req, res));

  return router;
};
