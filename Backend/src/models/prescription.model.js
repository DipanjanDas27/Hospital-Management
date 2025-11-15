import mongoose from "mongoose";
const medicineSchema = new mongoose.Schema({
    medicinename: {
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
const prescriptionSchema = new mongoose.Schema({
    appointmentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true,
    },
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
        type: mongoose.Schema.Types.ObjectId,
        ref:"Labtest",
    },

}, {timestamps: true,})
export const Prescription = mongoose.model("Prescription", prescriptionSchema);