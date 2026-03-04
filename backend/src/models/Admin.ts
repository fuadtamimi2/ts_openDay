import mongoose, { Schema, Document } from "mongoose";

export interface AdminDocument extends Document {
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<AdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 👇 THIS LINE IS THE ANSWER TO YOUR "WHERE???"
export default mongoose.model<AdminDocument>("Admin", adminSchema);
