import { randomUUID } from "crypto";
import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validateRolesList } from "../models/role.model.mjs";
import { getAuthUserExpiresAt } from "../utils/auth-user-expiry.mjs";

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

    const expiresAt = getAuthUserExpiresAt(roles, new Date());
    const update = {
      $set: {
        roles,
      },
    };

    if (expiresAt) {
      update.$set.expiresAt = expiresAt;
    } else {
      update.$unset = { expiresAt: "" };
    }

    const result = await db.collection("auth_users").findOneAndUpdate(
      { _id: user._id },
      update,
      { returnDocument: "after" }
    );

    const fallbackUser = { ...user, roles };
    if (expiresAt) {
      fallbackUser.expiresAt = expiresAt;
    } else {
      delete fallbackUser.expiresAt;
    }

    res.json(stripPassword(result.value ?? fallbackUser));
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

export async function updateAuthUserProfilePicture(req, res, next) {
  try {
    const idQuery = buildIdQuery(req.params.id);
    if (!idQuery) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }

    const profilePic = req.body?.profile_picture;
    if (!profilePic) {
      res.status(400).json({ error: "Profile picture data is required" });
      return;
    }

    const db = await getDb();
    const user = await db.collection("auth_users").findOne(idQuery);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Update in auth_users
    const result = await db.collection("auth_users").findOneAndUpdate(
      { _id: user._id },
      { $set: { profile_picture: profilePic } },
      { returnDocument: "after" }
    );

    // Propagate changes to support providers, if registered
    const userIdString = String(user._id);
    const userIdentityQuery = {
      $or: [
        { student_id: user.username },
        { auth_user_id: userIdString },
        { student_id: userIdString }
      ]
    };

    await db.collection("p_helpers").updateMany(
      userIdentityQuery,
      { $set: { profile_picture: profilePic } }
    );

    await db.collection("academic_helpers").updateMany(
      userIdentityQuery,
      { $set: { profile_picture: profilePic } }
    );

    res.json(stripPassword(result.value ?? { ...user, profile_picture: profilePic }));
  } catch (error) {
    next(error);
  }
}
