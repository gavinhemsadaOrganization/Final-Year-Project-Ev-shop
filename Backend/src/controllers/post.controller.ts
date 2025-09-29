import { Request, Response } from "express";
import { IPostService } from "../services/post.service";
import logger from "../utils/logger";

export interface IPostController {
  findPostById(req: Request, res: Response): Promise<Response>;
  findAllPosts(req: Request, res: Response): Promise<Response>;
  findPostsByUserId(req: Request, res: Response): Promise<Response>;
  findPostsByKeyword(req: Request, res: Response): Promise<Response>;
  createPost(req: Request, res: Response): Promise<Response>;
  updatePost(req: Request, res: Response): Promise<Response>;
  updatePostViews(req: Request, res: Response): Promise<Response>;
  updatePostReplyCount(req: Request, res: Response): Promise<Response>;
  updatePostLastReplyBy(req: Request, res: Response): Promise<Response>;
  deletePost(req: Request, res: Response): Promise<Response>;
    // Replies
  findReplyById(req: Request, res: Response): Promise<Response>;
  findRepliesByPostId(req: Request, res: Response): Promise<Response>;
  findRepliesByUserId(req: Request, res: Response): Promise<Response>;
  findAllReplies(req: Request, res: Response): Promise<Response>;
  createReply(req: Request, res: Response): Promise<Response>;
  updateReply(req: Request, res: Response): Promise<Response>;
  deleteReply(req: Request, res: Response): Promise<Response>;
}

export function postController(postService: IPostService): IPostController {
  return {
    findPostById: async (req, res) => {
      const id  = req.params.id;
      try {
        const result = await postService.findPostById(id);
        if (!result.success) {
          logger.error(`Post not found: ${id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Post fetched: ${id}`);
        return res.status(200).json({ post: result.post });
      } catch (err) {
        logger.error(`Error fetching post: ${id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    findAllPosts: async (req, res) => {
      try {
        const result = await postService.findAllPosts();
        if (!result.success) {
          logger.warn("No posts found");
          return res.status(404).json({ message: result.error });
        }
        logger.info("All posts fetched");
        return res.status(200).json({ posts: result.posts });
      } catch (err) {
        logger.error("Error fetching all posts", err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    findPostsByUserId: async (req, res) => {
      const  user_id  = req.params.user_id;
      try {
        const result = await postService.findPostsByUserId(user_id);
        if (!result.success) {
          logger.warn(`No posts found for user: ${user_id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Posts fetched for user: ${user_id}`);
        return res.status(200).json({ posts: result.posts });
      } catch (err) {
        logger.error(`Error fetching posts for user: ${user_id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    createPost: async (req, res) => {
      const user_id = req.body.user_id;
      const postData = req.body;
      try {
        const result = await postService.createPost(user_id, postData);
        if (!result.success) {
          logger.error(`Failed to create post for user: ${user_id}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Post created for user: ${user_id}`);
        return res.status(201).json({ post: result.post });
      } catch (err) {
        logger.error(`Error creating post for user: ${user_id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    updatePost: async (req, res) => {
      const id = req.params.id;
      const postData = req.body;
      try {
        const result = await postService.updatePost(id, postData);
        if (!result.success) {
          logger.warn(`Post not found for update: ${id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Post updated: ${id}`);
        return res.status(200).json({ post: result.post });
      } catch (err) {
        logger.error(`Error updating post: ${id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    updatePostViews: async (req, res) => {
      const id = req.params.id;
      const views = req.body.views;
      try {
        const result = await postService.updatePostViews(id, views);
        if (!result.success) {
          logger.warn(`Post not found for updating views: ${id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Post views updated: ${id}`);
        return res.status(200).json({ post: result.post });
      } catch (err) {
        logger.error(`Error updating post views: ${id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    updatePostReplyCount: async (req, res) => {
      const id = req.params.id;
      const reply_count = req.body.reply_count;
      try {
        const result = await postService.updatePostReplyCount(id, reply_count);
        if (!result.success) {
          logger.warn(`Post not found for updating reply count: ${id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Post reply count updated: ${id}`);
        return res.status(200).json({ post: result.post });
      } catch (err) {
        logger.error(`Error updating post reply count: ${id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    updatePostLastReplyBy: async (req, res) => {
      const id = req.params.id;
      const last_reply_by = req.body.last_reply_by;
      try {
        const result = await postService.updatePostLastReplyBy(
          id,
          last_reply_by
        );
        if (!result.success) {
          logger.warn(`Post not found for updating last reply by: ${id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Post last reply by updated: ${id}`);
        return res.status(200).json({ post: result.post });
      } catch (err) {
        logger.error(`Error updating post last reply by: ${id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    deletePost: async (req, res) => {
      const id = req.params.id;
      try {
        const result = await postService.deletePost(id);
        if (!result.success) {
          logger.warn(`Post not found for deletion: ${id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Post deleted: ${id}`);
        return res.status(200).json({ message: "Post deleted" });
      } catch (err) {
        logger.error(`Error deleting post: ${id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    findPostsByKeyword: async (req, res) => {
      const  keyword  = req.query.keyword;
      try {
        const result = await postService.findPostsByKeyword(keyword as string);
        if (!result.success) {
          logger.warn(`No posts found for keyword: ${keyword}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Posts fetched for keyword: ${keyword}`);
        return res.status(200).json({ posts: result.posts });
      } catch (err) {
        logger.error(`Error searching posts for keyword: ${keyword}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    // Replies
    findReplyById: async (req, res) => {
      const id = req.params.id;
      try {
        const result = await postService.findReplyById(id);
        if (!result.success) {
          logger.warn(`Reply not found: ${id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Reply fetched: ${id}`);
        return res.status(200).json({ reply: result.reply });
      } catch (err) {
        logger.error(`Error fetching reply: ${id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    findRepliesByPostId: async (req, res) => {
      const post_id = req.params.post_id;
      try {
        const result = await postService.findRepliesByPostId(post_id);
        if (!result.success) {
          logger.warn(`No replies found for post: ${post_id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Replies fetched for post: ${post_id}`);
        return res.status(200).json({ replies: result.replies });
      } catch (err) {
        logger.error(`Error fetching replies for post: ${post_id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    findRepliesByUserId: async (req, res) => {
      const user_id = req.params.user_id;
      try {
        const result = await postService.findRepliesByUserId(user_id);
        if (!result.success) {
          logger.warn(`No replies found for user: ${user_id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Replies fetched for user: ${user_id}`);
        return res.status(200).json({ replies: result.replies });
      } catch (err) {
        logger.error(`Error fetching replies for user: ${user_id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    findAllReplies: async (req, res) => {
      try {
        const result = await postService.findAllReplies();
        if (!result.success) {
          logger.warn("No replies found");
          return res.status(404).json({ message: result.error });
        }
        logger.info("All replies fetched");
        return res.status(200).json({ replies: result.replies });
      } catch (err) {
        logger.error("Error fetching all replies", err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    createReply: async (req, res) => {
      const user_id = req.body.user_id;
      const replyData = req.body;
      try {
        const result = await postService.createReply(user_id, replyData);
        if (!result.success) {
          logger.error(`Failed to create reply for user: ${user_id}`);
          return res.status(400).json({ message: result.error });
        }
        logger.info(`Reply created for user: ${user_id}`);
        return res.status(201).json({ reply: result.reply });
      } catch (err) {
        logger.error(`Error creating reply for user: ${user_id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    updateReply: async (req, res) => {
      const id = req.params.id;
      const replyData = req.body;
      try {
        const result = await postService.updateReply(id, replyData);
        if (!result.success) {
          logger.warn(`Reply not found for update: ${id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Reply updated: ${id}`);
        return res.status(200).json({ reply: result.reply });
      } catch (err) {
        logger.error(`Error updating reply: ${id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
    deleteReply: async (req, res) => {
      const id = req.params.id;
      try {
        const result = await postService.deleteReply(id);
        if (!result.success) {
          logger.warn(`Reply not found for deletion: ${id}`);
          return res.status(404).json({ message: result.error });
        }
        logger.info(`Reply deleted: ${id}`);
        return res.status(200).json({ message: "Reply deleted" });
      } catch (err) {
        logger.error(`Error deleting reply: ${id}`, err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
  };
}
