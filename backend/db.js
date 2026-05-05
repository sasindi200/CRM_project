const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Create database folder if it does not exist
const databaseFolder = path.join(__dirname, "database");

if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder);
}

// Database file path
const dbPath = path.join(databaseFolder, "crm.db");

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to SQLite database");
    }
});

// Create tables
function initDatabase() {
    db.serialize(() => {
        db.run("PRAGMA foreign_keys = ON");

        db.run(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lead_name TEXT NOT NULL,
        company_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        lead_source TEXT,
        assigned_salesperson TEXT,
        status TEXT DEFAULT 'New',
        estimated_deal_value REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

        db.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lead_id INTEGER NOT NULL,
        note_content TEXT NOT NULL,
        created_by TEXT DEFAULT 'Admin User',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
      )
    `);

        console.log("Database tables created successfully");
    });
}

module.exports = {
    db,
    initDatabase,
};