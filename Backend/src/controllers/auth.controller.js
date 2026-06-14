const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Wallet = require('../models/wallet.model')
const bcrypt = require('bcrypt');
const {sendOTPEmail,generateOTP} = require('../services/authMail.services');
const {loginMail} = require('../services/email.services');
const uaParser = require('ua-parser-js');


const register =  async (req, res) => {

    try {
        // destructuring components of req
        const { name, email, password, phone, address } = req.body; 

        // if any of the field is missing return
        if(!name || !email || !password || !phone || !address){
            return res.json({message : "all fields are required"})
        }   
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const otp = generateOTP(); // generate the otp

        try{
            await sendOTPEmail(email,otp); // otp sent to the mail
        } catch(err){
            return res.status(500).json({message: 'Failed to send the otp ' + err.message});
        }

        const user = new User({
            name,
            email,
            password : await bcrypt.hash(password,10), // hashing the password using bcrypt with salt rounds of 10
            wallet: null, // wallet will be created after the user is created
            phone,
            address,
            otp : await bcrypt.hash(otp,10), // store otp temporarily to verify in hashed form for securtity
            otpCreatedAt : new Date() // to manually check for the age of otp
        });

        // if otp is not verified withing the given time the user shall be deleted from the db
        await user.save();

        const token = jwt.sign({
                id: user._id, // create token after user creation
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' });

            res.cookie("token", token, {
                 httpOnly: true ,
                 maxAge: 7 * 24 * 60 * 60 * 1000,
                 secure:false,
                 sameSite: 'lax'
            });


        return res.status(200).json({
            message: "User created successfully : verify otp to connect wallet",
            token, // send token with the response
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const verifyOtp = async (req,res) => {

    try { 
        
        const {otp,email}= req.body; // email and otp from the body to verify the user
    
        if(!otp || !email){ // if any of the field is missing process should be stopped
            return res.status(400).json({message:"invalid fields"});
        }
    
        const user = await User.findOne({email});
    
        // user may have been deleted after 10 minutes because of TTL indexes or email may be wrong
        if(!user) {
            return res.status(404).json({
                 message: 'User not found or OTP session expired. Please register again.'
            });
        }
    
        if(user.isVerified){ // if the user is already verified, there is no need od verification
            return res.status(400).json({message:"user is already verified"}); /*this situation might never occur becuase this will
                                                                                 be done only once at the time of signup 
                                                                                 but just for security a fallback has been added*/
        }
    
    
        // manual checking for otp expiration 
        const otpAge = Date.now() - new Date(user.otpCreatedAt).getTime(); // get the time of otp created 
    
        if (otpAge > 10*60*1000) { // if the age of otp is greater than 10 minutes then.. otp must have expired
            return res.status(400).json({
                 message: 'OTP has expired, please signup again' // the signup process shall be restarted because the data is no longer ther in db 
            });
        }
    
        // check for the otp if it is correct or not
        const isOtpValid = await bcrypt.compare(otp, user.otp);
            
        if (!isOtpValid) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
    
        // attach the wallet to the user if everythings good
        const wallet = new Wallet({
            userId: user._id,
            balance: 0,
            transactions: []
        });
    
        await wallet.save();
    
        /* change the user data accordingly : wallet attached, 
        otp and otpCreatedAt : nullified -> if not done user will be deleted due to ttl index */
        user.wallet = wallet._id;
        user.isVerified = true;
        user.otp = null;
        user.otpCreatedAt = null;
        await user.save();
    
        return res.status(200).json({
            message: "OTP verified successfully and wallet connected",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                wallet: user.wallet
            }
        });
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

const login =  async (req,res)=>{

    try{
        // email and pass, if anything of two missing return
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:"all fields are required"})
        }

        // find the user by mail.
        const user = await User.findOne({email}).select("+password"); // we have select:false, so password would not be fetched by default

        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        if(!user.isVerified){
            return res.status(401).json({message:"user not verified"})
        }

        const isMatch = await bcrypt.compare(password,user.password); // bcrypt to compare the hashed password
        if(!isMatch){
            return res.status(401).json({message:"invalid credentials"})
        }

        const token = jwt.sign({
                id: user._id, // create token after user creation
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' });

            res.cookie("token", token, {
                 httpOnly: true ,
                 maxAge: 7 * 24 * 60 * 60 * 1000,
                 secure:false,
                 sameSite: 'lax'
            });


        const userAgent = req.headers['user-agent'];
        const device = (new uaParser(userAgent)).getResult();

        const systemDetails = {
            browser: device.browser,
            os: device.os,
            device: device,
            ip : req.ip,
            time : new Date().toLocaleString()
        }

        loginMail(user.email,systemDetails);
        
        // if login successfull return userdata
        return res.json({
            message: "login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        })
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }

}
const logout = async (req, res) => {
    res.clearCookie('token');
    return res.json({ message: "Logged out successfully" });
}

module.exports = {register,login,logout,verifyOtp};
