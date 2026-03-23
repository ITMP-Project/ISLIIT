import express from "express";
import cors from "cors";

import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import commentsRouter from "./routes/comments.mjs";
import timeTablesRouter from "./routes/timetables.mjs";
import authRouter from "./routes/auth.mjs";
import rolesRouter from "./routes/roles.mjs";
import authUsersRouter from "./routes/auth-users.mjs";
import kuppiSessionsRouter from "./routes/kuppi-sessions.mjs";
import studentRequestsRouter from "./routes/student-requests.mjs";
import facultiesRouter from "./routes/faculties.mjs";
import specializationsRouter from "./routes/specializations.mjs";
import modulesRouter from "./routes/modules.mjs";
import peerpointRouter from "./routes/peerpoint.mjs";
import pHelpersRouter from "./routes/p-helper.mjs";
import chatRouter from "./routes/chat.mjs";
import emailRouter from "./routes/email.mjs";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/time-tables", timeTablesRouter);
app.use("/api/auth", authRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/auth-users", authUsersRouter);
app.use("/api/kuppi-sessions", kuppiSessionsRouter);
app.use("/api/student-requests", studentRequestsRouter);
app.use("/api/faculties", facultiesRouter);
app.use("/api/specializations", specializationsRouter);
app.use("/api/modules", modulesRouter);
app.use("/api/peerpoint", peerpointRouter);
app.use("/api/p-helper", pHelpersRouter);
app.use("/api/psychological-helpers", pHelpersRouter);
app.use("/api/chat", chatRouter);
app.use("/api/email", emailRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err?.status ?? 500;
  res.status(status).json({ error: err?.message ?? "Server error" });
});

export default app;