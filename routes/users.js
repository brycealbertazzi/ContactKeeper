const express = require('express'); // Import express in each file so we can use the router
const router = express.Router();

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', (req, res) => {
    res.send('Register a user');
});

// Must do this or the route won't work
module.exports = router; 