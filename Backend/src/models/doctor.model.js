import mongoose, { Schema } from "mongoose";
const doctorDocumentSchema = new Schema({
    adhaar: {
        type: String,
        required: true
    },
    medicaldegree: {
        type: String,
        required: true,
    },
    mcismccertificate: {
        type: String,
        required: true,
    },
    profilepicture: {
        type: String,
        required: true,
    },
})
const timeSchema = new Schema({
    day: {
        type: String,
        required: true,
        trim: true,
    },
    time: {
        type: String,
        required: true,
        trim: true
    }
})
const doctorSchema = new Schema({
    doctorname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    doctorusername: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        maxlength: 15,
        minlength: 8,
        required: true,
        trim: true,

    },
    phonenumber: {
        type: Number,
        required: true,
        maxlength: 10,
    },
    sex: {
        type: String,
        enum: ["Male", "Female", "Others"]
    },
    age: {
        type: Number,
        required: true,
    },
    verificationdocument: {
        type: doctorDocumentSchema,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    shift: {
        type: [timeSchema],
        required: true,
    },
    department: {
        type: mongoose.Schema.type.ObjectId,
        ref: "Department",
        required: true,
    },

    hospitals: {
        type: [
            {
                type: mongoose.Schema.type.ObjectId,
                ref: "Hospital"
            }
        ],
        required: true,
    },
    patientlist: {
        type: [{
            type: mongoose.Schema.type.ObjectId,
            ref: "Patient"
        }]
    }


}, { timestamps: true })

export const Doctor = mongoose.model("Doctor", doctorSchema)