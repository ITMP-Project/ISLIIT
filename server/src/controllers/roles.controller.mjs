import { randomUUID } from "crypto";
import { getDb } from "../config/db.mjs";
import {
  normalizeRoleName,
  validateRolePayload,
} from "../models/role.model.mjs";

const normalizeId = (id) => String(id ?? "").trim();

export async function listRoles(req, res, next) {
  try {
    const db = await getDb();
    const roles = await db
      .collection("roles")
      .find({})
      .sort({ name: 1 })
      .toArray();
    res.json(roles);
  } catch (error) {
    next(error);
  }
}

export async function getRole(req, res, next) {
  try {
    const id = normalizeId(req.params.id);
    if (!id) {
      res.status(400).json({ error: "Invalid role id" });
      return;
    }

    const db = await getDb();
    const role = await db.collection("roles").findOne({ _id: id });
    if (!role) {
      res.status(404).json({ error: "Role not found" });
      return;
    }

    res.json(role);
  } catch (error) {
    next(error);
  }
}

export async function createRole(req, res, next) {
  try {
    const { valid, errors, value } = validateRolePayload(req.body);
    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    const db = await getDb();
    const existing = await db.collection("roles").findOne({ name: value.name });
    if (existing) {
      res.status(409).json({ error: "Role already exists" });
      return;
    }

    const role = { _id: randomUUID(), ...value, createdAt: new Date() };
    await db.collection("roles").insertOne(role);
    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
}

export async function updateRole(req, res, next) {
  try {
    const id = normalizeId(req.params.id);
    if (!id) {
      res.status(400).json({ error: "Invalid role id" });
      return;
    }

    const { valid, errors, value } = validateRolePayload(req.body, {
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
    const existing = await db.collection("roles").findOne({ _id: id });
    if (!existing) {
      res.status(404).json({ error: "Role not found" });
      return;
    }

    if (Object.prototype.hasOwnProperty.call(value, "name")) {
      const normalized = normalizeRoleName(value.name);
      const duplicate = await db
        .collection("roles")
        .findOne({ name: normalized });
      if (duplicate && String(duplicate._id) !== String(existing._id)) {
        res.status(409).json({ error: "Role name already exists" });
        return;
      }
      value.name = normalized;
    }

    const result = await db.collection("roles").findOneAndUpdate(
      { _id: existing._id },
      { $set: value },
      { returnDocument: "after" }
    );

    res.json(result.value ?? { ...existing, ...value });
  } catch (error) {
    next(error);
  }
}

export async function deleteRole(req, res, next) {
  try {
    const id = normalizeId(req.params.id);
    if (!id) {
      res.status(400).json({ error: "Invalid role id" });
      return;
    }

    const db = await getDb();
    const result = await db.collection("roles").findOneAndDelete({ _id: id });

    if (!result.value) {
      res.status(404).json({ error: "Role not found" });
      return;
    }

    await db
      .collection("auth_users")
      .updateMany({}, { $pull: { roles: result.value.name } });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}
