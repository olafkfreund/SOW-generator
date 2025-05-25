// Simple JSON-based data persistence layer
import fs from 'fs';
import path from 'path';

export interface Engineer {
  id: string;
  name: string;
  role: string;
  hourlyRate?: number;
  availability?: string;
}

export interface CalendarEntry {
  id: string;
  engineerId: string;
  date: string;
  type: 'vacation' | 'sick' | 'holiday' | 'training';
  description?: string;
}

export interface PriceItem {
  id: string;
  service: string;
  price: number;
  unit: string;
  description?: string;
}

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class DataStore {
  private readData<T>(filename: string): T[] {
    const filePath = path.join(DATA_DIR, filename);
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private writeData<T>(filename: string, data: T[]): void {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  // Engineers
  getEngineers(): Engineer[] {
    return this.readData<Engineer>('engineers.json');
  }

  addEngineer(engineer: Omit<Engineer, 'id'>): Engineer {
    const engineers = this.getEngineers();
    const newEngineer = { ...engineer, id: Date.now().toString() };
    engineers.push(newEngineer);
    this.writeData('engineers.json', engineers);
    return newEngineer;
  }

  updateEngineer(id: string, updates: Partial<Engineer>): Engineer | null {
    const engineers = this.getEngineers();
    const index = engineers.findIndex(e => e.id === id);
    if (index === -1) return null;
    
    engineers[index] = { ...engineers[index], ...updates };
    this.writeData('engineers.json', engineers);
    return engineers[index];
  }

  deleteEngineer(id: string): boolean {
    const engineers = this.getEngineers();
    const filtered = engineers.filter(e => e.id !== id);
    if (filtered.length === engineers.length) return false;
    
    this.writeData('engineers.json', filtered);
    return true;
  }

  // Calendar
  getCalendarEntries(): CalendarEntry[] {
    return this.readData<CalendarEntry>('calendar.json');
  }

  addCalendarEntry(entry: Omit<CalendarEntry, 'id'>): CalendarEntry {
    const entries = this.getCalendarEntries();
    const newEntry = { ...entry, id: Date.now().toString() };
    entries.push(newEntry);
    this.writeData('calendar.json', entries);
    return newEntry;
  }

  deleteCalendarEntry(id: string): boolean {
    const entries = this.getCalendarEntries();
    const filtered = entries.filter(e => e.id !== id);
    if (filtered.length === entries.length) return false;
    
    this.writeData('calendar.json', filtered);
    return true;
  }

  // Pricing
  getPriceItems(): PriceItem[] {
    return this.readData<PriceItem>('pricing.json');
  }

  addPriceItem(item: Omit<PriceItem, 'id'>): PriceItem {
    const items = this.getPriceItems();
    const newItem = { ...item, id: Date.now().toString() };
    items.push(newItem);
    this.writeData('pricing.json', items);
    return newItem;
  }

  updatePriceItem(id: string, updates: Partial<PriceItem>): PriceItem | null {
    const items = this.getPriceItems();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    this.writeData('pricing.json', items);
    return items[index];
  }

  deletePriceItem(id: string): boolean {
    const items = this.getPriceItems();
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length === items.length) return false;
    
    this.writeData('pricing.json', filtered);
    return true;
  }
}

export const dataStore = new DataStore();
