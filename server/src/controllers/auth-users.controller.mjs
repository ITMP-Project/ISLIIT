import { randomUUID } from "crypto";
import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validateRolesList } from "../models/role.model.mjs";

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

const stripPassword = (user) => {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
};

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

const findMissingRoles = async (db, roles) => {
  if (!roles.length) return [];
  const existing = await db
    .collection("roles")
    .find({ name: { $in: roles } })
    .project({ name: 1 })
    .toArray();
  const existingNames = new Set(existing.map((role) => role.name));
  return roles.filter((role) => !existingNames.has(role));
};

const ensureRolesExist = async (db, roles) => {
  const missing = await findMissingRoles(db, roles);
  if (!missing.length) return;
  const now = new Date();
  const docs = missing.map((name) => ({
    _id: randomUUID(),
    name,
    createdAt: now,
  }));
  await db.collection("roles").insertMany(docs);
};

export async function listAuthUsers(req, res, next) {
  try {
    const db = await getDb();
    const users = await db
      .collection("auth_users")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    res.json(
      users.map((user) => ({
        ...stripPassword(user),
        roles: normalizeRoles(user),
      }))
    );
  } catch (error) {
    next(error);
  }
}

export async function updateAuthUserRoles(req, res, next) {
  try {
    const idQuery = buildIdQuery(req.params.id);
    if (!idQuery) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }

    const { valid, errors, roles } = validateRolesList(req.body?.roles, {
      allowEmpty: true,
    });

    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    const db = await getDb();
    const user = await db.collection("auth_users").findOne(idQuery);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const missing = await findMissingRoles(db, roles);
    if (missing.length) {
      await ensureRolesExist(db, roles);
    }

    const result = await db.collection("auth_users").findOneAndUpdate(
      { _id: user._id },
      { $set: { roles } },
      { returnDocument: "after" }
    );

    res.json(stripPassword(result.value ?? { ...user, roles }));
  } catch (error) {
    next(error);
  }
}

export async function updateAuthUserModules(req, res, next) {
  try {
    const idQuery = buildIdQuery(req.params.id);
    if (!idQuery) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }

    const rawModules = Array.isArray(req.body?.modules) ? req.body.modules : [];
    const modules = rawModules
      .map((entry) => String(entry ?? "").trim())
      .filter((entry) => Boolean(entry));

    const db = await getDb();
    const user = await db.collection("auth_users").findOne(idQuery);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const result = await db.collection("auth_users").findOneAndUpdate(
      { _id: user._id },
      { $set: { modules } },
      { returnDocument: "after" }
    );

    res.json(stripPassword(result.value ?? { ...user, modules }));
  } catch (error) {
    next(error);
  }
}

export async function updateAuthUserEmail(req, res, next) {
  try {
    const idQuery = buildIdQuery(req.params.id);
    if (!idQuery) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }

    const email = String(req.body?.email ?? "").trim();
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const db = await getDb();
    const user = await db.collection("auth_users").findOne(idQuery);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const result = await db.collection("auth_users").findOneAndUpdate(
      { _id: user._id },
      { $set: { email } },
      { returnDocument: "after" }
    );

    res.json(stripPassword(result.value ?? { ...user, email }));
  } catch (error) {
    next(error);
  }
}
