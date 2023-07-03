import express from "express";
import { requireSignIn, isAdmin } from './../middlewares/authMiddleware.js'
import { categoryControlller, createCatagoryController, deleteCatagoryController, singleCategoryController, updateCategoryController } from "../controllers/caegoryController.js";

const router = express.Router()



// Routes

router.post('/create-catagory', requireSignIn, isAdmin, createCatagoryController)

router.put(
    "/update-category/:id",
    requireSignIn,
    isAdmin,
    updateCategoryController
);
// Get all catagory
router.get("/get-category", categoryControlller);

// Get single catagory
//single category
router.get("/single-category/:slug", singleCategoryController);
// Delete catagory
router.delete(
    "/delete-catagory/:id",
    requireSignIn,
    isAdmin,
    deleteCatagoryController
)
export default router

