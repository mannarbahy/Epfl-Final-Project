document.addEventListener('DOMContentLoaded', function () {
    // Load wishlist from local storage or initialize an empty array if not found
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Function to toggle favorite status of an item
    function toggleFavorite(button) {
        // Find the closest parent element with the class 'ser-box'
        const serBox = button.closest('.ser-box');
        // Get the unique identifier, name, and image of the item
        const itemId = serBox.getAttribute('data-id');
        const itemName = serBox.querySelector('p').textContent;
        const itemImage = serBox.querySelector('img').src;

        // Create an item object with the retrieved details
        const item = {
            id: itemId,
            name: itemName,
            image: itemImage
        };

        // Check if the item is already in the wishlist
        const itemIndex = wishlist.findIndex(i => i.id === itemId);

        if (itemIndex === -1) {
            // If the item is not in the wishlist, add it
            wishlist.push(item);
            // Change the heart icon to filled (indicating it's a favorite)
            button.querySelector('i').classList.remove('far');
            button.querySelector('i').classList.add('fas');
        } else {
            // If the item is already in the wishlist, remove it
            wishlist.splice(itemIndex, 1);
            // Change the heart icon to unfilled (indicating it's not a favorite)
            button.querySelector('i').classList.remove('fas');
            button.querySelector('i').classList.add('far');
        }

        // Save the updated wishlist to local storage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    // Attach event listeners to all favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', function () {
            toggleFavorite(button);
        });
    });

    // Function to display wishlist items on the wishlist page
    function displayWishlist() {
        const wishlistContainer = document.getElementById('wishlist-container');
        if (!wishlistContainer) return;

        wishlistContainer.innerHTML = ''; // Clear existing content

        wishlist.forEach(item => {
            const serBox = document.createElement('div');
            serBox.classList.add('ser-box');
            serBox.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="150px" height="100px">
                <p>${item.name}</p>
            `;
            wishlistContainer.appendChild(serBox);
        });
    }

    // Display wishlist items if on the wishlist page
    displayWishlist();
});


const q = document.querySelectorAll('.q');
const a = document.querySelectorAll('.a');
const arr = document.querySelectorAll('.arrow');

for(let i=0;i<q.length;i++)
    {
    q[i].addEventListener('click',()=>{
    a[i].classList.toggle('a-opened');
    arr[i].classList.toggle('arrow-rotated');  
    }
   
    );
}


