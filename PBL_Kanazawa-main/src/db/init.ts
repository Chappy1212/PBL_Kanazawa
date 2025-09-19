import { Client } from 'pg';
import { dbConfig } from './config';

async function main(): Promise<void> {
  // DB に接続.
  const client = new Client(dbConfig);
  await client.connect();

  await createTable(createTodoTable, client);

  // DB から切断.
  await client.end();
}

// テーブル作成.
async function createTable(func: (client: Client) => Promise<void>, client: Client): Promise<void> {
  try {
    await func(client);
  } catch (err: unknown) {
    const error = err as { code?: string };
    switch (error.code) {
      case '42P07':
        // テーブルが既に存在する場合は何もしない.
        break;
      default:
        console.error(err);
    }
  }
}

// TODO用のテーブルとデータを作成.
async function createTodoTable(client: Client): Promise<void> {
  // todoテーブルを作成する.
  await client.query(`CREATE TABLE todo (
    id SERIAL PRIMARY KEY,          -- id は自動採番
    title VARCHAR(255),             -- 255文字以下の文字列
    completed BOOLEAN DEFAULT false -- 真偽値
  )`);
  // 初期データを挿入する.
  const seedData = [
    { title: 'todo 1' },
    { title: 'todo 2' },
    { title: 'todo 3' },
  ];
  for (const { title } of seedData) {
    await client.query('INSERT INTO todo (title) VALUES ($1)', [title]);
  }
}

main();
