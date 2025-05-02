const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Function to check if files exist and are not empty
const waitForFiles = async () => {
  const checkFiles = () => {
    const cjsExists = fs.existsSync('dist/cjs/index.js');
    const esmExists = fs.existsSync('dist/esm/index.js');
    return cjsExists && esmExists;
  };

  let attempts = 0;
  while (!checkFiles() && attempts < 10) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }

  if (!checkFiles()) {
    console.error('Error: TypeScript compilation did not complete in time');
    process.exit(1);
  }
};

// Main build process
const build = async () => {
  try {
    await waitForFiles();

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

    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
};

build(); 