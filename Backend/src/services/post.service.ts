import { IPostRepository } from "../repositories/post.repository";
import { PostDTO, PostReplyDTO } from "../dtos/post.DTO";

export interface IPostService {
  findPostById(
    id: string
  ): Promise<{ success: boolean; post?: any; error?: string }>;
  findAllPosts(): Promise<{ success: boolean; posts?: any[]; error?: string }>;
  findPostsByUserId(
    user_id: string
  ): Promise<{ success: boolean; posts?: any[]; error?: string }>;
  createPost(
    user_id: string,
    postData: PostDTO
  ): Promise<{ success: boolean; post?: any; error?: string }>;
  updatePost(
    id: string,
    postData: Partial<PostDTO>
  ): Promise<{ success: boolean; post?: any; error?: string }>;
  updatePostViews(
    id: string,
    views: number
  ): Promise<{ success: boolean; post?: any; error?: string }>;
  updatePostReplyCount(
    id: string,
    reply_count: number
  ): Promise<{ success: boolean; post?: any; error?: string }>;
  updatePostLastReplyBy(
    id: string,
    last_reply_by: string
  ): Promise<{ success: boolean; post?: any; error?: string }>;
  deletePost(id: string): Promise<{ success: boolean; error?: string }>;
  findPostsByKeyword(
    keyword: string
  ): Promise<{ success: boolean; posts?: any[]; error?: string }>;
  // Replies
  findReplyById(
    id: string
  ): Promise<{ success: boolean; reply?: any; error?: string }>;
  findRepliesByPostId(
    post_id: string
  ): Promise<{ success: boolean; replies?: any[]; error?: string }>;
  findRepliesByUserId(
    user_id: string
  ): Promise<{ success: boolean; replies?: any[]; error?: string }>;
  findAllReplies(): Promise<{
    success: boolean;
    replies?: any[];
    error?: string;
  }>;
  createReply(
    user_id: string,
    replyData: PostReplyDTO
  ): Promise<{ success: boolean; reply?: any; error?: string }>;
  updateReply(
    id: string,
    replyData: Partial<PostReplyDTO>
  ): Promise<{ success: boolean; reply?: any; error?: string }>;
  deleteReply(id: string): Promise<{ success: boolean; error?: string }>;
}

export function postService(postRepo: IPostRepository): IPostService {
  return {
    // Posts
    findPostById: async (id) => {
      try {
        const post = await postRepo.findPostById(id);
        if (!post) return { success: false, error: "Post not found" };
        return { success: true, post };
      } catch (err) {
        return { success: false, error: "Failed to fetch post" };
      }
    },
    findAllPosts: async () => {
      try {
        const posts = await postRepo.findAllPosts();
        if (!posts) return { success: false, error: "No posts found" };
        return { success: true, posts };
      } catch (err) {
        return { success: false, error: "Failed to fetch posts" };
      }
    },
    findPostsByUserId: async (user_id) => {
      try {
        const posts = await postRepo.findPostsByUserId(user_id);
        if (!posts)
          return { success: false, error: "No posts found for this user" };
        return { success: true, posts };
      } catch (err) {
        return { success: false, error: "Failed to fetch posts for this user" };
      }
    },
    createPost: async (user_id, postData) => {
      try {
        const post = await postRepo.createPost({ ...postData, user_id });
        return { success: true, post };
      } catch (err) {
        return { success: false, error: "Failed to create post" };
      }
    },
    updatePost: async (id, postData) => {
      try {
        const post = await postRepo.updatePost(id, postData);
        if (!post) return { success: false, error: "Post not found" };
        return { success: true, post };
      } catch (err) {
        return { success: false, error: "Failed to update post" };
      }
    },
    updatePostViews: async (id, views) => {
      try {
        const post = await postRepo.updatePostViews(id, views);
        if (!post) return { success: false, error: "Post not found" };
        return { success: true, post };
      } catch (err) {
        return { success: false, error: "Failed to update post views" };
      }
    },
    updatePostReplyCount: async (id, reply_count) => {
      try {
        const post = await postRepo.updatePostReplyCount(id, reply_count);
        if (!post) return { success: false, error: "Post not found" };
        return { success: true, post };
      } catch (err) {
        return { success: false, error: "Failed to update reply count" };
      }
    },
    updatePostLastReplyBy: async (id, last_reply_by) => {
      try {
        const post = await postRepo.updatePostLastReplyBy(id, last_reply_by);
        if (!post) return { success: false, error: "Post not found" };
        return { success: true, post };
      } catch (err) {
        return { success: false, error: "Failed to update last reply by" };
      }
    },
    deletePost: async (id) => {
      try {
        const success = await postRepo.deletePost(id);
        if (!success) return { success: false, error: "Post not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete post" };
      }
    },
    // Search posts by keyword
    findPostsByKeyword: async (keyword) => {
      try {
        // Example: search in title
        const posts = await postRepo.findAllPosts();
        const filtered = posts?.filter(
          (post) =>
            post.title?.toLowerCase().includes(keyword.toLowerCase())
        );
        if (!filtered || filtered.length === 0)
          return { success: false, error: "No posts found for keyword" };
        return { success: true, posts: filtered };
      } catch (err) {
        return { success: false, error: "Failed to search posts" };
      }
    },
    // Replies
    findReplyById: async (id) => {
      try {
        const reply = await postRepo.findReplyById(id);
        if (!reply) return { success: false, error: "Reply not found" };
        return { success: true, reply };
      } catch (err) {
        return { success: false, error: "Failed to fetch reply" };
      }
    },
    findRepliesByPostId: async (post_id) => {
      try {
        const replies = await postRepo.findRepliesByPostId(post_id);
        if (!replies)
          return { success: false, error: "No replies found for this post" };
        return { success: true, replies };
      } catch (err) {
        return {
          success: false,
          error: "Failed to fetch replies for this post",
        };
      }
    },
    findRepliesByUserId: async (user_id) => {
      try {
        const replies = await postRepo.findRepliesByUserId(user_id);
        if (!replies)
          return { success: false, error: "No replies found for this user" };
        return { success: true, replies };
      } catch (err) {
        return {
          success: false,
          error: "Failed to fetch replies for this user",
        };
      }
    },
    findAllReplies: async () => {
      try {
        const replies = await postRepo.findAllReplies();
        if (!replies) return { success: false, error: "No replies found" };
        return { success: true, replies };
      } catch (err) {
        return { success: false, error: "Failed to fetch replies" };
      }
    },
    createReply: async (user_id, replyData) => {
      try {
        const reply = await postRepo.createReply({ ...replyData, user_id });
        return { success: true, reply };
      } catch (err) {
        return { success: false, error: "Failed to create reply" };
      }
    },
    updateReply: async (id, replyData) => {
      try {
        const reply = await postRepo.updateReply(id, replyData);
        if (!reply) return { success: false, error: "Reply not found" };
        return { success: true, reply };
      } catch (err) {
        return { success: false, error: "Failed to update reply" };
      }
    },
    deleteReply: async (id) => {
      try {
        const success = await postRepo.deleteReply(id);
        if (!success) return { success: false, error: "Reply not found" };
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to delete reply" };
      }
    },
  };
}
