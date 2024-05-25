const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const crypto = require('crypto');

const app = express();

app.use(express.json());

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');

// Session middleware setup
app.use("/customer", session({
    secret: secretKey, // secret used to sign the session ID cookie
    resave: true, // forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: true // forces a session that is "uninitialized" to be saved to the store
}));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the user's session contains a valid access token
    if (req.session && req.session.accessToken) {
        const accessToken = req.session.accessToken;

        // Verify the access token
        jwt.verify(accessToken, secretKey, (err, decoded) => {
            if (err) {
                // Token verification failed
                console.error("Token verification failed:", err);
                res.status(401).send("Unauthorized"); // Or redirect to login page, etc.
            } else {
                // Token is valid
                // Optionally, you can extract user information from the decoded token
                req.user = decoded; // Set user information in request object
                next(); // Proceed to the next middleware or route handler
            }
        });
    } else {
        // If no access token is found in the session, or if the session itself doesn't exist,
        // then the user is not authenticated
        res.status(401).send("Unauthorized"); // Or redirect to login page, etc.
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
