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

// GET /api/engineers - List engineers
router.get('/', (req: Request, res: Response) => {
  const engineers = readJsonData('engineers.json');
  res.json(engineers);
});

// POST /api/engineers - Add engineer
router.post('/', (req: Request, res: Response) => {
  const { name, role } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }
  
  const newEngineer = {
    id: Date.now().toString(),
    name,
    role,
    hourlyRate: req.body.hourlyRate || undefined,
    availability: req.body.availability || undefined
  };
  
  res.status(201).json(newEngineer);
});

export default router;
