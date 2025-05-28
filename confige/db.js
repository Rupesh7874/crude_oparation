const mongoose=require('mongoose');

const conectdb=async(req,res)=>{
    try {
        mongoose.connect("mongodb://127.0.0.1/test2");
        console.log("db conected");
        
    } catch (error) {
        console.log("db not conected");
        
    }
}

module.exports=conectdb;