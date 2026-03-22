import { randomUUID } from "crypto";
import { getDb } from "../config/db.mjs";

const normalizeString = (value) => String(value ?? "").trim();

export async function listSpecializations(req, res, next) {
  try {
    const faculty_id = normalizeString(req.query?.faculty_id);
    const db = await getDb();
    const query = faculty_id ? { faculty_id } : {};
    const specs = await db
      .collection("specializations")
      .find(query)
      .sort({ specialization_name: 1 })
      .toArray();
    res.json(specs);
  } catch (error) {
    next(error);
  }
}

export async function createSpecialization(req, res, next) {
  try {
    const specialization_name = normalizeString(req.body?.specialization_name);
    const faculty_id = normalizeString(req.body?.faculty_id);
    if (!specialization_name) {
      res.status(400).json({ error: "specialization_name is required" });
      return;
    }
    if (!faculty_id) {
      res.status(400).json({ error: "faculty_id is required" });
      return;
    }

    const db = await getDb();
    const existing = await db.collection("specializations").findOne({
      specialization_name,
      faculty_id,
    });
    if (existing) {
      res.status(409).json({ error: "Specialization already exists" });
      return;
    }

    const doc = {
      _id: randomUUID(),
      specialization_name,
      faculty_id,
      createdAt: new Date(),
    };
    await db.collection("specializations").insertOne(doc);
    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
}

