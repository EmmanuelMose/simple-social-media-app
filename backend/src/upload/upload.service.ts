import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export class UploadService {
  async uploadFile(file: Express.Multer.File): Promise<{ url: string; mediaType: "image" | "video" }> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: "auto", // detects image/video automatically
        folder: "social_media",
        use_filename: true,
        unique_filename: true,
      };

      // Determine media type based on mime type
      const mimeType = file.mimetype;
      let mediaType: "image" | "video" = "image";
      if (mimeType.startsWith("video/")) {
        mediaType = "video";
        uploadOptions.resource_type = "video";
      } else if (mimeType.startsWith("image/")) {
        uploadOptions.resource_type = "image";
      } else {
        reject(new Error("Unsupported file type"));
        return;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve({ url: result.secure_url, mediaType });
          else reject(new Error("Upload failed"));
        }
      );

      uploadStream.end(file.buffer);
    });
  }
}