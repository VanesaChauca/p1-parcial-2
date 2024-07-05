'use strict';

let carrito = [];

function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    carrito.push(producto);
    actualizarCarrito();
}

function actualizarCarrito() {
    const contadorCarrito = document.getElementById('cuenta-carrito');
    const totalCarrito = document.getElementById('totalCarrito');

    contadorCarrito.textContent = carrito.length;
    const total = carrito.reduce((total, producto) => total + parseFloat(producto.precio), 0);
    totalCarrito.textContent = `Total: $${formatearPrecio(total)}`;
}

function formatearPrecio(precio) {
    const partes = precio.toFixed(3).split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return partes.join('.');
}

