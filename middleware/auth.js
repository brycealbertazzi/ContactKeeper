const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({message: 'No token, authorization denied'});
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); // Verify the token

        req.user = decoded.user;
        next(); // Call next because this is a middleware function
    } catch {
        res.status(401).json({
            message: 'Token is not valid'
        });
    }
}