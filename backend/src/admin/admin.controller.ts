import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { AuthRequest } from "../middleware/auth.middleware";

const adminService = new AdminService();

export class AdminController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await adminService.getAllUsers(page, limit);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async updateUserRole(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const { role } = req.body;
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }
      const updated = await adminService.updateUserRole(userId, role);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      await adminService.deleteUser(userId);
      res.json({ success: true, message: 'User deleted' });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async getComplaints(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await adminService.getComplaints(page, limit);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async resolveComplaint(req: Request, res: Response) {
    try {
      const complaintId = parseInt(req.params.complaintId);
      const { status } = req.body;
      if (!['resolved', 'dismissed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      const updated = await adminService.resolveComplaint(complaintId, status);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async getAnalytics(req: Request, res: Response) {
    try {
      const data = await adminService.getAnalytics();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getResults(req: Request, res: Response) {
    try {
      const data = await adminService.getResults();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}