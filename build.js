const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Wait for TypeScript compilation to complete
setTimeout(() => {
  // Copy CJS files
  if (fs.existsSync('dist/cjs/index.js')) {
    fs.copyFileSync('dist/cjs/index.js', 'dist/index.js');
  }
  if (fs.existsSync('dist/cjs/index.d.ts')) {
    fs.copyFileSync('dist/cjs/index.d.ts', 'dist/index.d.ts');
  }

  // Copy ESM files and rename
  if (fs.existsSync('dist/esm/index.js')) {
    fs.copyFileSync('dist/esm/index.js', 'dist/index.mjs');
  }

  // Copy component files
  if (fs.existsSync('dist/cjs/components')) {
    fs.cpSync('dist/cjs/components', 'dist/components', { recursive: true });
  }

  // Clean up intermediate directories
  if (fs.existsSync('dist/cjs')) {
    fs.rmSync('dist/cjs', { recursive: true });
  }
  if (fs.existsSync('dist/esm')) {
    fs.rmSync('dist/esm', { recursive: true });
  }
}, 1000); // Wait 1 second for TypeScript to complete 