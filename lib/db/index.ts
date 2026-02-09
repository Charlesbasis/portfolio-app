import 'server-only';
import type { Pool } from 'mysql2/promise';

export const db: Pool = (() => {
  if (typeof window !== 'undefined') return {} as any;

  const mysql = require('mysql2');

  // Helper to get sanitized env var (trims quotes and whitespace)
  const getEnv = (key: string) => process.env[key]?.replace(/^["']|["']$/g, '').trim();

  const dbHost = getEnv('DB_HOST');
  const dbUser = getEnv('DB_USER');
  const dbPass = getEnv('DB_PASSWORD');
  const dbName = getEnv('DB_NAME');
  const dbPort = getEnv('DB_PORT');
  const url = process.env.DATABASE_URL;

  // Preferred: Individual variables (Safer for special characters)
  if (dbHost && dbUser) {
    if (process.env.NODE_ENV === 'production') {
      console.log(`🔌 Connecting to MySQL: ${dbUser}@${dbHost}:${dbPort || 3306}/${dbName} (Pass Length: ${dbPass?.length || 0})`);
    }
    return mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPass,
      database: dbName,
      port: Number(dbPort) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
      connectTimeout: 10000
    }).promise();
  } else if (process.env.NODE_ENV === 'production' && !url) {
    throw new Error(`Critical DB environment variables missing: DB_HOST=${!!dbHost}, DB_USER=${!!dbUser}. Check if .env is being loaded.`);
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
