// Import necessary modules and dependencies from tsyringe and other local files
import { container } from "tsyringe";
import {
  INotificationRepository,
  NotificationRepository,
} from "../repositories/notification.repository";
import {
  INotificationService,
  notificationService,
} from "../services/notification.service";
import {
  INotificationController,
  notificationController,
} from "../controllers/notification.controller";
import { IUserRepository } from "../repositories/user.repository";

/**
 * Registers all Notification-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Notification Repository
/**
 * Registers the `NotificationRepository` as the concrete implementation for the `INotificationRepository` interface.
 * This allows other parts of the application to depend on the `INotificationRepository` abstraction,
 * while the container provides the actual `NotificationRepository` instance.
 */
container.register<INotificationRepository>("NotificationRepository", {
  useValue: NotificationRepository,
});

// Register Notification Service
/**
 * Registers the `notificationService` as the factory function for creating `INotificationService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `INotificationRepository` and `IUserRepository` from the container and passes them to the `notificationService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `INotificationService`.
 */
container.register<INotificationService>("NotificationService", {
  useFactory: (c) =>
    notificationService(
      c.resolve<INotificationRepository>("NotificationRepository"),
      c.resolve<IUserRepository>("UserRepository")
    ),
});

// Register Notification Controller
/**
 * Registers the `notificationController` as the factory function for creating `INotificationController` instances.
 *
 * Uses `useFactory` to resolve the `INotificationService` dependency from the container and inject it into the `notificationController` factory function.
 * This ensures that the controller has access to the required service for handling notification-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `INotificationController`.
 */
container.register<INotificationController>("NotificationController", {
  useFactory: (c) =>
    notificationController(
      c.resolve<INotificationService>("NotificationService")
    ),
});

export { container };
