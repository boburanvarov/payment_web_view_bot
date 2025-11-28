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

// Update environment files with new version (preserve existing apiUrl)
const envPath = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');
const envProdPath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');

// Function to update only version in environment file
function updateVersionInFile(filePath, newVersion) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace only the version line, preserve apiUrl and other settings
    content = content.replace(/version:\s*['"][^'"]*['"]/g, `version: '${newVersion}'`);
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.warn(`⚠️  Could not update ${filePath}:`, error.message);
    return false;
  }
}

updateVersionInFile(envPath, newVersion);
updateVersionInFile(envProdPath, newVersion);

console.log(`📝 Updated environment files with version ${newVersion} (apiUrl preserved)`);

// Stage the updated files
try {
  execSync('git add package.json src/environments/environment.ts src/environments/environment.prod.ts', { stdio: 'inherit' });
  console.log('✅ Version files staged for commit');
} catch (error) {
  console.log('⚠️  Not in a git repository or git not available');
}
