import { Router } from "express";
import {
  listTimeTables,
  getTimeTable,
  createTimeTable,
  updateTimeTable,
  deleteTimeTable,
} from "../controllers/timetables.controller.mjs";

const router = Router();

router.get("/", listTimeTables);
router.get("/:id", getTimeTable);
router.post("/", createTimeTable);
router.put("/:id", updateTimeTable);
router.delete("/:id", deleteTimeTable);

export default router;
