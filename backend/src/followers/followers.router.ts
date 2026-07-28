import { Router } from "express";
import { FollowersController } from "./followers.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const followersController = new FollowersController();

router.post("/:userId/follow", authenticate, followersController.followUser.bind(followersController));
router.delete("/:userId/unfollow", authenticate, followersController.unfollowUser.bind(followersController));
router.get("/:userId/followers", authenticate, followersController.getFollowers.bind(followersController));
router.get("/:userId/following", authenticate, followersController.getFollowing.bind(followersController));

export default router;