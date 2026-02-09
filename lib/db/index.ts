import 'server-only';
import type { Pool } from 'mysql2/promise';

export const db: Pool = (() => {
  if (typeof window !== 'undefined') return {} as any;

  const url = process.env.DATABASE_URL;
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL is not defined in production environment.');
    }
    console.warn('⚠️ DATABASE_URL is not defined. Database features will be unavailable.');
    return {
      query: () => Promise.resolve([[]]),
      execute: () => Promise.resolve([{ insertId: 0 }]),
      end: () => Promise.resolve(),
    } as any;
  }

  const mysql = require('mysql2');
  return mysql.createPool(url).promise();
})() as Pool;
