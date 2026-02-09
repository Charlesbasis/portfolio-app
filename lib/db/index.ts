import 'server-only';
import type { Pool } from 'mysql2/promise';

export const db: Pool = (() => {
  if (typeof window !== 'undefined') return {} as any;

  const mysql = require('mysql2');
  const url = process.env.DATABASE_URL;

  // Preferred: Individual variables (Safer for special characters)
  if (process.env.DB_HOST && process.env.DB_USER) {
    return mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }).promise();
  }

  // Fallback: Connection string
  if (url) {
    try {
      return mysql.createPool(url).promise();
    } catch (err) {
      console.error('❌ Failed to parse DATABASE_URL. If your password has special characters, use individual DB_* variables instead.');
      throw err;
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Database configuration missing. Set DB_HOST/DB_USER or DATABASE_URL.');
  }

  console.warn('⚠️ No database configuration found. Using mock driver.');
  return {
    query: () => Promise.resolve([[]]),
    execute: () => Promise.resolve([{ insertId: 0 }]),
    end: () => Promise.resolve(),
  } as any;
})() as Pool;
