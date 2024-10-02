const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // Check if no token
    if (!token) {
        return res.status(401).json({ success: false, msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId; // Attach user ID to request object
        next(); // Proceed to next middleware or route handler
    } catch (err) {
        console.error('Error verifying token:', err);
        res.status(401).json({ success: false, msg: 'Token is not valid' });
    }
};