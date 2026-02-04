import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validateCommentPayload } from "../models/comment.model.mjs";

const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
};

export async function listComments(req, res, next) {
  try {
    const db = await getDb();
    const comments = await db
      .collection("comments")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    res.json(comments);
  } catch (error) {
    next(error);
  }
}

export async function getComment(req, res, next) {
  try {
    const commentId = toObjectId(req.params.id);
    if (!commentId) {
      res.status(400).json({ error: "Invalid comment id" });
      return;
    }

    const db = await getDb();
    const comment = await db.collection("comments").findOne({ _id: commentId });
    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }
    res.json(comment);
  } catch (error) {
    next(error);
  }
}

export async function createComment(req, res, next) {
  try {
    const { valid, errors, value } = validateCommentPayload(req.body);
    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    const comment = { ...value, createdAt: new Date() };
    const db = await getDb();
    const result = await db.collection("comments").insertOne(comment);
    res.status(201).json({ _id: result.insertedId, ...comment });
  } catch (error) {
    next(error);
  }
}

export async function updateComment(req, res, next) {
  try {
    const commentId = toObjectId(req.params.id);
    if (!commentId) {
      res.status(400).json({ error: "Invalid comment id" });
      return;
    }

    const { valid, errors, value } = validateCommentPayload(req.body, {
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
    const result = await db.collection("comments").findOneAndUpdate(
      { _id: commentId },
      { $set: value },
      { returnDocument: "after" }
    );

    if (!result.value) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.json(result.value);
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const commentId = toObjectId(req.params.id);
    if (!commentId) {
      res.status(400).json({ error: "Invalid comment id" });
      return;
    }

    const db = await getDb();
    const result = await db.collection("comments").findOneAndDelete({
      _id: commentId,
    });

    if (!result.value) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}
