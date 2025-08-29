#!/usr/bin/env node
// Script setup Prisma cho An Kun Studio
// Tác giả: An Kun Studio Digital Music Distribution

import { execSync } from 'child_process';
import chalk from 'chalk';

console.log(chalk.blue('🔧 Setting up Prisma for An Kun Studio...'));

try {
  // Generate Prisma Client
  console.log(chalk.yellow('📦 Generating Prisma Client...'));
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push schema to database (for development)
  console.log(chalk.yellow('🗄️ Pushing schema to database...'));
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log(chalk.green('✅ Prisma setup completed successfully!'));
  
} catch (error) {
  console.error(chalk.red('❌ Prisma setup failed:'), error.message);
  process.exit(1);
}