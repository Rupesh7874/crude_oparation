const productmodel = require('../models/productmodel');
const verifyToken =require('../confige/auth');

exports.addproduct = async (req, res) => {
    try {
        const { productname, productprice, productcolour, productquantity } = req.body;

        const product = new productmodel({
            productname,
            productprice,
            productcolour,
            productquantity
        })
        const productdata = await product.save();
        if (productdata) {
            res.status(200).json({ msg: "product add sucessfully", status: 1, productdata })
        } else {
            res.status(400).json({ msg: "product not add", status: 0 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "error in addproduct" })
    }
}

exports.viewallproduct = async (req, res) => {
    try {
        const allproduct = await productmodel.find();
        if (!allproduct) {
            res.status(400).json({ msg: "product not get", status: 0 })
        } else {
            res.status(200).json({ msg: "all product get sucessfully", status: 1, allproduct })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "error in addproduct" })
    }
}
exports.productupdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { productname, productprice, productcolour, productquantity } = req.body;

        const newproduct = {
            productname: productname,
            productprice: productprice,
            productcolour: productcolour,
            productquantity: productquantity
        }

        const updateproduct = await productmodel.findByIdAndUpdate(id, newproduct, { new: true });
        if (updateproduct) {
            res.status(200).json({ msg: "product update sucessfully", status: 1, updateproduct })
        } else {
            res.status(400).json({ msg: "product update sucessfully", status: 0 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "error in addproduct" })
    }
}
exports.productdelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteproduct = await productmodel.findByIdAndDelete(id, { new: true })
        if (deleteproduct) {
            res.status(200).json({ msg: "product delete sucessfullt", status: 1, deleteproduct })
        } else {
            res.status(400).json({ msg: "product not delete ", status: 0 })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "error in addproduct" })
    }
}