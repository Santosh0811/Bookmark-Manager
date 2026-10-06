const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const fetchUser = (req, res, next) => {
    const token = req?.cookies?.bookmark_token;

    if (!token) {
        return res.status(401).json({ error: "Authenticate with valid token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        // console.log("User ID from token:", req.userID);
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ errors: "Please authenticate with a valid token." });
    }
}

module.exports = fetchUser;
