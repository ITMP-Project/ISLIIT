import { Router } from "express";
import {
  getApprovedHelpers,
  getPendingHelpers,
  updateHelperStatus,
  getHelperStatusByUserId,
  getHelperById,
  createHelper,
  updateHelper,
  deleteHelper,
  updatePresenceByUserId
} from "../controllers/p-helper.controller.mjs";

const router = Router();

// Admin routes
router.get("/admin/pending", getPendingHelpers);
router.patch("/:id/status", updateHelperStatus);

// Mental Support Page
router.get("/", getApprovedHelpers);

// Check if user has already applied
router.get("/status/user/:userId", getHelperStatusByUserId);

// Update user presence (active/offline) upon login
router.patch("/presence/update", updatePresenceByUserId);

// View helper profile
router.get("/:id", getHelperById);

// CRUD (optional admin usage)
router.post("/", createHelper);
router.put("/:id", updateHelper);
router.delete("/:id", deleteHelper);

export default router;