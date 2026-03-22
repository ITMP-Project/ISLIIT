import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validateConversationPayload } from "../models/conversation.model.mjs";
import { validateMessagePayload } from "../models/message.model.mjs";

export const getOrCreateConversation = async (req, res, next) => {
    try {
        const { valid, errors, value } = validateConversationPayload(req.body);
        if (!valid) return res.status(400).json({ errors });

        const db = await getDb();
        let conversation = await db.collection("conversations").findOne({
            student_id: value.student_id,
            helper_id: value.helper_id
        });

        if (!conversation) {
            const newConv = {
                student_id: value.student_id,
                helper_id: value.helper_id,
                created_at: new Date()
            };
            const result = await db.collection("conversations").insertOne(newConv);
            conversation = { _id: result.insertedId, ...newConv };
        }

        // Also fetch helper details to pass along for UI convenience
        const helperParams = {};
        if (ObjectId.isValid(value.helper_id)) {
            helperParams._id = new ObjectId(value.helper_id);
        } else {
            helperParams.student_id = value.helper_id; // In case helper_id is stored as student_id
        }
        const helper = await db.collection("p_helpers").findOne(helperParams);
        if (helper) {
            conversation.helper = helper;
        }

        res.status(200).json(conversation);
    } catch (err) {
        next(err);
    }
};

export const getConversationMessages = async (req, res, next) => {
    try {
        const db = await getDb();
        const messages = await db.collection("messages").find({
            conversation_id: req.params.id
        }).sort({ created_at: 1 }).toArray();

        res.status(200).json(messages);
    } catch (err) {
        next(err);
    }
};

export const sendMessage = async (req, res, next) => {
    try {
        const { valid, errors, value } = validateMessagePayload(req.body);
        if (!valid) return res.status(400).json({ errors });

        const db = await getDb();
        const newMessage = {
            ...value,
            created_at: new Date()
        };
        const result = await db.collection("messages").insertOne(newMessage);

        res.status(201).json({ _id: result.insertedId, ...newMessage });
    } catch (err) {
        next(err);
    }
};

export const getUserConversations = async (req, res, next) => {
    try {
        const student_id = String(req.params.studentId || "").trim();
        if (!student_id || student_id === "STU-DEFAULT" || student_id === "undefined") {
            return res.status(200).json([]);
        }

        const db = await getDb();
        const { ObjectId } = await import("mongodb");

        // Find if this specific user has a helper profile themselves
        const ownHelperProfile = await db.collection("p_helpers").findOne({
            $or: [{ auth_user_id: student_id }, { student_id: student_id }]
        });

        const helperIds = [];
        if (ownHelperProfile) {
            helperIds.push(String(ownHelperProfile._id));
            helperIds.push(ownHelperProfile.student_id);
            if (ObjectId.isValid(ownHelperProfile._id)) {
                helperIds.push(new ObjectId(ownHelperProfile._id));
            }
        }

        const conversations = await db.collection("conversations").find({
            $or: [
                { student_id: student_id },
                { helper_id: student_id },
                { helper_id: { $in: helperIds } } // If user is a helper, match their own p_helper _id
            ]
        }).sort({ created_at: -1 }).toArray();

        // Populate helpers 
        const populatedConvs = await Promise.all(conversations.map(async conv => {
            const helperParams = {};
            if (ObjectId.isValid(conv.helper_id)) {
                helperParams._id = new ObjectId(conv.helper_id);
            } else {
                helperParams.student_id = conv.helper_id;
            }
            const helper = await db.collection("p_helpers").findOne(helperParams);
            return {
                ...conv,
                helper: helper || null
            };
        }));

        res.status(200).json(populatedConvs);

    } catch (err) {
        next(err);
    }
};
