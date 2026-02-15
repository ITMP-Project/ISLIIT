import { Router } from "express";
import {
  listAuthUsers,
  updateAuthUserRoles,
} from "../controllers/auth-users.controller.mjs";

const router = Router();

router.get("/", listAuthUsers);
router.put("/:id/roles", updateAuthUserRoles);

export default router;
