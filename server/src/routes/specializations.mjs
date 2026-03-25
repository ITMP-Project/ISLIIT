import { Router } from "express";
import {
  createSpecialization,
  listSpecializations,
} from "../controllers/specializations.controller.mjs";

const router = Router();

router.get("/", listSpecializations);
router.post("/", createSpecialization);

export default router;

