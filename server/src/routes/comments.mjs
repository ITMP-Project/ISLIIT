import { Router } from "express";
import {
  listComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller.mjs";

const router = Router();

router.get("/", listComments);
router.get("/:id", getComment);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
