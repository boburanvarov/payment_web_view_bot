const fs = require('fs');
const path = require('path');

// Read package.json to get current version
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageJson.version;

// Update environment files
const envFiles = [
    'src/environments/environment.ts',
    'src/environments/environment.prod.ts'
];

envFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/version:\s*['"][^'"]+['"]/g, `version: '${version}'`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file} to version ${version}`);
    }
});

console.log(`Version synced to ${version}`);
