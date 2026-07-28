import { Router } from "express";
import { PostsController } from "./posts.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const postsController = new PostsController();

router.post("/", authenticate, postsController.createPost.bind(postsController));
router.get("/feed", authenticate, postsController.getFeed.bind(postsController));
router.get("/:postId", authenticate, postsController.getPost.bind(postsController));
router.delete("/:postId", authenticate, postsController.deletePost.bind(postsController));

export default router;