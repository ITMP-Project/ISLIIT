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

export async function signin(req, res, next) {
  try {
    const username = String(req.body?.username ?? "").trim();
    const password = String(req.body?.password ?? "");
    const errors = [];

    if (!username) {
      errors.push("username is required");
    }

    if (!String(password).trim()) {
      errors.push("password is required");
    }

    if (errors.length > 0) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    const db = await getDb();
    const user = await db.collection("auth_users").findOne({ username });

    if (!user || String(user.password ?? "") !== String(password)) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const { password: _password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    next(error);
  }
}
