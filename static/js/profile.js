document.addEventListener('DOMContentLoaded', async () => {
    
    let user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        console.log(" Loading user from localStorage");
        displayUserInfo(user);
    } 
    else {
        console.log("Fetching user data from server...");
        try {
            const response = await fetch('/profile_data');
            const data = await response.json();

            if (data.success) {
                user = data.user;
                localStorage.setItem('user', JSON.stringify(user)); 
                displayUserInfo(user);
            } 
            else {
                document.getElementById('profile-info').innerHTML = '<p class="error">User not found.</p>';
            }
        } 
        catch (error) {
            document.getElementById('profile-info').innerHTML = '<p class="error">Error loading profile data.</p>';
        }
    }
    
    function displayUserInfo(user) {
    document.getElementById('profile-info').innerHTML = `
        <p><span class="label">Name:</span> ${user.name}</p>
        <p><span class="label">Email:</span> ${user.email}</p>
        <p><span class="label">Address:</span> ${user.address}</p>
        <p><span class="label">Phone:</span> ${user.phone}</p>
    `;
}

    
    fetch('/get_orders')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const ordersList = document.getElementById('orders-list');
                data.orders.forEach(order => {
                    const orderItem = document.createElement('div');
                    orderItem.className = 'order-item';
                    orderItem.innerHTML = `
                        <p><span class="label">Order ID:</span> ${order.order_id}</p>
                        <p><span class="label">Date:</span> ${order.order_date}</p>
                        <p><span class="label">Items:</span> ${order.cart.map(item => item.name).join(', ')}</p>
                        <p><span class="label">Total:</span> $${order.total}</p>
                    `;
                    ordersList.appendChild(orderItem);
                });
            } 
            else {
                document.getElementById('orders-list').innerHTML = '<p class="error">Error fetching orders.</p>';
            }
        })
        .catch(error => {
            document.getElementById('orders-list').innerHTML = '<p class="error">Error fetching orders.</p>';
        });
});