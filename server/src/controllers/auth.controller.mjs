import { randomUUID } from "crypto";
import { getDb } from "../config/db.mjs";
import { validateAuthUserPayload } from "../models/auth-user.model.mjs";

export async function signup(req, res, next) {
  try {
    const { valid, errors, value } = validateAuthUserPayload(req.body);
    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    const db = await getDb();
    const existing = await db.collection("auth_users").findOne({
      username: value.username,
    });

    if (existing) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    const user = { _id: randomUUID(), ...value, createdAt: new Date() };
    await db.collection("auth_users").insertOne(user);

    const { password, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (error) {
    next(error);
  }
}
