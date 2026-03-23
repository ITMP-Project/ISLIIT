import { randomUUID } from "crypto";
import { getDb } from "../config/db.mjs";

const normalizeString = (value) => String(value ?? "").trim();

export async function listFaculties(req, res, next) {
  try {
    const db = await getDb();
    const faculties = await db
      .collection("faculties")
      .find({})
      .sort({ faculty_name: 1 })
      .toArray();
    res.json(faculties);
  } catch (error) {
    next(error);
  }
}

export async function createFaculty(req, res, next) {
  try {
    const faculty_name = normalizeString(req.body?.faculty_name);
    if (!faculty_name) {
      res.status(400).json({ error: "faculty_name is required" });
      return;
    }

    const db = await getDb();
    const existing = await db.collection("faculties").findOne({ faculty_name });
    if (existing) {
      res.status(409).json({ error: "Faculty already exists" });
      return;
    }

    const doc = { _id: randomUUID(), faculty_name, createdAt: new Date() };
    await db.collection("faculties").insertOne(doc);
    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
}

