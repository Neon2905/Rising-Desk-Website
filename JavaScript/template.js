document.addEventListener('DOMContentLoaded', function() {
    attachHeaderEventListeners();
    //add all event-handlers
    function attachHeaderEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('search');

        if (searchInput && searchButton) {
            searchButton.addEventListener('click', function() {
                searchInput.classList.toggle('active');
                if (searchInput.classList.contains('active')) {
                    searchInput.focus();
                } else {
                    searchInput.blur();
                }
            });

            // Close search input when clicking outside
            document.addEventListener('click', function(event) {
                const isClickInside = searchButton.contains(event.target) || searchInput.contains(event.target);
                if (!isClickInside && searchInput.value == "") {
                    searchInput.classList.remove('active');
                }
            });

            // Prevent form submission on Enter key press
            searchInput.addEventListener('keydown', function(event) {
                    filterProducts(searchInput.value);
            });
        } else {
            console.error("Search input or button not found in the DOM.");
        }

        const menuButton = document.getElementById('menu');
        const menuDropdown = document.getElementById('menuDropdown');

        if(menuDropdown && menuButton){
            menuButton.addEventListener('click', function(event){
                menuDropdown.classList.toggle('show');
            });

            // Close the dropdown if clicking outside of it
            document.addEventListener('click', function(event) {
                if (!menuDropdown.contains(event.target) && !menuButton.contains(event.target)) {
                    menuDropdown.classList.remove('show');
                }
            });
        }else {
            console.error("Menu button or dropdown panel not found in the DOM.")
        }

        const shopButton = document.getElementById('shop-button');
        const shopDropdown = document.getElementById('shop-dropdown');
        
        shopButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            shopDropdown.classList.toggle('show');
        });
    
        // Close the dropdown if the user clicks outside of it
        window.addEventListener('click', function(event) {
            if (!event.target.matches('#shop-button')) {
                if (shopDropdown.classList.contains('show')) {
                    shopDropdown.classList.remove('show');
                }
            }
        });
    }
    //search products with filterValue
    function filterProducts(filterValue){
        filterValue = filterValue.toLowerCase();
        const productList = document.querySelector('.product-container');
        const productCards = Array.from(productList.getElementsByClassName('product-card'));
        let found = false;
        productCards.forEach(card => {
            if(card.getAttribute('data-name').toLowerCase().includes(filterValue)){card.style.display='block'; found=true;}
            else if(card.querySelector('p').textContent.toLowerCase().includes(filterValue)) {card.style.display='block'; found=true;}
            else card.style.display='none';
        });
        if(!found){
            productList.querySelector('.no-result').style.display='block';
        }
        else{
            productList.querySelector('.no-result').style.display='none';
        }
    }
    // Initialize cart rendering on page load
    updateCartItemCount();

    // Function to update the 'items' attribute of the cart icon
    function updateCartItemCount() {
        const cart = loadCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('#cart i span');
        if (cartCount) {
            cartCount.textContent = totalItems;
        } else {
            console.error('Cart icon count element not found.');
        }
    }

    // Function to load cart from localStorage
    function loadCart() {
        const cartData = localStorage.getItem('cart');
        return cartData ? JSON.parse(cartData) : [];
    }

    function saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart));
    }
});