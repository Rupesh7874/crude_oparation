const mongoose=require('mongoose');


const productschema=mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
     productprice:{
        type:String,
        required:true
    },
     productcolour:{
        type:String,
        required:true 
     },
     productquantity:{
         type:String,
        required:true 
     }
},{timestamps:true});

const Product=mongoose.model("productmodel",productschema);

module.exports=Product 