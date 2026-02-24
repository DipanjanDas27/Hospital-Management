import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    appointmentdate: {
      type: Date,
      required: true,
      index: true,
    },
    appointmenttime: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      trim: true,
    },
    medicalhistory: {
      type: String,
    },
    uniquecode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
    deleteafter: {
      type: Date,
      default: null,
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

appointmentSchema.index(
  { doctor: 1, appointmentdate: 1, appointmenttime: 1 },
  { unique: true }
);

export const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);