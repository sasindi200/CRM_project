const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Hardcoded test user for assessment
const testUser = {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
};

// POST /api/auth/login
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Check empty fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required.",
        });
    }

    // Check credentials
    if (email !== testUser.email || password !== testUser.password) {
        return res.status(401).json({
            message: "Invalid email or password.",
        });
    }

    // Create JWT token
    const token = jwt.sign(
        {
            id: testUser.id,
            name: testUser.name,
            email: testUser.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );

    res.json({
        message: "Login successful",
        token,
        user: {
            id: testUser.id,
            name: testUser.name,
            email: testUser.email,
        },
    });
});

module.exports = router;