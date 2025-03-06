import './babel-register.js';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { parseRoutes } from '../router/router.js';

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.argv.includes('--dev');
const app = express();
const distDir = path.join(process.cwd(), 'dist');
const pagesDir = path.join(process.cwd(), 'pages');

// If in production mode, serve static assets from `dist`
if (!isDev && fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// For demonstration, also serve /public if present
const publicDir = path.join(process.cwd(), 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Generic request handler
app.get('*', async (req, res) => {
  console.log("GETTING REACT")
  const { pageName, params } = parseRoutes(req.path);
  console.log("pageDir is: ", pagesDir);
  console.log("pageName is: ", pageName);

  if (!pageName) {
    return res.status(404).send('Page Not Found');
  }

  // Check if it's an API route
  if (pageName.startsWith('api/')) {
    const apiPath = path.join(pagesDir, pageName + '.js');
    if (!fs.existsSync(apiPath)) {
      return res.status(404).send('API route not found');
    }
    const apiModule = await import(apiPath);
    const apiHandler = apiModule.default || apiModule;
    return apiHandler(req, res);
  }
  
  // SSR for a normal page
  const pagePathjs = path.join(pagesDir, pageName + '.js');
  const pagePathjsx = path.join(pagesDir, pageName + '.jsx');
  let page;
  if ((!fs.existsSync(pagePathjs)) && (!fs.existsSync(pagePathjsx))) {
    return res.status(404).send('Page Not Found');
  } else if (fs.existsSync(pagePathjs)){
    page = await import(pagePathjs);
  }else{
    page = await import(pagePathjsx);
  }
  

  // Optional getServerSideProps
  let props = {};
  if (page.getServerSideProps) {
    props = await page.getServerSideProps({ query: params });
  }

  const element = React.createElement(page.default || page, props);
  const html = ReactDOMServer.renderToString(element);

  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>${pageName}</title></head>
    <body>
      <div id="root">${html}</div>
    </body>
    </html>
  `;
  res.send(fullHtml);
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Mini Next server running on http://localhost:${port} (dev=${isDev})`);
});
