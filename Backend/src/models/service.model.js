import mongoose from 'mongoose';
const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },

},{timestamps: true,});
export const Service = mongoose.model('Service', serviceSchema);