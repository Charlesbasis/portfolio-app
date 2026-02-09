import 'server-only';
import type { Pool } from 'mysql2/promise';

export const db: Pool = (() => {
  if (typeof window !== 'undefined') return {} as any;

  const mysql = require('mysql2');
  
  // Direct retrieval to ensure we get the latest process.env
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER;
  const dbPass = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;
  const dbPort = process.env.DB_PORT;

  if (process.env.NODE_ENV === 'production') {
    console.log(`🔌 DB Init: ${dbUser}@${dbHost} -> ${dbName}`);
  }

  if (dbHost && dbUser && dbPass) {
    return mysql.createPool({
      host: dbHost.replace(/['"]/g, ''), // Strip any accidental quotes
      user: dbUser.replace(/['"]/g, ''),
      password: dbPass.replace(/['"]/g, ''),
      database: dbName?.replace(/['"]/g, ''),
      port: Number(dbPort) || 3306,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    }).promise();
  }

  const url = process.env.DATABASE_URL;
  if (url) return mysql.createPool(url).promise();

  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE CONFIGURATION MISSING');
  }

  return {
    query: () => Promise.resolve([[]]),
    execute: () => Promise.resolve([{ insertId: 0 }]),
    end: () => Promise.resolve(),
  } as any;
})() as Pool;
