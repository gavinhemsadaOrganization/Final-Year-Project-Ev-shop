import { container } from "tsyringe";
import {
  IOrderRepository,
  OrderRepository,
} from "../repositories/order.repository";
import { IOrderService, orderService } from "../services/order.service";
import {
  IOrderController,
  orderController,
} from "../controllers/order.controller";

container.register<IOrderRepository>("OrderRepository", {
  useValue: OrderRepository,
});

container.register<IOrderService>("OrderService", {
  useFactory: (c) => orderService(c.resolve<IOrderRepository>("OrderRepository")),
});

container.register<IOrderController>("OrderController", {
  useFactory: (c) => orderController(c.resolve<IOrderService>("OrderService")),
});
