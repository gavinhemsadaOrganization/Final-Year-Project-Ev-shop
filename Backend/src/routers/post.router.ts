import { validateDto } from "../middlewares/DtoValidator.middleware";
import { Router } from "express";
import { IPostController } from "../controllers/post.controller";
import { PostDTO, PostReplyDTO } from "../dtos/post.DTO";
import { container } from "../di/post.di";

export const postRouter = (): Router => {
  const router = Router();
  const postController = container.resolve<IPostController>("IPostController");

  // Posts
  router.get("/post/:id", (req, res) => postController.findPostById(req, res));
  router.get("/posts", (req, res) => postController.findAllPosts(req, res));
  router.get("/posts/user/:user_id", (req, res) =>
    postController.findPostsByUserId(req, res)
  );
  router.get("/posts/search", (req, res) =>
    postController.findPostsByKeyword(req, res)
  );
  router.post("/post", validateDto(PostDTO), (req, res) =>
    postController.createPost(req, res)
  );
  router.put("/post/:id", validateDto(PostDTO), (req, res) =>
    postController.updatePost(req, res)
  );
  router.put("/post/:id/views", (req, res) =>
    postController.updatePostViews(req, res)
  );
  router.put("/post/:id/reply-count", (req, res) =>
    postController.updatePostReplyCount(req, res)
  );
  router.put("/post/:id/last-reply-by", (req, res) =>
    postController.updatePostLastReplyBy(req, res)
  );
  router.delete("/post/:id", (req, res) => postController.deletePost(req, res));

  // Replies
  router.get("/reply/:id", (req, res) =>
    postController.findReplyById(req, res)
  );
  router.get("/replies/post/:post_id", (req, res) =>
    postController.findRepliesByPostId(req, res)
  );
  router.get("/replies/user/:user_id", (req, res) =>
    postController.findRepliesByUserId(req, res)
  );
  router.get("/replies", (req, res) => postController.findAllReplies(req, res));
  router.post("/reply", validateDto(PostReplyDTO), (req, res) =>
    postController.createReply(req, res)
  );
  router.put("/reply/:id", validateDto(PostReplyDTO), (req, res) =>
    postController.updateReply(req, res)
  );
  router.delete("/reply/:id", (req, res) =>
    postController.deleteReply(req, res)
  );

  return router;
};
