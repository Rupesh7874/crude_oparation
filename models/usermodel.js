const mongoose=require('mongoose');
const devicesmodel = require('../models/device');


const userschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true,
        unique: true
    },
     roles: {
     type: String,
     enum: ['admin', 'seller', 'buyer'],
     default: 'admin'
    },
     password:{
        type:String,
        required:true
    },
    tokens: [
    {
        type: String,
        required: true
    },
  ],
     age:{
        type:String,
        required:true
    },
     gender:{
        type:String,
        required:true
    },
    //  devices:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"devicesmodel"
    // },
},{timestamps:true});


const User=mongoose.model("adminmodel",userschema);

module.exports=User 