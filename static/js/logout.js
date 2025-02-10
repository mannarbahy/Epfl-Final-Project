document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.querySelector("#logout-btn");
    
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            console.log("Logging out...");
           
        });
    } 
});
