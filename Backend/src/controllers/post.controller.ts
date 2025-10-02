import { Request, Response } from "express";
import { IPostService } from "../services/post.service";
import { handleResult, handleError } from "../utils/Respons.util";

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
      const id = req.params.id;
      try {
        const result = await postService.findPostById(id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching post by id");
      }
    },
    findAllPosts: async (req, res) => {
      try {
        const result = await postService.findAllPosts();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching all posts");
      }
    },
    findPostsByUserId: async (req, res) => {
      const user_id = req.params.user_id;
      try {
        const result = await postService.findPostsByUserId(user_id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching posts by user id");
      }
    },
    createPost: async (req, res) => {
      const user_id = req.body.user_id;
      const postData = req.body;
      try {
        const result = await postService.createPost(user_id, postData);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "creating post");
      }
    },
    updatePost: async (req, res) => {
      const id = req.params.id;
      const postData = req.body;
      try {
        const result = await postService.updatePost(id, postData);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updating post");
      }
    },
    updatePostViews: async (req, res) => {
      const id = req.params.id;
      const views = req.body.views;
      try {
        const result = await postService.updatePostViews(id, views);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updating post views");
      }
    },
    updatePostReplyCount: async (req, res) => {
      const id = req.params.id;
      const reply_count = req.body.reply_count;
      try {
        const result = await postService.updatePostReplyCount(id, reply_count);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updating post reply count");
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
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updating post last reply by");
      }
    },
    deletePost: async (req, res) => {
      const id = req.params.id;
      try {
        const result = await postService.deletePost(id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleting post");
      }
    },
    findPostsByKeyword: async (req, res) => {
      const keyword = req.query.keyword;
      try {
        const result = await postService.findPostsByKeyword(keyword as string);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "searching posts by keyword");
      }
    },
    // Replies
    findReplyById: async (req, res) => {
      const id = req.params.id;
      try {
        const result = await postService.findReplyById(id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching reply by id");
      }
    },
    findRepliesByPostId: async (req, res) => {
      const post_id = req.params.post_id;
      try {
        const result = await postService.findRepliesByPostId(post_id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching replies by post id");
      }
    },
    findRepliesByUserId: async (req, res) => {
      const user_id = req.params.user_id;
      try {
        const result = await postService.findRepliesByUserId(user_id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching replies by user id");
      }
    },
    findAllReplies: async (req, res) => {
      try {
        const result = await postService.findAllReplies();
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "fetching all replies");
      }
    },
    createReply: async (req, res) => {
      const user_id = req.body.user_id;
      const replyData = req.body;
      try {
        const result = await postService.createReply(user_id, replyData);
        return handleResult(res, result, 201);
      } catch (err) {
        return handleError(res, err, "creating reply");
      }
    },
    updateReply: async (req, res) => {
      const id = req.params.id;
      const replyData = req.body;
      try {
        const result = await postService.updateReply(id, replyData);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "updating reply");
      }
    },
    deleteReply: async (req, res) => {
      const id = req.params.id;
      try {
        const result = await postService.deleteReply(id);
        return handleResult(res, result);
      } catch (err) {
        return handleError(res, err, "deleting reply");
      }
    },
  };
}
