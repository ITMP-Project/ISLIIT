import { Router } from "express";
import { createFaculty, listFaculties } from "../controllers/faculties.controller.mjs";

const router = Router();

router.get("/", listFaculties);
router.post("/", createFaculty);

export default router;

