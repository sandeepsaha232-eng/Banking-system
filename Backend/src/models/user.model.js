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
        unique:true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        maxlength:128,
        select:false
    },
    phone:{
        type:String,
        required:true
    },
    // wallet information of the user
    wallet : {
        type:Schema.Types.ObjectId,
        ref: 'Wallet',
        default:0
    },
    address:{ // will be changed to object reference in future
        type:String,
        required:true
    }
},{timestamp:true});

module.exports = mongoose.model('User',User);