document.addEventListener('DOMContentLoaded', () => {
    const contenedorTarjetas = document.getElementById("listaProductos");

    class Producto {
        constructor(id, nombre, descripcion, precio, imagen, categoria) {
            this.id = id;
            this.nombre = nombre;
            this.descripcion = descripcion;
            this.precio = parseFloat(precio);
            this.imagen = imagen;
            this.categoria = categoria;
        }
    }

    const productos = [];

    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const datosProducto = data.map(producto => new Producto(
                producto.id,
                producto.nombre,
                producto.descripcion,
                producto.precio,
                producto.imagen,
                producto.categoria
            ));
            productos.push(...datosProducto);
            mostrarTarjetasProductos(productos);
        })
        .catch(error => console.error('Error al cargar el JSON:', error));

    function mostrarTarjetasProductos(productos) {
        const filtroCategoria = document.getElementById('filtroCategoria');

        const crearProducto = (productos) => {
            contenedorTarjetas.innerHTML = '';
            productos.forEach(producto => {
                const productoItem = document.createElement('div');
                productoItem.className = 'col-12 col-md-4 col-lg-3 mb-4 producto';

                const card = document.createElement('div');
                card.className = 'card h-auto';

                const img = document.createElement('img');
                img.src = producto.imagen;
                img.className = 'card-img-top';
                img.alt = producto.nombre;

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                const cardTitle = document.createElement('h3');
                cardTitle.className = 'card-title';
                cardTitle.textContent = producto.nombre;

                const cardTextCat = document.createElement('h5');
                cardTextCat.className = 'card-text';
                cardTextCat.textContent = `${producto.categoria}`;

                const cardTextDesc = document.createElement('p');
                cardTextDesc.className = 'card-text';
                cardTextDesc.textContent = producto.descripcion;

                const cardTextPrice = document.createElement('p');
                cardTextPrice.className = 'card-text';
                cardTextPrice.textContent = `$${formatearPrecio(producto.precio)}`;

                const botonDetalle = document.createElement('button');
                botonDetalle.className = 'btn btn-primary me-2';
                botonDetalle.textContent = 'Ver Detalle';
                botonDetalle.addEventListener("click", () => mostrarDetallesProducto(producto.id));
                
                const botonAgregar = document.createElement('button');
                botonAgregar.className = 'btn btn-primary';
                botonAgregar.textContent = 'Agregar al carrito';
                botonAgregar.addEventListener("click", () => agregarAlCarrito(producto.id));

                cardBody.append(cardTitle, cardTextCat, cardTextDesc, cardTextPrice, botonDetalle, botonAgregar);

                card.append(img, cardBody);

                productoItem.appendChild(card);
                contenedorTarjetas.appendChild(productoItem);
            });
        };

        const filtrarProductos = () => {
            const categoria = filtroCategoria.value;
            if (categoria === 'todas') {
                crearProducto(productos);
            } else {
                crearProducto(productos.filter(producto => producto.categoria === categoria));
            }
        };

        const categorias = [...new Set(productos.map(producto => producto.categoria))];
        categorias.forEach(categoria => {
            const opcion = document.createElement('option');
            opcion.value = categoria;
            opcion.textContent = categoria;
            filtroCategoria.appendChild(opcion);
        });

        filtroCategoria.addEventListener('change', filtrarProductos);

        crearProducto(productos);
    }

    const carrito = [];

    function agregarAlCarrito(productoId) {
        const producto = productos.find(p => p.id === productoId);
        carrito.push(producto);
        actualizarCarrito();
    }

    function actualizarCarrito() {
        const contadorCarrito = document.getElementById('cuenta-carrito');
        const totalCarrito = document.getElementById('totalCarrito');

        contadorCarrito.textContent = carrito.length;
        const total = carrito.reduce((total, producto) => total + parseFloat(producto.precio), 0).toFixed(3);
        totalCarrito.textContent = `$${total}`;
    }

    //mostrar detalles de producto en modal
    function mostrarDetallesProducto(productoId) {
        const producto = productos.find(p => p.id === productoId);
    
        const modal = document.getElementById('modal-producto');
        const contenidoModal = document.getElementById('detalles-modal-producto');
    
        contenidoModal.innerHTML = '';

        const divImagen = document.createElement('div');
        divImagen.className = 'modal-imagen';
        const imagenProducto = document.createElement('img');
        imagenProducto.src = producto.imagen;
        imagenProducto.alt = producto.nombre;
        divImagen.append(imagenProducto);

        const divContenido = document.createElement('div');
        divContenido.className = 'modal-contenido';

        const nombreProducto = document.createElement('h2');
        nombreProducto.textContent = producto.nombre;

        const descripcionProducto = document.createElement('p');
        descripcionProducto.textContent = producto.descripcion;
    
        const precioProducto = document.createElement('p');
        precioProducto.textContent = `$${formatearPrecio(producto.precio)}`;
    
        const botonAgregar = document.createElement('button');
        botonAgregar.className = 'btn btn-primary';
        botonAgregar.textContent = 'Agregar al carrito';
        botonAgregar.addEventListener("click", () => agregarAlCarrito(producto.id));
    
        divContenido.append(nombreProducto, descripcionProducto, precioProducto, botonAgregar);

        contenidoModal.append(divImagen, divContenido);

        modal.classList.add('show');
    }
    
    document.getElementById('cerrar-modal').onclick = function() {
        document.getElementById('modal-producto').classList.remove('show');
    };
    
    window.onclick = function(evento) {
        if (evento.target == document.getElementById('modal-producto')) {
            document.getElementById('modal-producto').classList.remove('show');
        }
    };
});



function formatearPrecio(precio) {
    const partes = precio.toFixed(3).split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return partes.join('.');
}
