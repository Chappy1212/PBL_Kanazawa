import express from 'express';
import path from 'path';
import fs from 'fs';
import { getExchangeDate, LensInfo, createLensInfo, getLensInfos } from './lib/lensInfo';
import { exchangeStock, getHistory, clearHistoryItem, history as exchangeHistory } from './lib/stock';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// クリアAPI: 登録情報と履歴を全て削除
app.post('/api/clear', (req, res) => {
  // レンズ情報ファイルを空にする
  const LENS_FILE = path.join(__dirname, 'db', 'lensInfos.json');
  fs.writeFileSync(LENS_FILE, '[]', 'utf8');
  exchangeHistory.length = 0;
  // 履歴ファイルも空にする
  const HISTORY_FILE = path.join(__dirname, 'db', 'exchangeHistory.json');
  fs.writeFileSync(HISTORY_FILE, '[]', 'utf8');
  res.redirect('/register');
});


// ホーム画面: レンズ情報表示
app.get('/', async (req, res) => {
  const lensInfos = await getLensInfos();
  let daysUntilExchange = null;
  if (lensInfos.length > 0) {
    // 残り日数を計算
    const { getDaysUntilExchange } = await import('./lib/lensInfo');
    daysUntilExchange = getDaysUntilExchange(lensInfos[0]);
  }
  res.render('home', { lensInfos, daysUntilExchange });
});

// 履歴画面: 交換履歴表示
app.get('/history', (req, res) => {
  const history = getHistory();
  res.render('history', { history });
});

// 登録画面: リマインダー登録フォーム
app.get('/register', (req, res) => {
  res.render('register');
});

// 設定フォーム
app.get('/settings', async (req, res) => {
  const lensInfos = await getLensInfos();
  const lensInfo = lensInfos[0] || {};
  res.render('settings', { lensInfo });
});

// 登録API
app.post('/api/reminder', async (req, res) => {
  const { title, date, type, stock, removeTime} = req.body;
  const tempLensInfo: LensInfo = { title, date, type, exchangeDate: '', stock: Number(stock ?? 1), removeTime};
  const exchangeDate = getExchangeDate(tempLensInfo);
  const lensInfo: LensInfo = { ...tempLensInfo, exchangeDate };
  await createLensInfo(lensInfo);
  res.redirect('/'); // 登録完了後ホーム画面へリダイレクト
});

// 設定API
app.post('/api/settings', async (req, res) => {
  const { title, date, type, stock, removeTime} = req.body;
  const tempLensInfo: LensInfo = { title, date, type, exchangeDate: '', stock: Number(stock ?? 1), removeTime};
  const exchangeDate = getExchangeDate(tempLensInfo);
  const lensInfo: LensInfo = { ...tempLensInfo, exchangeDate };
  await createLensInfo(lensInfo);
  res.redirect('/'); // 登録完了後ホーム画面へリダイレクト
});

// 一覧取得API
app.get('/api/reminder', async (req, res) => {
  const lensInfos = await getLensInfos();
  res.json(lensInfos);
});

// 履歴削除API
app.post('/api/history/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  clearHistoryItem(id);
  res.redirect('/history');
});

// 交換API
app.post('/api/exchange', async (req, res) => {
  const lensInfos = await getLensInfos();
  if (lensInfos.length > 0) {
    const lensInfo = lensInfos[0];
    const stock = Number(lensInfo.stock ?? 1);
    exchangeStock(lensInfo.title, stock);
    // 在庫数を1減らす
    lensInfo.stock = Math.max(stock - 1, 0);
    // 交換日・dateを更新
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    lensInfo.date = `${yyyy}-${mm}-${dd}`;
    // レンズタイプに応じて交換日を再計算
    const { getExchangeDate } = await import('./lib/lensInfo');
    lensInfo.exchangeDate = getExchangeDate(lensInfo);
    await createLensInfo(lensInfo);
  }
  res.redirect('/');
});

export { app };