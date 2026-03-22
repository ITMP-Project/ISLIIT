import { Router } from "express";
import {
    getOrCreateConversation,
    getConversationMessages,
    sendMessage,
    getUserConversations
} from "../controllers/chat.controller.mjs";

const router = Router();

router.post("/conversations", getOrCreateConversation);
router.get("/conversations/user/:studentId", getUserConversations);
router.get("/conversations/:id/messages", getConversationMessages);
router.post("/messages", sendMessage);

export default router;
