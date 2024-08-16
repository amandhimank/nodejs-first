const express = require('express');
const router = express.Router();
const person = require('../models/person');

// Add to a person to the database
router.post('/', async (req, res) => {
    try{
        const data = req.body;
        const newPerson = new person(data);
        const savedData = await newPerson.save();
        console.log("sucessfully person added");
        res.status(200).json({response: savedData});
    }
    catch(err){
        res.status(500).json({error: "Inernal Server Error"}); 
    }
});

// fetch persons data from the database
router.get('/', async (req, res) => {
    try{
        const data = await person.find();
        console.log('data fetched');
        res.status(200).json(data);
    }
    catch(err){
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

module.exports = router;

