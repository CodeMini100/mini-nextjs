const fs = require('fs');
const path = require('path');

// parseRoutes("/about") => { pageName: "about", params: {} }
// parseRoutes("/api/hello") => { pageName: "api/hello", params: {} }
// parseRoutes("/hello") => tries for exact 'hello.js', else tries [slug].js
function parseRoutes(urlPath) {
  let slug = urlPath.replace(/^\/+/, ''); // remove leading slash(es)
  if (slug === '') slug = 'index'; // root => index.js

  const pagesDir = path.join(process.cwd(), 'pages');
  if (!fs.existsSync(pagesDir)) {
    return { pageName: null, params: {} };
  }

  // Check if there's an exact .js file
  const exactFile = path.join(pagesDir, slug + '.js');
  if (fs.existsSync(exactFile)) {
    return { pageName: slug, params: {} };
  }

  // If it starts with "api/"
  if (slug.startsWith('api/')) {
    const apiFile = path.join(pagesDir, slug + '.js');
    if (fs.existsSync(apiFile)) {
      return { pageName: slug, params: {} };
    }
  }

  // Check for single dynamic route [slug].js, naive approach
  const files = fs.readdirSync(pagesDir);
  const dynamicFile = files.find((f) => f.startsWith('[') && f.endsWith('].js'));
  if (dynamicFile) {
    const baseName = dynamicFile.replace('.js', ''); // "[slug]"
    return {
      pageName: baseName,
      params: { [baseName.replace('[', '').replace(']', '')]: slug },
    };
  }

  return { pageName: null, params: {} };
}

module.exports = { parseRoutes };
