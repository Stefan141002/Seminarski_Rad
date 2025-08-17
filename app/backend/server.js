import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Putanja do baze u folderu db unutar app
const dbPath = path.join(process.cwd(), 'db/todos.db');

// Kreiraj folder db ako ne postoji
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Otvori bazu
const dbPromise = open({
  filename: dbPath,
  driver: sqlite3.Database
});

// Inicijalizacija baze
(async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      done INTEGER DEFAULT 0
    )
  `);
})();

// Rute
app.get('/', (req, res) => {
  res.send('Backend radi sa TODO listom!');
});
app.get('/health', (req, res) => res.sendStatus(200));
app.get('/todos', async (req, res) => {
  const db = await dbPromise;
  const todos = await db.all('SELECT * FROM todos');
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text je obavezan' });

  const db = await dbPromise;
  const result = await db.run('INSERT INTO todos (text) VALUES (?)', text);
  res.json({ id: result.lastID, text, done: 0 });
});

// NOVO: DELETE ruta
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const db = await dbPromise;

  const result = await db.run('DELETE FROM todos WHERE id = ?', id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Todo nije pronađen' });
  }

  res.json({ success: true, id });
});

// Start server
app.listen(PORT, () => console.log(`Server je pokrenut na portu ${PORT}`));
