const mongoose = require('mongoose');
require('dotenv').config(); // isse iss file ko pata chlega .env file ke baare mein

// Define MongoDB connection URL
const mongodbUrl = process.env.MONGODB_URL_LOCAL; // isse hamare local database mein save hoga jo save krenge data
// const mongodbUrl = process.env.MONGODB_URL;  // isse jitne bhi data save krenge wo online wla atlas pe jo databse banaya hai uspe jayega

// set up mongodb connection ==> it initializes the connnection 
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// get the default connection object
const db = mongoose.connection;

db.on('connected', () => {
    console.log("successfully connected to mongodb");
})
db.on('disconnected', () => {
    console.log("successfully disconnected to mongodb");
})
db.on('error', () => {
    console.log("error occurred");
})

module.exports = db;