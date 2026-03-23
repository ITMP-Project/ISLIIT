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

        let testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        let info = await transporter.sendMail({
            from: '"Timetable App" <no-reply@timetableapp.com>',
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
        console.log("Message sent to Ethereal: %s", previewUrl);

        res.json({
            success: true,
            message: "Email sent successfully!",
            previewUrl
        });
    } catch (err) {
        console.error("Email send error:", err);
        next(err);
    }
});

export default router;
