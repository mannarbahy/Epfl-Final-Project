document.addEventListener('DOMContentLoaded', function() {
  const navUserDropdown = document.querySelector('.nav-user-dropdown');
  const dropdownContent = navUserDropdown.querySelector('.dropdown-content');
  const navUser = navUserDropdown.querySelector('.nav-user');

 
  if (navUser) {
    navUser.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); 
      dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });
  }

  document.addEventListener('click', function(e) {
    if (!navUserDropdown.contains(e.target)) {
      dropdownContent.style.display = 'none';
    }
  });
});


function showSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.style.display = 'flex';  
}

function hideSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.style.display = 'none'; 
}
