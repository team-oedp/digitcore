// This script runs before React hydration to prevent flash of incorrect theme
// It ensures the theme respects system preferences on initial load

export const themeScript = `
  (function() {
    try {
      // Check localStorage for saved theme preference
      var savedTheme = localStorage.getItem('theme');
      
      // If no saved preference or set to 'system', check system preference
      if (!savedTheme || savedTheme === 'system') {
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Apply the appropriate class based on system preference
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else if (savedTheme === 'dark') {
        // User explicitly chose dark theme
        document.documentElement.classList.add('dark');
      } else if (savedTheme === 'light') {
        // User explicitly chose light theme
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Fail silently - let React handle it
    }
  })();
`;
