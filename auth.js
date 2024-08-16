const person = require('./models/person');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

passport.use(new localStrategy(
    async (username, password, done) => {
        try{
            // console.log("Recieved Credentials: ", username, password);
            const user = await person.findOne({username: username});
            if(!user){
                return done(null, false, {message: "Invalid username"})
            }

            const isPasswordMatched = await user.comparePassword(password);
            if(isPasswordMatched){
                return done(null, user);
            }
            else{
                return done(null, false, {message: "Invalid password"});
            }
        }
        catch(err){
            return done(err);
        }
    }
))

module.exports = passport;