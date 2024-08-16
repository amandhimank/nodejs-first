const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    // extract the token from the request header
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: 'unauthorized'});
    try{
        // Verify the jwt token => if token is successfully verified ==> it returns payload[wo wala payload jo use kiya tha iss token wo create krne mein]
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // we want to send this payload int request to the route jispe yeh middleware use ho rha hoga [Attach information to the request object]
        req.userPayload = decoded;
        next();
    }
    catch(err){
        console.error(err);
        res.status(401).json({"error": "invalid token"});
    }
}

// Function to generate JWT Token
const generateToken = (userData) => {
    // generate a new token using user data
    return jwt.sign(userData, 123);
}

module.exports = {jwtAuthMiddleware, generateToken};