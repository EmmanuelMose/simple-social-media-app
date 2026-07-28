import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorizeAdmin);

// User management
router.get("/users", adminController.getAllUsers.bind(adminController));
router.put("/users/:userId/role", adminController.updateUserRole.bind(adminController));
router.delete("/users/:userId", adminController.deleteUser.bind(adminController));

// Complaints
router.get("/complaints", adminController.getComplaints.bind(adminController));
router.put("/complaints/:complaintId/resolve", adminController.resolveComplaint.bind(adminController));

// Analytics and Results
router.get("/analytics", adminController.getAnalytics.bind(adminController));
router.get("/results", adminController.getResults.bind(adminController));

export default router;