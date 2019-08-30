const mongoose = require('mongoose');
const User = mongoose.model('User');
module.exports = ()=>{
    console.log("returning new user");
    return new User({}).save();
}