#!/usr/bin/env node

/**
 * Environment Validation Script - Step 7.4
 * Validates all environment variables and connections for VNPT cPanel deployment
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env.local') });

console.log('🔍 Environment Validation - Step 7.4');
console.log('=====================================');

const validationResults = [];

// 1. Database Configuration Validation
console.log('\n📊 Database Configuration:');
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  console.log('✅ DATABASE_URL configured');
  if (dbUrl.includes('postgresql://')) {
    console.log('✅ PostgreSQL connection string detected');
    console.log(`   Host: ${dbUrl.match(/@([^:]+)/)?.[1] || 'unknown'}`);
    console.log(`   Database: ${dbUrl.match(/\/([^?]+)/)?.[1] || 'unknown'}`);
    validationResults.push({ test: 'Database URL', status: 'PASS' });
  } else {
    console.log('❌ Invalid database URL format');
    validationResults.push({ test: 'Database URL', status: 'FAIL' });
  }
} else {
  console.log('❌ DATABASE_URL not configured');
  validationResults.push({ test: 'Database URL', status: 'FAIL' });
}

// 2. SMTP Configuration Validation
console.log('\n📧 SMTP Configuration:');
const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from: process.env.SMTP_FROM,
  name: process.env.SMTP_NAME
};

let smtpValid = true;
Object.entries(smtpConfig).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ SMTP_${key.toUpperCase()}: ${key === 'pass' ? '***' : value}`);
  } else {
    console.log(`❌ SMTP_${key.toUpperCase()}: Missing`);
    smtpValid = false;
  }
});

validationResults.push({ test: 'SMTP Configuration', status: smtpValid ? 'PASS' : 'FAIL' });

// 3. Authentication Configuration
console.log('\n🔐 Authentication Configuration:');
const authUrl = process.env.NEXTAUTH_URL;
const authSecret = process.env.NEXTAUTH_SECRET;

if (authUrl) {
  console.log(`✅ NEXTAUTH_URL: ${authUrl}`);
  validationResults.push({ test: 'Auth URL', status: 'PASS' });
} else {
  console.log('❌ NEXTAUTH_URL: Missing');
  validationResults.push({ test: 'Auth URL', status: 'FAIL' });
}

if (authSecret && authSecret !== 'your_nextauth_secret') {
  console.log('✅ NEXTAUTH_SECRET: Configured');
  validationResults.push({ test: 'Auth Secret', status: 'PASS' });
} else {
  console.log('❌ NEXTAUTH_SECRET: Missing or default value');
  validationResults.push({ test: 'Auth Secret', status: 'FAIL' });
}

// 4. WordPress Integration (Optional)
console.log('\n🔗 WordPress Integration:');
const wpUrl = process.env.WORDPRESS_GRAPHQL_URL;
const wpKey = process.env.WORDPRESS_API_KEY;

if (wpUrl && wpUrl !== 'https://ankun.dev/graphql') {
  console.log(`✅ WordPress GraphQL URL: ${wpUrl}`);
} else {
  console.log('⚠️  WordPress GraphQL URL: Using default (may need update)');
}

if (wpKey && wpKey !== 'your_wordpress_api_key') {
  console.log('✅ WordPress API Key: Configured');
} else {
  console.log('⚠️  WordPress API Key: Using default (may need update)');
}

// 5. Company Information
console.log('\n🏢 Company Information:');
const companyInfo = {
  name: process.env.COMPANY_NAME,
  email: process.env.COMPANY_EMAIL,
  phone: process.env.COMPANY_PHONE,
  address: process.env.COMPANY_ADDRESS,
  website: process.env.COMPANY_WEBSITE
};

let companyValid = true;
Object.entries(companyInfo).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ COMPANY_${key.toUpperCase()}: ${value}`);
  } else {
    console.log(`❌ COMPANY_${key.toUpperCase()}: Missing`);
    companyValid = false;
  }
});

validationResults.push({ test: 'Company Information', status: companyValid ? 'PASS' : 'FAIL' });

// 6. Environment Mode
console.log('\n🌍 Environment Mode:');
const nodeEnv = process.env.NODE_ENV;
if (nodeEnv === 'production') {
  console.log('✅ NODE_ENV: production (ready for deployment)');
  validationResults.push({ test: 'Environment Mode', status: 'PASS' });
} else {
  console.log(`⚠️  NODE_ENV: ${nodeEnv || 'not set'} (consider setting to production)`);
  validationResults.push({ test: 'Environment Mode', status: 'WARN' });
}

// Summary
console.log('\n📋 Validation Summary:');
console.log('=====================');

const passed = validationResults.filter(r => r.status === 'PASS').length;
const failed = validationResults.filter(r => r.status === 'FAIL').length;
const warnings = validationResults.filter(r => r.status === 'WARN').length;

validationResults.forEach(result => {
  const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${result.test}: ${result.status}`);
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${warnings} warnings`);

if (failed === 0) {
  console.log('\n🎉 Environment validation completed successfully!');
  console.log('✅ Ready for Step 7.5 - Final Testing & TypeScript Compilation');
  process.exit(0);
} else {
  console.log('\n⚠️  Environment validation found issues that need attention.');
  console.log('Please fix the failed items before proceeding to Step 7.5');
  process.exit(1);
}