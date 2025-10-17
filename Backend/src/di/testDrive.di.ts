// Import necessary modules and dependencies from tsyringe and other local files
import { container } from "tsyringe";
import {
  ITestDriveRepository,
  TestDriveRepository,
} from "../repositories/testDrive.repository";
import {
  ITestDriveService,
  testDriveService,
} from "../services/testDrive.service";
import {
  ITestDriveController,
  testDriveController,
} from "../controllers/testDrive.controller";
import { ISellerRepository } from "../repositories/seller.repository";
import { IEvRepository } from "../repositories/ev.repository";

/**
 * Registers all Test Drive-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Test Drive Repository
/**
 * Registers the `TestDriveRepository` as the concrete implementation for the `ITestDriveRepository` interface.
 * This allows other parts of the application to depend on the `ITestDriveRepository` abstraction,
 * while the container provides the actual `TestDriveRepository` instance.
 */
container.register<ITestDriveRepository>("TestDriveRepository", {
  useValue: TestDriveRepository,
});

// Register Test Drive Service
/**
 * Registers the `testDriveService` as the factory function for creating `ITestDriveService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `ITestDriveRepository`, `ISellerRepository`, and `IEvRepository` from the container and passes them to the `testDriveService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `ITestDriveService`.
 */
container.register<ITestDriveService>("TestDriveService", {
  useFactory: (c) =>
    testDriveService(
      c.resolve<ITestDriveRepository>("TestDriveRepository"),
      c.resolve<ISellerRepository>("SellerRepository"),
      c.resolve<IEvRepository>("EvRepository")
    ),
});

// Register Test Drive Controller
/**
 * Registers the `testDriveController` as the factory function for creating `ITestDriveController` instances.
 *
 * Uses `useFactory` to resolve the `ITestDriveService` dependency from the container and inject it into the `testDriveController` factory function.
 * This ensures that the controller has access to the required service for handling test drive-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `ITestDriveController`.
 */
container.register<ITestDriveController>("TestDriveController", {
  useFactory: (c) =>
    testDriveController(c.resolve<ITestDriveService>("TestDriveService")),
});

export { container };
