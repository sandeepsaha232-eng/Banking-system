const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//basic usermodel
const User = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    phone:{
        type:String,
        required:true
    },
    address:{ // will be changed to object res in future
        type:String,
        required:true
    }
},{timestamp:true});

module.exports = mongoose.model('User',User);