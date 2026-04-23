import express from 'express';
import { execSync } from 'child_process';
import { allAsync } from '../db.js';

const router = express.Router();

// Get events for next 7 days
router.get('/week', async (req, res) => {
  try {
    const output = execSync('gog list-events --days 7 --format json', { encoding: 'utf8' });
    const events = JSON.parse(output);
    res.json(events);
  } catch (error) {
    console.error('Error getting calendar events:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all upcoming events
router.get('/upcoming', async (req, res) => {
  try {
    const days = req.query.days || 30;
    const output = execSync(`gog list-events --days ${days} --format json`, { encoding: 'utf8' });
    const events = JSON.parse(output);
    res.json(events);
  } catch (error) {
    console.error('Error getting upcoming events:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get specific event
router.get('/:id', async (req, res) => {
  try {
    const output = execSync(`gog get-event ${req.params.id} --format json`, { encoding: 'utf8' });
    const event = JSON.parse(output);
    res.json(event);
  } catch (error) {
    console.error('Error getting event:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create event
router.post('/create', async (req, res) => {
  try {
    const { title, start, end, description } = req.body;
    const cmd = `gog create-event --title "${title}" --start "${start}" --end "${end}" --description "${description || ''}"`;
    execSync(cmd);
    res.json({ success: true, title });
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export { router as calendarRoutes };
