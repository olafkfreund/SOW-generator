import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Simple helper to read JSON data
const readJsonData = (filename: string) => {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// GET /api/calendar - List calendar entries
router.get('/', (req: Request, res: Response) => {
  const entries = readJsonData('calendar.json');
  res.json(entries);
});

// POST /api/calendar - Add calendar entry
router.post('/', (req: Request, res: Response) => {
  const { engineerId, date, type } = req.body;
  if (!engineerId || !date || !type) {
    return res.status(400).json({ error: 'Engineer ID, date, and type are required' });
  }
  
  const newEntry = {
    id: Date.now().toString(),
    engineerId,
    date,
    type,
    description: req.body.description || undefined
  };
  
  res.status(201).json(newEntry);
});

export default router;
