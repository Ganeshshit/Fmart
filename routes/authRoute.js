import express from "express";
import { forgotPasswordController, getAllOrdercontroller, getCodOrderController, getOrdercontroller,  loginController, registerController, updateProfileController } from '../controllers/authController.js'
import { testController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
// route object


const router = express.Router()


// ?routing 


// !Register || METHOD GET

router.post('/register', registerController)



//  ! LOgin || METHOD POST 

router.post('/login', loginController)

// ?Forgot password*
router.post('/forgot-password',forgotPasswordController)

// ?!Protect router auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok:true});
});

// ?!Protect Admin router auth

router.get('/admin-auth', requireSignIn, isAdmin ,(req, res) => {
    res.status(200).send({ok:true});
});

//!Order
router.get('/orders',requireSignIn,getOrdercontroller)
router.get('/all-orders',requireSignIn,isAdmin,getAllOrdercontroller)
router.get('/cod',requireSignIn,getCodOrderController)

// *Update profile
router.put('/profile',requireSignIn,updateProfileController)

router.put('/oder-status/:orderId',requireSignIn,isAdmin,)

// *@ Test routes 
router.get("/test", requireSignIn, isAdmin, testController)

export default router
