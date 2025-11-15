import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  test_name: {
    type: String,
    required: true,
    trim: true,
  },
  parameters: [
    {
      name: { type: String, trim: true }, 
      value: { type: String, trim: true }, 
      unit: { type: String, trim: true }, 
      reference_range: { type: String, trim: true }, 
      status: { type: String, enum: ["Normal", "Low", "High", "Abnormal"], default: "Normal" },
    },
  ],
  result_summary: {
    type: String, 
    trim: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["ordered", "processing", "completed"],
    default: "ordered",
  },
}, { _id: false });

const labTestSchema = new mongoose.Schema(
  {
    prescription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: true,
    },
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    tests: {
      type: [testResultSchema],
      required: true,
    },
    overall_status: {
      type: String,
      enum: ["ordered", "processing", "completed"],
      default: "ordered",
    },
    report_date: {
      type: Date,
      default: null,
    },
    attachments: [
      {
        file_name: { type: String },
        file_url: { type: String },
      },
    ],
    verified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    verified_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Labtest", labTestSchema);
