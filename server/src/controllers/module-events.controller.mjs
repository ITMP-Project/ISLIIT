import { randomUUID } from "crypto";
import { getDb } from "../config/db.mjs";
import { getContentExpiresAt } from "../utils/content-expiry.mjs";

const normalizeString = (value) => String(value ?? "").trim();

const VALID_TYPES = new Set(["lec", "lab", "exam"]);

export async function listModuleEvents(req, res, next) {
  try {
    const moduleId = normalizeString(req.params?.moduleId);
    if (!moduleId) {
      res.status(400).json({ error: "moduleId is required" });
      return;
    }

    const db = await getDb();
    const events = await db
      .collection("module_events")
      .find({ module_id: moduleId })
      .sort({ startTime: 1 })
      .limit(500)
      .toArray();

    res.json(events);
  } catch (error) {
    next(error);
  }
}

export async function createModuleEvent(req, res, next) {
  try {
    const moduleId = normalizeString(req.params?.moduleId);
    if (!moduleId) {
      res.status(400).json({ error: "moduleId is required" });
      return;
    }

    const title = normalizeString(req.body?.title);
    const type = normalizeString(req.body?.type).toLowerCase();
    const startRaw = normalizeString(req.body?.startTime);
    const endRaw = normalizeString(req.body?.endTime);
    const description = normalizeString(req.body?.description);
    const createdBy = normalizeString(req.body?.createdBy);

    if (!title) {
      res.status(400).json({ error: "title is required" });
      return;
    }

    if (!VALID_TYPES.has(type)) {
      res.status(400).json({ error: "type must be one of: lec, lab, exam" });
      return;
    }

    const startTime = new Date(startRaw);
    const endTime = new Date(endRaw);

    if (!startRaw || Number.isNaN(startTime.getTime())) {
      res.status(400).json({ error: "startTime must be a valid datetime" });
      return;
    }
    if (!endRaw || Number.isNaN(endTime.getTime())) {
      res.status(400).json({ error: "endTime must be a valid datetime" });
      return;
    }
    if (endTime <= startTime) {
      res.status(400).json({ error: "endTime must be after startTime" });
      return;
    }

    const now = new Date();

    const doc = {
      _id: randomUUID(),
      module_id: moduleId,
      title,
      type,
      startTime,
      endTime,
      description,
      createdBy,
      createdAt: now,
      expiresAt: getContentExpiresAt(now),
    };

    const db = await getDb();
    await db.collection("module_events").insertOne(doc);

    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
}

