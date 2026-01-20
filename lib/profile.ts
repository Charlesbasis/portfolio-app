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

export interface Skill extends RowDataPacket {
  id: number;
  profile_id: number;
  skill_name: string;
}

export interface Experience extends RowDataPacket {
  id: number;
  profile_id: number;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  bullets: string[];
  sort_order: number;
}

export interface Project extends RowDataPacket {
  id: number;
  profile_id: number;
  name: string;
  description: string | null;
  tech_stack: string[];
  url: string | null;
  sort_order: number;
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
  if (fields.length === 0) return (await db.query<Profile[]>('SELECT * FROM profiles WHERE id = ? LIMIT 1', [id]))[0][0];

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

// Skills
export async function getSkillsByProfileId(profileId: string): Promise<Skill[]> {
  const [rows] = await db.query<Skill[]>(
    'SELECT * FROM skills WHERE profile_id = ?',
    [profileId]
  );
  return rows;
}

export async function addSkill(profileId: string, skillName: string): Promise<Skill> {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO skills (profile_id, skill_name) VALUES (?, ?)',
    [profileId, skillName]
  );
  const [rows] = await db.query<Skill[]>('SELECT * FROM skills WHERE id = ?', [result.insertId]);
  return rows[0];
}

export async function deleteSkill(id: string): Promise<void> {
  await db.execute('DELETE FROM skills WHERE id = ?', [id]);
}

// Experiences
export async function getExperiencesByProfileId(profileId: string): Promise<Experience[]> {
  const [rows] = await db.query<any[]>(
    'SELECT * FROM experiences WHERE profile_id = ? ORDER BY sort_order ASC',
    [profileId]
  );
  return rows.map(row => ({
    ...row,
    bullets: typeof row.bullets === 'string' ? JSON.parse(row.bullets) : (row.bullets || []),
    is_current: !!row.is_current
  }));
}

export async function addExperience(experience: Partial<Experience>): Promise<Experience> {
  const data = { ...experience };
  if (data.bullets) (data as any).bullets = JSON.stringify(data.bullets);
  if (data.is_current !== undefined) (data as any).is_current = data.is_current ? 1 : 0;

  const fields = Object.keys(data);
  const values = fields.map(field => (data as any)[field]);
  const placeholders = fields.map(() => '?').join(', ');
  
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO experiences (${fields.join(', ')}) VALUES (${placeholders})`,
    values
  );
  const rows = await getExperiencesByProfileId((data.profile_id as any).toString());
  return rows.find(r => r.id === result.insertId) as Experience;
}

export async function updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
  const data = { ...updates };
  if (data.bullets) (data as any).bullets = JSON.stringify(data.bullets);
  if (data.is_current !== undefined) (data as any).is_current = data.is_current ? 1 : 0;

  const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'profile_id');
  const values = fields.map(field => (data as any)[field]);
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  
  await db.execute(
    `UPDATE experiences SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
  const [rows] = await db.query<any[]>('SELECT * FROM experiences WHERE id = ?', [id]);
  const row = rows[0];
  return {
    ...row,
    bullets: typeof row.bullets === 'string' ? JSON.parse(row.bullets) : (row.bullets || []),
    is_current: !!row.is_current
  } as Experience;
}

export async function deleteExperience(id: string): Promise<void> {
  await db.execute('DELETE FROM experiences WHERE id = ?', [id]);
}

// Projects
export async function getProjectsByProfileId(profileId: string): Promise<Project[]> {
  const [rows] = await db.query<any[]>(
    'SELECT * FROM projects WHERE profile_id = ? ORDER BY sort_order ASC',
    [profileId]
  );
  return rows.map(row => ({
    ...row,
    tech_stack: typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack) : (row.tech_stack || [])
  }));
}

export async function addProject(project: Partial<Project>): Promise<Project> {
  const data = { ...project };
  if (data.tech_stack) (data as any).tech_stack = JSON.stringify(data.tech_stack);

  const fields = Object.keys(data);
  const values = fields.map(field => (data as any)[field]);
  const placeholders = fields.map(() => '?').join(', ');
  
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO projects (${fields.join(', ')}) VALUES (${placeholders})`,
    values
  );
  const rows = await getProjectsByProfileId((data.profile_id as any).toString());
  return rows.find(r => r.id === result.insertId) as Project;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const data = { ...updates };
  if (data.tech_stack) (data as any).tech_stack = JSON.stringify(data.tech_stack);

  const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'profile_id');
  const values = fields.map(field => (data as any)[field]);
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  
  await db.execute(
    `UPDATE projects SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
  const [rows] = await db.query<any[]>('SELECT * FROM projects WHERE id = ?', [id]);
  const row = rows[0];
  return {
    ...row,
    tech_stack: typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack) : (row.tech_stack || [])
  } as Project;
}

export async function deleteProject(id: string): Promise<void> {
  await db.execute('DELETE FROM projects WHERE id = ?', [id]);
}
