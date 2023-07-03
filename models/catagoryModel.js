import mongoose, { Schema } from "mongoose";


const catagorySchema= new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true,
    },
    slug:{
        type:String,
        lowercase:true
    }
})
export default mongoose.model("Catagory",catagorySchema);
