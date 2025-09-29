import { container } from "tsyringe";
import { PostRepository, IPostRepository } from "../repositories/post.repository";
import { postService, IPostService } from "../services/post.service";
import { postController, IPostController } from "../controllers/post.controller";

container.register<IPostRepository>("PostRepository", {
  useValue: PostRepository,
});

container.register<IPostService>("PostService", {
    useFactory: (c) => postService(c.resolve<IPostRepository>("PostRepository")),
});

container.register<IPostController>("PostController", {
  useFactory: (c) => postController(c.resolve<IPostService>("PostService")),
});

export { container };