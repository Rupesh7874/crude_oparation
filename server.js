const express=require('express');
const app=express();
const conectdb=require('./confige/db');
const passport=require('passport')
var session = require('express-session');
const passportjwt=require('./confige/auth');

conectdb();

app.use(express.json());
app.use(express.urlencoded({extends:true}))


app.use(session({
  name:'codecube',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
     maxAge: 60 * 1000 * 100
  }
}));

app.use(passport.initialize());
app.use(passport.session()); 

app.use('/api/user',require('./routs/userrouts'))

const port=8888;

app.listen(port,(err)=>{
    console.log("server running sucessfully on port",port);
    
})