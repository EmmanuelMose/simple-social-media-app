import { Request, Response } from "express";
import { FollowersService } from "./followers.service";
import { AuthRequest } from "../middleware/auth.middleware";

const followersService = new FollowersService();

export class FollowersController {
  async followUser(req: AuthRequest, res: Response) {
    try {
      const followerId = req.user!.userId;
      const followingId = parseInt(
        Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId,
        10
      );

      const follow = await followersService.followUser(followerId, followingId);

      res.status(201).json({
        success: true,
        message: "User followed successfully",
        data: follow,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error following user",
      });
    }
  }

  async unfollowUser(req: AuthRequest, res: Response) {
    try {
      const followerId = req.user!.userId;
      const followingId = parseInt(
        Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId,
        10
      );

      await followersService.unfollowUser(followerId, followingId);

      res.json({
        success: true,
        message: "User unfollowed successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error unfollowing user",
      });
    }
  }

  async getFollowers(req: Request, res: Response) {
    try {
      const userId = parseInt(
        Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId,
        10
      );
      const followers = await followersService.getFollowers(userId);

      res.json({
        success: true,
        data: followers,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error fetching followers",
      });
    }
  }

  async getFollowing(req: Request, res: Response) {
    try {
      const userId = parseInt(
        Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId,
        10
      );
      const following = await followersService.getFollowing(userId);

      res.json({
        success: true,
        data: following,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error fetching following",
      });
    }
  }
}