// Redirection script for Vercel compatibility
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a route that should be redirected
    const path = window.location.pathname;
    
    if (path === '/game') {
        // Redirect to the static file
        window.location.href = './game.html';
    } else if (path === '/settings') {
        window.location.href = './settings.html';
    }
});
