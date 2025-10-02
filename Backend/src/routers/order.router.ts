import { Router } from "express";
import { container } from "tsyringe";
import { validateDto } from "../middlewares/DtoValidator.middleware";
import { CreateOrderDTO, UpdateOrderDTO } from "../dtos/order.DTO";
import { IOrderController } from "../controllers/order.controller";
import "../di/order.di";

export const orderRouter = (): Router => {
  const router = Router();
  const controller = container.resolve<IOrderController>("OrderController");

  
  router.post("/", validateDto(CreateOrderDTO), (req, res) =>
    controller.createOrder(req, res)
  );

 
  router.get("/user/:userId", (req, res) =>
    controller.getOrdersByUserId(req, res)
  );
  
  router.get("/seller/:sellerId", (req, res) =>
    controller.getOrdersBySellerId(req, res)
  );
 
  router.get("/:id", (req, res) => controller.getOrderById(req, res));

 
  router.patch("/:id", validateDto(UpdateOrderDTO), (req, res) =>
    controller.updateOrder(req, res)
  );
 
  router.patch("/:id/cancel", (req, res) => controller.cancelOrder(req, res));

  return router;
};
