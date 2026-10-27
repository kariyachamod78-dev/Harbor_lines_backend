// backend/models/Unit Of Measurement.js
import mongoose from "mongoose";

const uomSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true,
      minlength: 1,
      maxlength: 10,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["flight", "inventory"],
      required: true,
      default: "inventory",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UOM", uomSchema);
