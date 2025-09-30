import { container } from "tsyringe";
import { ICartRepository, CartRepository } from "../repositories/cart.repository";
import { ICartService, cartService } from "../services/cart.service";
import { ICartController, cartController } from "../controllers/cart.controller";

container.register<ICartRepository>("ICartRepository", {
  useValue: CartRepository,
});

container.register<ICartService>("ICartService", {
  useFactory: (c) => cartService(c.resolve<ICartRepository>("ICartRepository")),
});

container.register<ICartController>("ICartController", {
  useFactory: (c) => cartController(c.resolve<ICartService>("ICartService")),
});

export { container };