import express from "express";
import { getDb } from "../config/db.mjs";

const router = express.Router();

// Get marketplace listings
router.get("/marketplace", async (req, res, next) => {
    try {
        const db = await getDb();
        const items = await db.collection("peerpoint_marketplace").find().toArray();
        res.json(items);
    } catch (err) {
        next(err);
    }
});

// Post a marketplace listing
router.post("/marketplace", async (req, res, next) => {
    try {
        const { title, author, price, seller } = req.body;
        const db = await getDb();
        const result = await db.collection("peerpoint_marketplace").insertOne({
            title,
            author,
            price,
            seller,
            createdAt: new Date()
        });
        res.status(201).json({ _id: result.insertedId, title, author, price, seller });
    } catch (err) {
        next(err);
    }
});

// Get faculty documents
router.get("/faculty-docs", async (req, res, next) => {
    try {
        const { faculty } = req.query;
        const db = await getDb();
        const filter = faculty ? { faculty } : {};
        const docs = await db.collection("peerpoint_faculty_docs").find(filter).toArray();
        res.json(docs);
    } catch (err) {
        next(err);
    }
});

// Post a student document upload record (simulated storage)
router.post("/uploads", async (req, res, next) => {
    try {
        const { fileName, size, suggestionsApplied } = req.body;
        const db = await getDb();
        const result = await db.collection("peerpoint_student_uploads").insertOne({
            fileName,
            size,
            suggestionsApplied: suggestionsApplied || false,
            uploadedAt: new Date()
        });
        res.status(201).json({ _id: result.insertedId, fileName, status: "uploaded" });
    } catch (err) {
        next(err);
    }
});

// Place a print order
router.post("/order", async (req, res, next) => {
    try {
        const { documentName, copies, bindingType, faculty, pack, doubleSided, recycledPaper, draftMode, totalPages, ecoSelected, totalAmount } = req.body;
        const db = await getDb();

        // Generate a simple token
        const token = `A-${Math.floor(Math.random() * 900) + 100}`;

        const newOrder = {
            token,
            documentName,
            copies,
            bindingType,
            faculty,
            pack,
            totalPages: totalPages || 0,
            ecoSelected: ecoSelected || false,
            totalAmount: totalAmount || 0,
            options: { doubleSided, recycledPaper, draftMode },
            status: "Processing",
            estimatedTime: "12 mins",
            createdAt: new Date()
        };

        const result = await db.collection("peerpoint_orders").insertOne(newOrder);

        // If recycled paper used, add rewards points
        if (recycledPaper) {
            await db.collection("peerpoint_rewards").updateOne(
                { userId: "default-user" },
                { $inc: { points: 10 } },
                { upsert: true }
            );
        }

        res.status(201).json({ ...newOrder, _id: result.insertedId });
    } catch (err) {
        next(err);
    }
});

// Process a payment for an order
router.post("/payment", async (req, res, next) => {
    try {
        const { token, studentEmail, printCost, packCost, ecoDiscount, totalAmount } = req.body;

        // Validate SLIIT email format: ITxxxxxxxx@my.sliit.lk
        const sliitEmailRegex = /^IT\d{8}@my\.sliit\.lk$/i;
        if (!studentEmail || !sliitEmailRegex.test(studentEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student email. Must be in format ITxxxxxxxx@my.sliit.lk"
            });
        }

        if (!token) {
            return res.status(400).json({ success: false, message: "Order token is required." });
        }

        const db = await getDb();

        // Record the payment regardless of whether the order was saved to DB
        // (the order might have used a client-side fallback token if DB was temporarily unavailable)
        const payment = {
            token,
            studentEmail,
            printCost: parseFloat(printCost) || 0,
            packCost: parseFloat(packCost) || 0,
            ecoDiscount: parseFloat(ecoDiscount) || 0,
            totalAmount: parseFloat(totalAmount) || 0,
            status: "Paid",
            paidAt: new Date()
        };

        await db.collection("peerpoint_payments").insertOne(payment);

        // Update the order status to Paid only if the order exists (best-effort)
        await db.collection("peerpoint_orders").updateOne(
            { token },
            { $set: { status: "Paid", paidAt: new Date() } }
        );

        // Simulate sending email confirmation
        console.log(`[EMAIL NOTIFICATION] To: ${studentEmail}`);
        console.log(`[EMAIL NOTIFICATION] Subject: iSLIIT Peer Point - Payment Confirmation`);
        console.log(`[EMAIL NOTIFICATION] Your print order ${token} has been confirmed. Total: Rs. ${totalAmount}. It is ready for pickup soon.`);

        res.status(201).json({
            success: true,
            token,
            message: `Payment confirmed! Confirmation sent to ${studentEmail}.`
        });

    } catch (err) {
        next(err);
    }
});

// Get queue status
router.get("/queue/:token", async (req, res, next) => {
    try {
        const db = await getDb();
        const order = await db.collection("peerpoint_orders").findOne({ token: req.params.token });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
    } catch (err) {
        next(err);
    }
});

export default router;
