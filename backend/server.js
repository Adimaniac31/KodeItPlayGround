// server.js
import express from 'express';
import { json, urlencoded } from 'express';
import { createConnection } from 'mysql';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 5000;

// MySQL Connection
const connection = createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'code_snippets'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Express middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// API endpoints
app.get('/api/config', (req, res) => {
  res.json({
    apiKey: process.env.key,
  });
});

app.post('/submit', (req, res) => {
  const { username, language, stdin, sourceCode } = req.body;
  const timestamp = new Date().toISOString();

  const sql = `INSERT INTO snippets (username, language, stdin, sourceCode, timestamp) VALUES (?, ?, ?, ?, ?)`;
  connection.query(sql, [username, language, stdin, sourceCode, timestamp], (err, results) => {
    if (err) {
      console.error('Error inserting snippet: ', err);
      res.status(500).json({ error: 'Failed to submit snippet' });
      return;
    }
    res.status(200).json({ message: 'Snippet submitted successfully' });
  });
});

app.get('/snippets', (req, res) => {
  connection.query('SELECT username, language, stdin, LEFT(sourceCode, 100) AS sourceCodePreview, timestamp FROM snippets', (err, results) => {
    if (err) {
      console.error('Error fetching snippets: ', err);
      res.status(500).json({ error: 'Failed to fetch snippets' });
      return;
    }
    res.status(200).json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

