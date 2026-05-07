const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Hardcoded test user for assessment (password: "password123")
const testUser = {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "$2b$10$SnAzAwt2GDGVDDGf8ImfjewmzuqhNWFlFDuLI0AeZ/XRhaUB3UWbG",
};

// POST /api/auth/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check empty fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required.",
        });
    }

    // Check credentials
    const emailMatch = email === testUser.email;
    const passwordMatch = emailMatch && await bcrypt.compare(password, testUser.password);
    if (!emailMatch || !passwordMatch) {
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