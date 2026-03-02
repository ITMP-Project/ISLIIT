import { randomUUID } from "crypto";
import { getDb } from "../config/db.mjs";

const normalizeString = (value) => String(value ?? "").trim();
const normalizeInt = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return Math.trunc(num);
};

export async function listModules(req, res, next) {
  try {
    const year = req.query?.year !== undefined ? normalizeInt(req.query.year) : null;
    const semester =
      req.query?.semester !== undefined ? normalizeInt(req.query.semester) : null;
    const specialization_id = normalizeString(req.query?.specialization_id);

    const query = {};
    if (year !== null) query.year = year;
    if (semester !== null) query.semester = semester;
    if (specialization_id) query.specialization_id = specialization_id;

    const db = await getDb();
    const modules = await db
      .collection("modules")
      .find(query)
      .sort({ module_name: 1 })
      .toArray();
    res.json(modules);
  } catch (error) {
    next(error);
  }
}

export async function createModule(req, res, next) {
  try {
    const module_name = normalizeString(req.body?.module_name);
    const year = normalizeInt(req.body?.year);
    const semester = normalizeInt(req.body?.semester);
    const specialization_id = normalizeString(req.body?.specialization_id);

    if (!module_name) {
      res.status(400).json({ error: "module_name is required" });
      return;
    }
    if (year === null) {
      res.status(400).json({ error: "year must be a number" });
      return;
    }
    if (semester === null) {
      res.status(400).json({ error: "semester must be a number" });
      return;
    }
    if (!specialization_id) {
      res.status(400).json({ error: "specialization_id is required" });
      return;
    }

    const db = await getDb();
    const existing = await db.collection("modules").findOne({
      module_name,
      year,
      semester,
      specialization_id,
    });
    if (existing) {
      res.status(409).json({ error: "Module already exists" });
      return;
    }

    const doc = {
      _id: randomUUID(),
      module_name,
      year,
      semester,
      specialization_id,
      createdAt: new Date(),
    };
    await db.collection("modules").insertOne(doc);
    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
}

