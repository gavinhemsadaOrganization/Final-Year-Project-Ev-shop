// Import necessary modules and dependencies from tsyringe and other local files
import { container } from "tsyringe";
import {
  IReviewController,
  reviewController,
} from "../controllers/review.controller";
import { IReviewService, reviewService } from "../services/review.service";
import {
  IReviewRepository,
  ReviewRepository,
} from "../repositories/review.repository";
import { IUserRepository } from "../repositories/user.repository";

/**
 * Registers all Review-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Review Repository
/**
 * Registers the `ReviewRepository` as the concrete implementation for the `IReviewRepository` interface.
 * This allows other parts of the application to depend on the `IReviewRepository` abstraction,
 * while the container provides the actual `ReviewRepository` instance.
 */
container.register<IReviewRepository>("ReviewRepository", {
  useValue: ReviewRepository,
});

// Register Review Service
/**
 * Registers the `reviewService` as the factory function for creating `IReviewService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `IReviewRepository` and `IUserRepository` from the container and passes them to the `reviewService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IReviewService`.
 */
container.register<IReviewService>("ReviewService", {
  useFactory: (c) =>
    reviewService(
      c.resolve<IReviewRepository>("ReviewRepository"),
      c.resolve<IUserRepository>("UserRepository")
    ),
});

// Register Review Controller
/**
 * Registers the `reviewController` as the factory function for creating `IReviewController` instances.
 *
 * Uses `useFactory` to resolve the `IReviewService` dependency from the container and inject it into the `reviewController` factory function.
 * This ensures that the controller has access to the required service for handling review-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IReviewController`.
 */
container.register<IReviewController>("ReviewController", {
  useFactory: (c) =>
    reviewController(c.resolve<IReviewService>("ReviewService")),
});

export { container };
