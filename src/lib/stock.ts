type HistoryItem = {
  id?: number;
  title: string;
  date: string;
  stock: number;
  startDate?: string;
  usedDays?: number;
  type?: string
};

function writeHistory(history: HistoryItem[]) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
}

import fs from 'fs';
import path from 'path';

function getDbPath(filename: string) {
  if (__dirname.includes('dist')) {
    return path.join(__dirname, 'db', filename);
  } else {
    return path.join(__dirname, '../db', filename);
  }
}

const HISTORY_FILE = getDbPath('exchangeHistory.json');

function readHistory(): HistoryItem[] {
  try {
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}
export const history: HistoryItem[] = [];

import { getLensInfos } from './lensInfo';
import { error } from 'console';

export async function exchangeStock(title: string, stock: number) {
  const history = readHistory();
  const newId = Math.max(0, ...history.map(h => h.id || 0)) + 1;
  let startDate = '';
  let usedDays = undefined;
  let lensType = undefined;
  try {
    const lensInfos = await getLensInfos();
    const info = lensInfos.find(l => l.title === title); //交換対象のタイトル（引数title）と一致するレンズ情報を探す
    if (info) {
      startDate = info.date;
      lensType = info.type;
      const today = new Date().toISOString().slice(0, 10);
      if (startDate) {
        usedDays = Math.ceil((new Date(today).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      }
    }
  } catch {
    console.error('エラー', error);
  }
  history.push({ id: newId, title, date: new Date().toISOString().slice(0, 10), stock, startDate, usedDays, type: lensType });
  writeHistory(history);
}

export function getHistory() {
  return readHistory();
}

export function clearHistoryItem(id: number) {
  let history = readHistory();
  history = history.filter(item => item.id !== id);
  writeHistory(history);
}

