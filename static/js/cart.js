async function fetchCartItems() {
    try {
        const response = await fetch('/get_cart_items', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            document.getElementById('cart-items').innerHTML = '<tr><td colspan="6">No items in the cart.</td></tr>';
            disableCheckoutButton();
            return;
        }

        const cartItems = await response.json();
        displayCartItems(cartItems);
    } catch (error) {
        document.getElementById('cart-items').innerHTML = '<tr><td colspan="6"> Error fetching data.</td></tr>';
        disableCheckoutButton();
    }
}

async function removeItem(itemId) {
    try {
        const response = await fetch('/remove_from_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ product_id: itemId, quantity: 1 })
        });

        if (!response.ok) return;

        await refreshCart();
    } 
    catch (error) {
        disableCheckoutButton();
    }
}

async function addQuantity(itemId) {
    try {
        const response = await fetch('/add_to_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ product_id: itemId, quantity: 1 })
        });

        if (!response.ok) return;

        await refreshCart();
    } 
    catch (error) {}
}

async function removeQuantity(itemId) {
    try {
        const response = await fetch('/remove_quantity_from_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ product_id: itemId, quantity: 1 })
        });

        if (!response.ok) return;

        await refreshCart();
    } catch (error) {}
}

async function refreshCart() {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    await fetchCartItems();
}

function displayCartItems(cartItems) {  
    const cartItemsContainer = document.getElementById('cart-items');
    
    cartItemsContainer.innerHTML = ''; 
    if (!cartItems.length) {
        cartItemsContainer.innerHTML = '<tr><td colspan="6">Cart is empty.</td></tr>';
        disableCheckoutButton();

        updateCartTotals(0); 
        setTimeout(() => {
            window.location.href = '/shop'; 
        }, 10000);

        return;   
    }
    enableCheckoutButton();

    let subtotal = 0;

    cartItems?.forEach(item => {   
        console.log(item)     
        const quantity = item.quantity || 1; 
        const itemSubtotal = item.price * quantity;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.thumbnail}" alt="${item.name}" width="50"></td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button onclick="removeQuantity('${item.id}')" style="padding: 2px; background-color: #603F26; color: #fff; border-radius: 5px;">-</button>
                ${quantity}
                <button onclick="addQuantity('${item.id}') " style="padding: 2px; background-color: #603F26; color: #fff; border-radius: 5px;">+</button>
            </td>
            <td>$${itemSubtotal.toFixed(2)}</td>
            <td><button onclick="removeItem('${item.id}')" style="background-color: rgb(168, 43, 11); color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius:  10px;">Remove</button></td>
        `;
        cartItemsContainer.appendChild(row);

        subtotal += itemSubtotal; 
    });

    updateCartTotals(subtotal);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.backgroundColor = type === 'error' ? '#D32F2F' : '#4CAF50'; 
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 1000);
}

function updateCartTotals(subtotal) {
    const shipping = 0; 
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function disableCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.classList.add('disabled');
    checkoutButton.addEventListener('click', preventCheckout);
}

function enableCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.classList.remove('disabled');
    checkoutButton.removeEventListener('click', preventCheckout);
}

function preventCheckout(event) {
    event.preventDefault();
    showToast('You must add items to your cart before proceeding to checkout.');
}

window.onload = fetchCartItems;
