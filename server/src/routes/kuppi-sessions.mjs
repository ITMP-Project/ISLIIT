import { Router } from "express";
import {
  listKuppiSessions,
  getKuppiSession,
  createKuppiSession,
} from "../controllers/kuppi-sessions.controller.mjs";

const router = Router();

router.get("/", listKuppiSessions);
router.get("/:id", getKuppiSession);
router.post("/", createKuppiSession);

export default router;
