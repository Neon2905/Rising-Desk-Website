const sortBySelect = document.getElementById('sortBy');
const productList = document.querySelector('.product-container');
const productCards = Array.from(productList.getElementsByClassName('product-card'));
const filterOnSale = document.getElementById('onSale');
const filterAvailability = document.getElementById('availability');
const title = document.querySelector('.title');
const cartPanel = document.querySelector('.cart-panel')

title.addEventListener('click', () => {
    location.reload();
});

sortBySelect.addEventListener('click', () => {
    const productList = document.querySelector('.product-container');
    const productCards = Array.from(productList.getElementsByClassName('product-card'));
    sortBySelect.addEventListener('change', function() {
        const sortBy = sortBySelect.value;
        let sortedProducts;
    
        if (sortBy.includes('name')) {
            sortedProducts = productCards.sort((a, b) => {
                const nameA = a.getAttribute('data-name').toLocaleLowerCase();
                const nameB = b.getAttribute('data-name').toLocaleLowerCase();
                if(sortBy.includes('ascending')) return nameA.localeCompare(nameB);
                else return nameB.localeCompare(nameA);
            });
        } else if (sortBy.includes('price')) {
            sortedProducts = productCards.sort((a, b) => {
                const priceA = parseFloat(a.getAttribute('data-current-price'));
                const priceB = parseFloat(b.getAttribute('data-current-price'));
                if(sortBy.includes('ascending')) return priceA - priceB;
                else return priceB - priceA;
            });
        }
    
        productList.innerHTML = '';
    
        sortedProducts.forEach(card => productList.appendChild(card));
    });
})

filterOnSale.addEventListener('change', function(){
    const productList = document.querySelector('.product-container');
    const productCards = Array.from(productList.getElementsByClassName('product-card'));
    productCards.forEach(card => {
        if (filterOnSale.checked) {
            // Show only on-sale products
            if (card.hasAttribute('data-sale-price')) card.style.display = 'block';
            else card.style.display = 'none';
        } else card.style.display = 'block';
    });
});

filterAvailability.addEventListener('change', function(){
    const productList = document.querySelector('.product-container');
    const productCards = Array.from(productList.getElementsByClassName('product-card'));
    productCards.forEach(card => {
        if(filterAvailability.value==='in-stock' && filterAvailability.value === card.getAttribute('data-availability')) card.style.display = 'block';
        else if(filterAvailability.value==='pre-order' && filterAvailability.value === card.getAttribute('data-availability')) card.style.display = 'block';
        else if(filterAvailability.value==='all') card.style.display = 'block';
        else card.style.display = 'none';
    });
})

document.addEventListener('DOMContentLoaded', ()=>{
    decorateProducts(productCards);
});

function decorateProducts(productCards){
    productCards.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        const basePrice = parseFloat(card.getAttribute('data-base-price'));
        const availability = card.getAttribute('data-availability');
        const addToCartButton = card.querySelector('.btn');
        addToCartButton.setAttribute('onClick',`addToCart(${productId})`);
        const name = card.querySelector('h3');
        const price = card.querySelector('.base-price');
        const currentPrice = card.querySelector('.current-price');
        const badge = card.querySelector('.badge');

        name.textContent = card.getAttribute('data-name');

        if (availability === 'out-of-stock') {
            addToCartButton.textContent = 'Out of Stock';
            addToCartButton.style.backgroundColor = 'gray';
            addToCartButton.disabled = true;
        } else if (availability === 'pre-order') {
            addToCartButton.textContent = 'Add to Cart (Pre-order)';
        }

        //decorate for discounted items
        if(card.hasAttribute('data-sale-price')){
                        
            const salePrice = card.getAttribute('data-sale-price');
            let discountedPrice;

            if(salePrice.includes('%')){
                // Sale price is in percentage
                const discountPercent = parseFloat(salePrice.replace('%',''));
                badge.textContent = `-${discountPercent}%`;
                discountedPrice = basePrice - (basePrice * (discountPercent / 100));
            } else {
                // Sale price is a direct amount
                badge.textContent = "Sale";
                discountedPrice = parseFloat(salePrice);
            }

            // Display the discounted price
            card.setAttribute('data-current-price',discountedPrice);
            price.style.textDecoration = 'line-through ';
            currentPrice.textContent = `$${parseFloat(discountedPrice).toFixed(2)}`;
        }
        else card.setAttribute('data-current-price',basePrice);
        // Set the price based on the base-price attribute
        price.textContent = `$${parseFloat(basePrice).toFixed(2)}`;
        
        if(badge.textContent === '') badge.style.display = 'none';
    });
}

// Function to add items to the cart
function addToCart(productId) {
    const product = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    const name = product.getAttribute('data-name');
    const description = product.querySelector('.description').textContent;
    const imagePath = product.querySelector('img').getAttribute('src');
    const unitPrice = parseFloat(product.getAttribute('data-current-price'));
    const cart = loadCart();
    
    if (product){

        const existingItem = cart.find(item=> item.productId === productId);
        if(!existingItem){
            const newItem = {
                productId,
                name,
                description,
                imagePath,
                unitPrice,
                quantity: 1,
                totalPrice: unitPrice
            };
            cart.push(newItem);
        }
        else{
            existingItem.quantity += 1;
            existingItem.totalPrice += unitPrice;
        }
        saveCart(cart);
        updateCartItemCount();
    }
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

// Function to load cart from localStorage
function loadCart() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
}