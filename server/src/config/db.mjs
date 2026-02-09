import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const mongoUri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME ?? "tailadmin_demo";

let client;
let db;

export async function getDb() {
  if (db) return db;

  client = new MongoClient(mongoUri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

export async function closeDb() {
  if (client) {
    await client.close();
  }
}
