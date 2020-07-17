const express = require('express'); // Import express in each file so we can use the router
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/User');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => { // Passing in 'auth' as the second parameter makes this use the auth.js middleware functionality
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Ayth user & get token
// @access  Public
router.post('/', [
    check('email', 'A valid email is required').isEmail(),
    check('password', 'A password must exist and have at least 6 characters').exists()
],
 async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If we have errors
        return res.status(400).json({errors: errors.array()}); // Return 'errors' in array format
    }

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});
        console.log(user);
        if (!user) {
            return res.status(400).json({message: 'Invalid credentials, there is no user associated with this email'});
        }

        const isMatch = await bcrypt.compare(password, user.password); // Compares the user's plaintext password to its encrypted password, determines if they are a match

        if (!isMatch) {
            return res.status(400).json({message: 'Invalid Credentials, invalid password'});
        }

        // 'payload' is the object we want to send in the token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000, // Expires in this many seconds
        }, (err, token) => {
            if (err) throw err;
            res.json({token});
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Must do this or the route won't work
module.exports = router; 