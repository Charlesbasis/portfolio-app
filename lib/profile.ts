import { db } from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Profile extends RowDataPacket {
  id: number;
  user_id: string;
  username: string;
  full_name: string;
  role: string;
  location: string | null;
  headline: string | null;
  summary: string | null;
  contact_email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function getProfileByUserId(userId: string): Promise<Profile | undefined> {
  const [rows] = await db.query<Profile[]>(
    'SELECT * FROM profiles WHERE user_id = ? LIMIT 1',
    [userId]
  );
  return rows[0];
}

export async function getProfileByUsername(username: string): Promise<Profile | undefined> {
  const [rows] = await db.query<Profile[]>(
    'SELECT * FROM profiles WHERE username = ? LIMIT 1',
    [username]
  );
  return rows[0];
}

export async function createProfile(profileData: {
  user_id: string;
  username: string;
  full_name: string;
}): Promise<Profile> {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO profiles (user_id, username, full_name) VALUES (?, ?, ?)',
    [profileData.user_id, profileData.username, profileData.full_name]
  );
  
  const [rows] = await db.query<Profile[]>(
    'SELECT * FROM profiles WHERE id = ? LIMIT 1',
    [result.insertId]
  );
  return rows[0];
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
  const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'user_id' && key !== 'created_at' && key !== 'updated_at');
  const values = fields.map(field => (updates as any)[field]);
  
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  
  await db.execute(
    `UPDATE profiles SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [...values, id]
  );

  const [rows] = await db.query<Profile[]>(
    'SELECT * FROM profiles WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0];
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT id FROM profiles WHERE username = ? LIMIT 1',
    [username]
  );
  return rows.length === 0;
}
