import express from 'express';
import { execSync } from 'child_process';
import { allAsync, getAsync, runAsync } from '../db.js';

const router = express.Router();

// Get unread email count
router.get('/unread-count', async (req, res) => {
  try {
    const output = execSync('gog list-emails --limit 100 --format json', { encoding: 'utf8' });
    const emails = JSON.parse(output);
    const unreadCount = emails.filter(e => e.unread).length;
    res.json({ unread: unreadCount, total: emails.length });
  } catch (error) {
    console.error('Error getting email count:', error.message);
    res.json({ unread: 0, total: 0, error: error.message });
  }
});

// Get email list
router.get('/list', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const output = execSync(`gog list-emails --limit ${limit} --format json`, { encoding: 'utf8' });
    const emails = JSON.parse(output);
    res.json(emails);
  } catch (error) {
    console.error('Error listing emails:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get email detail
router.get('/:id', async (req, res) => {
  try {
    const output = execSync(`gog get-email ${req.params.id} --format json`, { encoding: 'utf8' });
    const email = JSON.parse(output);
    res.json(email);
  } catch (error) {
    console.error('Error getting email:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Search emails
router.get('/search/:query', async (req, res) => {
  try {
    const output = execSync(`gog search-emails "${req.params.query}" --format json`, { encoding: 'utf8' });
    const results = JSON.parse(output);
    res.json(results);
  } catch (error) {
    console.error('Error searching emails:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Mark email as read
router.post('/:id/read', async (req, res) => {
  try {
    execSync(`gog mark-read ${req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking email as read:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete email
router.delete('/:id', async (req, res) => {
  try {
    execSync(`gog delete-email ${req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting email:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export { router as emailRoutes };
