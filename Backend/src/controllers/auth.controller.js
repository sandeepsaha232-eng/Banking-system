const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Wallet = require('../models/wallet.model')
const bcrypt = require('bcrypt');

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

        const user = new User({
            name,
            email,
            password : await bcrypt.hash(password,10), // hashing the password using bcrypt with salt rounds of 10
            wallet: null, // wallet will be created after the user is created
            phone,
            address
        });

        await user.save();

        // creating wallet for the user
        const wallet = new Wallet({
            userId: user._id,
            balance: 0,
            transactions: []
        });

        await wallet.save();
        user.wallet = wallet._id; // linking wallet with user
        await user.save();

        const token = jwt.sign({
                id: user._id, // create token after user creation
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' });

        return res.status(200).json({
            message: "User created successfully",
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

        // if login successfull return userdata
        return res.json({
            message: "login successful",
            token, // send token with the response
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
        return res.json({message:error.message})
    }

}

module.exports = {register,login};