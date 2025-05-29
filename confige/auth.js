const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token.split("Bearer ")[1], 'exam3');

        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    } catch (error) {
        console.log(error);''
        res.status(401).json({ error: 'Invalid token' });
    }
};

function checkSellerRole (req, res, next) {
    if (req.role !== 'seller') {
        return res.status(403).json({ msg: 'Access denied: Only sellers allowed' });
    }
    next();
};

// app.use(session({
//   name:'codecube',
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//      maxAge: 60 * 1000 * 100
//   }
// }));

// app.use(passport.initialize());
// app.use(passport.session()); 
module.exports = {verifyToken,checkSellerRole};