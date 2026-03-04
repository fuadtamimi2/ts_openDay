import mongoose, { Schema, Document } from "mongoose";

export interface IRegistration extends Document {
  fullName: string;
  phone: string;
  email: string;
  track: string;
  createdAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    track: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRegistration>(
  "Registration",
  RegistrationSchema
);
