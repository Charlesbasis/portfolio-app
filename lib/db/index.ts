import 'server-only';
import type { Pool } from 'mysql2/promise';

export const db: Pool = (() => {
  if (typeof window !== 'undefined') return {} as any;

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn('⚠️ DATABASE_URL is not defined. Database features will be unavailable.');
    return {
      query: () => Promise.resolve([[]]),
      execute: () => Promise.resolve([{ insertId: 0 }]),
      end: () => Promise.resolve(),
    } as any;
  }

  // Use require to bypass potential bundling issues with native modules
  const mysql = require('mysql2');
  return mysql.createPool(url).promise();
})() as Pool;
