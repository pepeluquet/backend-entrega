const socket = io();

const form = document.getElementById('addProductForm');
const productsList = document.getElementById('productsList');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    socket.emit('newProduct', data);
    form.reset();
});

productsList.addEventListener('click', e => {
    if (e.target.classList.contains('deleteBtn')) {
        const id = e.target.dataset.id;
        socket.emit('deleteProduct', id);
    }
});

socket.on('productsUpdated', products => {
    productsList.innerHTML = '';
    products.forEach(p => {
        productsList.innerHTML += `<li>
            ${p.title} - $${p.price}
            <button class="deleteBtn" data-id="${p.id}">Eliminar</button>
        </li>`;
    });
});