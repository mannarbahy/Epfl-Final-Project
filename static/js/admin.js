document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('product-id').value, 10); 
    const name = document.getElementById('product-name').value;
    const type = document.getElementById('product-type').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const thumbnail = document.getElementById('product-thumbnail').value;
    const inStock = document.getElementById('product-inStock').checked;

    const productData = {
        id: id, 
        name: name,
        type: type,
        description: description,
        price: price,
        thumbnail: thumbnail,
        inStock: inStock
    };

    document.getElementById('product-form').reset();

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
            alert('Product successfully added/updated!');
            
            setTimeout(() => {
                location.reload(); 
            }, 2000);
        } 
        else {
            alert('Error: ' + data.error);
        }
    })
    .catch(() => {
       alert('There was an error processing your request...');
    });
});
