document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const type = document.getElementById('product-type').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const thumbnail = document.getElementById('product-thumbnail').value;
    const inStock = document.getElementById('product-inStock').checked;

    const productData = {
        id: id || Math.random().toString(36).substring(2, 9), 
        name,
        type,
        description,
        price,
        thumbnail,
        inStock
    };

    function showToast(message, type = 'success') {
        const toast = document.getElementById("toast");
        toast.innerText = message;
        toast.style.backgroundColor = type === 'error' ? '#D32F2F' : '#4CAF50'; 
        toast.classList.add("show");
    
        setTimeout(() => {
            toast.classList.remove("show");
        }, 2000);
    }
    fetch('/update_product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Product successfully added/updated!');
            document.getElementById('product-form').reset(); 
            setTimeout(() => {
                location.reload(); 
            }, 1000);
        } 
        else {
            showToast('Error: ' + data.error);
        }
    })
    .catch(() => {
        showToast('There was an error processing your request...');
    });
});
