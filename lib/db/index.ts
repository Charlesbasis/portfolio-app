import type { Pool } from 'mysql2/promise';

export const db: Pool = (() => {
  if (typeof window !== 'undefined') return {} as any;

  // Direct retrieval with aggressive sanitation
  const mysql = require('mysql2');
  const cleanEnv = (val: string | undefined) => val?.replace(/['"]/g, '').trim() || '';

  const dbHost = cleanEnv(process.env.DB_HOST) || '127.0.0.1';
  const dbUser = cleanEnv(process.env.DB_USER);
  const dbPass = cleanEnv(process.env.DB_PASSWORD);
  const dbName = cleanEnv(process.env.DB_NAME);
  const dbPort = cleanEnv(process.env.DB_PORT);

  if (process.env.NODE_ENV === 'production') {
    // This will help us see if there are any weird characters lurking
    console.log(`🔌 DB Init: User=[${dbUser}] Host=[${dbHost}] DB=[${dbName}] Port=[${dbPort || 3306}]`);
  }

  if (dbHost && dbUser && dbPass) {
    return mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPass,
      database: dbName,
      port: Number(dbPort) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 20000, // Longer timeout for remote connections
      enableKeepAlive: true,
      dateStrings: true
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
