import { db } from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Profile as IProfile, Skill as ISkill, Experience as IExperience, Project as IProject } from './types';

export interface Profile extends IProfile, RowDataPacket { }
export interface Skill extends ISkill, RowDataPacket { }
export interface Experience extends IExperience, RowDataPacket { }
export interface Project extends IProject, RowDataPacket { }

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

export async function getFirstProfile(): Promise<Profile | undefined> {
  const [rows] = await db.query<Profile[]>(
    'SELECT * FROM profiles ORDER BY created_at DESC LIMIT 1'
  );
  return rows[0];
}

export async function getPrimaryProfile(): Promise<Profile | undefined> {
  // Try to get the one with most content or most recently updated
  const [rows] = await db.query<Profile[]>(
    'SELECT * FROM profiles ORDER BY updated_at DESC LIMIT 1'
  );
  return rows[0];
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
  await touchProfile(profileId);
  const [rows] = await db.query<Skill[]>('SELECT * FROM skills WHERE id = ?', [result.insertId]);
  return rows[0];
}

export async function deleteSkill(id: string): Promise<void> {
  const [rows] = await db.query<Skill[]>('SELECT profile_id FROM skills WHERE id = ?', [id]);
  if (rows[0]) {
    const profileId = rows[0].profile_id;
    await db.execute('DELETE FROM skills WHERE id = ?', [id]);
    await touchProfile(profileId.toString());
  }
}

export async function touchProfile(id: string): Promise<void> {
  await db.execute(
    'UPDATE profiles SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
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
  if (data.profile_id) await touchProfile(data.profile_id.toString());
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

  const [current] = await db.query<any[]>('SELECT profile_id FROM experiences WHERE id = ?', [id]);
  if (current[0]) await touchProfile(current[0].profile_id.toString());

  const [rows] = await db.query<any[]>('SELECT * FROM experiences WHERE id = ?', [id]);
  const row = rows[0];
  return {
    ...row,
    bullets: typeof row.bullets === 'string' ? JSON.parse(row.bullets) : (row.bullets || []),
    is_current: !!row.is_current
  } as Experience;
}

export async function deleteExperience(id: string): Promise<void> {
  const [rows] = await db.query<any[]>('SELECT profile_id FROM experiences WHERE id = ?', [id]);
  if (rows[0]) {
    const profileId = rows[0].profile_id;
    await db.execute('DELETE FROM experiences WHERE id = ?', [id]);
    await touchProfile(profileId.toString());
  }
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
  if (data.profile_id) await touchProfile(data.profile_id.toString());
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

  const [current] = await db.query<any[]>('SELECT profile_id FROM projects WHERE id = ?', [id]);
  if (current[0]) await touchProfile(current[0].profile_id.toString());

  const [rows] = await db.query<any[]>('SELECT * FROM projects WHERE id = ?', [id]);
  const row = rows[0];
  return {
    ...row,
    tech_stack: typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack) : (row.tech_stack || [])
  } as Project;
}

export async function deleteProject(id: string): Promise<void> {
  const [rows] = await db.query<any[]>('SELECT profile_id FROM projects WHERE id = ?', [id]);
  if (rows[0]) {
    const profileId = rows[0].profile_id;
    await db.execute('DELETE FROM projects WHERE id = ?', [id]);
    await touchProfile(profileId.toString());
  }
}

export async function getAllProfiles(): Promise<Profile[]> {
  const [rows] = await db.query<Profile[]>(
    'SELECT * FROM profiles ORDER BY updated_at DESC'
  );
  return rows;
}
