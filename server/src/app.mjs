import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import commentsRouter from "./routes/comments.mjs";
import timeTablesRouter from "./routes/timetables.mjs";

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

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err?.status ?? 500;
  res.status(status).json({ error: err?.message ?? "Server error" });
});

export default app;
