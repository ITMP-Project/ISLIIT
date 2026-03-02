import { randomUUID } from "crypto";
import { getDb } from "../config/db.mjs";
import { validateStudentRequestPayload } from "../models/student-request.model.mjs";

const normalizeRoleName = (value) => String(value ?? "").trim().toLowerCase();

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

export async function listStudentRequests(req, res, next) {
  try {
    const status = String(req.query?.status ?? "").trim().toLowerCase();
    const db = await getDb();
    const query = status ? { status } : {};
    const requests = await db
      .collection("student_requests")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();
    res.json(requests);
  } catch (error) {
    next(error);
  }
}

export async function getMyStudentRequest(req, res, next) {
  try {
    const username = String(req.query?.username ?? "").trim();
    if (!username) {
      res.status(400).json({ error: "username is required" });
      return;
    }

    const db = await getDb();
    const request = await db
      .collection("student_requests")
      .find({ username })
      .sort({ createdAt: -1 })
      .limit(1)
      .next();

    res.json(request ?? null);
  } catch (error) {
    next(error);
  }
}

export async function createOrUpdateStudentRequest(req, res, next) {
  try {
    const { valid, errors, value } = validateStudentRequestPayload(req.body);
    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    const db = await getDb();
    const existingApproved = await db.collection("student_requests").findOne({
      username: value.username,
      status: "approved",
    });
    if (existingApproved) {
      res.status(409).json({ error: "Request already approved" });
      return;
    }

    const now = new Date();
    const existingPending = await db.collection("student_requests").findOne({
      username: value.username,
      status: "pending",
    });

    if (existingPending) {
      const result = await db.collection("student_requests").findOneAndUpdate(
        { _id: existingPending._id },
        {
          $set: {
            ...value,
            status: "pending",
            updatedAt: now,
          },
        },
        { returnDocument: "after" }
      );
      res.json(result.value ?? { ...existingPending, ...value, updatedAt: now });
      return;
    }

    const request = {
      _id: randomUUID(),
      ...value,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    await db.collection("student_requests").insertOne(request);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
}

export async function approveStudentRequest(req, res, next) {
  try {
    const id = String(req.params.id ?? "").trim();
    if (!id) {
      res.status(400).json({ error: "Invalid request id" });
      return;
    }

    const db = await getDb();
    const request = await db.collection("student_requests").findOne({ _id: id });
    if (!request) {
      res.status(404).json({ error: "Request not found" });
      return;
    }

    if (String(request.status).toLowerCase() === "approved") {
      res.status(409).json({ error: "Request already approved" });
      return;
    }

    const now = new Date();

    const authUser = await db
      .collection("auth_users")
      .findOne({ username: request.username });
    if (!authUser) {
      res.status(404).json({ error: "Auth user not found for this request" });
      return;
    }

    const existingRoles = normalizeRoles(authUser).map(normalizeRoleName).filter(Boolean);
    const nextRoles = Array.from(new Set([...existingRoles, "student"]));
    await ensureRolesExist(db, nextRoles);

    const studentIdValue =
      request.studentId ??
      request.student_id ??
      "";

    const moduleIds = Array.isArray(request.module_ids)
      ? request.module_ids.map((entry) => String(entry)).filter(Boolean)
      : [];

    await db.collection("auth_users").updateOne(
      { _id: authUser._id },
      {
        $set: {
          roles: nextRoles,
          student_id: studentIdValue,
          faculty_id: request.faculty_id,
          specialization_id: request.specialization_id,
          year: Number(request.year),
          semester: Number(request.semester),
          modules: moduleIds,
        },
      }
    );

    const studentDoc = {
      username: request.username,
      student_id: studentIdValue,
      faculty_id: request.faculty_id,
      specialization_id: request.specialization_id,
      year: Number(request.year),
      semester: Number(request.semester),
      modules: moduleIds,
      updatedAt: now,
    };

    const existingStudent = await db
      .collection("students")
      .findOne({ username: request.username });
    if (existingStudent) {
      await db.collection("students").updateOne(
        { _id: existingStudent._id },
        { $set: studentDoc }
      );
    } else {
      await db.collection("students").insertOne({
        _id: randomUUID(),
        ...studentDoc,
        createdAt: now,
      });
    }

    const result = await db.collection("student_requests").findOneAndUpdate(
      { _id: request._id },
      { $set: { status: "approved", approvedAt: now, updatedAt: now } },
      { returnDocument: "after" }
    );

    res.json({
      ok: true,
      request: result.value ?? { ...request, status: "approved", approvedAt: now, updatedAt: now },
      roles: nextRoles,
    });
  } catch (error) {
    next(error);
  }
}

