import express from 'express';
import { allAsync, getAsync, runAsync } from '../db.js';

const router = express.Router();

// Mock project data structure
const PROJECTS = {
  'skyridge-coaching': {
    name: 'Skyridge Coaching',
    description: 'High school and youth football coaching - Skyridge High + Skyridge Youth',
    status: 'active',
    progress: 75,
    nextSteps: [
      'Spring practices schedule',
      'Team conditioning program',
      'Equipment inventory'
    ]
  },
  'keyvault': {
    name: 'KeyVault',
    description: 'Crypto fund initiative',
    status: 'active',
    progress: 60,
    nextSteps: [
      'Finalize PPM',
      'Complete admin items with Nav',
      'Soft-launch to investors (30-60 days)',
      'Market sentiment tracking'
    ]
  },
  'teamdrip': {
    name: 'TeamDrip',
    description: "Jennifer's custom apparel business - hoodies, hats, shirts for schools, universities, companies",
    status: 'active',
    progress: 50,
    nextSteps: [
      'New product designs',
      'Marketing outreach',
      'Customer orders pipeline'
    ]
  }
};

// Get all projects
router.get('/', async (req, res) => {
  try {
    res.json(Object.values(PROJECTS));
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get specific project
router.get('/:id', async (req, res) => {
  try {
    const project = PROJECTS[req.params.id];
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update project progress
router.patch('/:id', async (req, res) => {
  try {
    const project = PROJECTS[req.params.id];
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    if (req.body.progress !== undefined) {
      project.progress = req.body.progress;
    }
    if (req.body.status !== undefined) {
      project.status = req.body.status;
    }
    if (req.body.nextSteps !== undefined) {
      project.nextSteps = req.body.nextSteps;
    }
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export { router as projectRoutes };
