const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy CJS files
fs.copyFileSync('dist/cjs/index.js', 'dist/index.js');
fs.copyFileSync('dist/cjs/index.d.ts', 'dist/index.d.ts');

// Copy ESM files and rename
fs.copyFileSync('dist/esm/index.js', 'dist/index.mjs');

// Copy component files
fs.cpSync('dist/cjs/components', 'dist/components', { recursive: true });
fs.cpSync('dist/cjs/fonts', 'dist/fonts', { recursive: true });

// Clean up intermediate directories
fs.rmSync('dist/cjs', { recursive: true });
fs.rmSync('dist/esm', { recursive: true }); 