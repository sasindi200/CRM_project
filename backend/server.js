const express = require("express");
const cors = require("cors");
const { initDatabase } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

app.get("/", (req, res) => {
    res.send("CRM Backend is running");
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});