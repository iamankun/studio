import dotenv from 'dotenv';
import pg from 'pg';
import chalk from 'chalk';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const { Pool } = pg;

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error(chalk.red('❌ DATABASE_URL not found'));
  process.exit(1);
}

async function resetDatabase() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  
  try {
    console.log(chalk.blue('🔄 Resetting AKS Studio Database...'));
    
    // Step 1: Drop all existing tables and types
    console.log(chalk.yellow('1️⃣ Dropping existing tables and types...'));
    
    const dropScript = readFileSync('prisma/xaydung/drop.sql', 'utf8');
    await pool.query(dropScript);
    console.log(chalk.green('✅ Dropped existing schema'));
    
    // Step 2: Create new schema
    console.log(chalk.yellow('2️⃣ Creating new schema...'));
    
    const finalScript = readFileSync('prisma/migrations/final.sql', 'utf8');
    await pool.query(finalScript);
    console.log(chalk.green('✅ Created new schema'));
    
    // Step 3: Insert sample data
    console.log(chalk.yellow('3️⃣ Inserting sample data...'));
    
    const { execSync } = await import('child_process');
    execSync('node src/data/tao-du-lieu-mau.js', { stdio: 'inherit' });
    
    console.log(chalk.green('🎉 Database reset completed successfully!'));
    
  } catch (error) {
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDatabase();