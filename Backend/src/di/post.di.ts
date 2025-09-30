import { container } from "tsyringe";
import { PostRepository, IPostRepository } from "../repositories/post.repository";
import { postService, IPostService } from "../services/post.service";
import { postController, IPostController } from "../controllers/post.controller";

container.register<IPostRepository>("IPostRepository", {
  useValue: PostRepository,
});

container.register<IPostService>("IPostService", {
  useFactory: (c) => postService(c.resolve<IPostRepository>("IPostRepository")),
});

container.register<IPostController>("IPostController", {
  useFactory: (c) => postController(c.resolve<IPostService>("IPostService")),
});

export { container };