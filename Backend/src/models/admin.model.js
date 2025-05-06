import mongoose, { Schema } from "mongoose";
const adminDocumentSchema= new Schema({
    aadhar:{
        type:String,
        required:true,
    },
    hospitalId:{
        type:String,
        required:true,
    },
    profilepicture: {
        type: String,
        required: true,
    },
    authletter:{
        type:String,
    },
    appointmentletter:{
        type:String,
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
    verificationdocs:{
        type:adminDocumentSchema,
        required:true,
    },
},{timestamps:true})

export const Admin = mongoose.model("Admin", adminSchema)