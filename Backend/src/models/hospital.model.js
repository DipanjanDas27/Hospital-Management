import mongoose, { Schema } from "mongoose";
const hospitalDocumentSchema = new Schema({
    registrationcertificate: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    tradelicense: {
        type: String,
        required: true,
    },
    NOC: {
        type: String,
    }
})
const hospitalSchema = new Schema({
    hospitalname: {
        type: String,
        required: true,
        index: true,
    },
    location: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        maxlength: 10,
        required: true,

    },
    email: {
        type: String,
        required: true,

    },
    hospitalpicture: {
        type: String,
        required: true
    },
    verificationdocs: {
        type: hospitalDocumentSchema,
        required:true,
    },
    department: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Department"

            }
        ]
    }
}, { timestamps: true })

export const Hospital = mongoose.model("Hospital", hospitalSchema)