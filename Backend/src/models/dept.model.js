import mongoose, { Schema } from "mongoose"
 const deptSchema = new Schema({
    deptname:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        trim:true,
    }
 })
 export const Department= mongoose.model("Department",deptSchema) 