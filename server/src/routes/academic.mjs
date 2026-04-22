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
  getHelperByStudentId,
  getHelperApplicationStatus,
  getHelperById,
  markMessagesAsRead,
  getUnreadCount,
  getStudentUnreadCount,
  getStudentInbox
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
router.get("/helpers/status/:moduleId/:studentId", getHelperApplicationStatus);

// Chat endpoints
router.get("/chat/inbox/:helperId", getHelperInbox);
router.get("/chat/student-inbox/:studentId", getStudentInbox);
router.get("/chat/unread/:helperId", getUnreadCount);
router.get("/chat/student-unread/:studentId", getStudentUnreadCount);
router.get("/chat/:helperId", getChatMessages);
router.post("/chat/read/:helperId", markMessagesAsRead);
router.post("/chat/:helperId", sendChatMessage);

router.get("/helpers/by-student/:studentId", getHelperByStudentId);
router.get("/helpers/:id", getHelperById);

export default router;
