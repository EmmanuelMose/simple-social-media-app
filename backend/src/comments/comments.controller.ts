import { Request, Response } from "express";
import { CommentsService } from "./comments.service";
import { AuthRequest } from "../middleware/auth.middleware";

const commentsService = new CommentsService();

export class CommentsController {
  async createComment(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { postId, content } = req.body;

      if (!content) {
        return res.status(400).json({
          success: false,
          message: "Comment content is required",
        });
      }

      const newComment = await commentsService.createComment(userId, {
        postId: parseInt(postId),
        content,
      });

      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: newComment,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error creating comment",
      });
    }
  }

  async getComments(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await commentsService.getCommentsByPost(postId);

      res.json({
        success: true,
        data: comments,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error fetching comments",
      });
    }
  }

  async deleteComment(req: AuthRequest, res: Response) {
    try {
      const commentId = parseInt(req.params.commentId);
      const userId = req.user!.userId;

      await commentsService.deleteComment(commentId, userId);

      res.json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error: any) {
      res.status(403).json({
        success: false,
        message: error.message || "Error deleting comment",
      });
    }
  }
}