import { Request, Response } from "express";
import { LikesService } from "./likes.service";
import { AuthRequest } from "../middleware/auth.middleware";

const likesService = new LikesService();

export class LikesController {
  async likePost(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const postIdParam = req.params.postId;
      const postIdStr = Array.isArray(postIdParam) ? postIdParam[0] : postIdParam;
      const postId = parseInt(postIdStr);

      const like = await likesService.likePost(userId, postId);

      res.status(201).json({
        success: true,
        message: "Post liked successfully",
        data: like,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error liking post",
      });
    }
  }

  async unlikePost(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const postIdParam = req.params.postId;
      const postIdStr = Array.isArray(postIdParam) ? postIdParam[0] : postIdParam;
      const postId = parseInt(postIdStr);

      await likesService.unlikePost(userId, postId);

      res.json({
        success: true,
        message: "Post unliked successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error unliking post",
      });
    }
  }

  async getPostLikes(req: Request, res: Response) {
    try {
      const postIdParam = req.params.postId;
      const postIdStr = Array.isArray(postIdParam) ? postIdParam[0] : postIdParam;
      const postId = parseInt(postIdStr);
      const likes = await likesService.getPostLikes(postId);

      res.json({
        success: true,
        data: likes,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error fetching likes",
      });
    }
  }
}