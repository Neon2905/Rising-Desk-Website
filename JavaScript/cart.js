// Initialize cart rendering on page load
document.addEventListener('DOMContentLoaded', renderCartItems);

// Initialize popup panels
document.addEventListener("DOMContentLoaded", function() {

    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupPanel = document.getElementById('popupPanel');

    closePopupBtn.addEventListener('click', function() {
        popupPanel.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === popupPanel) {
            popupPanel.style.display = 'none';
        }
    });

    const ConfirmCheckoutPopupPanel = document.getElementById('ConfirmCheckoutPopupPanel');
    const closeConfirmCheckoutPopupBtn = document.getElementById('closeConfirmCheckoutPopupBtn');
    const confirmCheckoutBtn = document.getElementById('confirmCheckoutBtn');
    const cancelCheckoutBtn = document.getElementById('cancelCheckoutBtn');

    closeConfirmCheckoutPopupBtn.addEventListener('click', function() {
        ConfirmCheckoutPopupPanel.style.display = 'none';
    });

    cancelCheckoutBtn.addEventListener('click', function() {
        ConfirmCheckoutPopupPanel.style.display = 'none';
    });

    confirmCheckoutBtn.addEventListener('click', function() {
        //Checkout procedures here
        popupPanel.style.display = 'block';
        ConfirmCheckoutPopupPanel.style.display = 'none';
        clearCart();
    });

    window.addEventListener('click', function(event) {
        if (event.target === popupPanel) {
            ConfirmCheckoutPopupPanel.style.display = 'none';
        }
    });

    const ConfirmClearCartPopupPanel = document.getElementById('ConfirmClearCartPopupPanel');
    const closeConfirmClearCartPopupBtn = document.getElementById('closeConfirmClearCartPopupBtn');
    const confirmClearCartBtn = document.getElementById('confirmClearCartBtn');
    const cancelClearCartBtn = document.getElementById('cancelClearCartBtn');

    closeConfirmClearCartPopupBtn.addEventListener('click', function() {
        ConfirmClearCartPopupPanel.style.display = 'none';
    });

    cancelClearCartBtn.addEventListener('click', function() {
        ConfirmClearCartPopupPanel.style.display = 'none';
    });

    confirmClearCartBtn.addEventListener('click', function() {
        ConfirmClearCartPopupPanel.style.display = 'none';
        clearCart();
    });

    window.addEventListener('click', function(event) {
        if (event.target === popupPanel) {
            ConfirmClearCartPopupPanel.style.display = 'none';
        }
    });

});


// Function to render cart items
function renderCartItems() {
    // Retrieve cart data from local storage
    const cart = loadCart();
    // Get the container where cart items will be displayed
    const cartItemsContainer = document.querySelector('.cart-items');
    
    // Clear any existing items
    cartItemsContainer.innerHTML = '';
    if(cart.length > 0)
    {
        // Loop through the cart items and create HTML for each item
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="${item.imagePath}" alt="Product Image" class="product-image">
                <div class="product-details">
                    <p class="product-name">${item.name}</p>
                    <p class="product-description">${item.description}</p>
                </div>
                <div class="item-order-detail">
                    <button class="remove-button" onclick="removeFromCart('${item.productId}')">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                    <p class="unit-price">$<span class="unit-price-value">${item.unitPrice.toFixed(2)}</span></p>
                    <div class="quantity">
                        <button class="decrease-quantity" onclick="updateQuantity('${item.productId}', -1)">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" readonly>
                        <button class="increase-quantity" onclick="updateQuantity('${item.productId}', 1)">+</button>
                    </div>
                    <p class="total-price">$<span class="total-price-value">${item.totalPrice.toFixed(2)}</span></p>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });
    }
    else{
        const message = document.createElement('p');
        message.classList.add('empty-cart-message');
        message.innerText = "You don't have any items in your cart yet.";
        cartItemsContainer.appendChild(message);
        const button = document.createElement('a');

        button.classList.add('shop-more')
        button.setAttribute('href','all-products.html');
        button.innerText= `Continue Shopping`;
        cartItemsContainer.appendChild(button);
    }

    updateCartItemCount();
    updateCheckoutTotal(); // Update the total price in the checkout panel
}

// Function to update the quantity of an item
function updateQuantity(productId, change) {
    const cart = loadCart();
    const item = cart.find(item => item.productId === parseInt(productId));
    if (item) {
        item.quantity += change>0 ? change: Math.abs(change)<item.quantity? change: 0;

        item.totalPrice = item.quantity * item.unitPrice;
        const index = cart.indexOf(item);
        cart[index] = item;
        saveCart(cart);
        renderCartItems();
        updateCartItemCount();
    }
}

// Function to remove an item from the cart
function removeFromCart(productId) {
    const cart = loadCart();
    const updatedCart = cart.filter(item => item.productId !== parseInt(productId));
    saveCart(updatedCart);
    renderCartItems();
}

// Function to update the checkout total
function updateCheckoutTotal() {
    const cart = loadCart();
    
    const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    document.querySelector('.checkout-total p span').textContent = totalPrice.toFixed(2);
}

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

function checkout(){
    if(loadCart().length > 0){
        ConfirmCheckoutPopupPanel.style.display = 'block';
    }
}

function emptyCart(){
    if(loadCart().length>0){
        ConfirmClearCartPopupPanel.style.display = 'block';
    }
}

function clearCart() {
    let cart = [];
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
}

function loadCart(){
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}
function saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
}