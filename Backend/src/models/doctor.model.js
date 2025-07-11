import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const doctorDocumentSchema = new Schema({
    aadhar: {
        type: String,
        required: true
    },
    medicaldegree: {
        type: String,
        required: true,
    },
    medicallicense: {
        type: String,
        required: true,
    },
    profilepicture: {
        type: String,
        required: true,
    },
},{_id: false })
const timeSchema = new Schema({
    day: {
        type: String,
        required: true,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday","Monday-Saturday"],
    },
    starttime: {
        type: String,
        required: true,
        trim: true
    },
    endtime: {
        type: String,
        required: true,
        trim: true
    },
    patientslot: {
        type: Number,
        required: true,
    }  
},{ _id: false })
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
        type: String,
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
        type: String,
        required: true,
    },

    hospitalname:{
        type: String,
        required: true,
    },
    refreshtoken: {
        type: String
    }
}, { timestamps: true })

doctorSchema.pre("save", async function (next) {
    if (this.isModified("password"))
        this.password = await bcrypt.hash(this.password, 10)
    next()
})

doctorSchema.methods.ispasswordcorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

doctorSchema.methods.generateaccesstoken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        doctorname: this.doctorname,
        doctorusername: this.doctorusername,
        role: "doctor"

    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

doctorSchema.methods.generaterefreshtoken = function () {
    return jwt.sign({
        _id: this._id,


    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Doctor = mongoose.model("Doctor", doctorSchema)