import { db } from './lib/db';

async function main() {
  try {
    const [rows] = await db.query('SELECT id, username, full_name, created_at, user_id FROM profiles');
    console.log('Profiles in DB:', rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

main();
