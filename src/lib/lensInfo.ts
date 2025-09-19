// ダミーのレンズ情報管理（TDD用の最小実装）
export type LensInfo = {
  title: string;
  date: string;
  type: string;
  exchangeDate: string;
  stock: number;
  removeTime?: string; // 毎日外す時間（"HH:mm"形式）
};


import fs from 'fs';
import path from 'path';

function getDbPath(filename: string) {
  // distで動作している場合はdist/db、devならsrc/db
  if (__dirname.includes('dist')) {
    return path.join(__dirname, 'db', filename);
  } else {
    return path.join(__dirname, '../db', filename);
  }
}

const LENS_FILE = getDbPath('lensInfos.json');

function readLensInfos(): LensInfo[] {
  try {
    const data = fs.readFileSync(LENS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeLensInfos(lensInfos: LensInfo[]) {
  fs.writeFileSync(LENS_FILE, JSON.stringify(lensInfos, null, 2), 'utf8');
}


export async function createLensInfo(lensInfo: LensInfo) {
  const lensInfos = readLensInfos();
  lensInfos[0] = lensInfo; // 1件のみ管理
  writeLensInfos(lensInfos);
} //レンズ情報登録

export async function getLensInfos(): Promise<LensInfo[]> {
  return readLensInfos();
} //レンズ情報取得

export function getExchangeDate(lensInfo: LensInfo): string {
  const startDate = new Date(lensInfo.date);
  if (isNaN(startDate.getTime())) {
    // 不正な日付値の場合は空文字を返す
    return '';
  }
  let daysToAdd = 0;
  if (lensInfo.type === '1day') {
    daysToAdd = 1;
  } else if (lensInfo.type === '2week') {
    daysToAdd = 14;
  } else if (lensInfo.type === '1month') {
    daysToAdd = 30;
  }
  startDate.setDate(startDate.getDate() + daysToAdd);
  // YYYY-MM-DD形式で返す
  return startDate.toISOString().slice(0, 10);
}

// 交換日までの残り日数を計算する関数
export function getDaysUntilExchange(lensInfo: LensInfo): number {
  const today = new Date();
  const exchangeDate = new Date(lensInfo.exchangeDate);
  // 日付が不正な場合は-100を返す
  if (isNaN(exchangeDate.getTime())) return -100;
  // 両日付をUTCで比較
  const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const utcExchange = Date.UTC(exchangeDate.getFullYear(), exchangeDate.getMonth(), exchangeDate.getDate());
  return Math.ceil((utcExchange - utcToday) / (1000 * 60 * 60 * 24));
}
