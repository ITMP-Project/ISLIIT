import "dotenv/config";
import app from "./src/app.mjs";

const PORT = Number(process.env.PORT ?? 4000);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
