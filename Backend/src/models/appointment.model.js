import mongoose from 'mongoose';
const apointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    appointmentDate: {
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
    medicalhistory:{
        type:String,
    },
    uniquecode: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending',
    },
},
    { timestamps: true, });
export const Appointment = mongoose.model('Appointment', apointmentSchema);
