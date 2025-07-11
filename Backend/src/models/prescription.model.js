import mongoose from "mongoose";
const medicineSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    dosage: {
        type: String,
        required: true,
    },
    frequency: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },

})
const prescriptionSchema = new Schema({
    doctorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    diagonosis: {
        type: String,
        required: true,
    },
    medicines: {
        type: [medicineSchema],
        required: true,
    },
    labtest: {
        type: String,
    },

}, {timestamps: true,})
export const Prescription = mongoose.model("Prescription", prescriptionSchema);