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

// GET /api/pricing - List price items
router.get('/', (req: Request, res: Response) => {
  const items = readJsonData('pricing.json');
  res.json(items);
});

// POST /api/pricing - Add price item
router.post('/', (req: Request, res: Response) => {
  const { service, price } = req.body;
  if (!service || price === undefined) {
    return res.status(400).json({ error: 'Service name and price are required' });
  }
  
  const newItem = {
    id: Date.now().toString(),
    service,
    price: parseFloat(price),
    unit: req.body.unit || 'each',
    description: req.body.description || undefined
  };
  
  res.status(201).json(newItem);
});

export default router;
