import express from 'express';
import { allAsync, getAsync, runAsync } from '../db.js';

const router = express.Router();

// Get all rules
router.get('/', async (req, res) => {
  try {
    const rules = await allAsync('SELECT * FROM rules ORDER BY created_at DESC');
    res.json(rules);
  } catch (error) {
    console.error('Error fetching rules:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get active rules only
router.get('/active', async (req, res) => {
  try {
    const rules = await allAsync('SELECT * FROM rules WHERE enabled = 1 ORDER BY created_at DESC');
    res.json(rules);
  } catch (error) {
    console.error('Error fetching active rules:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get specific rule
router.get('/:id', async (req, res) => {
  try {
    const rule = await getAsync('SELECT * FROM rules WHERE id = ?', [req.params.id]);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    res.json(rule);
  } catch (error) {
    console.error('Error fetching rule:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create new rule
router.post('/', async (req, res) => {
  try {
    const { name, trigger_type, trigger_condition, action_type, action_config } = req.body;
    const result = await runAsync(
      'INSERT INTO rules (name, trigger_type, trigger_condition, action_type, action_config) VALUES (?, ?, ?, ?, ?)',
      [name, trigger_type, trigger_condition, action_type, JSON.stringify(action_config)]
    );
    res.json({ id: result.lastID, success: true });
  } catch (error) {
    console.error('Error creating rule:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update rule
router.patch('/:id', async (req, res) => {
  try {
    const { name, enabled, trigger_condition, action_config } = req.body;
    const updates = [];
    const values = [];
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (enabled !== undefined) {
      updates.push('enabled = ?');
      values.push(enabled ? 1 : 0);
    }
    if (trigger_condition !== undefined) {
      updates.push('trigger_condition = ?');
      values.push(trigger_condition);
    }
    if (action_config !== undefined) {
      updates.push('action_config = ?');
      values.push(JSON.stringify(action_config));
    }
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.params.id);

    await runAsync(`UPDATE rules SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating rule:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete rule
router.delete('/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM rules WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting rule:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Toggle rule enabled/disabled
router.post('/:id/toggle', async (req, res) => {
  try {
    const rule = await getAsync('SELECT enabled FROM rules WHERE id = ?', [req.params.id]);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    const newEnabled = rule.enabled ? 0 : 1;
    await runAsync('UPDATE rules SET enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newEnabled, req.params.id]);
    res.json({ success: true, enabled: newEnabled === 1 });
  } catch (error) {
    console.error('Error toggling rule:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export { router as rulesRoutes };
