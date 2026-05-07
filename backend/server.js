require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initDatabase } = require("./db");

const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

initDatabase();

app.get("/", (req, res) => {
    res.send("CRM Backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You are authorized",
        user: req.user,
    });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});