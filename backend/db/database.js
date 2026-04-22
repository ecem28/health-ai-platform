const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create Tables
    db.serialize(() => {
      // Users Table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        name TEXT,
        university TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt TEXT
      )`);

      // Seed Admin
      db.get("SELECT * FROM users WHERE email = ?", ['admin@healthai.edu'], (err, row) => {
        if (!row) {
          db.run(`INSERT INTO users (id, email, password, role, name, isActive, createdAt) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['admin_1', 'admin@healthai.edu', 'admin', 'Admin', 'System Admin', 1, new Date().toISOString()]
          );
        }
      });

      // Posts Table
      db.run(`CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT,
        domain TEXT,
        shortExplanation TEXT,
        highLevelIdea TEXT,
        desiredExpertise TEXT,
        commitmentLevel TEXT,
        projectStage TEXT,
        country TEXT,
        city TEXT,
        confidentialityLevel TEXT,
        expiryDate TEXT,
        autoClose INTEGER,
        authorId TEXT,
        authorRole TEXT,
        status TEXT,
        createdAt TEXT
      )`);

      // Meetings Table
      db.run(`CREATE TABLE IF NOT EXISTS meetings (
        id TEXT PRIMARY KEY,
        postId TEXT,
        requesterId TEXT,
        requesterRole TEXT,
        receiverId TEXT,
        message TEXT,
        proposedDate TEXT,
        status TEXT,
        createdAt TEXT
      )`);

      // Add columns if they don't exist
      db.run("ALTER TABLE users ADD COLUMN domain TEXT", (err) => { if(err) console.log("domain err", err.message); });
      db.run("ALTER TABLE users ADD COLUMN university TEXT", (err) => { if(err) console.log("university err", err.message); });
      db.run("ALTER TABLE meetings ADD COLUMN proposedTime TEXT", (err) => { if(err) console.log("proposedTime err", err.message); });
      db.run("ALTER TABLE meetings ADD COLUMN isRead INTEGER DEFAULT 0", (err) => { if(err) console.log("isRead err", err.message); });

      // Audit Logs Table
      db.run(`CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        userId TEXT,
        role TEXT,
        actionType TEXT,
        targetEntity TEXT,
        resultStatus TEXT,
        additionalData TEXT
      )`);
    });
  }
});

module.exports = db;
