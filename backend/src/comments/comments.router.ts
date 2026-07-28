import { Router } from "express";
import { CommentsController } from "./comments.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const commentsController = new CommentsController();

router.post("/", authenticate, commentsController.createComment.bind(commentsController));
router.get("/post/:postId", authenticate, commentsController.getComments.bind(commentsController));
router.delete("/:commentId", authenticate, commentsController.deleteComment.bind(commentsController));

export default router;