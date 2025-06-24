import mongoose from "mongoose";
const deptSchema = new mongoose.Schema({
    deptname: {
        type: String,
        required: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });
export const Department = mongoose.model("Department", deptSchema);