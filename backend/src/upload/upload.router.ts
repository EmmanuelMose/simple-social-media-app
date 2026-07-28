import { Router } from "express";
import multer from "multer";
import { UploadController } from "./upload.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const uploadController = new UploadController();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images and videos are allowed.") as any, false);
    }
  },
});

router.post(
  "/",
  authenticate,
  (upload.single("file") as unknown) as any,
  uploadController.uploadFile.bind(uploadController)
);

export default router;