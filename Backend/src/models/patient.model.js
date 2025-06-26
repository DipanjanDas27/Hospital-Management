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
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true,
    },
    patientID:{
        type:mongoose.Schema.Types.ObjectId,
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
        trim: true,
        required:true,
    },
    prescription:{
        type:prescriptionSchema,
        
    },
    refreshtoken:{
        type:String,
    },
    profilepicture: {
        type: String,
        required: true,
    },
},{timestamps:true})


patientSchema.pre("save", async function (next) {
    if (this.isModified("password"))
        this.password = await brcypt.hash(this.password, 10)
    next()
})

patientSchema.methods.ispasswordcorrect = async function (password) {
    return await brcypt.compare(password, this.password)
}

patientSchema.methods.generateaccesstoken = function () {
   return jwt.sign({
        _id: this._id,
        email: this.email,
        patientname: this.patientname,
        patientusername: this.patientusername
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