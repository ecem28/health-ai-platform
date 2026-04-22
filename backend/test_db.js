const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'db/database.sqlite');
console.log("Testing DB at", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to DB');
    db.serialize(() => {
      db.run("ALTER TABLE meetings ADD COLUMN isRead INTEGER DEFAULT 0", (err) => {
        if(err) console.log("isRead err:", err.message);
        else console.log("isRead added successfully");
      });
      db.run("ALTER TABLE meetings ADD COLUMN test_col INTEGER DEFAULT 0", (err) => {
        if(err) console.log("test_col err:", err.message);
        else console.log("test_col added successfully");
      });
      db.all("PRAGMA table_info(meetings)", (err, rows) => {
        console.log("meetings table schema:", rows);
      });
    });
  }
});
