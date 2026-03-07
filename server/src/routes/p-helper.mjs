import { Router } from "express";
import {
  getApprovedHelpers,
  getHelperById,
  createHelper,
  updateHelper,
  deleteHelper
} from "../controllers/p-helper.controller.mjs";

const router = Router();

// Mental Support Page
router.get("/", getApprovedHelpers);

// View helper profile
router.get("/:id", getHelperById);

// CRUD (optional admin usage)
router.post("/", createHelper);
router.put("/:id", updateHelper);
router.delete("/:id", deleteHelper);

export default router;