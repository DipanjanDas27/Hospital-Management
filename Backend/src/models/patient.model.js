import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const patientSchema = new Schema({
    patientname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    patientusername: {
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
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    guardianName: {
        type: String,
        trim: true,
        required:true,
    },
    refreshtoken:{
        type:String,
    },
    profilepicture: {
        type: String,
    },
},{timestamps:true})


patientSchema.pre("save", async function (next) {
    if (this.isModified("password"))
        this.password = await bcrypt.hash(this.password, 10)
    next()
})

patientSchema.methods.ispasswordcorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

patientSchema.methods.generateaccesstoken = function () {
   return jwt.sign({
        _id: this._id,
        email: this.email,
        patientname: this.patientname,
        patientusername: this.patientusername,
        role: "patient"
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

    patientSchema.methods.generaterefreshtoken = function () { 
        return jwt.sign({
            _id: this._id,

        },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    }

export const Patient = mongoose.model("Patient", patientSchema)