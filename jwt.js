const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    // first check request headers has "Authorization" key or not
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error: 'Token not found'});

    // jab bhi hum token ko bhejte hai, toh hum log kya krte hai jo bhi hai request hai uske headers mein jaate hai and whan pe "Authorization" ko pass krte hai ==> token ko pass krte hai uske ander
    // extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1];

    if(!token){ // agar token nhi mila
        return res.status(401).json({error: 'Unauthorized'});
    }

    // agar token mil gya toh ab verify krenge usko
    try{
        // Verify the jwt token
        // if this verify() successfully verifies the token it return the payload => woii payload jo humne use kiya tha iss token ko banane mein
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

        // ab hum chahte hai iss payload ko aaage server mein pass krna => mtlb ki yeh middleware jiss route par yeh middleware use ho rha hoga => usko request mein bhejenge yeh payload
        // Attach user information to the request object
        req.userPayload = decodedPayload;
        // basically hum kya krte hai jo request jaa rha hai route ke pass usme yeh extra key add krr dete hai "userPayload" ==> koi bhi name de skte hai isko

        next();
    }
    catch(err){  // agar token verify nhi hua
        console.log(err);
        res.status(401).json({error: "Invalid Token"})
    }
}


// Function to generate JWT Token
const generateJwtToken = (userData) => {
    // generate a new token using user data
    return jwt.sign({userData}, process.env.JWT_SECRET, {expiresIn: 30000}); // kabhi kbhi yeh expresIn wala kaam nhi krta because "userData" ko directly likh dete hai toh wo usse as string consider krr leta hai h isiliye usse hamesha {userData} dena hai 
}

module.exports = {jwtAuthMiddleware,generateJwtToken};