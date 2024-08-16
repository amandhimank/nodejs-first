const express = require('express');
const router = express.Router();
const menu = require('../models/menu');

router.post('/', async (req, res) => {
    try{
        // extracting data from the request body
        const data =  req.body;
        // creating new document for new item
        const newItem = new menu(data);

        const savedItem = await newItem.save();
        console.log('data saved');
        res.status(200).json(savedItem);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
});

router.get('/', async (req, res) => {
    try{
        const response = await menu.find();
        console.log('data fetched');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
})



module.exports = router;