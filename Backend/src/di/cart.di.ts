import { container } from "tsyringe";
import { ICartRepository, CartRepository } from "../repositories/cart.repository";
import { ICartService, cartService } from "../services/cart.service";
import { ICartController, cartController } from "../controllers/cart.controller";

container.register<ICartRepository>("CartRepository", {
  useValue: CartRepository,
});

container.register<ICartService>("CartService", {
  useFactory: (c) => cartService(c.resolve<ICartRepository>("CartRepository")),
});

container.register<ICartController>("CartController", {
  useFactory: (c) => cartController(c.resolve<ICartService>("CartService")),
});

export { container };