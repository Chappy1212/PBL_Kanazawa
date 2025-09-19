// Setup file for tests (spec/* and tests/*)
import { spawnSync } from 'node:child_process';
import { Client } from 'pg';
import { dbConfig } from '@/db/config';

// テーブル一覧を取得・削除
async function dropTables() {
  const client = new Client(dbConfig);
  await client.connect();

  const { rows } = await client.query('SELECT tablename FROM pg_tables WHERE schemaname = \'public\'');

  await Promise.all(rows.map((table) => {
    return client.query(`DROP TABLE ${table.tablename}`);
  }));

  client.end();
}

// テーブル作成・初期データ挿入
async function initTables() {
  spawnSync('npm', ['run', 'db:init'], { env: process.env });
}

beforeAll(async () => {
  await dropTables();
  await initTables();
});
