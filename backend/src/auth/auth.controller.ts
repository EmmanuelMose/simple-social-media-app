import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error registering user",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);

      res.json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || "Error logging in",
      });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const user = await authService.getCurrentUser(userId);

      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "User not found",
      });
    }
  }
}