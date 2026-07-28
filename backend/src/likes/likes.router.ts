import { Router } from "express";
import { LikesController } from "./likes.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const likesController = new LikesController();

router.post("/:postId/like", authenticate, likesController.likePost.bind(likesController));
router.delete("/:postId/unlike", authenticate, likesController.unlikePost.bind(likesController));
router.get("/:postId/likes", authenticate, likesController.getPostLikes.bind(likesController));

export default router;