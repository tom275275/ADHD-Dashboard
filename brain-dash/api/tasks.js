import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import { join } from 'path';

// Initialize database
function initDB() {
  const dbPath = process.env.NODE_ENV === 'production' 
    ? '/tmp/brain-dash.db' 
    : join(process.cwd(), 'brain-dash.db');
  
  const db = new Database(dbPath);
  
  // Create tasks table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      urgency TEXT NOT NULL,
      energy_level TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  
  return db;
}

// Middleware to verify JWT token
function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}

export default async function handler(req, res) {
  try {
    const user = verifyToken(req);
    const db = initDB();

    if (req.method === 'GET') {
      // Get all tasks for user
      const tasks = db.prepare(`
        SELECT * FROM tasks 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `).all(user.userId);

      return res.status(200).json({ tasks });

    } else if (req.method === 'POST') {
      // Save new tasks
      const { tasks } = req.body;
      
      if (!Array.isArray(tasks)) {
        return res.status(400).json({ error: 'Tasks must be an array' });
      }

      const insertStmt = db.prepare(`
        INSERT INTO tasks (user_id, content, category, urgency, energy_level) 
        VALUES (?, ?, ?, ?, ?)
      `);

      const insertMany = db.transaction((tasks) => {
        for (const task of tasks) {
          insertStmt.run(user.userId, task.content, task.category, task.urgency, task.energy_level);
        }
      });

      insertMany(tasks);

      return res.status(201).json({ success: true });

    } else if (req.method === 'PUT') {
      // Update task (mark completed, etc.)
      const { taskId, updates } = req.body;
      
      const updateStmt = db.prepare(`
        UPDATE tasks 
        SET completed = COALESCE(?, completed)
        WHERE id = ? AND user_id = ?
      `);

      updateStmt.run(updates.completed, taskId, user.userId);

      return res.status(200).json({ success: true });

    } else if (req.method === 'DELETE') {
      // Delete all tasks for user (clear brain dump)
      db.prepare('DELETE FROM tasks WHERE user_id = ?').run(user.userId);
      
      return res.status(200).json({ success: true });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Tasks API error:', error);
    if (error.message === 'No valid token provided' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}