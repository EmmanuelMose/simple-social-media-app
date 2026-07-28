import { Request, Response } from "express";
import { UploadService } from "./upload.service";
import { AuthRequest } from "../middleware/auth.middleware";

const uploadService = new UploadService();

export class UploadController {
  async uploadFile(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const { url, mediaType } = await uploadService.uploadFile(req.file);

      res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        data: {
          url,
          mediaType,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Upload failed",
      });
    }
  }
}