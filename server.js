import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';
import { initializeDatabase } from './src/db.js';
import { emailRoutes } from './src/routes/email.js';
import { calendarRoutes } from './src/routes/calendar.js';
import { projectRoutes } from './src/routes/projects.js';
import { rulesRoutes } from './src/routes/rules.js';
import { predictionsRoutes } from './src/routes/predictions.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initializeDatabase();

// API Routes
app.use('/api/email', emailRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/rules', rulesRoutes);
app.use('/api/predictions', predictionsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from React build
const clientBuildPath = join(__dirname, 'client', 'dist');
app.use(express.static(clientBuildPath));

// Fallback to React index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send('Error loading index.html');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Dashboard at http://localhost:${PORT}`);
});

export default app;
