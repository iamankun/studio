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

async function setupDatabase() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  
  try {
    console.log(chalk.blue('🎵 Setting up AKS Studio Database...'));
    
    // Step 1: Create schema
    console.log(chalk.yellow('1️⃣ Creating database schema...'));
    
    const finalScript = readFileSync('f:/studio/prisma/xaydung/final.sql', 'utf8');
    await pool.query(finalScript);
    console.log(chalk.green('✅ Schema created successfully'));
    
    console.log(chalk.green('🎉 Database setup completed!'));
    console.log(chalk.blue('Now run: node src/data/tao-du-lieu-mau.js'));
    
  } catch (error) {
    console.error(chalk.red('❌ Error:'), error.message);
    if (error.message.includes('already exists')) {
      console.log(chalk.yellow('⚠️  Some objects already exist, continuing...'));
    } else {
      process.exit(1);
    }
  } finally {
    await pool.end();
  }
}

setupDatabase();