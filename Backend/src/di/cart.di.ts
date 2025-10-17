// Import necessary modules and dependencies from tsyringe and other local files
import { container } from "tsyringe";
import {
  ICartRepository,
  CartRepository,
} from "../repositories/cart.repository";
import { ICartService, cartService } from "../services/cart.service";
import {
  ICartController,
  cartController,
} from "../controllers/cart.controller";

/**
 * Registers all Cart-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Cart Repository

/**
 * Registers the `CartRepository` as the concrete implementation for the `ICartRepository` interface.
 * This allows other parts of the application to depend on the `ICartRepository` abstraction,
 * while the container provides the actual `CartRepository` instance.
 */
container.register<ICartRepository>("CartRepository", {
  useValue: CartRepository,
});

// Register Cart Service

/**
 * Registers the `cartService` as the factory function for creating `ICartService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `ICartRepository` from the container and passes it to the `cartService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `ICartService`.
 */
container.register<ICartService>("CartService", {
  useFactory: (c) => cartService(c.resolve<ICartRepository>("CartRepository")),
});

// Register Cart Controller
/**
 * Registers the `cartController` as the factory function for creating `ICartController` instances.
 *
 * Uses `useFactory` to resolve the `ICartService` dependency from the container and inject it into the `cartController` factory function.
 * This ensures that the controller has access to the required service for handling cart-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `ICartController`.
 */
container.register<ICartController>("CartController", {
  useFactory: (c) => cartController(c.resolve<ICartService>("CartService")),
});

export { container };
