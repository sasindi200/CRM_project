require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initDatabase } = require("./db");

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// Public route
app.get("/", (req, res) => {
    res.send("CRM Backend is running");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You are authorized",
        user: req.user,
    });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});