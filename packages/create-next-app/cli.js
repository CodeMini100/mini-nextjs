#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function createApp(appName) {
  const targetDir = path.join(process.cwd(), appName);
  if (fs.existsSync(targetDir)) {
    console.error(`Directory "${appName}" already exists!`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir);
  fs.mkdirSync(path.join(targetDir, 'pages'));

  const indexJs = `
import React from 'react';

export default function Home() {
  return <h1>Hello from Mini Next App!</h1>;
}
`;
  fs.writeFileSync(path.join(targetDir, 'pages', 'index.js'), indexJs);

  const packageJson = {
    name: appName,
    version: '0.0.1',
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start"
    },
    dependencies: {
      "mini-next": "file:../..", // For local monorepo usage
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    }
  };
  fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(packageJson, null, 2));

  console.log(`Created "${appName}"!`);
  console.log(`\nTo get started:\n  cd ${appName}\n  npm install\n  npx next dev\n`);
}

function main() {
  const appName = process.argv[2];
  if (!appName) {
    console.error('Usage: create-mini-next-app <app-name>');
    process.exit(1);
  }
  createApp(appName);
}

main();
