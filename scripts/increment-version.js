#!/usr/bin/env node

/**
 * Auto Version Increment Script
 * Automatically increments patch version on every git push
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get current version
const currentVersion = packageJson.version;
console.log(`📦 Current version: ${currentVersion}`);

// Increment patch version
const versionParts = currentVersion.split('.');
versionParts[2] = parseInt(versionParts[2]) + 1;
const newVersion = versionParts.join('.');

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');

console.log(`✅ Version incremented: ${currentVersion} → ${newVersion}`);

// Update environment files with new version
const envPath = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');
const envProdPath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');

const envContent = `export const environment = {
  production: false,
  apiUrl: 'https://api.kartaxabar.uz',
  version: '${newVersion}'
};
`;

const envProdContent = `export const environment = {
  production: true,
  apiUrl: 'https://api.kartaxabar.uz',
  version: '${newVersion}'
};
`;

fs.writeFileSync(envPath, envContent, 'utf8');
fs.writeFileSync(envProdPath, envProdContent, 'utf8');

console.log(`📝 Updated environment files with version ${newVersion}`);

// Stage the updated files
try {
    execSync('git add package.json src/environments/environment.ts src/environments/environment.prod.ts', { stdio: 'inherit' });
    console.log('✅ Version files staged for commit');
} catch (error) {
    console.log('⚠️  Not in a git repository or git not available');
}
