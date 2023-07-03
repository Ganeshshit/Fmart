import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { barintreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCatagoryController,  productCountController, productFiltersController, productListController, productPhotoController, searchProductController, updateProductController } from "../controllers/productController.js";
// import formidable from ExpressFormidable
import formidable from "express-formidable";
const router = express.Router()


// Routes

router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

// !Update product routes
router.post('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)




// Get all product
router.get('/get-product', getProductController)

// Get single product

router.get('/get-product/:slug', getSingleProductController)


// get photo

router.get("/product-photo/:pid", productPhotoController);

// delete product
router.get("/delete-product/:pid", deleteProductController);


// Product count 
router.get("/product-count", productCountController);



// Product catagory 

router.get("/product-catagory/:slug", productCatagoryController);

//* Filtter product
router.post('/product-filters',productFiltersController)
// !Product per page
router.get('product-list/:page',productListController)


// Searching product
router.get('/search/:keyword',searchProductController)


// pAyment get

router.get('/braintree/token',braintreeTokenController)

// Payment 
router.post('/braintree/payment',requireSignIn,barintreePaymentController)

export default router
