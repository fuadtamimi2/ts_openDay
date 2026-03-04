import { Router } from "express";
import Admin from "../models/Admin";
import bcrypt from "bcrypt";


const router = Router();

router.post("/seed", async (_req, res) => {
  const email = "admin.test@ariel.ac.il";
  const password = "123456";

  const exists = await Admin.findOne({ email });
  if (exists) return res.json({ ok: true, message: "Already exists", email });

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ email, passwordHash });

  res.json({ ok: true, email, password });
});

export default router;
