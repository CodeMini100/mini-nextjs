/**
 * build.js
 * 
 * A simplified static build script that:
 * 1. Collects page files from `pages/`.
 * 2. Calls an optional `getStaticProps`.
 * 3. Renders each page to an HTML file in `dist/`.
 * 
 * TODOs:
 * - Add any additional handling for `_app.js` or `_document.js` if desired.
 * - Consider advanced features like nested pages or multiple dynamic routes.
 */

const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

// --- Directories ---
const pagesDir = path.join(process.cwd(), 'pages');
const distDir = path.join(process.cwd(), 'dist');

/**
 * Collects all standard `.js` files in the `pages/` directory,
 * excluding `_app.js` and `_document.js`.
 * 
 * TODO: Modify this function if you want to support `.jsx` or multiple dynamic routes.
 */
function collectPages() {
  // TODO: Possibly handle nested folders for more complex route structures
  if (!fs.existsSync(pagesDir)) return [];
  const all = fs.readdirSync(pagesDir);

  return all.filter((file) =>
    file.endsWith('.js') &&
    file !== '_app.js' &&
    file !== '_document.js'
  );
}

/**
 * Builds a single page by requiring the component, optionally calling `getStaticProps`,
 * then rendering it to a full HTML string.
 * 
 * @param {string} pageFile - The filename of the page (e.g., "index.js").
 * @returns {Promise<string>} The rendered HTML string.
 * 
 * TODO: Add custom HTML head, meta tags, or link tags if you want more advanced usage.
 */
async function buildPage(pageFile) {
  const pagePath = path.join(pagesDir, pageFile);
  const PageComponent = require(pagePath);

  // Optional "getStaticProps"
  let props = {};
  // TODO: You could add error handling here if getStaticProps throws an error.
  if (PageComponent.getStaticProps) {
    props = await PageComponent.getStaticProps();
  }

  // Render the component
  const element = React.createElement(PageComponent.default || PageComponent, props);
  const html = ReactDOMServer.renderToString(element);

  // TODO: You might insert a <script> tag for client-side hydration if you want to mimic Next.js more closely.
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${pageFile}</title>
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `;
}

/**
 * Main function to build all pages, one by one, writing them to `dist/`.
 */
async function buildAllPages() {
  // TODO: Clear or recreate the `dist` folder if you want a fresh build each time.
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  const pages = collectPages();
  // TODO: Consider logging how many pages were found or any relevant build stats.

  for (const pageFile of pages) {
    const baseName = pageFile.replace('.js', '');
    // Next.js typically uses `index.html` for the root route.
    const outFileName = baseName === 'index' ? 'index.html' : `${baseName}.html`;
    const outPath = path.join(distDir, outFileName);

    const html = await buildPage(pageFile);
    fs.writeFileSync(outPath, html);
    console.log(`Built: ${outPath}`);
  }
}

/**
 * Immediately invoke the build process on script execution.
 */
buildAllPages()
  .then(() => {
    console.log('Build complete!');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
