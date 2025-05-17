import mongoose, { Schema } from "mongoose";
import brcypt from "bcrypt";
import jwt from "jasonwebtoken";
const adminDocumentSchema = new Schema({
    aadhar: {
        type: String,
        required: true,
    },
    hospitalId: {
        type: String,
        required: true,
    },
    profilepicture: {
        type: String,
        required: true,
    },
    authletter: {
        type: String,
    },
    appointmentletter: {
        type: String,
    },

})
const adminSchema = new Schema({
    adminname: {
        type: String,
        required: true,
        trim: true,

    },
    adminusername: {
        type: String,
        required: true,
        unique: true,
        trim: true,
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
    verificationdocs: {
        type: adminDocumentSchema,
        required: true,
    },
    refreshtoken: {
        type: String
    }
}, { timestamps: true })

adminSchema.pre("save", async function (next) {
    if (this.isModified("password"))
        this.password = await brcypt.hash(this.password, 10)
    next()
})

adminSchema.methods.ispasswordcorrect = async function (password) {
    return await brcypt.compare(password, this.password)
}

adminSchema.methods.generateaccesstoken = function () {
   return jwt.sign({
        _id: this._id,
        email: this.email,
        adminname: this.adminname,
        adminusername: this.adminusername

    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

    adminSchema.methods.generaterefreshtoken = function () { 
        return jwt.sign({
            _id: this._id,
            
    
        },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    }

    export const Admin = mongoose.model("Admin", adminSchema)