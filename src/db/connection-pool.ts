import { Pool } from 'pg';
import { dbConfig } from './config';

export const connectionPool = new Pool({
  ...dbConfig,
  max: 10,
});
