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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },

    hospitals: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hospital"
            }
        ],
        required: true,
    },
    patientlist: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient"
        }]
    },
    refreshtoken: {
        type: String
    }
}, { timestamps: true })

doctorSchema.pre("save", async function (next) {
    if (this.isModified("password"))
        this.password = await brcypt.hash(this.password, 10)
    next()
})

doctorSchema.methods.ispasswordcorrect = async function (password) {
    return await brcypt.compare(password, this.password)
}

doctorSchema.methods.generateaccesstoken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        adminname: this.doctorname,
        adminusername: this.doctorusername

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

export const Doctor = mongoose.model("Doctor", doctorSchema)