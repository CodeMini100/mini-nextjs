/**
 * client.js
 * 
 * A minimal client-side router to intercept link clicks and update
 * the browser history without performing a full page reload.
 * 
 * In a real Next.js application, this is far more sophisticated, handling
 * dynamic code splitting, prefetching, and component hydration.
 * 
 * TODOs:
 * 1. Consider how to inject this script into your rendered HTML (for truly "client-side" navigation).
 * 2. Enhance navigation to do partial re-renders rather than a full page reload.
 * 3. Add error handling or special conditions for external links, anchors (#), etc.
 */

function initClientRouter() {
  // TODO: Optionally detect if the user is pressing modifier keys (Cmd, Ctrl) so we don't override default new-tab behavior
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.tagName === 'A') {
      const href = target.getAttribute('href');
      
      // TODO: Check for relative vs. absolute URLs or handle external domains differently
      if (href && !href.startsWith('http')) {
        e.preventDefault();
        
        // Push new URL into history
        window.history.pushState({}, '', href);
        
        // Naive approach: refresh the entire page
        window.location.reload();
      }
    }
  });

  // Handle back/forward navigation
  window.addEventListener('popstate', () => {
    // TODO: Replace with partial re-render or a more advanced approach if desired
    window.location.reload();
  });
}

export { initClientRouter };
