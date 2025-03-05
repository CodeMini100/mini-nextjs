const express = require('express');
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { parseRoutes } = require('../router');

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
  const { pageName, params } = parseRoutes(req.path);

  if (!pageName) {
    return res.status(404).send('Page Not Found');
  }

  // Check if it's an API route
  if (pageName.startsWith('api/')) {
    const apiPath = path.join(pagesDir, pageName + '.js');
    if (!fs.existsSync(apiPath)) {
      return res.status(404).send('API route not found');
    }
    const apiHandler = require(apiPath);
    return apiHandler(req, res);
  }

  // SSR for a normal page
  const pagePath = path.join(pagesDir, pageName + '.js');
  if (!fs.existsSync(pagePath)) {
    return res.status(404).send('Page Not Found');
  }
  const PageComponent = require(pagePath);

  // Optional getServerSideProps
  let props = {};
  if (PageComponent.getServerSideProps) {
    props = await PageComponent.getServerSideProps({ query: params });
  }

  const element = React.createElement(PageComponent.default || PageComponent, props);
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
