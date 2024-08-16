const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

// Yeh pre function tab trigger hoga jab save() execute hone wala hoga [save hone se pehle]
personSchema.pre('save', async function(next){
    const person1 = this; // this represent krr rha ahai => wo document jisko save kiya jaa rha hai

    // Hash the password onlt if it has been modified (or is new)
    if(!person1.isModified('password')) return next();

    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10); // jitna bada number hoga wo utna complex salt ko generate krega
        
        // hash password
        const hashedPassword = await bcrypt.hash(person1.password, salt);

        // Override the  plain password with hashed one
        person1.password = hashedPassword;

        next(); 
    }
    catch(err){
        return next(err);
    }
});

personSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password 
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
        // lets understand what is the happening? How does it compare the passwords?
        // when we store the password it is stored in hashed form in the database, but when we provide password at the time of login, we have to compare this password with the hashed password in the database for that compare() ===> first it will extract salt from the hashed password stored in database and then using this salt it converts the provided password into hashed form and then compares it.
    }
    catch(err){
        throw err;
    }
}

const person = mongoose.model('person', personSchema);

module.exports = person;