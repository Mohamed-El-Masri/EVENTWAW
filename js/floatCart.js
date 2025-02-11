var header = document.querySelector('header');

var floating_cart = document.createElement('div');
floating_cart.id = 'floating_cart';
floating_cart.className = 'floating_cart_container';
floating_cart.innerHTML = `
    <div class="floating_cart_header">  
        <h2 class="fs24 padb0 ttu">Cart</h2>  
        <i class="fa fa-times curp floating_cart_close" onclick="toggleCart()"></i>  
    </div>  
    <div class="notices"></div>  
    <div class="floating_cart_body">  
        <div id="cart_items" class="floating_cart_products pad20 over-hidden">  
            <p class="">Cart is empty</p> <!-- Placeholder for products -->  
        </div>  
    </div>  
    <div class="floating_cart_footer">  
        <div class="floating_cart_total dfx fx_jc_sb fx_ai_c linet">  
            <h5 class="ffmu900">Total</h5>  
            <span id="cart_total" class="ffmu900">$0</span>  
        </div>  
        <div class="dfx fx_jc_sb fx_ai_c linet fx_w_w padt20 fx_d_c_s">  
            <button class="btn btn_blue marb10" onclick="continueShopping()">Continue Shopping <i class="fa fa-chevron-right marl10"></i></button>  
            <button id="checkout_button" class="btn btn_green marb10" onclick="checkout()" style="pointer-events: none; opacity: 0.5;">Checkout <i class="fa fa-chevron-right marl10"></i></button>  
        </div>  
    </div>  
`;

document.body.appendChild(floating_cart);

let cartItems = [];
let totalAmount = 0;

// Add some dummy items to the cart for testing
addItem('Product 1', 10.00);
addItem('Product 2', 15.50);
addItem('Product 3', 7.25);
addItem('Product 1', 10.00); // Adding the same product to test quantity increment

function toggleCart() {
    const cart = document.getElementById('floating_cart');
    cart.style.right = cart.style.right === '20px' ? '-400px' : '20px'; // Toggle cart visibility
}

function addItem(productName, productPrice) {
    const existingItem = cartItems.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ name: productName, price: productPrice, quantity: 1 });
    }
    totalAmount += productPrice;
    removeProductFromUpsell(productName); // Remove the product from the upsell section
    updateCart();
}

function removeItem(productName) {
    const itemIndex = cartItems.findIndex(item => item.name === productName);
    if (itemIndex > -1) {
        totalAmount -= cartItems[itemIndex].price * cartItems[itemIndex].quantity;
        cartItems.splice(itemIndex, 1);
        updateCart();
    }
}

function removeProductFromUpsell(productName) {
    const upsellProducts = document.querySelectorAll('.addon');
    upsellProducts.forEach(product => {
        if (product.querySelector('.title a').innerText === productName) {
            product.remove();
        }
    });
}

function updateCart() {
    const cartItemsDiv = document.getElementById('cart_items');
    const checkoutButton = document.getElementById('checkout_button');
    const cartTotal = document.getElementById('cart_total');

    cartItemsDiv.innerHTML = cartItems.length > 0 ? cartItems.map(item => `
        <div class="cart-item">
            <span class="item-name">${item.name}</span>
            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-item" onclick="removeItem('${item.name}')">Remove</button>
        </div>
    `).join('') : 'Cart is empty';
    cartTotal.innerText = `$${totalAmount.toFixed(2)}`;
    checkoutButton.style.pointerEvents = cartItems.length > 0 ? 'auto' : 'none';
    checkoutButton.style.opacity = cartItems.length > 0 ? '1' : '0.5';
}

function continueShopping() {
    toggleCart(); // Optionally hide the cart
}

function checkout() {
    if (cartItems.length > 0) {
        alert('Proceeding to checkout with: ' + cartItems.map(item => `${item.name} x${item.quantity}`).join(', '));
        // Implement navigation to checkout page here
    } else {
        alert('Your cart is empty!');
    }
}
