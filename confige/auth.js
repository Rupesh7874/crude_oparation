// const passport=require('passport');
// var JwtStrategy = require('passport-jwt').Strategy;
// var ExtractJwt = require('passport-jwt').ExtractJwt;
// const usermodel= require('../models/usermodel')

// var opts1 = {
//      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
//      secretOrKey :'exam1'  
// }  

// var opts2 = {
//      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
//      secretOrKey :'exam2'  
// } 

// var opts3 = {
//      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
//      secretOrKey :'exam3'  
// } 

// passport.use('admin', new JwtStrategy(opts1, async function(rj, done) {
//     const user = await usermodel.findById(rj.data._id);
//     if (user && user.roles === 'admin') {
//      return done(null, user);   
//     }
//     else{
//         return done(null, false);
//     }
// }));

// passport.use('buyer', new JwtStrategy(opts2, async function(rj1, done) {
//     const user = await usermodel.findById(rj1.data._id);
//     if (user && user.roles === 'buyer') {
//      return done(null, user);   
//     }
//     else{
//         return done(null, false);
//     }
// }));

// passport.use('seller', new JwtStrategy(opts3, async function(rj2, done) {
//     const user = await usermodel.findById(rj2.data._id);
//     console.log(user);
    
//     if (user.roles === 'seller') {
//      return done(null, user);   
//     }
//     else{
//         return done(null, false);
//     }
// })); 

// passport.serializeUser(function(user, done) {
//    return done(null, user); 
// });


// passport.deserializeUser(async function(id, done) {
//    const user = await usermodel.findById(id);
//     if (id) {
//      return done(null, user);   
//     }
//     else{
//         return done(null, false);
//     }
// });  

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
const token = req.header('Authorization');
// console.log(token);

if (!token) return res.status(401).json({ error: 'Access denied' });
try {
        const decoded = jwt.verify(token.split("Bearer ")[1], 'exam3');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Invalid token' });
    }
 };

module.exports = verifyToken;