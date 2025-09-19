// APIレスポンステスト
// 例: /api/exchange, /api/clear のレスポンスが正しいか
import request from 'supertest';
import { app } from '../src/app';

describe('APIレスポンス', () => {
  // GET: ホーム画面
  it('GET / は200でHTMLを返す', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  // GET: 履歴画面
  it('GET /history は200でHTMLを返す', async () => {
    const res = await request(app).get('/history');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  // GET: 登録画面
  it('GET /register は200でHTMLを返す', async () => {
    const res = await request(app).get('/register');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  // GET: 設定画面
  it('GET /settings は200でHTMLを返す', async () => {
    const res = await request(app).get('/settings');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  // GET: レンズ情報一覧取得API
  it('GET /api/reminder は200でJSONを返す', async () => {
    const res = await request(app).get('/api/reminder');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // POST: クリアAPI
  it('POST /api/clear 正常系', async () => {
    const res = await request(app).post('/api/clear');
    expect(res.status).toBeGreaterThanOrEqual(300); // リダイレクト
    expect(res.headers['location']).toBe('/register');
  });

  // POST: リマインダー登録API
  it('POST /api/reminder 正常系', async () => {
    const res = await request(app)
      .post('/api/reminder')
      .send({ title: 'テスト', date: '2025-09-10', type: '1day', stock: 1, removeTime: '12:00' });
    expect(res.status).toBeGreaterThanOrEqual(300); // リダイレクト
    expect(res.headers['location']).toBe('/');
  });

  // POST: 設定登録API
  it('POST /api/settings 正常系', async () => {
    const res = await request(app)
      .post('/api/settings')
      .send({ title: 'テスト', date: '2025-09-10', type: '1day', stock: 1, removeTime: '12:00' });
    expect(res.status).toBeGreaterThanOrEqual(300); // リダイレクト
    expect(res.headers['location']).toBe('/');
  });

  // POST: 交換API
  it('POST /api/exchange 正常系', async () => {
    const res = await request(app).post('/api/exchange');
    expect(res.status).toBeGreaterThanOrEqual(300); // リダイレクト
    expect(res.headers['location']).toBe('/');
  });
});
