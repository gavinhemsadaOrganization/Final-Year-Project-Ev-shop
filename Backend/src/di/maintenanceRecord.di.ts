// Import necessary modules and dependencies from tsyringe and other local files
import { container } from "tsyringe";
import {
  IMaintenanceRecordRepository,
  MaintenanceRecordRepository,
} from "../repositories/maintenanceRecord.repository";
import {
  IMaintenanceRecordService,
  maintenanceRecordService,
} from "../services/maintenanceRecord.service";
import {
  IMaintenanceRecordController,
  maintenanceRecordController,
} from "../controllers/maintenanceRecord.controller";
import { ISellerRepository } from "../repositories/seller.repository";

/**
 * Registers all Maintenance Record-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Maintenance Record Repository
/**
 * Registers the `MaintenanceRecordRepository` as the concrete implementation for the `IMaintenanceRecordRepository` interface.
 * This allows other parts of the application to depend on the `IMaintenanceRecordRepository` abstraction,
 * while the container provides the actual `MaintenanceRecordRepository` instance.
 */
container.register<IMaintenanceRecordRepository>(
  "MaintenanceRecordRepository",
  {
    useValue: MaintenanceRecordRepository,
  }
);

// Register Maintenance Record Service
/**
 * Registers the `maintenanceRecordService` as the factory function for creating `IMaintenanceRecordService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `IMaintenanceRecordRepository` and `ISellerRepository` from the container and passes them to the `maintenanceRecordService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IMaintenanceRecordService`.
 */
container.register<IMaintenanceRecordService>("MaintenanceRecordService", {
  useFactory: (c) =>
    maintenanceRecordService(
      c.resolve<IMaintenanceRecordRepository>("MaintenanceRecordRepository"),
      c.resolve<ISellerRepository>("SellerRepository")
    ),
});

// Register Maintenance Record Controller
/**
 * Registers the `maintenanceRecordController` as the factory function for creating `IMaintenanceRecordController` instances.
 *
 * Uses `useFactory` to resolve the `IMaintenanceRecordService` dependency from the container and inject it into the `maintenanceRecordController` factory function.
 * This ensures that the controller has access to the required service for handling maintenance record-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IMaintenanceRecordController`.
 */
container.register<IMaintenanceRecordController>(
  "MaintenanceRecordController",
  {
    useFactory: (c) =>
      maintenanceRecordController(
        c.resolve<IMaintenanceRecordService>("MaintenanceRecordService")
      ),
  }
);

export { container };
