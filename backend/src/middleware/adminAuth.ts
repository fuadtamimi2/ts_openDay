import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) return res.status(401).json({ message: "Missing token" });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ message: "Missing JWT_SECRET" });

  try {
    const payload = jwt.verify(token, secret);
    (req as any).admin = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
