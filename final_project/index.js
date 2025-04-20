const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization']; // Expect token in Authorization header
    if (!token) {
        return res.status(401).send({ message: "Access Denied: No Token Provided!" });
    }

    try {
        // Verify Token (Replace `yourSecretKey` with your actual secret key)
        const verified = jwt.verify(token, "yourSecretKey"); // Example uses JWT
        req.user = verified; // Attach decoded token info to the request
        next(); // Proceed to next middleware or route
    } catch (err) {
        res.status(400).send({ message: "Invalid Token!" });
    }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
