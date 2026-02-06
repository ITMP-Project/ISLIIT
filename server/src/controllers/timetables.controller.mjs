import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validateTimeTablePayload } from "../models/timetable.model.mjs";

const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
};

export async function listTimeTables(req, res, next) {
  try {
    const db = await getDb();
    const timeTables = await db
      .collection("time_table")
      .find({})
      .sort({ date: 1, startTime: 1, createdAt: -1 })
      .limit(100)
      .toArray();
    res.json(timeTables);
  } catch (error) {
    next(error);
  }
}

export async function getTimeTable(req, res, next) {
  try {
    const timeTableId = toObjectId(req.params.id);
    if (!timeTableId) {
      res.status(400).json({ error: "Invalid time table id" });
      return;
    }

    const db = await getDb();
    const timeTable = await db
      .collection("time_table")
      .findOne({ _id: timeTableId });
    if (!timeTable) {
      res.status(404).json({ error: "Time table not found" });
      return;
    }
    res.json(timeTable);
  } catch (error) {
    next(error);
  }
}

export async function createTimeTable(req, res, next) {
  try {
    const { valid, errors, value } = validateTimeTablePayload(req.body);
    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    const timeTable = { ...value, createdAt: new Date() };
    const db = await getDb();
    const result = await db.collection("time_table").insertOne(timeTable);
    res.status(201).json({ _id: result.insertedId, ...timeTable });
  } catch (error) {
    next(error);
  }
}

export async function updateTimeTable(req, res, next) {
  try {
    const timeTableId = toObjectId(req.params.id);
    if (!timeTableId) {
      res.status(400).json({ error: "Invalid time table id" });
      return;
    }

    const { valid, errors, value } = validateTimeTablePayload(req.body, {
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
    const result = await db.collection("time_table").findOneAndUpdate(
      { _id: timeTableId },
      { $set: value },
      { returnDocument: "after" }
    );

    if (!result.value) {
      res.status(404).json({ error: "Time table not found" });
      return;
    }

    res.json(result.value);
  } catch (error) {
    next(error);
  }
}

export async function deleteTimeTable(req, res, next) {
  try {
    const timeTableId = toObjectId(req.params.id);
    if (!timeTableId) {
      res.status(400).json({ error: "Invalid time table id" });
      return;
    }

    const db = await getDb();
    const result = await db.collection("time_table").findOneAndDelete({
      _id: timeTableId,
    });

    if (!result.value) {
      res.status(404).json({ error: "Time table not found" });
      return;
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}
