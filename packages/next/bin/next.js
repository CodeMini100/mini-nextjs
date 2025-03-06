#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      console.log("trying to run dev\n");
      await runScript(path.join(__dirname, '../server/server.js'), ['--dev']);
      break;
    case 'build':
      await runScript(path.join(__dirname, '../build/build.js'));
      break;
    case 'start':
      await runScript(path.join(__dirname, '../server/server.js'));
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
