document.addEventListener('DOMContentLoaded', function () {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    document.querySelectorAll('.ser-box').forEach(serBox => {
        const itemId = serBox.getAttribute('data-id');
        const heartIcon = serBox.querySelector('.favorite-btn i');

        if (wishlist.some(item => item.id === itemId)) {
            heartIcon.classList.replace('far', 'fas'); 
        }
    });

    function toggleFavorite(button) {
        const serBox = button.closest('.ser-box');
        const itemId = serBox.getAttribute('data-id');
        const itemName = serBox.querySelector('p').textContent;
        const itemImage = serBox.querySelector('img').src;
        const heartIcon = button.querySelector('i');

        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const itemIndex = wishlist.findIndex(i => i.id === itemId);

        if (itemIndex === -1) {
            wishlist.push({ id: itemId, name: itemName, image: itemImage });
            heartIcon.classList.replace('far', 'fas');
        } else {
            wishlist.splice(itemIndex, 1);
            heartIcon.classList.replace('fas', 'far'); 
        }

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        displayWishlist(); 
    }

    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', function () {
            toggleFavorite(button);
        });
    });

    function displayWishlist() {
        const wishlistContainer = document.getElementById('wishlist-container');
        if (!wishlistContainer) return;

        wishlistContainer.innerHTML = '<h1>My Wishlist</h1>'; 

        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist.forEach(item => {
            const serBox = document.createElement('div');
            serBox.classList.add('ser-box');
            serBox.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="150px" height="100px">
                <p>${item.name}</p>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            `;
            wishlistContainer.appendChild(serBox);
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function () {
                removeFromWishlist(button.getAttribute('data-id'));
            });
        });
    }

    function removeFromWishlist(itemId) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist = wishlist.filter(item => item.id !== itemId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        displayWishlist(); ف

    
        const heartButton = document.querySelector(`.ser-box[data-id="${itemId}"] .favorite-btn i`);
        if (heartButton) {
            heartButton.classList.replace('fas', 'far'); 
        }
    }

    displayWishlist();
});
