// Clase para manejar el carrito de compras
class CarritoCompras {
    constructor() {
        this.productos = this.loadCartFromSessionStorage();
        this.subtotal = 0;
        this.isv = 0;
        this.total = 0;
        // Actualizar totales y lista al cargar (para mostrar el carrito persistente)
        this.actualizarTotales();
        this.actualizarListaProductos();
    }

    loadCartFromSessionStorage() {
        try {
            const storedCart = sessionStorage.getItem('shoppingCart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (e) {
            console.error("Error al cargar el carrito de sessionStorage:", e);
            return [];
        }
    }

    saveCartToSessionStorage() {
        sessionStorage.setItem('shoppingCart', JSON.stringify(this.productos));
    }

    agregarProducto(producto) {
        // Verificar si el producto ya existe en el carrito para evitar duplicados
        const existingProduct = this.productos.find(item => item.nombre === producto.nombre);
        if (existingProduct) {
             console.log('Producto ya existe en el carrito:', producto.nombre);
             return; // No añadir si ya existe
        }
        console.log('Agregando producto:', producto);
        this.productos.push(producto);
        this.saveCartToSessionStorage(); // Guardar después de añadir
        this.actualizarTotales();
        this.actualizarListaProductos();
    }

    eliminarProducto(index) {
        this.productos.splice(index, 1);
        this.saveCartToSessionStorage(); // Guardar después de eliminar
        this.actualizarTotales();
        this.actualizarListaProductos();
    }

    actualizarTotales() {
        console.log('Productos en carrito al actualizar totales:', this.productos); // Debug: ver el array de productos
        this.subtotal = this.productos.reduce((sum, producto) => {
            console.log('DEBUG: Sumando producto:', producto.nombre, 'Precio:', producto.precio, 'Suma actual:', sum); // Nuevo Debug: ver la suma en cada paso
            return sum + (typeof producto.precio === 'number' ? producto.precio : 0);
        }, 0);
        this.isv = this.subtotal * 0.15;
        this.total = this.subtotal + this.isv;
        
        document.getElementById('subtotal').textContent = `L. ${this.subtotal.toFixed(2)}`;
        document.getElementById('isv').textContent = `L. ${this.isv.toFixed(2)}`;
        document.getElementById('total').textContent = `L. ${this.total.toFixed(2)}`;
        
        // Actualizar el monto del préstamo
        document.getElementById('monto').value = this.total;
    }

    actualizarListaProductos() {
        const listaProductos = document.getElementById('lista-productos');
        listaProductos.innerHTML = '';

        if (this.productos.length === 0) {
            listaProductos.innerHTML = '<p>No hay productos en el carrito.</p>';
        } else {
            this.productos.forEach((producto, index) => {
                console.log('DEBUG: Producto en actualizarListaProductos loop:', producto); // Debug: ver el producto dentro del bucle
                const item = document.createElement('div');
                item.className = 'producto-item';
                // Asegurarse de que producto.precio es un número antes de usar toFixed
                const precioFormateado = typeof producto.precio === 'number' ? producto.precio.toFixed(2) : 'N/A';
                item.innerHTML = `
                    <span>${producto.nombre} - L. ${precioFormateado}</span>
                    <button onclick="carrito.eliminarProducto(${index})" class="eliminar-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                listaProductos.appendChild(item);
            });
        }
    }
}

// Clase para manejar la simulación del crédito
class SimuladorCredito {
    constructor() {
        this.tasaAnual = 12; // 12% anual
    }

    calcularCuota(monto, plazo) {
        const tasaMensual = this.tasaAnual / 12 / 100;
        const cuota = (monto * tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                     (Math.pow(1 + tasaMensual, plazo) - 1);
        return cuota;
    }

    calcularInteresTotal(monto, cuota, plazo) {
        return (cuota * plazo) - monto;
    }

    actualizarResultados() {
        const monto = parseFloat(document.getElementById('monto').value);
        const plazo = parseInt(document.getElementById('plazo').value);

        if (monto > 0 && plazo > 0) {
            const cuotaMensual = this.calcularCuota(monto, plazo);
            const interesTotal = this.calcularInteresTotal(monto, cuotaMensual, plazo);
            const totalPagar = monto + interesTotal;

            document.getElementById('cuota-mensual').textContent = `L. ${cuotaMensual.toFixed(2)}`;
            document.getElementById('interes-total').textContent = `L. ${interesTotal.toFixed(2)}`;
            document.getElementById('total-pagar').textContent = `L. ${totalPagar.toFixed(2)}`;
        }
    }
}

// Clase para generar facturas
class GeneradorFactura {
    generarFactura() {
        const fecha = new Date().toLocaleDateString();
        const numeroFactura = Math.floor(Math.random() * 1000000);
        const metodoFinanciamiento = document.getElementById('metodo-financiamiento').value;
        const numeroTarjeta = document.getElementById('numero-tarjeta').value;
        const nombreBanco = document.getElementById('nombre-banco').value;
        
        const nombreCliente = document.getElementById('nombre-cliente').value;
        const direccionCliente = document.getElementById('direccion-cliente').value;

        let productosHtml = '';
        carrito.productos.forEach(producto => {
            productosHtml += `
                <tr>
                    <td>1</td>
                    <td>${producto.nombre}</td>
                    <td>L. ${producto.precio.toFixed(2)}</td>
                    <td>L. ${producto.precio.toFixed(2)}</td>
                </tr>
            `;
        });

        let metodoFinanciamientoHtml = `<p><span>Método de Financiamiento:</span> <span>${metodoFinanciamiento === 'tarjeta' ? 'Tarjeta de Crédito' : 'Crédito Bancario'}</span></p>`;
        if (metodoFinanciamiento === 'tarjeta') {
            metodoFinanciamientoHtml += `<p><span>Número de Tarjeta:</span> <span>${numeroTarjeta || 'N/A'}</span></p>`;
        } else if (metodoFinanciamiento === 'bancario') {
            metodoFinanciamientoHtml += `<p><span>Nombre del Banco:</span> <span>${nombreBanco || 'N/A'}</span></p>`;
        }

        let contenido = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Factura de Crédito - AutoStar Premium</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #f4f7f6;
                        color: #333;
                        line-height: 1.6;
                    }
                    .invoice-container {
                        max-width: 800px;
                        margin: 20px auto;
                        background-color: #fff;
                        padding: 40px;
                        border-radius: 8px;
                        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                    }
                    .invoice-header {
                        position: relative;
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .invoice-logo {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 120px;
                        height: auto;
                    }
                    .invoice-header h2 {
                        color: #007bff;
                        font-size: 2.5rem;
                        margin-bottom: 5px;
                    }
                    .invoice-header p {
                        font-size: 0.9rem;
                        color: #777;
                    }
                    .invoice-details {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 15px;
                    }
                    .invoice-details div p {
                        margin: 5px 0;
                    }
                    .invoice-details strong {
                        color: #555;
                    }
                    .invoice-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    .invoice-table th,
                    .invoice-table td {
                        border: 1px solid #eee;
                        padding: 12px 15px;
                        text-align: left;
                    }
                    .invoice-table th {
                        background-color: #f8f9fa;
                        color: #555;
                        font-weight: 600;
                    }
                    .invoice-table td {
                        background-color: #fff;
                    }
                    .invoice-totals {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    .invoice-totals td {
                        padding: 8px 15px;
                        text-align: right;
                    }
                    .invoice-totals .label {
                        text-align: left;
                        font-weight: 600;
                    }
                    .invoice-totals .total-amount {
                        font-size: 1.2rem;
                        font-weight: bold;
                        color: #007bff;
                    }
                    .credit-details h4 {
                        color: #2c3e50;
                        margin-bottom: 15px;
                        font-size: 1.3rem;
                    }
                    .credit-details p {
                        margin: 8px 0;
                        display: flex;
                        justify-content: space-between;
                    }
                    .invoice-footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                        font-size: 0.85rem;
                        color: #777;
                    }
                    @media (max-width: 600px) {
                        .invoice-container {
                            padding: 20px;
                            margin: 10px auto;
                        }
                        .invoice-details {
                            flex-direction: column;
                        }
                        .invoice-details div {
                            margin-bottom: 10px;
                        }
                        .invoice-table th,
                        .invoice-table td {
                            padding: 8px 10px;
                            font-size: 0.9rem;
                        }
                        .invoice-totals .total-amount {
                            font-size: 1rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="invoice-header">
                        <img src="logos/logo.png" alt="AutoStar Premium Logo" class="invoice-logo">
                        <h2>Factura de Crédito</h2>
                        <p>AutoStar Premium</p>
                        <p>RTN: 08011985123960</p>
                        <p>Email: autolote@autolostarpremium.com | Tel: (504) 9962-0194</p>
                    </div>

                    <div class="invoice-details">
                        <div>
                            <p><strong>Factura No:</strong> <span>${numeroFactura}</span></p>
                            <p><strong>Fecha:</strong> <span>${fecha}</span></p>
                        </div>
                        <div>
                            <p><strong>Cliente:</strong> <span>${nombreCliente || 'N/A'}</span></p>
                            <p><strong>Dirección:</strong> <span>${direccionCliente || 'N/A'}</span></p>
                        </div>
                    </div>

                    <h3>Productos:</h3>
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <th>Cantidad</th>
                                <th>Descripción</th>
                                <th>Precio Unitario</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productosHtml}
                        </tbody>
                    </table>

                    <table class="invoice-totals">
                        <tr>
                            <td class="label">Subtotal:</td>
                            <td>${document.getElementById('subtotal').textContent}</td>
                        </tr>
                        <tr>
                            <td class="label">ISV (15%):</td>
                            <td>${document.getElementById('isv').textContent}</td>
                        </tr>
                        <tr>
                            <td class="label">Total:</td>
                            <td class="total-amount">${document.getElementById('total').textContent}</td>
                        </tr>
                    </table>

                    <div class="credit-details">
                        <h4>Detalles del Crédito:</h4>
                        <p><span>Monto del Préstamo:</span> <span>${document.getElementById('monto').value ? `L. ${parseFloat(document.getElementById('monto').value).toFixed(2)}` : 'N/A'}</span></p>
                        ${metodoFinanciamientoHtml}
                        <p><span>Plazo (meses):</span> <span>${document.getElementById('plazo').value}</span></p>
                        <p><span>Tasa de Interés Anual (%):</span> <span>${document.getElementById('tasa').value}</span></p>
                        <p><span>Cuota Mensual:</span> <span>${document.getElementById('cuota-mensual').textContent}</span></p>
                        <p><span>Interés Total:</span> <span>${document.getElementById('interes-total').textContent}</span></p>
                        <p><span>Total a Pagar:</span> <span>${document.getElementById('total-pagar').textContent}</span></p>
                    </div>

                    <div class="invoice-footer">
                        <p>¡Gracias por tu compra en AutoStar Premium!</p>
                        <p>Para cualquier consulta, contáctanos.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const ventana = window.open('', '_blank');
        ventana.document.write(contenido);
        ventana.document.close();
    }
}

// Inicializar el carrito de compras y el simulador
const carrito = new CarritoCompras();
const simulador = new SimuladorCredito();
const generadorFactura = new GeneradorFactura();

// La lógica de carga inicial ahora se maneja en el constructor de CarritoCompras
// Por lo tanto, esta función ya no es necesaria y será eliminada
// function checkSessionStorageForProduct() {
//     const productData = sessionStorage.getItem('productForCreditSimulation');
//     if (productData) {
//         const product = JSON.parse(productData);
//         carrito.agregarProducto(product);
//         sessionStorage.removeItem('productForCreditSimulation'); // Limpiar después de usar
//     }
// }

document.addEventListener('DOMContentLoaded', function() {
    // checkSessionStorageForProduct(); // Ya no es necesario aquí

    // Event Listeners
    const calcularCreditoBtn = document.getElementById('calcular-credito');
    if (calcularCreditoBtn) {
        calcularCreditoBtn.addEventListener('click', () => {
            simulador.actualizarResultados();
        });
    }

    const generarFacturaBtn = document.getElementById('generar-factura');
    if (generarFacturaBtn) {
        generarFacturaBtn.addEventListener('click', () => {
            generadorFactura.generarFactura();
        });
    }

    // Event listeners para los campos de método de financiamiento
    const metodoFinanciamientoSelect = document.getElementById('metodo-financiamiento');
    const campoNumeroTarjeta = document.getElementById('campo-numero-tarjeta');
    const campoNombreBanco = document.getElementById('campo-nombre-banco');

    if (metodoFinanciamientoSelect) {
        metodoFinanciamientoSelect.addEventListener('change', function() {
            if (this.value === 'tarjeta') {
                campoNumeroTarjeta.style.display = 'block';
                campoNombreBanco.style.display = 'none';
            } else if (this.value === 'bancario') {
                campoNumeroTarjeta.style.display = 'none';
                campoNombreBanco.style.display = 'block';
            } else {
                campoNumeroTarjeta.style.display = 'none';
                campoNombreBanco.style.display = 'none';
            }
        });
    }
});

// Función global para agregar al carrito (llamada desde otras páginas)
function agregarAlCarrito(nombre, precio) {
    carrito.agregarProducto({ nombre, precio });
}

function generarFactura() {
    const factura = document.getElementById('factura');
    const fecha = new Date();
    const numeroFactura = 'FAC-' + fecha.getFullYear() + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    // Actualizar información de la factura
    document.getElementById('factura-numero').textContent = numeroFactura;
    document.getElementById('factura-fecha').textContent = fecha.toLocaleDateString('es-HN');
    
    // Obtener información del cliente
    const nombre = document.getElementById('nombre').value;
    const direccion = document.getElementById('direccion').value;
    const metodoFinanciamiento = document.getElementById('metodo-financiamiento').value;
    const banco = document.getElementById('banco').value;
    
    // Actualizar información del cliente en la factura
    document.getElementById('factura-nombre').textContent = nombre;
    document.getElementById('factura-direccion').textContent = direccion;
    document.getElementById('factura-metodo').textContent = metodoFinanciamiento;
    document.getElementById('factura-banco').textContent = banco || 'No aplica';
    
    // Obtener productos del carrito
    const productos = JSON.parse(sessionStorage.getItem('carrito')) || [];
    const listaProductos = document.getElementById('factura-lista-productos');
    listaProductos.innerHTML = '';
    
    let subtotal = 0;
    productos.forEach(producto => {
        const precio = parseFloat(producto.precio.replace(/[^0-9.-]+/g, ''));
        subtotal += precio;
        
        const item = document.createElement('div');
        item.className = 'factura-item';
        item.innerHTML = `
            <span class="label">${producto.nombre}</span>
            <span class="value">LPS ${precio.toLocaleString('es-HN')}</span>
        `;
        listaProductos.appendChild(item);
    });
    
    // Calcular totales
    const isv = subtotal * 0.15;
    const total = subtotal + isv;
    
    // Actualizar totales en la factura
    document.getElementById('factura-subtotal').textContent = 'LPS ' + subtotal.toLocaleString('es-HN');
    document.getElementById('factura-isv').textContent = 'LPS ' + isv.toLocaleString('es-HN');
    document.getElementById('factura-total').textContent = 'LPS ' + total.toLocaleString('es-HN');
    
    // Mostrar la factura
    factura.style.display = 'block';
    
    // Scroll a la factura
    factura.scrollIntoView({ behavior: 'smooth' });
}

function imprimirFactura() {
    window.print();
}

function enviarFacturaPorEmail() {
    const email = prompt('Por favor, ingrese su correo electrónico:');
    if (email) {
        // Aquí iría la lógica para enviar la factura por email
        alert('La factura será enviada a: ' + email);
    }
}

// Agregar event listeners
document.addEventListener('DOMContentLoaded', function() {
    const btnGenerarFactura = document.getElementById('btn-generar-factura');
    const btnImprimir = document.getElementById('btn-imprimir');
    const btnEmail = document.getElementById('btn-email');
    
    if (btnGenerarFactura) {
        btnGenerarFactura.addEventListener('click', generarFactura);
    }
    
    if (btnImprimir) {
        btnImprimir.addEventListener('click', imprimirFactura);
    }
    
    if (btnEmail) {
        btnEmail.addEventListener('click', enviarFacturaPorEmail);
    }
}); 