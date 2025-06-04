const express=require('express');
const routs=express.Router();
const {ragister,login,adddevice,getalluser}=require('../controllers/usercontroller')
const {addproduct,viewallproduct,productupdate,productdelete}=require('../controllers/productcontroller');
const {verifyToken,checkSellerRole} = require('../confige/auth');
const passport=require('passport')

routs.post('/ragister',ragister)
routs.post('/login',login)
routs.post('/addproduct',verifyToken,checkSellerRole,addproduct);
routs.get('/viewallproduct',verifyToken,viewallproduct);
routs.post('/productupdate/:id',verifyToken,productupdate);
routs.post('/productdelete/:id',verifyToken,productdelete);
routs.get('/getalluser',getalluser);
module.exports=routs; 