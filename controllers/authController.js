import codModel from "../models/codModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import { comparePassword, hashPassword } from './../helpers/authHelper.js';
import JWT from 'jsonwebtoken'
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
        // *? Validation
        if (!name) {
            return res.send({ message: "Name is Required" })
        }
        if (!email) {
            return res.send({ message: "email is Required" })
        }
        if (!password) {
            return res.send({ message: "Password is Required" })
        }
        if (!phone) {
            return res.send({ message: "Phone is Required" })
        }
        if (!address) {
            return res.send({ message: "address is Required" })
        }
        if (!answer) {
            return res.send({ message: "answer is Required" })
        }
        // ! Check USER
        const exisitingUser = await userModel.findOne({ email })
        // !Check exiting user
        if (exisitingUser) {
            return res.status(200).send({
                success: true,
                message: "Already Register plese login"
            })
        }
        //  ?Register USER
        const hashedPassword = await hashPassword(password)
        // ?*Save password
        const user = new userModel({ name, email, phone, address, answer, password: hashedPassword }).save()

        res.status(201).send({
            success: true,
            meassage: 'User Register sucesssfull',
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            meassage: "Error registation",
            error
        })
    }
}
// ! Forgot password controller
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newpassword } = req.body
        if (!email) {
            res.status(400).send({ meassage: 'email is required' })
        }
        if (!answer) {
            res.status(400).send({ meassage: 'answer is required is required' })
        }
        if (!newpassword) {
            res.status(400).send({ meassage: 'New password is required' })
        }
        // ? chech email or password
        const user = await userModel.findOne({ email, answer })
        // !Validation
        if (!user) {
            return res.status(400).send({
                success: false,
                meassage: 'wrong email or password'
            })
        }
        const hashed = await hashPassword(newpassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            meassage: 'passsword reset successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            meassage: 'something went wrong'
            , error
        })
    }
}

// ! POST login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        // * Validation ADD
        // if (!email || !password) {
        if (!email && !password) {

            return res.status(404).send({
                success: false,
                meassage: "Invalid email or password"
            })
        }
        // CHECK User present or not
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                meassage: "Email is not registered"
            })
        }

        // ? Compare the password 200 is ok status //
        const match = await comparePassword(password, user.password)
        if (!user.password) {
            return res.status(200).send({
                success: 'false',
                meassage: " Invalide password "
            })
        }
        // *! Token create 
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            meassage: "Login sucessfully",
            //send data to user
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            meassage: 'Error in login',
            error,
        })
    }
};

export const testController = (req, res) => {
    res.send("protected")
}

// !Update profile contorller

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body
        const user = await userModel.findById(req.user._id)
        // ?Check pasword
        if (password && password.length < 6) {
            return res.json({ error: "Password is required" })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: password || user.password,
            phone: phone || user.phone,
            address: address || user.address

        }, { new: true })
        res.status(200).send({
            success: true,
            meassage: "Profileupdated sucessfully"
            ,
            updatedUser
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            meassage: "profile cnnot de update"
            ,
            error
        })
    }
}

// Orders
export const getOrdercontroller = async (req, res) => {

    try {

        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
        // res.json(orders)
        res.status(200).send({
            success: true,
            meassage: "Get order sucessfully",
            orders 
        })
    } catch (error) {
        console.log(error);
        res.status(404).send({
            success: false,
            meassage: "Something went wrong",
            error

        })
    }
}

// Get all order
export const getAllOrdercontroller = async (req, res) => {

    try {

        const orders = await orderModel.find({ }).populate("products", "-photo").populate("buyer", "name").sort({createdAt:"-1"})

        // res.json(orders)
        res.status(200).send({
            success: true,
            meassage: "Get order sucessfully",
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(404).send({
            success: false,
            meassage: "Something went wrong",
            error

        })
    }
}


export const getCodOrderController = async (req, res) => {
    try {
        const codOrder = await codModel.findById({ buyer: req.user._id }).populate("product", "-photo").populate("buyer", "name")
        res.json(codOrder);
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            meassage: "Something went wrong",
            error
        })
    }
}


// Order status

export const orderStatusController=async(req,res)=>{
    try {
        const {orderId}=req.params
        const {status}=req.body

        const orders= await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(orders)
        res.status(400).send({
            success:true,
            meassage:"Order updated Successfully",
            status,
            orderId,
            orders
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            meassage:"Error while updating error",
            error
        })
    }
}

