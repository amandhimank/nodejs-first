const express = require('express');
const router = express.Router();
const person = require('../models/person');
const {jwtAuthMiddleware,generateJwtToken} = require('./../jwt');

// Add to a person to the database
router.post('/signup', async (req, res) => {
    try{
        const data = req.body;
        const newPerson = new person(data);
        const savedData = await newPerson.save();
        console.log("sucessfully person added");

        // creating payload to generate JWT token
        const payload = {
            id: savedData.id, // _id ko "id" se hii access krte hai [_id => id jo harr document ko milti hai automatically insertion ke baad]
            username: savedData.username,
            email: savedData.email
        }
        console.log(JSON.stringify(payload)); // payload ko print krke dekh rhe
        const jwtToken = generateJwtToken(payload);
        console.log('Token is ', jwtToken);

        res.status(200).json({response: savedData, token: jwtToken});
        // res.status(200).json({response: savedData});
    }
    catch(err){
        res.status(500).json({error: "Inernal Server Error"}); 
    }
});


// login route
router.post('/login', async (req, res) => {
    try{
        // Extract username and password from the request body
        const {username,password} = req.body;

        // find user by username
        const user = await person.findOne({username: username});

        // If user does not exist or password does not match, return error  
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: "Invalid username or password"});
        }

        // generate token
        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateJwtToken(payload);

        // return token as response
        res.status(200).json({token: token})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
})


// fetch persons data from the database
router.get('/', jwtAuthMiddleware, async (req, res) => {
    try{
        const data = await person.find();
        console.log('data fetched');
        res.status(200).json(data);
    }
    catch(err){
        res.status(500).json({error: "Internal Server Error"});
    }
});

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.userPayload;
        console.log("User Data: ", userData);

        // userdata ke ander id bhi present h toh uske through user ka pura data nikal skte hai database se
        const userId = userData.id;
        const user = await person.findById(userId);
        
        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});

router.get('/:workType', async (req, res) => {
    try{
        const workType = req.params.workType;
        if(workType === "chef" || workType === "waiter" || workType === "manager"){
            const data = await person.find({work: workType});
            res.status(200).json(data);
        }
        else{
            res.status(404).json({error: "Invalid workType"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});	
    }
})

// updating data
router.put('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const updatedData = req.body;
        const response = await person.findByIdAndUpdate(id, updatedData, {
            new: true, // return the updated document
            runValidators: true // run validation on the document
        });
        if(!response){
            res.status(404).json({error: "person not found"});
        }
        console.log('data updated');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});

// delete data
router.delete('/:id', async (req, res) => {
    try{
        const personId = req.params.id;
        const response = await person.findByIdAndDelete(personId);
        if(!response){
            res.status(404).json({error: "person not found"});
        }
        console.log('data deleted successfully');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});

// Profile Route


module.exports = router;

