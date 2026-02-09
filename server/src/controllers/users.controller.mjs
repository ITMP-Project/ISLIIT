import { randomUUID } from "crypto";
import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validateUserPayload } from "../models/user.model.mjs";

const normalizeId = (id) => {
  const raw = String(id ?? "").trim();
  if (!raw) return "";
  const objectIdMatch = raw.match(/ObjectId\(["']?([a-fA-F0-9]{24})["']?\)/);
  if (objectIdMatch) return objectIdMatch[1];
  const oidMatch = raw.match(/^\{?\s*"\$oid"\s*:\s*"([a-fA-F0-9]{24})"\s*\}?$/);
  if (oidMatch) return oidMatch[1];
  return raw;
};

const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
};

const buildIdQuery = (id) => {
  const normalized = normalizeId(id);
  if (!normalized) return null;
  const objectId = toObjectId(normalized);
  if (objectId) {
    return { $or: [{ _id: normalized }, { _id: objectId }] };
  }
  return { _id: normalized };
};

export async function listUsers(req, res, next) {
  try {
    const db = await getDb();
    const users = await db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    const idQuery = buildIdQuery(req.params.id);
    if (!idQuery) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }

    const db = await getDb();
    const user = await db.collection("users").findOne(idQuery);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const { valid, errors, value } = validateUserPayload(req.body);
    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    const user = { _id: randomUUID(), ...value, createdAt: new Date() };
    const db = await getDb();
    await db.collection("users").insertOne(user);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const idQuery = buildIdQuery(req.params.id);
    if (!idQuery) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }

    const { valid, errors, value } = validateUserPayload(req.body, {
      partial: true,
    });

    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    if (!Object.keys(value).length) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const db = await getDb();
    const existing = await db.collection("users").findOne(idQuery);
    if (!existing) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const result = await db.collection("users").findOneAndUpdate(
      { _id: existing._id },
      { $set: value },
      { returnDocument: "after" }
    );

    res.json(result.value ?? { ...existing, ...value });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const idQuery = buildIdQuery(req.params.id);
    if (!idQuery) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }

    const db = await getDb();
    const result = await db.collection("users").findOneAndDelete(idQuery);

    if (!result.value) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}
