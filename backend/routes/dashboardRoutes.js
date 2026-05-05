const express = require("express");
const { db } = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
  GET /api/dashboard
  Get dashboard statistics
*/
router.get("/", authMiddleware, (req, res) => {
    const sql = `
    SELECT
      COUNT(*) AS totalLeads,

      SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) AS newLeads,
      SUM(CASE WHEN status = 'Qualified' THEN 1 ELSE 0 END) AS qualifiedLeads,
      SUM(CASE WHEN status = 'Won' THEN 1 ELSE 0 END) AS wonLeads,
      SUM(CASE WHEN status = 'Lost' THEN 1 ELSE 0 END) AS lostLeads,

      COALESCE(SUM(estimated_deal_value), 0) AS totalEstimatedDealValue,

      COALESCE(
        SUM(CASE WHEN status = 'Won' THEN estimated_deal_value ELSE 0 END),
        0
      ) AS totalWonDealValue

    FROM leads
  `;

    db.get(sql, [], (err, row) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch dashboard data",
                error: err.message,
            });
        }

        res.json({
            totalLeads: row.totalLeads || 0,
            newLeads: row.newLeads || 0,
            qualifiedLeads: row.qualifiedLeads || 0,
            wonLeads: row.wonLeads || 0,
            lostLeads: row.lostLeads || 0,
            totalEstimatedDealValue: row.totalEstimatedDealValue || 0,
            totalWonDealValue: row.totalWonDealValue || 0,
        });
    });
});

module.exports = router;