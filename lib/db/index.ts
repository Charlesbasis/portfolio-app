import 'server-only';
import type { Pool } from 'mysql2/promise';

export const db: Pool = (() => {
  if (typeof window !== 'undefined') return {} as any;
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  // Use require to bypass potential bundling issues with native modules
  const mysql = require('mysql2');
  return mysql.createPool(process.env.DATABASE_URL).promise();
})() as Pool;
