import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { AuthRequest } from "../middleware/auth.middleware";

const usersService = new UsersService();

export class UsersController {
  async getProfile(req: Request, res: Response) {
    try {
      const rawUserId = Array.isArray(req.params.userId)
        ? req.params.userId[0]
        : req.params.userId;
      const userId = rawUserId ? parseInt(rawUserId, 10) : NaN;
      if (Number.isNaN(userId)) throw new Error("Invalid userId");
      const currentUserId = (req as AuthRequest).user?.userId;

      const profile = await usersService.getUserProfile(userId, currentUserId);

      // Record a profile view if viewer is authenticated and not the owner
      if (currentUserId && currentUserId !== userId) {
        await usersService.recordProfileView(currentUserId, userId);
      }

      // Also get view count (optional)
      const viewCount = await usersService.getProfileViewCount(userId);

      res.json({
        success: true,
        data: {
          ...profile,
          viewCount,
        },
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "User not found",
      });
    }
  }

  // updateProfile, searchUsers remain same
  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const updatedUser = await usersService.updateUserProfile(userId, req.body);

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error updating profile",
      });
    }
  }

  async searchUsers(req: AuthRequest, res: Response) {
    try {
      const { q } = req.query;
      const currentUserId = req.user?.userId;

      const results = await usersService.searchUsers(q as string, currentUserId);

      res.json({
        success: true,
        data: results,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error searching users",
      });
    }
  }
}