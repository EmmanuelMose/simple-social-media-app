import { Request, Response } from "express";
import { PostsService } from "./posts.service";
import { AuthRequest } from "../middleware/auth.middleware";

const postsService = new PostsService();

export class PostsController {
  async createPost(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { content, mediaUrl, mediaType } = req.body;

      if (!content) {
        return res.status(400).json({
          success: false,
          message: "Content is required",
        });
      }

      const newPost = await postsService.createPost(userId, {
        content,
        mediaUrl,
        mediaType: mediaType || "none",
      });

      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: newPost,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error creating post",
      });
    }
  }

  // getFeed, getPost, deletePost remain same
  async getFeed(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const feed = await postsService.getFeed(userId, page, limit);

      res.json({
        success: true,
        data: feed,
        pagination: {
          page,
          limit,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error fetching feed",
      });
    }
  }

  async getPost(req: AuthRequest, res: Response) {
    try {
      const rawPostId = req.params.postId;
      const postIdStr = Array.isArray(rawPostId) ? rawPostId[0] : rawPostId;
      const postId = parseInt(postIdStr as string);
      const userId = req.user!.userId;

      const post = await postsService.getPostById(postId, userId);

      res.json({
        success: true,
        data: post,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Post not found",
      });
    }
  }

  async deletePost(req: AuthRequest, res: Response) {
    try {
      const rawPostId = req.params.postId;
      const postIdStr = Array.isArray(rawPostId) ? rawPostId[0] : rawPostId;
      const postId = parseInt(postIdStr as string);
      const userId = req.user!.userId;

      await postsService.deletePost(postId, userId);

      res.json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        message: error.message || "Error deleting post",
      });
    }
  }
}