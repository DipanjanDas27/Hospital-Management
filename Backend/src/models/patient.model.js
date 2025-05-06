import mongoose, { Schema } from "mongoose";
const medicineSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    dosage:{
        type:String,
        required:true,
    },
    frequency:{
        type:String,
        required:true,
    },
    duration:{
        type:String,
        required:true,
    },
    
})
const prescriptionSchema= new Schema({
    doctorID:{
        type:mongoose.Schema.type.ObjectID,
        ref:"Doctor",
        required:true,
    },
    patientID:{
        type:mongoose.Schema.type.ObjectID,
        ref:"Patient",
        required:true,
    },
    diagonosis:{
        type:String,
        required:true,
    },
    medicines:{
        type:[medicineSchema],
        required:true,
    },
    labtest:{
        type:String,
    },
    medicalhistory:{
        type:String,
    },
    picture:{
        type:String,
        required:true,
    }
})
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
        enum: ["Male", "Female", "Others"]
    },
    age: {
        type: Number,
        required: true,
    },
    guardianName: {
        type: String,
        required: function () {
            return this.age < 18;
        },
        trim: true
    },
    prescription:{
        type:prescriptionSchema,
        required:true,
    },
    token:{
        type:String,
        required:true,
    },
    profilepicture: {
        type: String,
        required: true,
    }
},{timestamps:true})

export const Patient = mongoose.model("Patient", patientSchema)