// 交換履歴管理のテスト
// このテストは、交換履歴が正しく保存・取得・クリアされることを保証します。
import { exchangeStock, getHistory, clearHistoryItem } from '../src/lib/stock';
import { createLensInfo } from '../src/lib/lensInfo';
import fs from 'fs';
import path from 'path';

const HISTORY_FILE = path.join(__dirname, '../src/db/exchangeHistory.json');
const LENSINFOS_FILE = path.join(__dirname, '../src/db/lensInfos.json');

describe('交換履歴管理', () => {
  beforeEach(() => {
    // 履歴ファイルとレンズ情報ファイルを初期化
    fs.writeFileSync(HISTORY_FILE, '[]', 'utf8');
    fs.writeFileSync(LENSINFOS_FILE, '[]', 'utf8');
  });

  it('交換すると履歴に1件追加される', async () => {
    // テスト用レンズ情報を登録
    await createLensInfo({
      title: 'テストレンズ',
      date: '2025-09-01',
      type: '1day',
      exchangeDate: '2025-09-02',
      stock: 5,
      removeTime: '12:00'
    });
    // 交換処理を実行
    await exchangeStock('テストレンズ', 5);
    // 履歴取得
    const history = getHistory();
    // 履歴が1件追加されていること
    expect(history.length).toBe(1);
    // 履歴内容が正しいこと
    expect(history[0].title).toBe('テストレンズ');
    expect(history[0].stock).toBe(5);
    expect(history[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('複数回交換すると履歴がその回数分追加される', async () => {
    await createLensInfo({
      title: 'A',
      date: '2025-09-01',
      type: '1day',
      exchangeDate: '2025-09-02',
      stock: 2,
      removeTime: '12:00'
    });
    await createLensInfo({
      title: 'B',
      date: '2025-09-01',
      type: '1day',
      exchangeDate: '2025-09-02',
      stock: 1,
      removeTime: '12:00'
    });
    await exchangeStock('A', 2);
    await exchangeStock('B', 1);
    const history = getHistory();
    expect(history.length).toBe(2);
    expect(history[0].title).toBe('A');
    expect(history[1].title).toBe('B');
  });

  it('履歴ファイルをクリアすると履歴が空になる', async () => {
    await createLensInfo({
      title: 'A',
      date: '2025-09-01',
      type: '1day',
      exchangeDate: '2025-09-02',
      stock: 2,
      removeTime: '12:00'
    });
    await exchangeStock('A', 2);
    // 履歴ファイルを手動でクリア
    fs.writeFileSync(HISTORY_FILE, '[]', 'utf8');
    const history = getHistory();
    expect(history.length).toBe(0);
  });
});

describe('個別履歴削除', () => {
  beforeEach(() => {
    // 履歴ファイルとレンズ情報ファイルを初期化
    fs.writeFileSync(LENSINFOS_FILE, '[]', 'utf8');

    // テスト用の履歴データを直接書き込む
    const testHistory = [
      {
        'id': 1,
        'title': 'アキュビューモイスト',
        'date': '2025-09-16',
        'stock': 30,
        'startDate': '2025-09-09',
        'usedDays': 7,
        'type': '2week'
      },
      {
        'id': 2,
        'title': 'バイオフィニティ',
        'date': '2025-09-15',
        'stock': 5,
        'startDate': '2025-09-01',
        'usedDays': 14,
        'type': '2week'
      },
      {
        'id': 3,
        'title': 'ワンデーピュア',
        'date': '2025-09-14',
        'stock': 3,
        'startDate': '2025-09-14',
        'usedDays': 0,
        'type': '1day'
      }
    ];
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(testHistory, null, 2), 'utf8');
  });

  it('指定したIDの履歴を削除できる', () => {
    const initialHistory = getHistory();
    expect(initialHistory.length).toBe(3);

    // ID:2 の履歴を削除
    clearHistoryItem(2);

    const currentHistory = getHistory();
    expect(currentHistory.length).toBe(2);
    // 残った履歴のIDを確認
    expect(currentHistory.find(h => h.id === 2)).toBeUndefined();
    expect(currentHistory.map(h => h.title)).toEqual(['アキュビューモイスト', 'ワンデーピュア']);
  });

  it('存在しないIDを指定してもエラーにならない', () => {
    const initialHistory = getHistory();
    expect(initialHistory.length).toBe(3);

    // 存在しないID: 99 を指定
    clearHistoryItem(99);

    const currentHistory = getHistory();
    // 履歴の件数が変わらないことを確認
    expect(currentHistory.length).toBe(3);
  });
});

describe('exchangeStock usedDays', () => {
  beforeEach(async () => {
    // 履歴ファイルとレンズ情報ファイルを初期化
    fs.writeFileSync(HISTORY_FILE, '[]', 'utf8');
    fs.writeFileSync(LENSINFOS_FILE, '[]', 'utf8');
    // テスト用レンズ情報を登録
    await createLensInfo({
      title: 'テストレンズ',
      date: '2025-09-01', // 開始日
      type: '1day',
      exchangeDate: '2025-09-02',
      stock: 10,
      removeTime: '12:00'
    });
  });

  it('交換時にusedDaysが正しく記録される', async () => {
    await exchangeStock('テストレンズ', 10);
    const history = getHistory();
    const last = history[history.length - 1];
    expect(last.title).toBe('テストレンズ');
    expect(typeof last.usedDays).toBe('number');
    // 交換日と開始日の差分がusedDaysになる
    const today = new Date().toISOString().slice(0, 10);
    const expectedDays = Math.ceil((new Date(today).getTime() - new Date('2025-09-01').getTime()) / (1000 * 60 * 60 * 24));
    expect(last.usedDays).toBe(expectedDays);
  });
});