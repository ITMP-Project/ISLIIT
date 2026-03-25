import { Router } from "express";
import {
  listAuthUsers,
  updateAuthUserRoles,
  updateAuthUserModules,
  updateAuthUserEmail,
} from "../controllers/auth-users.controller.mjs";

const router = Router();

router.get("/", listAuthUsers);
router.put("/:id/roles", updateAuthUserRoles);
router.put("/:id/modules", updateAuthUserModules);
router.put("/:id/email", updateAuthUserEmail);

export default router;
