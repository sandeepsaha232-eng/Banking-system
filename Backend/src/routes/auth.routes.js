const express = require('express')
const router = express.Router();
const User = require('../models/user.model')
const bcrypt = require('bcrypt');


// signup route
router.post('/signup', async (req, res) => {

    try {
        // destructuring components of req
        const { name, email, password, phone, address } = req.body;

        // if any of the field is missing return
        if(!name || !email || !password || !phone || !address){
            return res.json({message : "all fields are required"})
        }

        const user = new User({
            name,
            email,
            password : await bcrypt.hash(password,10),
            phone,
            address
        });

        await user.save();
        res.status(201).json({ message: "User created successfully" });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// login route
router.post('/login', async (req,res)=>{

    try{
        // email and pass, if anything of two missing return
        const {email,password} = req.body;

        if(!email || !password){
            return res.json({message:"all fields are required"})
        }

        // find the user by mail.
        const user = await User.findOne({email}).select("+password"); // we have select:false, so password would not be fetched by default

        if(!user){
            return res.json({message:"user not found"})
        }

        const isMatch = await bcrypt.compare(password,user.password); // bcrypt to compare the hashed password
        if(!isMatch){
            return res.json({message:"invalid credentials"})
        }

        // if login successfull return userdata
        res.json({message:"login successful",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address
            }
        })
    }
    catch(error){
        return res.json({message:error.message})
    }

})


module.exports = router;