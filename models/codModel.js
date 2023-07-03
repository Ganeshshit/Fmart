import mongoose, { Schema } from "mongoose";
const codorderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.ObjectId,
        ref: 'products'
    }],
    byer: {
        type: mongoose.ObjectId,
        ref: 'Users'
    },
    status: {
        type: String,
        default: "Not processed",
        enum: ["Not process", "processing", "Shipped", "deliver", "cancel"]
    },
    address: {
        type: String,
        require: true
    }
}, { timestamps: true }
)
export default mongoose.model("codOrder", codorderSchema);
