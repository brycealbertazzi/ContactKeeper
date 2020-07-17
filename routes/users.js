const express = require('express'); // Import express in each file so we can use the router
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const User = require('../models/User');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', [
    check('name', 'A name is required').not().isEmpty(),
    check('email', 'A valid email is required').isEmail(),
    check('password', 'A password must exist and have at least 6 characters').isLength({
        min: 6
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If we have errors
        return res.status(400).json({errors: errors.array()}); // Return 'errors' in array format
    }
    
    const {name, email, password} = req.body;

    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({message: "This user already exists"})
        }
        user = new User({
            name,
            email,
            password
        });
        // Encrypt the password with bcrypt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt); // Gives us a hashed version of the password
        await user.save(); // Save the user to MongoDB

        // 'payload' is the object we want to send in the token
        const payload = {
            user: {
                id: user.id
            }
        }

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