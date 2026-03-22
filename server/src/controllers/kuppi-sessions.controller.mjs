import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validateKuppiSessionPayload } from "../models/kuppi-session.model.mjs";

const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
};

export async function listKuppiSessions(req, res, next) {
  try {
    const db = await getDb();
    const sessions = await db
      .collection("kuppi_sessions")
      .find({})
      .sort({ date: 1, time: 1, createdAt: -1 })
      .limit(100)
      .toArray();
    
    // Calculate status based on current date and session date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sessionsWithStatus = sessions.map(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      
      let status = "UPCOMING";
      if (sessionDate < today) {
        status = "PASSED";
      } else if (sessionDate.getTime() === today.getTime()) {
        status = "ONGOING";
      }
      
      return { ...session, status };
    });
    
    res.json(sessionsWithStatus);
  } catch (error) {
    next(error);
  }
}

export async function getKuppiSession(req, res, next) {
  try {
    const sessionId = toObjectId(req.params.id);
    if (!sessionId) {
      res.status(400).json({ error: "Invalid session id" });
      return;
    }

    const db = await getDb();
    const session = await db
      .collection("kuppi_sessions")
      .findOne({ _id: sessionId });

    if (!session) {
      res.status(404).json({ error: "Kuppi session not found" });
      return;
    }

    // Calculate status based on current date and session date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionDate = new Date(session.date);
    sessionDate.setHours(0, 0, 0, 0);
    
    let status = "UPCOMING";
    if (sessionDate < today) {
      status = "PASSED";
    } else if (sessionDate.getTime() === today.getTime()) {
      status = "ONGOING";
    }

    res.json({ ...session, status });
  } catch (error) {
    next(error);
  }
}

export async function createKuppiSession(req, res, next) {
  try {
    const { valid, errors, value } = validateKuppiSessionPayload(req.body);
    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    // Calculate status based on session date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionDate = new Date(value.date);
    sessionDate.setHours(0, 0, 0, 0);
    
    let status = "UPCOMING";
    if (sessionDate < today) {
      status = "PASSED";
    } else if (sessionDate.getTime() === today.getTime()) {
      status = "ONGOING";
    }

    const session = {
      ...value,
      status,
      createdAt: new Date(),
    };

    const db = await getDb();
    const result = await db.collection("kuppi_sessions").insertOne(session);
    res.status(201).json({ _id: result.insertedId, ...session });
  } catch (error) {
    next(error);
  }
}
