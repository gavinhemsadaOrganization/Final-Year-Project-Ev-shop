// Import necessary modules and dependencies from tsyringe and other local files
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
import { IOrderRepository } from "../repositories/order.repository";

/**
 * Registers all Payment-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Payment Repository
/**
 * Registers the `PaymentRepository` as the concrete implementation for the `IPaymentRepository` interface.
 * This allows other parts of the application to depend on the `IPaymentRepository` abstraction,
 * while the container provides the actual `PaymentRepository` instance.
 */
container.register<IPaymentRepository>("PaymentRepository", {
  useValue: PaymentRepository,
});

// Register Payment Service
/**
 * Registers the `paymentService` as the factory function for creating `IPaymentService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `IPaymentRepository` and `IOrderRepository` from the container and passes them to the `paymentService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IPaymentService`.
 */
container.register<IPaymentService>("PaymentService", {
  useFactory: (c) => paymentService(
    c.resolve<IPaymentRepository>("PaymentRepository"),
    c.resolve<IOrderRepository>("OrderRepository")
  ),
});

// Register Payment Controller
/**
 * Registers the `paymentController` as the factory function for creating `IPaymentController` instances.
 *
 * Uses `useFactory` to resolve the `IPaymentService` dependency from the container and inject it into the `paymentController` factory function.
 * This ensures that the controller has access to the required service for handling payment-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IPaymentController`.
 */
container.register<IPaymentController>("PaymentController", {
  useFactory: (c) => paymentController(c.resolve<IPaymentService>("PaymentService")),
});

export { container };