// Import necessary modules and dependencies from tsyringe and other local files
import { container } from "tsyringe";
import {
  ISellerRepository,
  SellerRepository,
} from "../repositories/seller.repository";
import { ISellerService, sellerService } from "../services/seller.service";
import {
  ISellerController,
  sellerController,
} from "../controllers/seller.controller";
import { IUserRepository } from "../repositories/user.repository";
import { IReviewRepository } from "../repositories/review.repository";

/**
 * Registers all Seller-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Seller Repository
/**
 * Registers the `SellerRepository` as the concrete implementation for the `ISellerRepository` interface.
 * This allows other parts of the application to depend on the `ISellerRepository` abstraction,
 * while the container provides the actual `SellerRepository` instance.
 */
container.register<ISellerRepository>("SellerRepository", {
  useValue: SellerRepository,
});

// Register Seller Service
/**
 * Registers the `sellerService` as the factory function for creating `ISellerService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `ISellerRepository`, `IUserRepository`, and `IReviewRepository` from the container and passes them to the `sellerService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `ISellerService`.
 */
container.register<ISellerService>("SellerService", {
  useFactory: (c) =>
    sellerService(
      c.resolve<ISellerRepository>("SellerRepository"),
      c.resolve<IUserRepository>("UserRepository"),
      c.resolve<IReviewRepository>("ReviewRepository")
    ),
});

// Register Seller Controller
/**
 * Registers the `sellerController` as the factory function for creating `ISellerController` instances.
 *
 * Uses `useFactory` to resolve the `ISellerService` dependency from the container and inject it into the `sellerController` factory function.
 * This ensures that the controller has access to the required service for handling seller-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `ISellerController`.
 */
container.register<ISellerController>("SellerController", {
  useFactory: (c) =>
    sellerController(c.resolve<ISellerService>("SellerService")),
});

export { container };
