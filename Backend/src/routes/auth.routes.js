const express = require('express')
const router = express.Router();
const {register,login} = require('../controllers/auth.controller');
// signup route
router.post('/signup', register);

// login route
router.post('/login', login);


module.exports = router;