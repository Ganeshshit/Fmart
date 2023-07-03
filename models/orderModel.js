import mongoose, { Schema } from "mongoose";
const orderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.ObjectId,
        ref: 'products'
    }],
    //payment: {},
    byer: {
        type: mongoose.ObjectId,
        ref: 'Users'
    },
    status: {
        type: String,
        default: "Not processed",
        enum: ["Not process", "processing", "Shipped", "deliver", "cancel"]
    }

}, { timestamps: true }
)
export default mongoose.model("order", orderSchema);
