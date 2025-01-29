
window.addEventListener('load', function() {
    document.body.classList.add('fade-in');
});
function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';  
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none'; 
}



function toggleFavorite(button) {
    const icon = button.querySelector('i');
    button.classList.toggle('favorited'); 

    if (button.classList.contains('favorited')) {
        icon.classList.remove('far'); 
        icon.classList.add('fas'); 
    }
     else {
        icon.classList.remove('fas'); 
        icon.classList.add('far');
    }
}



const q = document.querySelectorAll('.q');
const a = document.querySelectorAll('.a');
const arr = document.querySelectorAll('.arrow');

for(let i=0;i<q.length;i++){
    q[i].addEventListener('click',()=>{
    a[i].classList.toggle('a-opened');
    arr[i].classList.toggle('arrow-rotated');  
    }
   
    );
}


