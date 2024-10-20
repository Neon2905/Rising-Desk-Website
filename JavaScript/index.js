document.addEventListener("DOMContentLoaded", function() {
    const welcomePopup = document.getElementById('welcomePopup');
    const closeWelcomePopupBtn = document.getElementById('closeWelcomePopupBtn');
    const gotItBtn = document.getElementById('gotItBtn');

    // Function to show the welcome popup
    function showWelcomePopup() {
        welcomePopup.style.display = 'block';
    }

    // Function to hide the welcome popup
    function hideWelcomePopup() {
        welcomePopup.style.display = 'none';
    }

    // Check if the popup has been shown in the current session
    if (!sessionStorage.getItem('popupShown')) {
        showWelcomePopup();
        sessionStorage.setItem('popupShown', 'true'); // Mark that the popup has been shown for this session
    }


    closeWelcomePopupBtn.addEventListener('click', hideWelcomePopup);
    gotItBtn.addEventListener('click', hideWelcomePopup);

    window.addEventListener('click', function(event) {
        if (event.target === welcomePopup) {
            hideWelcomePopup();
        }
    });
});