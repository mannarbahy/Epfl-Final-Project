document.addEventListener('DOMContentLoaded', () => {
    let wishlist = [];
    let err = [];

    function fetchWishlist() {
        return fetch('/get_wishlist')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    wishlist = data.wishlist;
                } 
                else {
                    err = data.error;
                }
            })
            .catch(() => {
                showToast('Error fetching wishlist. Please try again later.');
            });
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
        fetch('/add_to_wishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ product_id: productId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    heartIcon.classList.toggle('active');
                } else {
                    showToast(`${data.error}`);
                }
            })
            .catch(() => {
                showToast('Error adding to wishlist. Please try again later.');
            });
    }

    function addToCart(product, quantity) {
        if (quantity < 1) {
            showToast('Quantity cannot be less than 1.');
            
        }

        fetch('/add_to_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ product_id: product.id, quantity: quantity })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast(`Added ${quantity} ${product.name}(s) to cart!`);
                } 
                else {
                    showToast(`${data.error}`);
                }
            })
            .catch(() => {
                showToast('Error adding to cart. Please try again later.');
            });
    }

    function fetchProducts(category = null) {
        let url = "/get_products";
        if (category) {
            url += `?category=${category}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const productList = document.getElementById('products');
                productList.innerHTML = ''; 
                data.forEach(product => {
                    const listItem = document.createElement('li');
                    const isWishlisted = wishlist.includes(product.id);
                    listItem.innerHTML = `
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
                    `;
                    productList.appendChild(listItem);

                    const heartIcon = listItem.querySelector('.wishlist-heart');
                    heartIcon.addEventListener('click', () => {
                        toggleWishlist(product.id, heartIcon);
                    });

                    const addToCartBtn = listItem.querySelector('.add-to-cart-btn');
                    const quantityInput = listItem.querySelector('.quantity');
                    const decreaseBtn = listItem.querySelector('.decrease');
                    const increaseBtn = listItem.querySelector('.increase');

                   
                    decreaseBtn.addEventListener('click', () => {
                        let currentQuantity = parseInt(quantityInput.value);
                        if (currentQuantity > 1) {
                            quantityInput.value = currentQuantity - 1;
                        }
                    });

                    increaseBtn.addEventListener('click', () => {
                        let currentQuantity = parseInt(quantityInput.value);
                        quantityInput.value = currentQuantity + 1;
                    });

                   
                    addToCartBtn.addEventListener('click', () => {
                        const quantity = parseInt(quantityInput.value);
                        if (product.inStock && quantity >= 1) {
                            addToCart(product, quantity);
                        } else {
                            showToast('Please select a valid quantity.');
                        }
                    });
                });
            })
            .catch(() => {
                showToast('Error fetching the products. Please try again later.');
            });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    fetchWishlist().then(() => fetchProducts(category));
});
