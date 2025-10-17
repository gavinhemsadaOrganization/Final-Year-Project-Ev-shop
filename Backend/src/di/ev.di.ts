// Import necessary modules and dependencies from tsyringe and other local files
import { container } from "tsyringe";
import { IEvRepository, EvRepository } from "../repositories/ev.repository";
import { IEvService, evService } from "../services/ev.service";
import { IEvController, evController } from "../controllers/ev.controller";
import { ISellerRepository } from "../repositories/seller.repository";

/**
 * Registers all EV-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Ev Repository
/**
 * Registers the `EvRepository` as the concrete implementation for the `IEvRepository` interface.
 * This allows other parts of the application to depend on the `IEvRepository` abstraction,
 * while the container provides the actual `EvRepository` instance.
 */
container.register<IEvRepository>("EvRepository", { useValue: EvRepository });

// Register Ev Service
/**
 * Registers the `evService` as the factory function for creating `IEvService` instance.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `IEvRepository` and `ISellerRepository` from the container and passes it to the `evService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IEvService`.
 */
container.register<IEvService>("EvService", {
  useFactory: (c) =>
    evService(
      c.resolve<IEvRepository>("EvRepository"),
      c.resolve<ISellerRepository>("SellerRepository")
    ),
});

// Register Ev Controller
/**
 * Registers the `evController` as the factory function for creating `IEvController` instances.
 * @param c - The dependency injection container.
 * @returns An instance of `IEvController`.
 */
container.register<IEvController>("EvController", {
  useFactory: (c) => evController(c.resolve<IEvService>("EvService")),
});
