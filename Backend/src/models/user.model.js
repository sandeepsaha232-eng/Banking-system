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
        default : null
    },
    address:{ // will be changed to object reference in future
        type:String,
        required:true
    },
    // two fields required for otp verification

    isVerified:{
        type:Boolean, 
        default:false, // by default w/o verification it should be false, after verification attach the wallet and change to true
        required:true 
    },
    otp:{
        type:String,
        default:null
    },

    // if the user is not verified it's residual data must be deleted
    otpCreatedAt: {
        type: Date,
        default: Date.now,
        index: { expires: '10m' } // Automatically deletes the user document after 10 minutes if not verified
    }

    // index : TTL index (time to live) : it deletes the document after specified time

},{timestamps:true});

module.exports = mongoose.model('User',User);