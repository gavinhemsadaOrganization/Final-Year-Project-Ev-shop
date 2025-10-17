// Import necessary modules and dependencies from tsyringe and other local files
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

/**
 * Registers all Order-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Order Repository
/**
 * Registers the `OrderRepository` as the concrete implementation for the `IOrderRepository` interface.
 * This allows other parts of the application to depend on the `IOrderRepository` abstraction,
 * while the container provides the actual `OrderRepository` instance.
 */
container.register<IOrderRepository>("OrderRepository", {
  useValue: OrderRepository,
});

// Register Order Service
/**
 * Registers the `orderService` as the factory function for creating `IOrderService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `IOrderRepository` from the container and passes it to the `orderService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IOrderService`.
 */
container.register<IOrderService>("OrderService", {
  useFactory: (c) => orderService(c.resolve<IOrderRepository>("OrderRepository")),
});

// Register Order Controller
/**
 * Registers the `orderController` as the factory function for creating `IOrderController` instances.
 *
 * Uses `useFactory` to resolve the `IOrderService` dependency from the container and inject it into the `orderController` factory function.
 * This ensures that the controller has access to the required service for handling order-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IOrderController`.
 */
container.register<IOrderController>("OrderController", {
  useFactory: (c) => orderController(c.resolve<IOrderService>("OrderService")),
});

export { container };
