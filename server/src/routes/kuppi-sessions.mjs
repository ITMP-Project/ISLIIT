import { Router } from "express";
import {
  listKuppiSessions,
  getKuppiSession,
  createKuppiSession,
} from "../controllers/kuppi-sessions.controller.mjs";
import sessionRegistrationRoutes from "./session-registrations.mjs";

const router = Router();

router.get("/", listKuppiSessions);
router.get("/:id", getKuppiSession);
router.post("/", createKuppiSession);

// Mount session registration routes
router.use("", sessionRegistrationRoutes);

export default router;
