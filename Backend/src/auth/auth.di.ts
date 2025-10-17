// Import necessary modules and dependencies from tsyringe and other local files
import { container } from "tsyringe";
import { AuthRepository, IAuthRepository } from "./auth.repository";
import { authService, IAuthService } from "./auth.service";
import { authController, IAuthController } from "./auth.controller";

/**
 * Registers all Authentication-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Auth Repository
/**
 * Registers the `AuthRepository` as the concrete implementation for the `IAuthRepository` interface.
 * This allows other parts of the application to depend on the `IAuthRepository` abstraction,
 * while the container provides the actual `AuthRepository` instance.
 */
container.register<IAuthRepository>("IAuthRepository", {
  useValue: AuthRepository,
});

// Register Auth Service
/**
 * Registers the `authService` as the factory function for creating `IAuthService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `IAuthRepository` from the container and passes it to the `authService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IAuthService`.
 */
container.register<IAuthService>("IAuthService", {
  useFactory: (c) => authService(c.resolve<IAuthRepository>("IAuthRepository")),
});

// Register Auth Controller
/**
 * Registers the `authController` as the factory function for creating `IAuthController` instances.
 *
 * Uses `useFactory` to resolve the `IAuthService` dependency from the container and inject it into the `authController` factory function.
 * This ensures that the controller has access to the required service for handling authentication-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IAuthController`.
 */
container.register<IAuthController>("IAuthController", {
  useFactory: (c) => authController(c.resolve<IAuthService>("IAuthService")),
});

export { container };
