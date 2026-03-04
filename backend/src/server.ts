import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import registrationsRouter from "./routes/registrations";
import { connectDB } from "./db";
import adminRouter from "./routes/admin";
import adminSeedRouter from "./routes/adminSeed";


dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/registrations", registrationsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin", adminSeedRouter);
const PORT = Number(process.env.PORT || 5000);
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  if (!MONGO_URI) {
    console.error("❌ Missing MONGO_URI in .env");
    process.exit(1);
  }
  await connectDB(MONGO_URI);
  app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("❌ Server failed:", err);
  process.exit(1);
});
