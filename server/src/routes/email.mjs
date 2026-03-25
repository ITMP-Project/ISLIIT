import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/send-timetable", upload.single("pdf"), async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email address is required." });
        }
        if (!req.file) {
            return res.status(400).json({ error: "PDF file is required." });
        }

        let transporter;
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || "smtp.gmail.com",
                port: parseInt(process.env.SMTP_PORT || "587"),
                secure: process.env.SMTP_PORT === "465",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        } else {
            // Fallback to Ethereal test account
            let testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }

        let info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Timetable App" <no-reply@timetableapp.com>',
            to: email,
            subject: "Your Timetable PDF",
            text: "Attached is your requested timetable PDF.",
            html: "<p>Attached is your requested timetable PDF.</p>",
            attachments: [
                {
                    filename: 'Timetable.pdf',
                    content: req.file.buffer,
                    contentType: 'application/pdf'
                }
            ]
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log("Message sent to Ethereal: %s", previewUrl);
        }

        res.json({
            success: true,
            message: previewUrl ? "Email sent to test account! Check console for preview URL." : "Email sent successfully!",
            previewUrl
        });
    } catch (err) {
        console.error("Email send error:", err);
        next(err);
    }
});

export default router;
