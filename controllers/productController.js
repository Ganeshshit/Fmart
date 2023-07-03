import slugify from "slugify"
import productsModel from "../models/productsModel.js"
import catagoryModel from '../models/catagoryModel.js'
import mongoose from "mongoose"

import fs from 'fs'
import braintree from "braintree"
import orderModel from "../models/orderModel.js"


// Payment getway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "your_merchant_id",
    publicKey: "your_public_key",
    privateKey: "your_private_key",
});

export const createProductController = async (req, res) => {
    const ObjectId = mongoose.Types.ObjectId
    try {
        const { name, slug, description, price, catagory, quantity, shipping } = req.fields
        const { photo } = req.files
        // !validation 
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" })
            case !description:
                return res.status(500).send({ error: "Description is required" })
            case !price:
                return res.status(500).send({ error: "Price is required" })
            case !catagory:
                return res.status(500).send({ error: "Catgory is required" })
            case !quantity:
                return res.status(500).send({ error: "Quantity is required" })
            case !shipping:
                res.status(500).send({ error: "Shiping is required" })
            case photo && photo.size > 100000:
                return res.status(500).send({ error: "photo  is required" })
        }
        const products = new productsModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            // products.photo.data = fcs.readdirSync(photo.path)
            products.photo.data = fs.readFileSync(photo.path)

            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            meassage: 'product created ',
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            meassage: "Error in creating product"
        })
    }
}
// ! Update product controller


export const updateProductController = async (req, res) => {
    const ObjectId = mongoose.Types.ObjectId
    try {
        const { name, slug, description, price, catagory, quantity, shipping } = req.fields
        const { photo } = req.files
        // !validation 
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is required" })
            case !description:
                return res.status(500).send({ error: "Description is required" })
            case !price:
                return res.status(500).send({ error: "Price is required" })
            case !catagory:
                return res.status(500).send({ error: "Catgory is required" })
            case !quantity:
                return res.status(500).send({ error: "Quantity is required" })
            // case !shipping:
            // res.status(500).send({ error: "Shiping is required" })
            case photo && photo.size > 100000:
                return res.status(500).send({ error: "photo  is required" })
        }
        const products = new productsModel({ ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            // products.photo.data = fcs.readdirSync(photo.path)
            products.photo.data = fs.readFileSync(photo.path)

            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            meassage: 'product created ',
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            meassage: "Error in creating product"
        })
    }
}


// Get all product
export const getProductController = async (req, res) => {

    try {
        const products = await productsModel.find({}).populate("catagory").select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            meassage: "All product",
            products,
            total: products.length
        })

    } catch (error) {
        console.log(error)
        res.status(500).send
            ({
                success: false,
                meassage: "Product didnot get",
                error
            })
    }
}

// Get single product
export const getSingleProductController = async (req, res) => {

    try {
        const { product } = await productsModel.findOne({ slug: req.params.slug }).select("-photo").populate("catagory")
        console.log(product)
        res.status(200).send({
            success: true,
            meassage: "Your product is",
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            meassage: "Can not acess the product due to bellow error",
            error
        })
    }
}




// Get photo of product

export const productPhotoController = async (req, res) => {

    try {
        const product = await productsModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set("content-type", product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            meassage: "photo is not found",
            error
        })
    }

}


export const deleteProductController = async (req, res) => {
    try {
        const product = await productsModel.findByIdAndDelete(req.params.pid).select("-photo")
        if (product) {
            res.status(200).send({
                success: true,
                meassage: "Product deleted sucessfully",
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            meassage: "Product cannot be deleted",
            error
        })
    }

}


// Product count controller
export const productCountController = async (req, res) => {

    try {
        const total = await productsModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            meassage: "Total product are",
            total,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            meassage: "Product is not found",
            error
        })
    }


}

// Product catagory controller


export const productCatagoryController = async (req, res) => {
    try {
        const catagory = await catagoryModel.findOne({ slug: req.params.slug })
        const product = await productsModel.find({ catagory }).populate("catagory")
        res.status(200).send({
            success: true,
            meassage: "product catagory are get successfully",
            catagory,
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).sen({
            success: false,
            meassage: "Didnot get product catagory",
            error
        })
    }
}

// Flter
export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0) {
            args.catagory = checked
        }
        if (radio.length > 0) {
            args.price = { $get: radio[0], $lte: radio[1] }

        }
        const products = await productsModel.find(args)
        res.status(200).send({
            success: true,
            products

        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            meassage: "Error while filltering product",
            error
        })
    }
}



//! Product List controller 
export const productListController = async (req, res) => {
    try {
        const perPage = 6
        const page = req.params.page ? req.params.page : 1
        const products = await productsModel.find({}).select("-photo").skip((page - 1) + perPage).limit(perPage).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            products

        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            meassage: "Something went wrong",
            error
        })
    }
}



// Search product

// search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const resutls = await productsModel
            .find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                ],
            })
            .select("-photo");
        res.json(resutls);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error In Search Product API",
            error,
        });
    }
};
// !Payment getway
// ?Token


export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.send(response);
            }
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            meassage: "something went wrong",
            error
        })
    }
}

// PAYment
export const barintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body
        let total = 0;
        cart.map((i) => { total += i.price })
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id
                    }).save()
                    res.json({ ok: true })
                }
                else {
                    res.status(500).send(error)
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
}
