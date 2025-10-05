import { Types } from "mongoose";
import { IPost, Post } from "../models/Post";
import { IPostReply, PostReply } from "../models/PostReply";
import { PostDTO, PostReplyDTO } from "../dtos/post.DTO";
import { withErrorHandling } from "../utils/CustomException";

export interface IPostRepository {
  findPostById(id: string): Promise<IPost | null>;
  findAllPosts(): Promise<IPost[] | null>;
  findPostsByUserId(user_id: string): Promise<IPost[] | null>;
  createPost(data: PostDTO): Promise<IPost | null>;
  updatePost(id: string, data: Partial<PostDTO>): Promise<IPost | null>;
  updatePostViews(id: string, views: number): Promise<IPost | null>;
  updatePostReplyCount(id: string, reply_count: number): Promise<IPost | null>;
  updatePostLastReplyBy(
    id: string,
    last_reply_by: string
  ): Promise<IPost | null>;
  deletePost(id: string): Promise<boolean | null>;

  findReplyById(id: string): Promise<IPostReply | null>;
  findRepliesByPostId(post_id: string): Promise<IPostReply[] | null>;
  findRepliesByUserId(user_id: string): Promise<IPostReply[] | null>;
  findAllReplies(): Promise<IPostReply[] | null>;
  createReply(data: PostReplyDTO): Promise<IPostReply | null>;
  updateReply(
    id: string,
    data: Partial<PostReplyDTO>
  ): Promise<IPostReply | null>;
  deleteReply(id: string): Promise<boolean | null>;
}

export const PostRepository: IPostRepository = {
  // Posts
  findPostById: withErrorHandling(async (id: string) => {
    const result = await Post.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: PostReply.collection.name,
          localField: "_id",
          foreignField: "post_id",
          as: "replies",
        },
      },
    ]);
    return result[0] || null;
  }),
  findAllPosts: withErrorHandling(async () => {
    return await Post.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: PostReply.collection.name,
          localField: "_id",
          foreignField: "post_id",
          as: "replies",
        },
      },
    ]);
  }),
  findPostsByUserId: withErrorHandling(async (user_id: string) => {
    return await Post.aggregate([
      { $match: { user_id: new Types.ObjectId(user_id) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: PostReply.collection.name,
          localField: "_id",
          foreignField: "post_id",
          as: "replies",
        },
      },
    ]);
  }),
  createPost: withErrorHandling(async (data: PostDTO) => {
    return await Post.create(data);
  }),
  updatePost: withErrorHandling(async (id: string, data: Partial<PostDTO>) => {
    return await Post.findByIdAndUpdate(id, data, { new: true });
  }),
  updatePostViews: withErrorHandling(async (id: string, views: number) => {
    return await Post.findByIdAndUpdate(id, { views }, { new: true });
  }),
  updatePostReplyCount: withErrorHandling(async (id: string, reply_count: number) => {
    return await Post.findByIdAndUpdate(id, { reply_count }, { new: true });
  }),
  updatePostLastReplyBy: withErrorHandling(async (id: string, last_reply_by: string) => {
    return await Post.findByIdAndUpdate(id, { last_reply_by }, { new: true });
  }),
  deletePost: withErrorHandling(async (id: string) => {
    const result = await Post.findByIdAndDelete(id);
    return result !== null;
  }),

  // Replies
  findReplyById: withErrorHandling(async (id: string) => {
    return await PostReply.findById(id);
  }),
  findRepliesByPostId: withErrorHandling(async (post_id: string) => {
    return await PostReply.find({ post_id }).sort({ createdAt: -1 });
  }),
  findRepliesByUserId: withErrorHandling(async (user_id: string) => {
    return await PostReply.find({ user_id }).sort({ createdAt: -1 });
  }),
  findAllReplies: withErrorHandling(async () => {
    return await PostReply.find().sort({ createdAt: -1 });
  }),
  createReply: withErrorHandling(async (data: PostReplyDTO) => {
    return await PostReply.create(data);
  }),
  updateReply: withErrorHandling(async (id: string, data: Partial<PostReplyDTO>) => {
    return await PostReply.findByIdAndUpdate(id, data, { new: true });
  }),
  deleteReply: withErrorHandling(async (id: string) => {
    const result = await PostReply.findByIdAndDelete(id);
    return result !== null;
  }),
};

export default PostRepository;
