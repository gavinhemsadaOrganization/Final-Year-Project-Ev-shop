import { Router } from "express";
import { container } from "tsyringe";
import { validateDto } from "../middlewares/DtoValidator.middleware";
import { CreatePaymentDTO, UpdatePaymentDTO } from "../dtos/payment.DTO";
import { IPaymentController } from "../controllers/payment.controller";
import "../di/payment.di";

export const paymentRouter = (): Router => {
  const router = Router();
  const controller = container.resolve<IPaymentController>("PaymentController");

 
  router.post("/", validateDto(CreatePaymentDTO), (req, res) =>
    controller.createPayment(req, res)
  );

 
  router.get("/:id", (req, res) => controller.getPaymentById(req, res));


  router.get("/order/:orderId", (req, res) =>
    controller.getPaymentByOrderId(req, res)
  );

  router.get("/", (req, res) => controller.getAllPayments(req, res));

 
  router.patch("/:id", validateDto(UpdatePaymentDTO), (req, res) =>
    controller.updatePayment(req, res)
  );

 
  router.delete("/:id", (req, res) => controller.deletePayment(req, res));

  return router;
};
