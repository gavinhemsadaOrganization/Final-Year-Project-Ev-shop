// Import necessary modules and dependencies from tsyringe and other local files
import { container } from "tsyringe";
import {
  IChatbotRepository,
  ChatbotRepository,
} from "../repositories/chatbot.repository";
import { IChatbotService, chatbotService } from "../services/chatbot.service";
import {
  IChatbotController,
  chatbotController,
} from "../controllers/chatbot.controller";
import { IUserRepository } from "../repositories/user.repository";

/**
 * Registers all Chatbot-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Chatbot Repository
/**
 * Registers the `ChatbotRepository` as the concrete implementation for the `IChatbotRepository` interface.
 * This allows other parts of the application to depend on the `IChatbotRepository` abstraction,
 * while the container provides the actual `ChatbotRepository` instance.
 */
container.register<IChatbotRepository>("ChatbotRepository", {
  useValue: ChatbotRepository,
});

// Register Chatbot Service
/**
 * Registers the `chatbotService` as the factory function for creating `IChatbotService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `IChatbotRepository` and `IUserRepository` from the container and passes them to the `chatbotService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IChatbotService`.
 */
container.register<IChatbotService>("ChatbotService", {
  useFactory: (c) =>
    chatbotService(
      c.resolve<IChatbotRepository>("ChatbotRepository"),
      c.resolve<IUserRepository>("UserRepository")
    ),

});

// Register Chatbot Controller
/**
 * Registers the `chatbotController` as the factory function for creating `IChatbotController` instances.
 *
 * Uses `useFactory` to resolve the `IChatbotService` dependency from the container and inject it into the `chatbotController` factory function.
 * This ensures that the controller has access to the required service for handling chatbot-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IChatbotController`.
 */
// Register Chatbot Controller
container.register<IChatbotController>("ChatbotController", {
  useFactory: (c) =>
    chatbotController(c.resolve<IChatbotService>("ChatbotService")),
});

export { container };
