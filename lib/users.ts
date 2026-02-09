import { db } from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface DbUser extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  name: string;
  wp_id?: number;
  created_at: Date;
}

export type NewUser = Omit<DbUser, 'id' | 'created_at'>;

export async function getUserByEmail(email: string): Promise<DbUser | undefined> {
  const [rows] = await db.query<DbUser[]>(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0];
}

export async function createUser(userData: NewUser): Promise<DbUser> {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO users (email, password, name, wp_id) VALUES (?, ?, ?, ?)',
    [userData.email, userData.password, userData.name, userData.wp_id || null]
  );

  const [rows] = await db.query<DbUser[]>(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [result.insertId]
  );

  if (!rows[0]) {
    throw new Error('Failed to retrieve user after creation');
  }

  return rows[0];
}

export async function updateUserWpId(userId: number, wpId: number): Promise<void> {
  await db.execute(
    'UPDATE users SET wp_id = ? WHERE id = ?',
    [wpId, userId]
  );
}
