import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFileName(month, year) {
  return `${month.toLowerCase()}_${year}_expense.json`;
}

export function getMonthYearFromDate(dateStr) {
  const d = new Date(dateStr);
  const month = d.toLocaleString('en-US', { month: 'long' });
  const year = d.getFullYear();
  return { month, year };
}

export function readMonthFile(month, year) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, getFileName(month, year));
  if (!fs.existsSync(filePath)) return { month, year, entries: [] };
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function writeMonthFile(month, year, data) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, getFileName(month, year));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function listAvailableMonths() {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('_expense.json'));
  return files
    .map(f => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf-8')))
    .map(({ month, year }) => ({ month, year }))
    .sort((a, b) => new Date(`${b.month} 1, ${b.year}`) - new Date(`${a.month} 1, ${a.year}`));
}