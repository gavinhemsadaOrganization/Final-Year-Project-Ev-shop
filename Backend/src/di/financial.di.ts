// Import necessary modules and dependencies from tsyringe and other local files
import { container } from "tsyringe";
import {
  IFinancialRepository,
  FinancialRepository,
} from "../repositories/financial.repository";
import {
  IFinancialService,
  financialService,
} from "../services/financial.service";
import {
  IFinancialController,
  financialController,
} from "../controllers/financial.controller";
import { IUserRepository } from "../repositories/user.repository";

/**
 * Registers all Financial-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Financial Repository
/**
 * Registers the `FinancialRepository` as the concrete implementation for the `IFinancialRepository` interface.
 * This allows other parts of the application to depend on the `IFinancialRepository` abstraction,
 * while the container provides the actual `FinancialRepository` instance.
 */
container.register<IFinancialRepository>("FinancialRepository", {
  useValue: FinancialRepository,
});

// Register Financial Service
/**
 * Registers the `financialService` as the factory function for creating `IFinancialService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `IFinancialRepository` and `IUserRepository` from the container and passes them to the `financialService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IFinancialService`.
 */
container.register<IFinancialService>("FinancialService", {
  useFactory: (c) => financialService(
    c.resolve<IFinancialRepository>("FinancialRepository"),
    c.resolve<IUserRepository>("UserRepository")
  ),
});

// Register Financial Controller
/**
 * Registers the `financialController` as the factory function for creating `IFinancialController` instances.
 *
 * Uses `useFactory` to resolve the `IFinancialService` dependency from the container and inject it into the `financialController` factory function.
 * This ensures that the controller has access to the required service for handling financial-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IFinancialController`.
 */
container.register<IFinancialController>("FinancialController", {
  useFactory: (c) => financialController(c.resolve<IFinancialService>("FinancialService")),
});

export { container };
