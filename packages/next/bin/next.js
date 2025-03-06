#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

/**
 * Skeleton CLI script for "next dev", "next build", and "next start".
 * 
 * TODOs:
 * 1. Adjust or enhance runScript if you need custom flags, environment variables, or additional logging.
 * 2. Consider adding support for other commands or advanced CLI options.
 */

// --- Setup __dirname Equivalent (for ESM) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Helper function that spawns a child process to run another script.
 * 
 * @param {string} scriptPath - The absolute path to the script to run.
 * @param {string[]} [args=[]] - Additional arguments to pass to the script.
 * @returns {Promise<void>}
 */
function runScript(scriptPath, args = []) {
  // TODO: Add extra logging or error handling if desired
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

/**
 * Main entrypoint for the CLI. 
 * Parses the command ("dev", "build", or "start") and runs the respective script.
 */
async function main() {
  // TODO: Parse additional arguments if necessary (e.g., --port, --host, etc.)
  const command = process.argv[2];

  switch (command) {
    case 'dev':
      console.log("Running dev mode...\n");
      // TODO: You might inject dev-specific environment variables here
      await runScript(path.join(__dirname, '../server/server.js'), ['--dev']);
      break;
    case 'build':
      console.log("Building project...\n");
      // TODO: Handle build-specific options (minification flags, output directory, etc.)
      await runScript(path.join(__dirname, '../build/build.js'));
      break;
    case 'start':
      console.log("Starting production server...\n");
      // TODO: Potentially handle environment variables for production here
      await runScript(path.join(__dirname, '../server/server.js'));
      break;
    default:
      console.log(`Unknown command: ${command}`);
      console.log('Usage: next dev | next build | next start');
      process.exit(1);
  }
}

// --- Execute Main Function ---
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
