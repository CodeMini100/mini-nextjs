/**
 * server.js
 * 
 * Main Express server that handles:
 *   - Serving static files (in prod mode from `dist/`, optionally `public/`)
 *   - Routing to API endpoints in `pages/api/`
 *   - Server-side rendering (SSR) for regular page files (`.js` or `.jsx`)
 * 
 * TODOs:
 * 1. Review how you want to handle `.jsx` vs `.js`—consider a build step or unify file extensions.
 * 2. Enhance data-fetching (e.g., handle errors in `getServerSideProps`).
 * 3. Support advanced features like `_app.js`, `_document.js`, or nested routes if desired.
 * 4. Optionally integrate a client-side router script for partial or no-refresh navigation.
 */

import './babel-register.js'; // Loads Babel transpilation for files if needed
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { parseRoutes } from '../router/router.js';

// --- Setup __dirname Equivalent ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we're running in dev mode
const isDev = process.argv.includes('--dev');
const app = express();

// Directory paths used by the server
const distDir = path.join(process.cwd(), 'dist');
const pagesDir = path.join(process.cwd(), 'pages');
const publicDir = path.join(process.cwd(), 'public');

// Serve static assets from `dist` when in production mode
if (!isDev && fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Serve anything in `/public` if it exists (images, scripts, etc.)
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// --- Main request handler ---
app.get('*', async (req, res) => {
  // TODO: Possibly handle HEAD, POST, or other methods for custom routes
  console.log("[server.js] Incoming GET request:", req.path);

  // Use our router to match page or API route
  const { pageName, params } = parseRoutes(req.path);
  if (!pageName) {
    return res.status(404).send('Page Not Found');
  }

  // -- API Route Handling --
  if (pageName.startsWith('api/')) {
    // e.g. /api/hello => pages/api/hello.js
    const apiPath = path.join(pagesDir, pageName + '.js');
    if (!fs.existsSync(apiPath)) {
      return res.status(404).send('API route not found');
    }
    // Dynamic import the API module and call it
    const apiModule = await import(apiPath);
    const apiHandler = apiModule.default || apiModule;
    return apiHandler(req, res);
  }

  // -- SSR for a normal page --
  // For convenience, check both .js and .jsx
  const pagePathJs = path.join(pagesDir, pageName + '.js');
  const pagePathJsx = path.join(pagesDir, pageName + '.jsx');
  let pageModule;

  if (!fs.existsSync(pagePathJs) && !fs.existsSync(pagePathJsx)) {
    return res.status(404).send('Page Not Found');
  } else if (fs.existsSync(pagePathJs)) {
    pageModule = await import(pagePathJs);
  } else {
    pageModule = await import(pagePathJsx);
  }

  // If the page has getServerSideProps, call it to fetch data
  // TODO: Wrap in try/catch if you want to handle errors or timeouts
  let props = {};
  if (pageModule.getServerSideProps) {
    props = await pageModule.getServerSideProps({ query: params });
  }

  // Create a React element and render it to an HTML string
  const element = React.createElement(pageModule.default || pageModule, props);
  const html = ReactDOMServer.renderToString(element);

  // TODO: Optionally inject <script> tags or client routing script
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${pageName}</title>
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `;

  // Send the rendered HTML to the client
  res.send(fullHtml);
});

// Start server on port 3000 (or an env-defined port)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Mini Next server running on http://localhost:${port} (dev=${isDev})`);
});
