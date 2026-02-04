import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validateUserPayload } from "../models/user.model.mjs";

const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
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
    const userId = toObjectId(req.params.id);
    if (!userId) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ _id: userId });
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

    const user = { ...value, createdAt: new Date() };
    const db = await getDb();
    const result = await db.collection("users").insertOne(user);
    res.status(201).json({ _id: result.insertedId, ...user });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const userId = toObjectId(req.params.id);
    if (!userId) {
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
    const result = await db.collection("users").findOneAndUpdate(
      { _id: userId },
      { $set: value },
      { returnDocument: "after" }
    );

    if (!result.value) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(result.value);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const userId = toObjectId(req.params.id);
    if (!userId) {
      res.status(400).json({ error: "Invalid user id" });
      return;
    }

    const db = await getDb();
    const result = await db.collection("users").findOneAndDelete({
      _id: userId,
    });

    if (!result.value) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}
