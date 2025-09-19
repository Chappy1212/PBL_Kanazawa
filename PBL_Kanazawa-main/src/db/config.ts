// DBへの接続情報を環境変数から取得.
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } = process.env;
const database = NODE_ENV === 'test' ? 'sample_test' : DB_NAME;

// sample_* はSSL無効, 本番を含めて他は SELF_SIGNED_CERT_IN_CHAIN無視.
const ssl = database!.startsWith('sample_') ? false : { rejectUnauthorized: false };
console.log('database config:', { database, ssl });

export const dbConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database,
  ssl,
};
