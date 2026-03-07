import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validatePHelperPayload } from "../models/p-helper.model.mjs";



// 1️⃣ Get approved helpers for Mental Support page
export const getApprovedHelpers = async (req, res, next) => {
  try {
    const db = await getDb();

    const helpers = await db.collection("p_helpers")
      .find({
        onboarding_status: "approved",
        availability_status: { $ne: "offline" }
      })
      .project({
        name: 1,
        bio: 1,
        profile_picture: 1,
        availability_status: 1,
        student_id: 1
      })
      .toArray();

    const mappedHelpers = helpers.map(h => ({
      ...h,
      id: h._id,
      name: h.name || `Helper ${h.student_id}`,
      profilePicture: h.profile_picture || '/images/user/user-01.jpg',
      availability: h.availability_status === 'active' ? 'Available' : 'Busy'
    }));

    res.status(200).json(mappedHelpers);
  } catch (err) {
    next(err);
  }
};


// 2️⃣ Get single helper (when clicking card)
export const getHelperById = async (req, res, next) => {
  try {
    const db = await getDb(); // ✅ ADDED
    const helper = await db.collection("p_helpers").findOne({ // ✅ FIXED: was `collection`
      _id: new ObjectId(req.params.id)
    });

    if (!helper) {
      return res.status(404).json({ error: "Helper not found" });
    }

    const mappedHelper = {
      ...helper,
      id: helper._id,
      name: helper.name || `Helper ${helper.student_id}`,
      profilePicture: helper.profile_picture || '/images/user/user-01.jpg',
      availability: helper.availability_status === 'active' ? 'Available' : 'Busy'
    };

    res.status(200).json(mappedHelper);
  } catch (err) {
    next(err);
  }
};


// 3️⃣ Create helper profile
export const createHelper = async (req, res, next) => {
  try {
    const { valid, errors, value } = validatePHelperPayload(req.body);

    if (!valid) {
      return res.status(400).json({ errors });
    }

    const newHelper = {
      ...value,
      availability_status: value.availability_status ?? "offline",
      verified_status: value.verified_status ?? false,
      onboarding_status: value.onboarding_status ?? "pending",
      created_at: new Date()
    };

    const db = await getDb(); // ✅ ADDED
    const result = await db.collection("p_helpers").insertOne(newHelper); // ✅ FIXED

    res.status(201).json({
      _id: result.insertedId,
      ...newHelper
    });
  } catch (err) {
    next(err);
  }
};


// 4️⃣ Update helper
export const updateHelper = async (req, res, next) => {
  try {
    const { valid, errors, value } = validatePHelperPayload(req.body, {
      partial: true
    });

    if (!valid) {
      return res.status(400).json({ errors });
    }

    const db = await getDb(); // ✅ ADDED
    const result = await db.collection("p_helpers").updateOne( // ✅ FIXED
      { _id: new ObjectId(req.params.id) },
      { $set: value }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Helper not found" });
    }

    res.status(200).json({ message: "Helper updated successfully" });
  } catch (err) {
    next(err);
  }
};


// 5️⃣ Delete helper
export const deleteHelper = async (req, res, next) => {
  try {
    const db = await getDb(); // ✅ ADDED
    const result = await db.collection("p_helpers").deleteOne({ // ✅ FIXED
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Helper not found" });
    }

    res.status(200).json({ message: "Helper deleted successfully" });
  } catch (err) {
    next(err);
  }
};