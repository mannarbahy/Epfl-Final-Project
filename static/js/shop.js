document.addEventListener('DOMContentLoaded', async () => {
    let wishlist = [];

    async function fetchWishlist() {
        try {
            const response = await fetch('/get_wishlist');
            const data = await response.json();
            if (data.success) {
                wishlist = data.wishlist;
            } else {
                showToast(data.error, 'error');
            }
        } catch {
            showToast('Error fetching wishlist. Please try again later.', 'error');
        }
    }

    function showToast(message, type = 'success') {
        const toast = document.getElementById("toast");
        toast.innerText = message;
        toast.style.backgroundColor = type === 'error' ? '#D32F2F' : '#4CAF50';
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 2000);
    }

    function toggleWishlist(productId, heartIcon) {
        const isWishlisted = wishlist.includes(productId);

        // Optimistic UI update
        if (isWishlisted) {
            wishlist = wishlist.filter(id => id !== productId);
            heartIcon.classList.remove('active');
        } else {
            wishlist.push(productId);
            heartIcon.classList.add('active');
        }

        fetch('/add_to_wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                
                if (isWishlisted) {
                    wishlist.push(productId);
                    heartIcon.classList.add('active');
                } else {
                    wishlist = wishlist.filter(id => id !== productId);
                    heartIcon.classList.remove('active');
                }
                showToast(data.error, 'error');
            }
        })
        .catch(() => {
           
            if (isWishlisted) {
                wishlist.push(productId);
                heartIcon.classList.add('active');
            } else {
                wishlist = wishlist.filter(id => id !== productId);
                heartIcon.classList.remove('active');
            }
            showToast('Error adding to wishlist. Please try again later.', 'error');
        });
    }

    function addToCart(product, quantity) {
        if (quantity < 1) {
            showToast('Quantity cannot be less than 1.', 'error');
            return;
        }

        if (!product.inStock) {
            showToast('This product is out of stock.', 'error');
            return;
        }

        fetch('/add_to_cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: product.id, quantity })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast(`Added ${quantity} ${product.name}(s) to cart!`);
            } else {
                showToast(data.error, 'error');
            }
        })
        .catch(() => showToast('Error adding to cart. Please try again later.', 'error'));
    }

    async function fetchProducts(category = null) {
        let url = "/get_products";
        if (category) url += `?category=${category}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const productList = document.getElementById('products');
            let html = ''; 

            data?.forEach(product => {
                const isWishlisted = wishlist.includes(product.id);
                html += `
                    <li>
                        <span class="wishlist-heart ${isWishlisted ? 'active' : ''}" data-id="${product.id}">
                            &#10084;
                        </span>
                        <img src="${product.thumbnail}" alt="${product.name}" width="50">
                        <div class="product-details ${product.inStock ? '' : 'out-of-stock'}">
                            <strong>${product.name}</strong>
                            <p>${product.description}</p>
                            <p class="type">${product.type}</p>
                            <span class="price">$${product.price} </span>
                        </div>
                        <div class="product-actions">
                            <div class="quantity-control">
                                <button class="decrease">-</button>
                                <input type="number" min="1" value="1" class="quantity">
                                <button class="increase">+</button>
                            </div>
                            <button class="add-to-cart-btn ${product.inStock ? '' : 'out-of-stock'}" data-id="${product.id}">
                                Add to Cart
                            </button>
                        </div>
                    </li>
                `;
            });

            productList.innerHTML = html; 

            
            productList.querySelectorAll('.wishlist-heart').forEach(heartIcon => {
                heartIcon.addEventListener('click', () => {
                    const productId = heartIcon.getAttribute('data-id');
                    toggleWishlist(productId, heartIcon);
                });
            });

            productList.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const productId = button.getAttribute('data-id');
                    const product = data.find(p => p.id == productId);
                    const quantityInput = button.closest('li').querySelector('.quantity');
                    const quantity = parseInt(quantityInput.value);

                    if (product.inStock && quantity >= 1) {
                        addToCart(product, quantity);
                    } else {
                        showToast('Please select a valid quantity.', 'error');
                    }
                });
            });

            productList.querySelectorAll('.quantity-control').forEach(control => {
                const decreaseBtn = control.querySelector('.decrease');
                const increaseBtn = control.querySelector('.increase');
                const quantityInput = control.querySelector('.quantity');

                decreaseBtn.addEventListener('click', () => {
                    let currentQuantity = parseInt(quantityInput.value);
                    if (currentQuantity > 1) quantityInput.value = currentQuantity - 1;
                });

                increaseBtn.addEventListener('click', () => {
                    let currentQuantity = parseInt(quantityInput.value);
                    quantityInput.value = currentQuantity + 1;
                });
            });
        } catch {
            showToast('Error fetching the products. Please try again later.', 'error');
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    await fetchWishlist();
    await fetchProducts(category);
});