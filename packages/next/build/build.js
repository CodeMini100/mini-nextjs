const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const pagesDir = path.join(process.cwd(), 'pages');
const distDir = path.join(process.cwd(), 'dist');

function collectPages() {
  if (!fs.existsSync(pagesDir)) return [];
  const all = fs.readdirSync(pagesDir);
  return all.filter((file) => file.endsWith('.js') && file !== '_app.js' && file !== '_document.js');
}

async function buildPage(pageFile) {
  const pagePath = path.join(pagesDir, pageFile);
  const PageComponent = require(pagePath);

  // Optional "getStaticProps"
  let props = {};
  if (PageComponent.getStaticProps) {
    props = await PageComponent.getStaticProps();
  }

  const element = React.createElement(PageComponent.default || PageComponent, props);
  const html = ReactDOMServer.renderToString(element);

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>${pageFile}</title></head>
    <body>
      <div id="root">${html}</div>
    </body>
    </html>
  `;
}

async function buildAllPages() {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }
  const pages = collectPages();

  for (const pageFile of pages) {
    const baseName = pageFile.replace('.js', '');
    const outFileName = baseName === 'index' ? 'index.html' : `${baseName}.html`;
    const outPath = path.join(distDir, outFileName);

    const html = await buildPage(pageFile);
    fs.writeFileSync(outPath, html);
    console.log(`Built: ${outPath}`);
  }
}

buildAllPages()
  .then(() => {
    console.log('Build complete!');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
