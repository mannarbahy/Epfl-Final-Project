function showToast(message, type = 'success') {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.backgroundColor = type === 'error' ? '#D32F2F' : '#4CAF50'; 
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
document.addEventListener('DOMContentLoaded', () => {
    const name = document.getElementById('name');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const country = document.getElementById('country');
    const postcode = document.getElementById('postcode');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const nameError = document.getElementById('name-error');
    const addressError = document.getElementById('address-error');
    const cityError = document.getElementById('city-error');
    const countryError = document.getElementById('country-error');
    const postcodeError = document.getElementById('postcode-error');
    const phoneError = document.getElementById('phone-error');
    const emailError = document.getElementById('email-error');
    const placeOrderBtn = document.querySelector('.place-order');

   
    function checkFormValidity() {
        const isValidName = name.value.trim().length >= 5;
        const isValidAddress = /^[A-Za-z\s,]+$/.test(address.value.trim());
        const isValidCity = city.value.trim().length >= 2;
        const isValidCountry = country.value.trim().length >= 2;
        const isValidPostcode = /^[0-9]{3,5}$/.test(postcode.value.trim());
        const isValidPhone = /^[0-9]{10,15}$/.test(phone.value);
        const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value);

        nameError.style.display = name.value ? (isValidName ? 'none' : 'block') : 'none';
        addressError.style.display = address.value ? (isValidAddress ? 'none' : 'block') : 'none';
        cityError.style.display = city.value ? (isValidCity ? 'none' : 'block') : 'none';
        countryError.style.display = country.value ? (isValidCountry ? 'none' : 'block') : 'none';
        postcodeError.style.display = postcode.value ? (isValidPostcode ? 'none' : 'block') : 'none';
        phoneError.style.display = phone.value ? (isValidPhone ? 'none' : 'block') : 'none';
        emailError.style.display = email.value ? (isValidEmail ? 'none' : 'block') : 'none';

        return isValidName && isValidAddress && isValidCity && isValidCountry && isValidPostcode && isValidPhone && isValidEmail;
    }

    function placeOrder() {
        if (checkFormValidity()) {
            document.getElementById('checkout-form').submit();
        } else {
            showToast('Please fill out all fields correctly.');
        }
    }


    name.addEventListener('input', checkFormValidity);
    address.addEventListener('input', checkFormValidity);
    city.addEventListener('input', checkFormValidity);
    country.addEventListener('input', checkFormValidity);
    postcode.addEventListener('input', checkFormValidity);
    phone.addEventListener('input', checkFormValidity);
    email.addEventListener('input', checkFormValidity);

   
   
    placeOrderBtn.addEventListener('click', function(event) {
        event.preventDefault(); 
        placeOrder();
    });
});

let total = 0;
const checkoutForm = document.getElementById('checkout-form');
const placeOrderBtn = document.querySelector('.place-order');
const requiredInputs = checkoutForm.querySelectorAll('input[required]');

placeOrderBtn.disabled = true;
placeOrderBtn.style.opacity = '0.5';
placeOrderBtn.style.cursor = 'not-allowed';

function validateForm() {
    let isValid = true;
    let emptyFields = [];
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            emptyFields.push(input.getAttribute('placeholder'));
        }
    });
    
    if (isValid) {
        placeOrderBtn.disabled = false;
        placeOrderBtn.style.opacity = '1';
        placeOrderBtn.style.cursor = 'pointer';
    } 
    else {
        placeOrderBtn.disabled = true;
        placeOrderBtn.style.opacity = '0.5';
        placeOrderBtn.style.cursor = 'not-allowed';
    }

    return { isValid, emptyFields };
}

requiredInputs.forEach(input => {
    input.addEventListener('input', validateForm);
  
});

async function displayCart() {
    const cartItemsElement = document.getElementById('cart-items');
    cartItemsElement.innerHTML = '';
    total = 0;

    try {
        const response = await fetch('/get_cart_items', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const products = await response.json();

        products.forEach(product => {
            const quantity = product.quantity;
            const itemTotal = product.price * quantity;
            total += itemTotal;

            const productDiv = document.createElement('div');
            productDiv.className = 'product-item';
            productDiv.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.name}" class="product-image">
                <div class="product-details">
                    <div>${product.name}</div>
                    <div>x ${quantity}</div>
                </div>
                <div class="product-price">$${itemTotal.toFixed(2)}</div>
            `;
            cartItemsElement.appendChild(productDiv);
        });

        document.getElementById('subtotal').textContent = `$${total.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    } catch (error) {
        document.getElementById('cart-items').innerHTML = '<div>Error fetching cart items.</div>';
    }
}

async function fetchCartFromBackend() {
    try {
        const response = await fetch('/get_cart_items', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    } 
    catch (error) {
        document.getElementById('cart-items').innerHTML = '<div>Error fetching cart items.</div>';
        return {};
    }
}

async function placeOrder() {
    const validation = validateForm();
    
    if (!validation.isValid) {
        const emptyFieldsList = validation.emptyFields.join(', ');
        showToast(`Please fill in all required fields to continue your order.\n\nMissing information for: ${emptyFieldsList}`);
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                input.addEventListener('input', function removeHighlight() {
                    if (input.value.trim()) {
                        input.style.borderColor = '';
                        input.removeEventListener('input', removeHighlight);
                    }
                });
            }
        });
        return;
    }

    const formData = new FormData(document.getElementById('checkout-form'));
    const orderData = {
        customerInfo: Object.fromEntries(formData),
        cart: await fetchCartFromBackend(),
        total: total,
    };

    try {
        const response = await fetch('/save_order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const data = await response.json();

        if (data.success) {
            showSuccessDialog();
        } else {
            showToast('Error placing order: ' + data.message);
        }
    } 
    catch (error) {
        showToast('Error placing order.');
    }
    placeOrderBtn.addEventListener('click', placeOrder);
}

function showSuccessDialog() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('successDialog').style.display = 'block';
}

function hideSuccessDialog() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('successDialog').style.display = 'none';
}

displayCart();