import { Router } from "express";
import {
  listAuthUsers,
  updateAuthUserRoles,
  updateAuthUserModules,
} from "../controllers/auth-users.controller.mjs";

const router = Router();

router.get("/", listAuthUsers);
router.put("/:id/roles", updateAuthUserRoles);
router.put("/:id/modules", updateAuthUserModules);

export default router;
