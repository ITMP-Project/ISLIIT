import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import {
  validateAcademicHelperPayload,
  validateFacultyPayload,
  validateSpecializationPayload,
  validateModulePayload,
} from "../models/academic.model.mjs";

// --- ADMIN API ---

export const addFaculty = async (req, res, next) => {
  try {
    const { valid, errors, value } = validateFacultyPayload(req.body);
    if (!valid) return res.status(400).json({ errors });

    const db = await getDb();
    const result = await db.collection("academic_faculties").insertOne(value);
    res.status(201).json({ _id: result.insertedId, ...value });
  } catch (err) {
    next(err);
  }
};

export const addSpecialization = async (req, res, next) => {
  try {
    const { valid, errors, value } = validateSpecializationPayload(req.body);
    if (!valid) return res.status(400).json({ errors });

    const db = await getDb();
    const result = await db.collection("academic_specializations").insertOne(value);
    res.status(201).json({ _id: result.insertedId, ...value });
  } catch (err) {
    next(err);
  }
};

export const addModule = async (req, res, next) => {
  try {
    const { valid, errors, value } = validateModulePayload(req.body);
    if (!valid) return res.status(400).json({ errors });

    const db = await getDb();
    const result = await db.collection("academic_modules").insertOne(value);
    res.status(201).json({ _id: result.insertedId, ...value });
  } catch (err) {
    next(err);
  }
};

export const deleteModule = async (req, res, next) => {
  try {
    const db = await getDb();
    const result = await db.collection("academic_modules").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Module not found" });
    res.status(200).json({ message: "Module deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const getPendingHelpers = async (req, res, next) => {
  try {
    const db = await getDb();
    const helpers = await db.collection("academic_helpers")
      .find({ status: "pending" })
      .toArray();

    // Attach module details for better admin view
    for (let helper of helpers) {
      if (helper.module_id) {
        const mod = await db.collection("academic_modules").findOne({ _id: new ObjectId(helper.module_id) });
        helper.moduleDetails = mod || null;
      }
    }
    
    res.status(200).json(helpers);
  } catch (err) {
    next(err);
  }
};

export const approveRejectHelper = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const db = await getDb();
    const result = await db.collection("academic_helpers").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: "Helper not found" });
    res.status(200).json({ message: `Helper ${status} successfully` });
  } catch (err) {
    next(err);
  }
};

export const getAcceptedHelpers = async (req, res, next) => {
  try {
    const db = await getDb();
    const helpers = await db.collection("academic_helpers")
      .find({ status: "approved" })
      .toArray();

    for (let helper of helpers) {
      if (helper.module_id) {
        const mod = await db.collection("academic_modules").findOne({ _id: new ObjectId(helper.module_id) });
        helper.moduleDetails = mod || null;
      }
    }
    res.status(200).json(helpers);
  } catch (err) {
    next(err);
  }
};

export const deleteHelper = async (req, res, next) => {
  try {
    const db = await getDb();
    const result = await db.collection("academic_helpers").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Helper not found" });
    res.status(200).json({ message: "Helper deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// --- STUDENT API ---

export const getFaculties = async (req, res, next) => {
  try {
    const db = await getDb();
    const faculties = await db.collection("academic_faculties").find().toArray();
    res.status(200).json(faculties);
  } catch (err) {
    next(err);
  }
};

export const getSpecializations = async (req, res, next) => {
  try {
    const { facultyId } = req.query;
    const db = await getDb();
    const filter = facultyId ? { faculty_id: facultyId } : {};
    const specs = await db.collection("academic_specializations").find(filter).toArray();
    res.status(200).json(specs);
  } catch (err) {
    next(err);
  }
};

export const getModules = async (req, res, next) => {
  try {
    const { facultyId, specId, year, semester } = req.query;
    const filter = {};
    if (facultyId) filter.faculty_id = facultyId;
    if (specId) filter.spec_id = specId;
    if (year) filter.year = year;
    if (semester) filter.semester = semester;

    const db = await getDb();
    const modules = await db.collection("academic_modules").find(filter).toArray();
    res.status(200).json(modules);
  } catch (err) {
    next(err);
  }
};

export const getHelpersByModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const db = await getDb();
    const helpers = await db.collection("academic_helpers")
      .find({ module_id: moduleId, status: "approved" })
      .toArray();

    const mappedHelpers = helpers.map(h => ({
      ...h,
      id: h._id,
      name: h.name || `Helper ${h.student_id}`,
      profilePicture: h.profile_picture || '/images/user/user-01.jpg',
    }));

    res.status(200).json(mappedHelpers);
  } catch (err) {
    next(err);
  }
};

export const applyHelper = async (req, res, next) => {
  try {
    const { valid, errors, value } = validateAcademicHelperPayload(req.body);
    if (!valid) return res.status(400).json({ errors });

    const newHelper = {
      ...value,
      status: "pending",
      created_at: new Date()
    };

    const db = await getDb();
    const result = await db.collection("academic_helpers").insertOne(newHelper);
    res.status(201).json({ _id: result.insertedId, ...newHelper });
  } catch (err) {
    next(err);
  }
};

export const getHelperInbox = async (req, res, next) => {
  try {
    const { helperId } = req.params;
    const db = await getDb();
    
    const messages = await db.collection("academic_chats").find({ helperId }).toArray();
    const students = [...new Set(messages.map(m => m.studentId))];
    
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

export const getChatMessages = async (req, res, next) => {
  try {
    const { helperId } = req.params;
    const { studentId } = req.query;

    if (!studentId) return res.status(400).json({ error: "studentId is required" });

    const db = await getDb();
    const messages = await db.collection("academic_chats")
      .find({ helperId, studentId })
      .sort({ timestamp: 1 })
      .toArray();

    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

export const sendChatMessage = async (req, res, next) => {
  try {
    const { helperId } = req.params;
    const { studentId, sender, text } = req.body;

    if (!studentId || !sender || !text) {
      return res.status(400).json({ error: "studentId, sender, and text are required" });
    }

    const db = await getDb();
    const message = {
      helperId,
      studentId,
      sender,
      text,
      timestamp: new Date()
    };

    const result = await db.collection("academic_chats").insertOne(message);
    res.status(201).json({ _id: result.insertedId, ...message });
  } catch (err) {
    next(err);
  }
};

export const getHelperByStudentId = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const db = await getDb();
    
    // We fetch the first approved helper application matching the student_id
    const helper = await db.collection("academic_helpers").findOne({ 
      student_id: studentId,
      status: "approved"
    });
    
    if (!helper) {
      return res.status(404).json({ error: "Helper profile not found." });
    }
    
    res.status(200).json(helper);
  } catch (err) {
    next(err);
  }
};
