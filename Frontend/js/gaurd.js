// this file will contain function to verify the user on every protected page

// it checks for the user authentication via session storage when redirecting to protected pages
(function () {
    if (!sessionStorage.getItem('userEmail')) {
        window.location.href = './login.html';
    }
})();