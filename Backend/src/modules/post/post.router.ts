import { validateDto } from "../../shared/middlewares/DtoValidator.middleware";
import { Router } from "express";
import { IPostController } from "./post.controller";
import { PostDTO, PostReplyDTO } from "../../dtos/post.DTO";
import { container } from "../../di/container";

/**
 * Factory function that creates and configures the router for forum post-related endpoints.
 * It resolves the post controller from the dependency injection container and maps
 * controller methods to specific API routes for posts and replies.
 *
 * @returns The configured Express Router for forum posts.
 */
export const postRouter = (): Router => {
  const router = Router();
  // Resolve the post controller from the DI container.
  const postController = container.resolve<IPostController>("PostController");

  // --- Post Routes ---

  /**
   * @route GET /api/posts/post/:id
   * @description Retrieves a single post by its unique ID.
   * @access Public
   */
  router.get("/post/:id", (req, res) => postController.findPostById(req, res));

  /**
   * @route GET /api/posts/posts
   * @description Retrieves a list of all posts.
   * @access Public
   */
  router.get("/posts", (req, res) => postController.findAllPosts(req, res));

  /**
   * @route GET /api/posts/posts/user/:user_id
   * @description Retrieves all posts created by a specific user.
   * @access Public
   */
  router.get("/posts/user/:user_id", (req, res) =>
    postController.findPostsByUserId(req, res)
  );
  /**
   * @route POST /api/posts/post
   * @description Creates a new forum post.
   * @middleware validateDto(PostDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.post("/post", validateDto(PostDTO), (req, res) =>
    postController.createPost(req, res)
  );

  /**
   * @route PUT /api/posts/post/:id
   * @description Updates an existing forum post.
   * @middleware validateDto(PostDTO) - Validates the request body.
   * @access Private (User who created the post, or Admin)
   */
  router.put("/post/:id", validateDto(PostDTO), (req, res) =>
    postController.updatePost(req, res)
  );

  /**
   * @route PUT /api/posts/post/:id/views
   * @description Updates the view count of a post.
   * @access Private (Typically called internally when a post is viewed)
   */
  router.put("/post/:id/views", (req, res) =>
    postController.updatePostViews(req, res)
  );

  /**
   * @route PUT /api/posts/post/:id/reply-count
   * @description Updates the reply count of a post.
   * @access Private (Typically called internally when a reply is added/deleted)
   */
  router.put("/post/:id/reply-count", (req, res) =>
    postController.updatePostReplyCount(req, res)
  );

  /**
   * @route PUT /api/posts/post/:id/last-reply-by
   * @description Updates the user who made the last reply on a post.
   * @access Private (Typically called internally when a reply is added)
   */
  router.put("/post/:id/last-reply-by", (req, res) =>
    postController.updatePostLastReplyBy(req, res)
  );

  /**
   * @route DELETE /api/posts/post/:id
   * @description Deletes a post by its unique ID.
   * @access Private (User who created the post, or Admin)
   */
  router.delete("/post/:id", (req, res) => postController.deletePost(req, res));

  // --- Reply Routes ---

  /**
   * @route GET /api/posts/reply/:id
   * @description Retrieves a single reply by its unique ID.
   * @access Public
   */
  router.get("/reply/:id", (req, res) =>
    postController.findReplyById(req, res)
  );

  /**
   * @route GET /api/posts/replies/post/:post_id
   * @description Retrieves all replies for a specific post.
   * @access Public
   */
  router.get("/replies/post/:post_id", (req, res) =>
    postController.findRepliesByPostId(req, res)
  );

  /**
   * @route GET /api/posts/replies/user/:user_id
   * @description Retrieves all replies created by a specific user.
   * @access Public
   */
  router.get("/replies/user/:user_id", (req, res) =>
    postController.findRepliesByUserId(req, res)
  );

  /**
   * @route GET /api/posts/replies
   * @description Retrieves a list of all replies across all posts.
   * @access Public
   */
  router.get("/replies", (req, res) => postController.findAllReplies(req, res));

  /**
   * @route POST /api/posts/reply
   * @description Creates a new reply to a post.
   * @middleware validateDto(PostReplyDTO) - Validates the request body.
   * @access Private (Authenticated User)
   */
  router.post("/reply", validateDto(PostReplyDTO), (req, res) =>
    postController.createReply(req, res)
  );

  /**
   * @route PUT /api/posts/reply/:id
   * @description Updates an existing reply.
   * @middleware validateDto(PostReplyDTO) - Validates the request body.
   * @access Private (User who created the reply, or Admin)
   */
  router.put("/reply/:id", validateDto(PostReplyDTO), (req, res) =>
    postController.updateReply(req, res)
  );

  /**
   * @route DELETE /api/posts/reply/:id
   * @description Deletes a reply by its unique ID.
   * @access Private (User who created the reply, or Admin)
   */
  router.delete("/reply/:id", (req, res) =>
    postController.deleteReply(req, res)
  );

  return router;
};
