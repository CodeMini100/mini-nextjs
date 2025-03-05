#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

function runScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.argv[0], [scriptPath, ...args], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    child.on('close', (code) => {
      if (code !== 0) reject(new Error(`Script failed with code ${code}`));
      else resolve();
    });
  });
}

async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'dev':
      await runScript(path.join(__dirname, '../server/index.js'), ['--dev']);
      break;
    case 'build':
      await runScript(path.join(__dirname, '../build/index.js'));
      break;
    case 'start':
      await runScript(path.join(__dirname, '../server/index.js'));
      break;
    default:
      console.log(`Unknown command: ${command}`);
      console.log('Usage: next dev | next build | next start');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
