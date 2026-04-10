import { Router } from "express";
import {
  approveStudentRequest,
  createOrUpdateStudentRequest,
  getMyStudentRequest,
  listStudentRequests,
} from "../controllers/student-requests.controller.mjs";

const router = Router();

router.get("/", listStudentRequests);
router.get("/me", getMyStudentRequest);
router.post("/", createOrUpdateStudentRequest);
router.put("/:id/approve", approveStudentRequest);

export default router;

