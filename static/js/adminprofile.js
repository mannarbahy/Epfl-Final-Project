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
        
       
});