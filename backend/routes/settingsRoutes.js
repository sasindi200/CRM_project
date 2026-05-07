const express = require("express");
const { db } = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
  GET /api/settings/target
  Get the monthly sales target
*/
router.get("/target", authMiddleware, (req, res) => {
    db.get("SELECT value FROM settings WHERE key = 'monthly_target'", [], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Failed to fetch target", error: err.message });
        }
        res.json({ target: row ? Number(row.value) : 0 });
    });
});

/*
  PUT /api/settings/target
  Set the monthly sales target
*/
router.put("/target", authMiddleware, (req, res) => {
    const { target } = req.body;

    if (target === undefined || target === null || isNaN(Number(target))) {
        return res.status(400).json({ message: "A valid numeric target is required." });
    }

    if (Number(target) < 0) {
        return res.status(400).json({ message: "Target cannot be negative." });
    }

    db.run(
        "INSERT INTO settings (key, value) VALUES ('monthly_target', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        [String(target)],
        function (err) {
            if (err) {
                return res.status(500).json({ message: "Failed to save target", error: err.message });
            }
            res.json({ message: "Target saved", target: Number(target) });
        }
    );
});

module.exports = router;
