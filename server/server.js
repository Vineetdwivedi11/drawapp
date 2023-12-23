const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Create SQLite database and table
const db = new sqlite3.Database('canvas.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to the SQLite database');
    db.run(`
      CREATE TABLE IF NOT EXISTS canvases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT
      )
    `);
  }
});

// API endpoint to save canvas data
app.post('/api/canvas', (req, res) => {
  const { canvasData } = req.body;

  if (!canvasData) {
    return res.status(400).json({ error: 'Missing canvas data' });
  }

  // Insert canvas data into the database
  db.run('INSERT INTO canvases (data) VALUES (?)', [canvasData], function (err) {
    if (err) {
      console.error('Error inserting data into database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const canvasId = this.lastID;
    res.json({ success: true, canvasId });
  });
});

// API endpoint to retrieve all saved canvases
app.get('/api/canvases', (req, res) => {
  // Retrieve all canvases from the database
  db.all('SELECT * FROM canvases', (err, rows) => {
    if (err) {
      console.error('Error retrieving data from database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
