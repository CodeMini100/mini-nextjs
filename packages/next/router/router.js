/**
 * router.js
 * 
 * This file maps incoming URLs to page files in `pages/`. It checks:
 * 1. Exact matches like "/about" => "pages/about.js" (or "about.jsx")
 * 2. API routes like "/api/hello" => "pages/api/hello.js"
 * 3. Single dynamic routes like "[slug].js"
 * 
 * TODOs:
 * 1. Add support for nested routing if desired (e.g., "pages/blog/[slug].js").
 * 2. Consider multiple dynamic segments (e.g., "[category]/[slug].js").
 * 3. Decide how to handle `.jsx` vs `.js`—either unify or keep them separate.
 * 4. Log or handle errors more gracefully if a file is missing or an unsupported extension is requested.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * parseRoutes("/about") => { pageName: "about", params: {} }
 * parseRoutes("/api/hello") => { pageName: "api/hello", params: {} }
 * parseRoutes("/hello") => tries for exact 'hello.js', else tries [slug].js
 * 
 * @param {string} urlPath - The requested URL path (e.g. "/about", "/api/hello").
 * @returns {{ pageName: string|null, params: Object }} The matching page name and dynamic params.
 */
function parseRoutes(urlPath) {
  // TODO: Extend the logic if you need multiple dynamic params or nested dirs
  console.log(`[router] Incoming path: ${urlPath}`);

  // Remove leading slash(es)
  let slug = urlPath.replace(/^\/+/, '');
  // Root => index.js
  if (slug === '') slug = 'index';

  const pagesDir = path.join(process.cwd(), 'pages');
  // If there's no pages directory, we can't route
  if (!fs.existsSync(pagesDir)) {
    return { pageName: null, params: {} };
  }

  // 1. Check for an exact .js file
  const exactFile = path.join(pagesDir, slug + '.js');
  if (fs.existsSync(exactFile)) {
    return { pageName: slug, params: {} };
  }

  // 2. Check for an exact .jsx file
  // TODO: If you prefer a build step, consider consolidating .jsx into .js 
  const exactFilejsx = path.join(pagesDir, slug + '.jsx');
  if (fs.existsSync(exactFilejsx)) {
    return { pageName: slug, params: {} };
  }

  // 3. Check if it's an API route (pages/api/...)
  if (slug.startsWith('api/')) {
    const apiFile = path.join(pagesDir, slug + '.js');
    if (fs.existsSync(apiFile)) {
      return { pageName: slug, params: {} };
    }
    // TODO: Optionally handle .jsx for API routes if you want to allow that
  }

  // 4. Single dynamic route [slug].js (naive approach)
  // TODO: Expand this to handle multiple dynamic parameters or nested structures
  const files = fs.readdirSync(pagesDir);
  const dynamicFile = files.find((f) => f.startsWith('[') && f.endsWith('].js'));
  if (dynamicFile) {
    const baseName = dynamicFile.replace('.js', ''); // "[slug]"
    return {
      pageName: baseName, // e.g., "[slug]"
      params: { [baseName.replace('[', '').replace(']', '')]: slug },
    };
  }

  // If no match
  return { pageName: null, params: {} };
}

export { parseRoutes };
