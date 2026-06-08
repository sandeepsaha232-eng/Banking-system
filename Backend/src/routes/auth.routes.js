const express = require('express')
const router = express.Router();
const {register,login,logout} = require('../controllers/auth.controller');
// signup route
router.post('/signup', register);

// login route
router.post('/login', login);

// logout route 
router.post('/logout', logout);

module.exports = router;