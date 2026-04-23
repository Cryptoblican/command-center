import express from 'express';
import { execSync } from 'child_process';
import { allAsync, getAsync, runAsync } from '../db.js';

const router = express.Router();

// Mock email data for demo
const mockEmails = [
  {
    id: '1',
    from: 'rob@alpine.edu',
    subject: 'Alpine Board Agenda - April 2026',
    date: '2026-04-22T14:30:00Z',
    unread: true,
    snippet: 'Here is the agenda for the April board meeting...'
  },
  {
    id: '2',
    from: 'nav@keyvault.com',
    subject: 'KeyVault PPM - Outstanding Items',
    date: '2026-04-21T10:15:00Z',
    unread: true,
    snippet: 'Following up on the remaining PPM tasks...'
  },
  {
    id: '3',
    from: 'jennifer@teamdrip.com',
    subject: 'TeamDrip Q2 Campaign - Ready for Review',
    date: '2026-04-20T16:45:00Z',
    unread: false,
    snippet: 'Check the Q2 campaign materials attached...'
  },
  {
    id: '4',
    from: 'julius@cryptoblican.com',
    subject: 'Market Update - Weekly',
    date: '2026-04-19T09:00:00Z',
    unread: false,
    snippet: 'Weekly crypto market analysis and positions...'
  }
];

// Get unread email count
router.get('/unread-count', async (req, res) => {
  try {
    // Try to use gog if available
    try {
      const output = execSync('gog gmail list --limit 100 --format json 2>/dev/null', { encoding: 'utf8' });
      const emails = JSON.parse(output);
      const unreadCount = emails.filter(e => e.unread).length;
      res.json({ unread: unreadCount, total: emails.length });
    } catch {
      // Fallback to mock data
      const unreadCount = mockEmails.filter(e => e.unread).length;
      res.json({ unread: unreadCount, total: mockEmails.length, mock: true });
    }
  } catch (error) {
    console.error('Error getting email count:', error.message);
    res.json({ unread: 0, total: 0, error: error.message });
  }
});

// Get email list
router.get('/list', async (req, res) => {
  try {
    // Try to use gog if available
    try {
      const limit = req.query.limit || 20;
      const output = execSync(`gog gmail list --limit ${limit} --format json 2>/dev/null`, { encoding: 'utf8' });
      const emails = JSON.parse(output);
      res.json(emails);
    } catch {
      // Fallback to mock data
      const limit = req.query.limit || 20;
      res.json(mockEmails.slice(0, limit));
    }
  } catch (error) {
    console.error('Error listing emails:', error.message);
    res.json(mockEmails);
  }
});

// Get email detail
router.get('/:id', async (req, res) => {
  try {
    const email = mockEmails.find(e => e.id === req.params.id);
    if (email) {
      res.json(email);
    } else {
      res.status(404).json({ error: 'Email not found' });
    }
  } catch (error) {
    console.error('Error getting email:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Search emails
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const results = mockEmails.filter(e => 
      e.subject.toLowerCase().includes(query) || 
      e.from.toLowerCase().includes(query) ||
      e.snippet.toLowerCase().includes(query)
    );
    res.json(results);
  } catch (error) {
    console.error('Error searching emails:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Mark email as read
router.post('/:id/read', async (req, res) => {
  try {
    const email = mockEmails.find(e => e.id === req.params.id);
    if (email) {
      email.unread = false;
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking email as read:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete email
router.delete('/:id', async (req, res) => {
  try {
    const index = mockEmails.findIndex(e => e.id === req.params.id);
    if (index > -1) {
      mockEmails.splice(index, 1);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting email:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export { router as emailRoutes };
