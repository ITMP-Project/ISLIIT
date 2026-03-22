import { Router } from "express";
import { createModule, listModules } from "../controllers/modules.controller.mjs";
import {
  listModuleEvents,
  createModuleEvent,
} from "../controllers/module-events.controller.mjs";

const router = Router();

router.get("/", listModules);
router.post("/", createModule);

router.get("/:moduleId/events", listModuleEvents);
router.post("/:moduleId/events", createModuleEvent);

export default router;

