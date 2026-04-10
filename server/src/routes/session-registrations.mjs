import { Router } from "express";
import {
  registerForSession,
  getSessionParticipants,
  checkUserRegistration,
} from "../controllers/session-registration.controller.mjs";

const router = Router();

// Register user for a session
router.post("/:id/register", registerForSession);

// Get all participants for a session
router.get("/:id/participants", getSessionParticipants);

// Check if user is registered for a session
router.get("/:id/check-registration", checkUserRegistration);

export default router;
