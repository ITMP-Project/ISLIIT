import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = Number(process.env.PORT ?? 4000);

const { default: app } = await import("./src/app.mjs");

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
