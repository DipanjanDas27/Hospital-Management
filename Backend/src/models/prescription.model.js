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
    doctordetails: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    patientdetails: {
        type: mongoose.Schema.Types.Mixed,
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