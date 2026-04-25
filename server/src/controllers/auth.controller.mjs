import { randomUUID } from "crypto";
import { getDb } from "../config/db.mjs";
import { validateAuthUserPayload } from "../models/auth-user.model.mjs";
import {
  getAuthUserExpiresAt,
  getAuthUserTtlDays,
  isAuthUserExpired,
} from "../utils/auth-user-expiry.mjs";

const defaultRoles = ["user"];
const normalizeRoles = (user) => {
  if (Array.isArray(user?.roles)) {
    return user.roles.map((role) => String(role)).filter(Boolean);
  }

  if (Array.isArray(user?.role)) {
    return user.role.map((role) => String(role)).filter(Boolean);
  }

  if (user?.role) {
    return [String(user.role)];
  }

  return [];
};

const ensureRolesExist = async (db, roles) => {
  if (!roles.length) return;
  const existing = await db
    .collection("roles")
    .find({ name: { $in: roles } })
    .project({ name: 1 })
    .toArray();
  const existingNames = new Set(existing.map((role) => role.name));
  const missing = roles.filter((role) => !existingNames.has(role));
  if (!missing.length) return;
  const now = new Date();
  const docs = missing.map((name) => ({
    _id: randomUUID(),
    name,
    createdAt: now,
  }));
  await db.collection("roles").insertMany(docs);
};

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

    await ensureRolesExist(db, defaultRoles);

    const now = new Date();
    const user = {
      _id: randomUUID(),
      ...value,
      roles: [...defaultRoles],
      createdAt: now,
      expiresAt: getAuthUserExpiresAt(defaultRoles, now),
    };
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

    if (user && isAuthUserExpired(user.expiresAt)) {
      res.status(403).json({
        error: `This account expired after ${getAuthUserTtlDays()} days. Please sign up again or contact an admin.`,
      });
      return;
    }

    if (!user || String(user.password ?? "") !== String(password)) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    // Automatically set helper availability to active on successful login
    await db.collection("p_helpers").updateOne(
      {
        $or: [
          { auth_user_id: String(user._id) },
          { student_id: String(user.username) }
        ],
        onboarding_status: "approved"
      },
      { $set: { availability_status: "active" } }
    );

    const { password: _password, role, roles, ...safeUser } = user;
    res.json({ ...safeUser, roles: normalizeRoles({ role, roles }) });
  } catch (error) {
    next(error);
  }
}
