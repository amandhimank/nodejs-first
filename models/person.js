const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        enum: ["waiter", "chef", "manager"],
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    },
    salary: {
        type: Number
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

const person = mongoose.model('person', personSchema);

module.exports = person;