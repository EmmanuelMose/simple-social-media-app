import { Router } from "express";
import { UsersController } from "./users.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();
const usersController = new UsersController();

router.get("/search", authenticate, usersController.searchUsers.bind(usersController));
router.get("/:userId", authenticate, usersController.getProfile.bind(usersController));
router.put("/profile", authenticate, usersController.updateProfile.bind(usersController));

export default router;