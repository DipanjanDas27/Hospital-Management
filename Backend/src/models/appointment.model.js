import mongoose from 'mongoose';
const appointmentSchema = new mongoose.Schema({
    patientdetails: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Patient',
        required: true,
    },
    doctordetails: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Doctor',
        required: true,
    },
    appointmentdate: {
        type: Date,
        required: true,
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
        enum: [ 'Confirmed', 'Cancelled', 'Completed'],
    },
    deleteafter: {
        type: Date,
        default: null,
        index: { expireAfterSeconds: 0 }
    }
},
    { timestamps: true, });


appointmentSchema.index(
    { "doctordetails.doctorusername": 1, appointmentdate: 1, appointmenttime: 1 },
    { unique: true }
);
export const Appointment = mongoose.model('Appointment', appointmentSchema);
