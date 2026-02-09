import fs from 'fs';
import path from 'path';
import { db } from './index';

async function setup() {
    console.log('🚀 Starting database setup...');

    try {
        const sqlPath = path.join(process.cwd(), 'lib/db/init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split the SQL into individual statements
        // This is a simple split, might need to be more robust for complex SQL
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`📜 Found ${statements.length} SQL statements.`);

        for (const statement of statements) {
            console.log(`⏳ Executing: ${statement.substring(0, 50)}...`);
            await db.execute(statement);
        }

        console.log('✅ Database setup complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup failed:');
        console.error(error);
        process.exit(1);
    }
}

setup();
