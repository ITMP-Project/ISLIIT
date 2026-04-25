import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validateSessionParticipantPayload } from "../models/session-participants.model.mjs";
import { getContentExpiresAt } from "../utils/content-expiry.mjs";

const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
};

export async function registerForSession(req, res, next) {
  try {
    const sessionId = toObjectId(req.params.id);
    if (!sessionId) {
      res.status(400).json({ error: "Invalid session id" });
      return;
    }

    // Validate payload with new fields
    const { valid, errors, value } = validateSessionParticipantPayload({
      ...req.body,
      sessionId: sessionId.toString(),
    });
    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    const db = await getDb();

    // Check if session exists
    const session = await db
      .collection("kuppi_sessions")
      .findOne({ _id: sessionId });

    if (!session) {
      res.status(404).json({ error: "Kuppi session not found" });
      return;
    }

    // Check if user is already registered
    const existingParticipant = await db
      .collection("session_participants")
      .findOne({
        sessionId: sessionId,
        userId: value.userId,
      });

    if (existingParticipant) {
      res.status(409).json({ error: "Already registered for this session" });
      return;
    }

    // Register user with all fields
    const now = new Date();
    const result = await db
      .collection("session_participants")
      .insertOne({
        sessionId: sessionId,
        userId: value.userId,
        studentId: value.studentId,
        year: value.year,
        semester: value.semester,
        createdAt: now,
        expiresAt: session.expiresAt ?? getContentExpiresAt(now),
      });

    res.status(201).json({
      _id: result.insertedId,
      sessionId: sessionId,
      userId: value.userId,
      studentId: value.studentId,
      year: value.year,
      semester: value.semester,
      createdAt: now,
      expiresAt: session.expiresAt ?? getContentExpiresAt(now),
    });
  } catch (error) {
    next(error);
  }
}

export async function getSessionParticipants(req, res, next) {
  try {
    const sessionId = toObjectId(req.params.id);
    if (!sessionId) {
      res.status(400).json({ error: "Invalid session id" });
      return;
    }

    const db = await getDb();

    // Check if session exists
    const session = await db
      .collection("kuppi_sessions")
      .findOne({ _id: sessionId });

    if (!session) {
      res.status(404).json({ error: "Kuppi session not found" });
      return;
    }

    // Get count and list of participants
    const participants = await db
      .collection("session_participants")
      .find({ sessionId: sessionId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      sessionId: sessionId,
      count: participants.length,
      participants: participants,
    });
  } catch (error) {
    next(error);
  }
}

export async function checkUserRegistration(req, res, next) {
  try {
    const sessionId = toObjectId(req.params.id);
    if (!sessionId) {
      res.status(400).json({ error: "Invalid session id" });
      return;
    }

    const userId = req.query.userId;
    if (!userId) {
      res.status(400).json({ error: "userId query parameter is required" });
      return;
    }

    const db = await getDb();

    const participant = await db
      .collection("session_participants")
      .findOne({
        sessionId: sessionId,
        userId: userId,
      });

    res.json({
      isRegistered: !!participant,
      participant: participant || null,
    });
  } catch (error) {
    next(error);
  }
}
