# Editorial

Below is a concise editorial explaining the overall goals and structure of each file in your **mini Next.js** skeleton. Each file is already **incomplete**, with guiding comments that prompt you on what to implement. This editorial clarifies **why** those tasks exist and how they fit together. We’ll end with a **task checklist** so you know exactly what to do.

---

## Overview

Your repository contains a simplified version of Next.js in a monorepo structure:


- **`packages/next/`** is your mini framework.  
- **`packages/create-next-app/`** is a small CLI to scaffold new apps.  
- **`examples/`** has an example application (with incomplete pages) to demonstrate your framework.  

You’ll find **skeleton code** in each file with **comments** indicating what to fill in. Here’s how each piece fits into a Next.js–style workflow:

1. **`bin/next.js`**  
   - The CLI entrypoint for commands: `dev`, `build`, and `start`.  
   - Skeleton code awaits your implementation of spawning the correct scripts.  

2. **`server/index.js`**  
   - An Express server to handle requests.  
   - You’ll see placeholders for:
     - Identifying requested pages
     - SSR logic
     - API routes  

3. **`router/index.js`**  
   - Resolves file-based routes (e.g., `/about` → `pages/about.js`).  
   - Includes skeleton functions for dynamic routing (`[slug].js`) and API detection (`pages/api`).  

4. **`build/index.js`**  
   - Provides a static build step (`next build`).  
   - You’ll see stubs prompting you to:
     - Collect page files
     - Call `getStaticProps`
     - Render HTML into a `dist/` folder  

5. **`create-next-app/cli.js`**  
   - A small script to scaffold new projects:
     - Creates a folder
     - Generates a `package.json`
     - Initializes a `pages/` directory  

6. **`examples/basic-app/pages/`**  
   - Sample React pages with placeholders for `getServerSideProps`/`getStaticProps`.  
   - Useful for testing your framework once the features are implemented.

### How it All Comes Together

- **Routing**: `router/index.js` maps request paths to `pages/` files.  
- **Data Fetching**: `getServerSideProps` or `getStaticProps` is called in `server/index.js` or `build/index.js`, providing props.  
- **Rendering**: `ReactDOMServer.renderToString` generates the HTML on the server or at build time.  
- **CLI**: `npx next dev` starts the dev server, `npx next build` triggers the static build, and `npx next start` serves the production build.  
- **Scaffolding**: `npx create-mini-next-app my-app` spins up a minimal project referencing your mini framework.

---

## Task Checklist

Below is a list of tasks matching the comments found in the skeleton files:

1. **`bin/next.js`**  
   - **Task**: Implement the CLI so that `npx next dev|build|start` runs the correct scripts (`server/index.js`, `build/index.js`) with the right flags.

2. **`server/index.js`**  
   - **Task**: Complete the Express server logic:
     - Use the router to find a matching page from `pages/`.
     - Handle API routes from `pages/api`.
     - If `getServerSideProps` exists, call it.
     - Render the page with `renderToString`.

3. **`router/index.js`**  
   - **Task**: Write a function that maps paths to page files:
     - Exact match (`/about` → `about.js`).
     - Dynamic routes (`[slug].js`).
     - API routes (`/api/hello` → `pages/api/hello.js`).

4. **`build/index.js`**  
   - **Task**: Implement the static build:
     - Collect all `.js` files in `pages/` (excluding `api/`).
     - Call `getStaticProps` if available.
     - Render each page to an `.html` file in `dist/`.

5. **`create-next-app/cli.js`**  
   - **Task**: Finish the scaffolding script so `npx create-mini-next-app new-app`:
     - Creates a folder with a `pages` directory.
     - Writes a minimal `package.json`.
     - Optionally generates a sample `index.js` page.

6. **`examples/basic-app/pages/`**  
   - **Task**: Edit these example pages to test:
     - `getServerSideProps` usage.
     - `getStaticProps`.
     - Navigating between routes.

Once you finish these tasks, run:
`cd examples/basic-app npx next dev`
and open `http://localhost:3000`. You should see your mini Next.js in action!

## Extensions

You have completed the basic version of Next.js! Congratulations. There’s still much more that real Next.js does. Below are some additional features you might try implementing to further deepen your understanding:

1. **Nested Routes & Multiple Dynamic Segments**  
   - In real Next.js, you can have routes like `/blog/[category]/[slug].js`. Implementing nested folder structures and multiple dynamic parameters will help you learn more about routing.

2. **`_app.js` and `_document.js`**  
   - Next.js allows a custom `_app.js` to define top-level layout or global state, and `_document.js` to control how the HTML `<head>` and `<body>` are structured.  
   - Try adding these special files so every page can share common styling or scripts.

3. **API Routes with Middleware**  
   - Add basic **middleware** support (like request logging, authentication checks, or custom headers) for your API routes.  
   - This will give you insight into how Next.js handles middleware in its built-in server.

4. **Incremental Static Regeneration (ISR)**  
   - Next.js can periodically re-build a static page in the background. Try adding a `revalidate` option to `getStaticProps` to automatically refresh the static HTML after a set interval.

5. **Automatic Code Splitting and Bundling**  
   - In a production-ready environment, Next.js splits your app’s code and loads only what’s needed. Try experimenting with a build step that uses a bundler (e.g., Rollup, esbuild, or webpack) to generate optimized client and server bundles.

6. **Client-Side Hydration**  
   - For a fully seamless user experience, your SSR’d pages should “hydrate” in the browser so React can take over without losing state. Investigate how to inject a hydration script that re-mounts the React app on the client side.

7. **Hot Reloading / Fast Refresh**  
   - In dev mode, Next.js automatically updates your components when you save a file. You can mimic that by watching for file changes, reloading only the affected modules, and then refreshing the browser.

8. **TypeScript Support**  
   - Try adding a small build step with Babel or SWC to handle `.ts` and `.tsx` files. This will bring static type checking to your framework and replicate how real Next.js handles TypeScript out of the box.

Each of these enhancements moves you closer to how the **real Next.js** is architected. Pick and choose the features that interest you most, and you’ll gain a deeper understanding of **modern React frameworks**!

