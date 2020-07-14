const express = require('express'); // Import express in each file so we can use the router
const router = express.Router();

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', (req, res) => {
    res.send('Get logged in user');
});

// @route   POST api/auth
// @desc    Ayth user & get token
// @access  Public
router.post('/', (req, res) => {
    res.send('Log in user');
});

// Must do this or the route won't work
module.exports = router; 