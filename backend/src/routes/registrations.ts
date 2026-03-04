import { Router, Request, Response } from "express";
import Registration from "../models/Registration";
import { adminAuth } from "../middleware/adminAuth";

import Admin from "../models/Admin";
import bcrypt from "bcrypt";

const router = Router();


router.get("/admin", adminAuth, async (_req, res) => {
  const items = await Registration.find().sort({ createdAt: -1 }).limit(1000);
  res.json({ items });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email.endsWith("@ariel.ac.il")) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  // פה בהמשך JWT
  res.json({ ok: true });
});


router.get("/admin.csv", adminAuth, async (_req, res) => {
  const items = await Registration.find().sort({ createdAt: -1 }).limit(5000);

  const header = ["fullName", "phone", "email", "track", "createdAt"];
  const rows = items.map((x: any) => [
    x.fullName,
    x.phone,
    x.email,
    x.track,
    x.createdAt?.toISOString?.() ?? "",
  ]);

  // CSV escape
  const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;

  const csv = [header.map(esc).join(","), ...rows.map(r => r.map(esc).join(","))].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=registrations.csv");
  res.send("\uFEFF" + csv); // BOM for Hebrew in Excel
});


router.post("/", async (req: Request, res: Response) => {
  try {
    const { fullName, phone, email, track } = req.body;

    // Basic validation
    if (!fullName || !phone || !email || !track) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const registration = await Registration.create({
      fullName,
      phone,
      email,
      track,
    });

    return res.status(201).json({
      ok: true,
      registration,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
