import { Router } from "express";
import {
  addFaculty,
  addSpecialization,
  addModule,
  getPendingHelpers,
  approveRejectHelper,
  getFaculties,
  getSpecializations,
  getModules,
  getHelpersByModule,
  applyHelper,
  getAcceptedHelpers,
  deleteModule,
  deleteHelper,
  getChatMessages,
  sendChatMessage,
  getHelperInbox,
  getHelperByStudentId
} from "../controllers/academic.controller.mjs";

const router = Router();

// Admin / Content Management
router.post("/faculty", addFaculty);
router.post("/specialization", addSpecialization);
router.post("/module", addModule);
router.delete("/module/:id", deleteModule);

// Admin / Helper Management
router.get("/helpers/pending", getPendingHelpers);
router.get("/helpers/accepted", getAcceptedHelpers);
router.patch("/helpers/:id/status", approveRejectHelper);
router.delete("/helpers/:id", deleteHelper);

// Student / Discovery
router.get("/faculties", getFaculties);
router.get("/specializations", getSpecializations);
router.get("/modules", getModules); // expects ?facultyId=&specId=&year=&semester=
router.get("/modules/:moduleId/helpers", getHelpersByModule);
router.post("/helpers/apply", applyHelper);

// Chat endpoints
router.get("/chat/inbox/:helperId", getHelperInbox);
router.get("/chat/:helperId", getChatMessages);
router.post("/chat/:helperId", sendChatMessage);

router.get("/helpers/by-student/:studentId", getHelperByStudentId);

export default router;
