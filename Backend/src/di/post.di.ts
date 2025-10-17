// Import necessary modules and dependencies from tsyringe and other local files
import { container } from "tsyringe";
import { PostRepository, IPostRepository } from "../repositories/post.repository";
import { postService, IPostService } from "../services/post.service";
import { postController, IPostController } from "../controllers/post.controller";
import { IUserRepository } from "../repositories/user.repository";

/**
 * Registers all Post-related dependencies in the DI container using tsyringe.
 *
 * This file defines the dependency injection bindings for:
 * - Repository layer (data access)
 * - Service layer (business logic)
 * - Controller layer (request handling)
 *
 * The structure ensures loose coupling and easier testing.
 */

// Register Post Repository
/**
 * Registers the `PostRepository` as the concrete implementation for the `IPostRepository` interface.
 * This allows other parts of the application to depend on the `IPostRepository` abstraction,
 * while the container provides the actual `PostRepository` instance.
 */
container.register<IPostRepository>("PostRepository", {
  useValue: PostRepository,
});

// Register Post Service
/**
 * Registers the `postService` as the factory function for creating `IPostService` instances.
 *
 * The `useFactory` option allows resolving dependencies required by the service.
 * In this case, it resolves `IPostRepository` and `IUserRepository` from the container and passes them to the `postService` factory function.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IPostService`.
 */
container.register<IPostService>("PostService", {
  useFactory: (c) => postService(
    c.resolve<IPostRepository>("PostRepository"),
    c.resolve<IUserRepository>("UserRepository")
  ),
});

// Register Post Controller
/**
 * Registers the `postController` as the factory function for creating `IPostController` instances.
 *
 * Uses `useFactory` to resolve the `IPostService` dependency from the container and inject it into the `postController` factory function.
 * This ensures that the controller has access to the required service for handling post-related operations.
 *
 * @param c - The dependency injection container.
 * @returns An instance of `IPostController`.
 */
container.register<IPostController>("PostController", {
  useFactory: (c) => postController(c.resolve<IPostService>("PostService")),
});

export { container };