import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/send-timetable", upload.single("pdf"), async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "A valid recipient email is required." });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({ error: "PDF file is required." });
    }
    if (req.file.mimetype && req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are allowed." });
    }

    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();
    if (!smtpUser || !smtpPass) {
      return res.status(500).json({
        error:
          "Email service is not configured. Set SMTP_USER and SMTP_PASS in server/.env (use a real SMTP provider).",
      });
    }

    const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const secure = smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure,
      auth: { user: smtpUser, pass: smtpPass },
    });

    // Fail fast with a clearer error when SMTP creds/host are wrong
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Timetable App" <no-reply@timetableapp.com>',
      to: email,
      subject: "Your Timetable PDF",
      text: "Attached is your requested timetable PDF.",
      html: "<p>Attached is your requested timetable PDF.</p>",
      attachments: [
        {
          filename: "Timetable.pdf",
          content: req.file.buffer,
          contentType: "application/pdf",
        },
      ],
    });

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("Email send error:", err);
    next(err);
  }
});

export default router;
