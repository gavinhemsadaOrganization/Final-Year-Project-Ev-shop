// Import necessary modules and dependencies from tsyringe and other local files
import { container } from "tsyringe";
import { UserRepository, IUserRepository } from "../repositories/user.repository";
import { userService, IUserService } from "../services/user.service";
import { userController, IUserController } from "../controllers/user.controller";

/**
 * Registers all User-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register User Repository
/**
 * Registers the `UserRepository` as the concrete implementation for the `IUserRepository` interface.
 * This allows other parts of the application to depend on the `IUserRepository` abstraction,
 * while the container provides the actual `UserRepository` instance.
 */
container.register<IUserRepository>("UserRepository", {
  useValue: UserRepository,
});

// Register User Service
/**
 * Registers the `userService` as the factory function for creating `IUserService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `IUserRepository` from the container and passes it to the `userService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IUserService`.
 */
container.register<IUserService>("UserService", {
  useFactory: (c) => userService(c.resolve<IUserRepository>("UserRepository")),
});

// Register User Controller
/**
 * Registers the `userController` as the factory function for creating `IUserController` instances.
 *
 * Uses `useFactory` to resolve the `IUserService` dependency from the container and inject it into the `userController` factory function.
 * This ensures that the controller has access to the required service for handling user-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IUserController`.
 */
container.register<IUserController>("UserController", {
  useFactory: (c) => userController(c.resolve<IUserService>("UserService")),
});

export { container };
