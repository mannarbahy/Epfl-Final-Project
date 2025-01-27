
var a = document.getElementById("loginBtn");
var b = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("signup-form");

function login() {
    x.style.left = "4px";
    y.style.right = "520px";
    b.className = "btn";
    x.style.opacity = 1;
    y.style.opacity = 0;
}

function register() {
    x.style.left = "510px";
    y.style.right = "5px";
    a.className = "btn";
    x.style.opacity = 0;
    y.style.opacity = 1;
}
document.getElementById('termsLink').addEventListener('click', function () {
    document.getElementById('termsPopup').classList.remove('hidden');
});

document.getElementById('closeBtn').addEventListener('click', function () {
    document.getElementById('termsPopup').classList.add('hidden');
});

