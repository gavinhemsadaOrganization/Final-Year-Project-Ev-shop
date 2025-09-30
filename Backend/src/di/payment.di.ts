import { container } from "tsyringe";
import {
  IPaymentRepository,
  PaymentRepository,
} from "../repositories/payment.repository";
import { IPaymentService, paymentService } from "../services/payment.service";
import {
  IPaymentController,
  paymentController,
} from "../controllers/payment.controller";

container.register<IPaymentRepository>("PaymentRepository", {
  useValue: PaymentRepository,
});
container.register<IPaymentService>("PaymentService", {
  useFactory: (c) => paymentService(c.resolve("PaymentRepository")),
});
container.register<IPaymentController>("PaymentController", {
  useFactory: (c) => paymentController(c.resolve("PaymentService")),
});

export { container };