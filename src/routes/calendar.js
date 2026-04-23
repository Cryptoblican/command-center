import express from 'express';
import { execSync } from 'child_process';
import { allAsync } from '../db.js';

const router = express.Router();

// Mock calendar data
const mockEvents = [
  {
    id: '1',
    title: 'Alpine Board Meeting',
    start: '2026-04-23T10:00:00Z',
    end: '2026-04-23T11:00:00Z',
    description: 'Quarterly board meeting with district leadership',
    attendees: ['Rob Smith', 'Julie King', 'Brett Nielsen']
  },
  {
    id: '2',
    title: 'Skyridge Athletic Director Meeting',
    start: '2026-04-23T14:00:00Z',
    end: '2026-04-23T15:00:00Z',
    description: 'Discuss indoor facility project',
    attendees: ['Athletic Director', 'Brett Nielsen']
  },
  {
    id: '3',
    title: 'KeyVault Investor Call',
    start: '2026-04-24T09:00:00Z',
    end: '2026-04-24T10:00:00Z',
    description: 'Update soft-committed investors on fund status',
    attendees: ['Deven', 'JD', 'Brett Nielsen']
  },
  {
    id: '4',
    title: 'TeamDrip Outreach - High School Calls',
    start: '2026-04-25T10:00:00Z',
    end: '2026-04-25T12:00:00Z',
    description: 'Call athletic directors to gather coach contacts',
    attendees: ['Brett Nielsen']
  },
  {
    id: '5',
    title: 'Football Practice - Skyridge High',
    start: '2026-04-25T16:00:00Z',
    end: '2026-04-25T17:30:00Z',
    description: 'Team practice session',
    attendees: []
  }
];

// Get events for next 7 days
router.get('/week', async (req, res) => {
  try {
    const output = execSync('gog calendar events --days 7 --json -j --results-only', { encoding: 'utf8' });
    const events = JSON.parse(output);
    const formatted = events.map(e => ({
      id: e.id,
      title: e.summary || '(no title)',
      start: e.start?.dateTime || e.start?.date || '',
      end: e.end?.dateTime || e.end?.date || '',
      description: e.description || '',
      location: e.location || '',
      attendees: e.attendees ? e.attendees.map(a => a.email) : []
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Error getting calendar events:', error.message);
    // Fallback to mock data
    res.json(mockEvents);
  }
});

// Get all upcoming events
router.get('/upcoming', async (req, res) => {
  try {
    const days = req.query.days || 30;
    const output = execSync(`gog calendar events --days ${days} --json -j --results-only`, { encoding: 'utf8' });
    const events = JSON.parse(output);
    const formatted = events.map(e => ({
      id: e.id,
      title: e.summary || '(no title)',
      start: e.start?.dateTime || e.start?.date || '',
      end: e.end?.dateTime || e.end?.date || '',
      description: e.description || '',
      location: e.location || '',
      attendees: e.attendees ? e.attendees.map(a => a.email) : []
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Error getting upcoming events:', error.message);
    // Fallback to mock data
    res.json(mockEvents);
  }
});

// Get specific event
router.get('/:id', async (req, res) => {
  try {
    const event = mockEvents.find(e => e.id === req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error('Error getting event:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create event
router.post('/create', async (req, res) => {
  try {
    const { title, start, end, description } = req.body;
    const newEvent = {
      id: String(mockEvents.length + 1),
      title,
      start,
      end,
      description: description || '',
      attendees: []
    };
    mockEvents.push(newEvent);
    res.json({ success: true, title, event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export { router as calendarRoutes };
