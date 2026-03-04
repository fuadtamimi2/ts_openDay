import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const emailLower = String(email).trim().toLowerCase();

  if (!emailLower.endsWith("@ariel.ac.il")) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const admin = await Admin.findOne({ email: emailLower });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(String(password), admin.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ message: "Missing JWT_SECRET" });

  const token = jwt.sign(
    { email: admin.email, role: "admin" },
    secret,
    { expiresIn: "7d" }
  );

  return res.json({ token });
});

export default router;
