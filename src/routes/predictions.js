import express from 'express';
import { allAsync, getAsync, runAsync } from '../db.js';

const router = express.Router();

// Get all predictions
router.get('/', async (req, res) => {
  try {
    const predictions = await allAsync('SELECT * FROM predictions ORDER BY prediction_date DESC');
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get predictions by category
router.get('/category/:category', async (req, res) => {
  try {
    const predictions = await allAsync(
      'SELECT * FROM predictions WHERE category = ? ORDER BY prediction_date DESC',
      [req.params.category]
    );
    res.json(predictions);
  } catch (error) {
    console.error('Error fetching predictions by category:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get prediction accuracy stats
router.get('/stats/accuracy', async (req, res) => {
  try {
    const stats = await getAsync(`
      SELECT
        category,
        COUNT(*) as total,
        SUM(CASE WHEN result IS NOT NULL THEN 1 ELSE 0 END) as resolved,
        AVG(CASE WHEN accuracy_score IS NOT NULL THEN accuracy_score ELSE NULL END) as avg_accuracy
      FROM predictions
      GROUP BY category
    `);
    res.json(stats || {});
  } catch (error) {
    console.error('Error fetching accuracy stats:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create new prediction
router.post('/', async (req, res) => {
  try {
    const { category, prediction, prediction_date, notes } = req.body;
    const result = await runAsync(
      'INSERT INTO predictions (category, prediction, prediction_date, notes) VALUES (?, ?, ?, ?)',
      [category, prediction, prediction_date, notes || null]
    );
    res.json({ id: result.lastID, success: true });
  } catch (error) {
    console.error('Error creating prediction:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update prediction with result
router.patch('/:id/resolve', async (req, res) => {
  try {
    const { result, accuracy_score, notes } = req.body;
    await runAsync(
      'UPDATE predictions SET result = ?, accuracy_score = ?, notes = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?',
      [result, accuracy_score, notes || null, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error resolving prediction:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete prediction
router.delete('/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM predictions WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting prediction:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export { router as predictionsRoutes };
