// NOTE: Not automatically used in this minimal example. 
// In real usage, you'd inject <script> to load this in the browser.

function initClientRouter() {
    // Intercept internal link clicks
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href && !href.startsWith('http')) {
          e.preventDefault();
          window.history.pushState({}, '', href);
          // Naive approach: just reload
          window.location.reload();
        }
      }
    });
  
    // Listen to back/forward
    window.addEventListener('popstate', () => {
      window.location.reload();
    });
  }
  
  module.exports = { initClientRouter };
  