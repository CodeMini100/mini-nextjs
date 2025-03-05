const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');

let server;

function startServer() {
  return new Promise((resolve, reject) => {
    server = spawn('node', [path.join(__dirname, '../packages/next/server/index.js'), '--dev'], {
      cwd: path.join(__dirname, '../examples/basic-app'),
      stdio: 'pipe'
    });

    server.stdout.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('Mini Next server running')) {
        resolve();
      }
    });

    server.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
      reject(data.toString());
    });
  });
}

function stopServer() {
  if (server) {
    server.kill();
  }
}

describe('Mini Next SSR Test', () => {
  beforeAll(async () => {
    await startServer();
  });

  afterAll(() => {
    stopServer();
  });

  test('renders home page', async () => {
    const res = await axios.get('http://localhost:3000/');
    expect(res.status).toBe(200);
    expect(res.data).toContain('Hello from Basic App');
  });

  test('renders about page', async () => {
    const res = await axios.get('http://localhost:3000/about');
    expect(res.status).toBe(200);
    expect(res.data).toContain('About Page');
  });
});
