import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validatePHelperPayload } from "../models/p-helper.model.mjs";



// 1️⃣ Get approved helpers for Mental Support page
export const getPendingHelpers = async (req, res, next) => {
  try {
    const db = await getDb();

    const helpers = await db.collection("p_helpers")
      .find({
        onboarding_status: "pending"
      })
      .project({
        name: 1,
        bio: 1,
        profile_picture: 1,
        availability_status: 1,
        verified_status: 1,
        onboarding_status: 1,
        year_of_study: 1,
        student_id: 1,
        contact_no: 1,
        why_select_you: 1
      })
      .toArray();

    const mappedHelpers = helpers.map(h => ({
      ...h,
      id: h._id,
      name: h.name || `Helper ${h.student_id}`,
      profilePicture: h.profile_picture || '/images/user/user-01.jpg',
      availability: h.availability_status === 'active' ? 'Available' : h.availability_status === 'offline' ? 'Offline' : 'Busy'
    }));

    res.status(200).json(mappedHelpers);
  } catch (err) {
    next(err);
  }
};

export const updateHelperStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const { ObjectId } = await import("mongodb");
    const db = await getDb();
    const helperId = new ObjectId(req.params.id);

    const helper = await db.collection("p_helpers").findOne({ _id: helperId });
    if (!helper) {
      return res.status(404).json({ error: "Helper not found" });
    }

    const result = await db.collection("p_helpers").updateOne(
      { _id: helperId },
      {
        $set: {
          onboarding_status: status,
          ...(status === "approved" ? { availability_status: "active" } : {})
        }
      }
    );

    if (status === "approved") {
      // Sync role
      const query = {
        $or: [
          { _id: helper.auth_user_id || helper.student_id || "" },
          { username: helper.student_id || "" }
        ]
      };

      await db.collection("auth_users").updateMany(query, {
        $addToSet: { roles: "p_helper" },
        $unset: { expiresAt: "" }
      });
      await db.collection("users").updateMany(query, {
        $addToSet: { roles: "p_helper" }
      });
    }

    res.status(200).json({ message: `Helper status updated to ${status}` });
  } catch (err) {
    next(err);
  }
};

// 1.5️⃣ Get approved helpers for Mental Support page
export const getApprovedHelpers = async (req, res, next) => {
  try {
    const db = await getDb();

    const helpers = await db.collection("p_helpers")
      .find({
        onboarding_status: "approved"
      })
      .project({
        name: 1,
        bio: 1,
        profile_picture: 1,
        availability_status: 1,
        year_of_study: 1,
        student_id: 1,
        contact_no: 1,
        why_select_you: 1
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

export const getHelperStatusByUserId = async (req, res, next) => {
  try {
    const db = await getDb();
    const userId = req.params.userId;
    const helper = await db.collection("p_helpers").findOne({
      $or: [
        { student_id: userId },
        { auth_user_id: userId }
      ]
    });
    if (helper) {
      res.status(200).json({ hasApplication: true, status: helper.onboarding_status });
    } else {
      res.status(200).json({ hasApplication: false });
    }
  } catch (err) {
    next(err);
  }
};

// 7️⃣ Update explicit presence upon login
export const updatePresenceByUserId = async (req, res, next) => {
  try {
    const { availability_status, auth_user_id, student_id } = req.body;

    // Treat 'online' as 'active' explicitly
    const finalStatus = (availability_status === "online" || availability_status === "active") ? "active" : "offline";

    const db = await getDb();

    const queryConditions = [];
    if (auth_user_id) queryConditions.push({ auth_user_id: String(auth_user_id) });
    if (student_id) queryConditions.push({ student_id: String(student_id) });

    if (queryConditions.length === 0) {
      return res.status(400).json({ error: "Missing identity credentials" });
    }

    const result = await db.collection("p_helpers").updateOne(
      {
        $or: queryConditions,
        onboarding_status: "approved"
      },
      {
        $set: { availability_status: finalStatus }
      }
    );

    res.status(200).json({ message: `Presence updated to ${finalStatus}` });
  } catch (err) {
    next(err);
  }
};
