document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signup-form');
    const submitButton = document.querySelector('input[type="submit"]');

    const fullname = document.getElementById('fullname');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const address = document.getElementById('address');
    const phone = document.getElementById('phone');
    const security_question = document.getElementById('security_question');
    

    const fullnameError = document.getElementById('fullname-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const addressError = document.getElementById('address-error');
    const phoneError = document.getElementById('phone-error');
    const securityQuestionError = document.getElementById('security_question-error');
   

    submitButton.disabled = true;

    function checkFormValidity() {

    const isValidFullname = fullname.value.trim().length >= 5;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmail = emailPattern.test(email.value);
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&./)(#^])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValidPassword = passwordPattern.test(password.value);
    const addressPattern = /^[A-Za-z\s,]+$/;
    const isValidAddress = addressPattern.test(address.value.trim());
    const isValidPhone = /^[0-9]{10,15}$/.test(phone.value);
    const securityQuestionPattern = /^[A-Za-z\s]+$/;
    const isValidSecurityQuestion = securityQuestionPattern.test(security_question.value.trim()) && security_question.value.trim().length >= 3;
   

    fullnameError.style.display = fullname.value ? (isValidFullname ? 'none' : 'block') : 'none';
    emailError.style.display = email.value ? (isValidEmail ? 'none' : 'block') : 'none';
    passwordError.style.display = password.value ? (isValidPassword ? 'none' : 'block') : 'none';
    addressError.style.display = address.value ? (isValidAddress ? 'none' : 'block') : 'none';
    phoneError.style.display = phone.value ? (isValidPhone ? 'none' : 'block') : 'none';
    securityQuestionError.style.display = security_question.value ? (isValidSecurityQuestion ? 'none' : 'block') : 'none';

    submitButton.disabled = !(isValidFullname && isValidEmail && isValidPassword && isValidAddress && isValidPhone && isValidSecurityQuestion && isValidRole);
    }

    fullname.addEventListener('input', checkFormValidity);
    email.addEventListener('input', checkFormValidity);
    password.addEventListener('input', checkFormValidity);
    address.addEventListener('input', checkFormValidity);
    phone.addEventListener('input', checkFormValidity);
    security_question.addEventListener('input', checkFormValidity);
   

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!submitButton.disabled) {
            const formData = new URLSearchParams({
                fullname: fullname.value,
                email: email.value,
                password: password.value,
                address: address.value,
                phone: phone.value,
                security_question: security_question.value,
                
            });

            fetch('/signup', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.id) {
                    localStorage.setItem('user', JSON.stringify(data));
                    window.location.href = '/home';
                } else {
                    if (data.error) {
                        if (data.error.includes('Email already exists')) {
                            email.classList.add('error');
                            emailError.textContent = data.error;
                            emailError.style.display = 'block';
                        }
                        submitButton.disabled = true;  
                    }
                }
            })
            .catch(err => {
                alert("There was an error processing your request. Please try again later.");
            });       
         }
    });
});
