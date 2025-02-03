const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    
    email:{
        type: String,
        require: true,
        uniqe: true
    },

    password:{
        type: String,
        require: true}
    }, 
    {timetamps: true}); 

module.exports = mongoose.model('user', userSchema);