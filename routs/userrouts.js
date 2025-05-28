const express=require('express');
const routs=express.Router();
const {ragister,login,adddevice}=require('../controllers/usercontroller')
const {addproduct,viewallproduct,productupdate,productdelete}=require('../controllers/productcontroller');
const verifyToken = require('../confige/auth');
const passport=require('passport')

routs.post('/ragister',ragister)
routs.post('/login',login)
// routs.post('/addproduct',passport.authenticate("seller",{failureRedirect: "/api/user/failauth"}),addproduct)
routs.post('/addproduct',verifyToken,addproduct);
routs.post('/viewallproduct',viewallproduct)
routs.post('/productupdate/:id',productupdate)
routs.post('/productdelete/:id',productdelete)
// routs.post('/adddevice',adddevice)

// routs.get('/failauth',(req,res)=>{
//     res.status(400).json({msg:"invalid token",status:0})
// })
module.exports=routs; 