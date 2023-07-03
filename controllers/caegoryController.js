import slugify from "slugify"
import catagoryModel from "../models/catagoryModel.js"

export const createCatagoryController = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(401).send({ message: "name is require" })
        }
        const existingCatagory = await catagoryModel.findOne({ name })
        if (existingCatagory) {
            return res.status(200).send({
                success: true,
                message: "Catagory already exists"
            })
        }
        const catagory = await new catagoryModel({ name, slug: slugify(name) }).save()
        res.status(201).send({
            success: true,
            message: "new catagory created",
            catagory
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Errror in catagory'

        })
    }

}
// Update catagory
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await catagoryModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true }
        );
        res.status(200).send({
            success: true,
            messsage: "Category Updated Successfully",
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating category",
        });
    }
};


// List all cata gory
export const categoryControlller = async (req, res) => {
    try {
        const category = await catagoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All Categories List",
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting all categories",
        });
    }
};
//   
export const singleCategoryController = async (req, res) => {
    try {
        const category = await catagoryModel.findOne({ slug: req.params.slug });
        res.status(200).send({
            success: true,
            message: "Get SIngle Category SUccessfully",
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While getting Single Category",
        });
    }
};
// Delete catagory
export const deleteCatagoryController =async(req,res)=>{
    try {
        const {id}=req.params;
        await catagoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"Delete catagory successfully"
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Delete Not be possible",
            error
        })
    }
}

