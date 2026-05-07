const express = require("express");
const { db } = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const VALID_STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+\d{1,3})?\d{7,15}$/;

function validateLead({ lead_name, company_name, email, phone, status, estimated_deal_value }) {
    if (!lead_name || !company_name || !email) {
        return "Lead name, company name, and email are required.";
    }
    if (!EMAIL_REGEX.test(email)) {
        return "Please enter a valid email address.";
    }
    if (phone && !PHONE_REGEX.test(phone.replace(/\s/g, ""))) {
        return "Phone number must be 7–15 digits, optionally starting with a country code.";
    }
    if (status && !VALID_STATUSES.includes(status)) {
        return `Status must be one of: ${VALID_STATUSES.join(", ")}.`;
    }
    if (estimated_deal_value !== undefined && estimated_deal_value !== "" && Number(estimated_deal_value) < 0) {
        return "Estimated deal value cannot be negative.";
    }
    return null;
}

/*
  GET /api/leads
  Get all leads with optional filters:
  ?status=New
  ?source=LinkedIn
  ?salesperson=Admin User
  ?search=nimal
*/
router.get("/", authMiddleware, (req, res) => {
    const { status, source, salesperson, search } = req.query;

    let sql = "SELECT * FROM leads";
    const conditions = [];
    const params = [];

    if (status) {
        conditions.push("status = ?");
        params.push(status);
    }

    if (source) {
        conditions.push("lead_source = ?");
        params.push(source);
    }

    if (salesperson) {
        conditions.push("assigned_salesperson = ?");
        params.push(salesperson);
    }

    if (search) {
        conditions.push(
            "(lead_name LIKE ? OR company_name LIKE ? OR email LIKE ?)"
        );
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY created_at DESC";

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch leads",
                error: err.message,
            });
        }

        res.json(rows);
    });
});

/*
  GET /api/leads/:id
  Get one lead by ID
*/
router.get("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM leads WHERE id = ?", [id], (err, lead) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch lead",
                error: err.message,
            });
        }

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }

        res.json(lead);
    });
});

/*
  POST /api/leads
  Create new lead
*/
router.post("/", authMiddleware, (req, res) => {
    const {
        lead_name,
        company_name,
        email,
        phone,
        lead_source,
        assigned_salesperson,
        status,
        estimated_deal_value,
    } = req.body;

    const validationError = validateLead(req.body);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const sql = `
    INSERT INTO leads (
      lead_name,
      company_name,
      email,
      phone,
      lead_source,
      assigned_salesperson,
      status,
      estimated_deal_value
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const params = [
        lead_name,
        company_name,
        email,
        phone || "",
        lead_source || "Other",
        assigned_salesperson || "Admin User",
        status || "New",
        estimated_deal_value || 0,
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({
                message: "Failed to create lead",
                error: err.message,
            });
        }

        res.status(201).json({
            message: "Lead created successfully",
            leadId: this.lastID,
        });
    });
});

/*
  PUT /api/leads/:id
  Update existing lead
*/
router.put("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;

    const {
        lead_name,
        company_name,
        email,
        phone,
        lead_source,
        assigned_salesperson,
        status,
        estimated_deal_value,
    } = req.body;

    const validationError = validateLead(req.body);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const sql = `
    UPDATE leads
    SET
      lead_name = ?,
      company_name = ?,
      email = ?,
      phone = ?,
      lead_source = ?,
      assigned_salesperson = ?,
      status = ?,
      estimated_deal_value = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

    const params = [
        lead_name,
        company_name,
        email,
        phone || "",
        lead_source || "Other",
        assigned_salesperson || "Admin User",
        status || "New",
        estimated_deal_value || 0,
        id,
    ];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({
                message: "Failed to update lead",
                error: err.message,
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }

        res.json({
            message: "Lead updated successfully",
        });
    });
});

/*
  DELETE /api/leads/:id
  Delete lead
*/
router.delete("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM leads WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({
                message: "Failed to delete lead",
                error: err.message,
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }

        res.json({
            message: "Lead deleted successfully",
        });
    });
});

/*
  GET /api/leads/:id/notes
  Get all notes for a specific lead
*/
router.get("/:id/notes", authMiddleware, (req, res) => {
    const { id } = req.params;

    const sql = `
    SELECT * FROM notes
    WHERE lead_id = ?
    ORDER BY created_at DESC
  `;

    db.all(sql, [id], (err, notes) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch notes",
                error: err.message,
            });
        }

        res.json(notes);
    });
});

/*
  POST /api/leads/:id/notes
  Add a note to a specific lead
*/
router.post("/:id/notes", authMiddleware, (req, res) => {
    const { id } = req.params;
    const { note_content } = req.body;

    if (!note_content) {
        return res.status(400).json({
            message: "Note content is required.",
        });
    }

    // First check if the lead exists
    db.get("SELECT * FROM leads WHERE id = ?", [id], (err, lead) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to check lead",
                error: err.message,
            });
        }

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }

        const sql = `
      INSERT INTO notes (
        lead_id,
        note_content,
        created_by
      )
      VALUES (?, ?, ?)
    `;

        const params = [
            id,
            note_content,
            req.user.name || "Admin User"
        ];

        db.run(sql, params, function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Failed to add note",
                    error: err.message,
                });
            }

            res.status(201).json({
                message: "Note added successfully",
                noteId: this.lastID,
            });
        });
    });
});


/*
  PUT /api/leads/:id/notes/:noteId
  Edit an existing note
*/
router.put("/:id/notes/:noteId", authMiddleware, (req, res) => {
    const { noteId } = req.params;
    const { note_content } = req.body;

    if (!note_content) {
        return res.status(400).json({ message: "Note content is required." });
    }

    db.run(
        "UPDATE notes SET note_content = ? WHERE id = ?",
        [note_content, noteId],
        function (err) {
            if (err) {
                return res.status(500).json({ message: "Failed to update note", error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Note not found" });
            }
            res.json({ message: "Note updated successfully" });
        }
    );
});

/*
  DELETE /api/leads/:id/notes/:noteId
  Delete a note
*/
router.delete("/:id/notes/:noteId", authMiddleware, (req, res) => {
    const { noteId } = req.params;

    db.run("DELETE FROM notes WHERE id = ?", [noteId], function (err) {
        if (err) {
            return res.status(500).json({ message: "Failed to delete note", error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json({ message: "Note deleted successfully" });
    });
});

module.exports = router;