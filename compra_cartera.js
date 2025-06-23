// Clase para manejar el carrito de compras (reutilizada de simular_credito.js)
class CarritoCompras {
    constructor() {
        this.productos = [];
        this.subtotal = 0;
        this.isv = 0;
        this.total = 0;
        this.cargarProductosDeSessionStorage(); // Cargar productos al inicializar
    }

    cargarProductosDeSessionStorage() {
        const storedCart = sessionStorage.getItem('shoppingCart');
        if (storedCart) {
            this.productos = JSON.parse(storedCart);
            console.log('DEBUG: Productos cargados de sessionStorage (compra_cartera.js):', this.productos);
        } else {
            console.log('DEBUG: No hay productos en sessionStorage (compra_cartera.js).');
        }
    }

    agregarProducto(producto) {
        this.productos.push(producto);
        this.actualizarTotales();
        this.actualizarListaProductos();
        sessionStorage.setItem('shoppingCart', JSON.stringify(this.productos)); // Guardar cambios
        console.log('DEBUG: Producto añadido al carrito y guardado (compra_cartera.js):', this.productos);
    }

    eliminarProducto(index) {
        console.log('DEBUG: Eliminando producto en índice (compra_cartera.js):', index);
        this.productos.splice(index, 1);
        this.actualizarTotales();
        this.actualizarListaProductos();
        sessionStorage.setItem('shoppingCart', JSON.stringify(this.productos)); // Guardar cambios
        console.log('DEBUG: Carrito después de eliminar (compra_cartera.js):', this.productos);
    }

    actualizarTotales() {
        this.subtotal = this.productos.reduce((sum, producto) => sum + producto.precio, 0);
        this.isv = this.subtotal * 0.15;
        this.total = this.subtotal + this.isv;
        
        document.getElementById('subtotal').textContent = `L. ${this.subtotal.toFixed(2)}`;
        document.getElementById('isv').textContent = `L. ${this.isv.toFixed(2)}`;
        document.getElementById('total').textContent = `L. ${this.total.toFixed(2)}`;
        
        // Actualizar el monto de compra
        const montoCompraInput = document.getElementById('monto-compra');
        if (montoCompraInput) {
            montoCompraInput.value = this.total.toFixed(2);
        }
        console.log('DEBUG: Totales actualizados (compra_cartera.js). Subtotal:', this.subtotal, 'Total:', this.total);
    }

    actualizarListaProductos() {
        const listaProductos = document.getElementById('lista-productos');
        if (!listaProductos) {
            console.error('ERROR: Elemento #lista-productos no encontrado (compra_cartera.js).');
            return;
        }
        listaProductos.innerHTML = '';
        console.log('DEBUG: Actualizando lista de productos. Productos a mostrar:', this.productos);

        if (this.productos.length === 0) {
            listaProductos.innerHTML = '<p>No hay productos seleccionados.</p>';
        }

        this.productos.forEach((producto, index) => {
            const item = document.createElement('div');
            item.className = 'producto-item';
            item.innerHTML = `
                <span>${producto.nombre} - L. ${producto.precio.toFixed(2)}</span>
                <button onclick="carrito.eliminarProducto(${index})" class="eliminar-btn">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            listaProductos.appendChild(item);
            console.log('DEBUG: Producto añadido a la lista (compra_cartera.js):', producto.nombre);
        });
    }
}

// Clase para generar facturas (reutilizada y mejorada de simular_credito.js)
class GeneradorFactura {
    generarFactura(nombreCliente, direccionCliente, montoPagado, cambioPendiente, metodoPago) {
        const fecha = new Date().toLocaleDateString();
        const numeroFactura = Math.floor(Math.random() * 1000000);
        const numeroTarjeta = document.getElementById('numero-tarjeta').value;
        const numeroCuenta = document.getElementById('numero-cuenta').value;
        
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

        let metodoPagoHtml = `<p><span>Método de Pago:</span> <span>${metodoPago === 'tarjeta' ? 'Tarjeta de Crédito/Débito' : metodoPago === 'transferencia' ? 'Transferencia Bancaria' : 'Efectivo'}</span></p>`;
        if (metodoPago === 'tarjeta') {
            metodoPagoHtml += `<p><span>Número de Tarjeta:</span> <span>${numeroTarjeta || 'N/A'}</span></p>`;
        } else if (metodoPago === 'transferencia') {
            metodoPagoHtml += `<p><span>Número de Cuenta:</span> <span>${numeroCuenta || 'N/A'}</span></p>`;
        }

        let efectivoDetallesHtml = '';
        if (metodoPago === 'efectivo') {
            efectivoDetallesHtml = `
                <p><span>Monto Pagado en Efectivo:</span> <span>L. ${montoPagado.toFixed(2)}</span></p>
                <p><span>Cambio/Pendiente:</span> <span>L. ${cambioPendiente.toFixed(2)}</span></p>
            `;
        }

        let contenido = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Factura de Compra - AutoStar Premium</title>
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
                        <h2>AutoStar Premium</h2>
                        <p>123 Calle Principal, Ciudad, País</p>
                        <p>RTN: 08011985123960</p>
                        <p>Email: autolote@autolostarpremium.com | Tel: (504) 9962-0194</p>
                    </div>

                    <div class="invoice-details">
                        <div>
                            <p><strong>Factura #:</strong> ${numeroFactura}</p>
                            <p><strong>Fecha:</strong> ${fecha}</p>
                        </div>
                        <div>
                            <p><strong>Cliente:</strong> ${nombreCliente || 'N/A'}</p>
                            <p><strong>Dirección:</strong> ${direccionCliente || 'N/A'}</p>
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
                        <h4>Detalles del Crédito (si aplica)</h4>
                        <p><span>Monto Solicitado:</span> <span id="monto-solicitado-factura">L. 0.00</span></p>
                        <p><span>Plazo:</span> <span id="plazo-factura">0 meses</span></p>
                        <p><span>Tasa de Interés Anual:</span> <span id="tasa-interes-factura">0%</span></p>
                        <p><span>Cuota Mensual Estimada:</span> <span id="cuota-mensual-factura">L. 0.00</span></p>
                    </div>

                    ${metodoPagoHtml}
                    ${efectivoDetallesHtml}

                    <div class="invoice-footer">
                        <p>Gracias por tu compra en AutoStar Premium.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const nuevaVentana = window.open('', '_blank');
        nuevaVentana.document.write(contenido);
        nuevaVentana.document.close();
    }
}

// Inicializar el carrito de compras y el generador de facturas
const carrito = new CarritoCompras();
const generadorFactura = new GeneradorFactura();

document.addEventListener('DOMContentLoaded', () => {
    carrito.actualizarTotales();
    carrito.actualizarListaProductos();

    // Lógica para mostrar/ocultar campos de número de tarjeta/cuenta
    const metodoPagoSelect = document.getElementById('metodo-pago');
    const campoNumeroTarjeta = document.getElementById('campo-numero-tarjeta');
    const campoNumeroCuenta = document.getElementById('campo-numero-cuenta');
    const campoMontoEfectivo = document.getElementById('campo-monto-efectivo'); // Nuevo campo

    if (metodoPagoSelect) {
        metodoPagoSelect.addEventListener('change', function() {
            if (this.value === 'tarjeta') {
                campoNumeroTarjeta.style.display = 'block';
                campoNumeroCuenta.style.display = 'none';
                campoMontoEfectivo.style.display = 'none'; // Ocultar si es tarjeta
            } else if (this.value === 'transferencia') {
                campoNumeroTarjeta.style.display = 'none';
                campoNumeroCuenta.style.display = 'block';
                campoMontoEfectivo.style.display = 'none'; // Ocultar si es transferencia
            } else if (this.value === 'efectivo') { // Si es efectivo
                campoNumeroTarjeta.style.display = 'none';
                campoNumeroCuenta.style.display = 'none';
                campoMontoEfectivo.style.display = 'block'; // Mostrar si es efectivo
            } else {
                campoNumeroTarjeta.style.display = 'none';
                campoNumeroCuenta.style.display = 'none';
                campoMontoEfectivo.style.display = 'none'; // Ocultar por defecto
            }
        });
    }

    // Lógica para procesar la compra
    const procesarCompraBtn = document.getElementById('procesar-compra');
    if (procesarCompraBtn) {
        procesarCompraBtn.addEventListener('click', function() {
            console.log('DEBUG: Botón Procesar Compra clickeado (compra_cartera.js).');

            let montoPagado = 0;
            const metodoPago = metodoPagoSelect.value;

            if (metodoPago === 'efectivo') {
                const montoEfectivoInput = document.getElementById('monto-efectivo');
                montoPagado = parseFloat(montoEfectivoInput.value) || 0;
                console.log('DEBUG: Monto en efectivo ingresado:', montoPagado);
            } else { // Si no es efectivo, el monto pagado es el total de la compra para fines de simulación
                montoPagado = carrito.total;
            }

            const montoPagadoDisplay = document.getElementById('monto-pagado');
            const cambioPendienteDisplay = document.getElementById('cambio-pendiente');

            if (montoPagadoDisplay && cambioPendienteDisplay) {
                montoPagadoDisplay.textContent = `L. ${montoPagado.toFixed(2)}`;
                const cambioPendiente = montoPagado - carrito.total;
                cambioPendienteDisplay.textContent = `L. ${cambioPendiente.toFixed(2)}`;
                console.log('DEBUG: Monto pagado:', montoPagado, 'Cambio/Pendiente:', cambioPendiente, '(compra_cartera.js).');
            }
        });
    }

    // Lógica para generar la factura
    const generarFacturaBtn = document.getElementById('generar-factura');
    if (generarFacturaBtn) {
        generarFacturaBtn.addEventListener('click', function() {
            console.log('DEBUG: Botón Generar Factura clickeado (compra_cartera.js).');
            const nombreCliente = document.getElementById('nombre-cliente').value;
            const direccionCliente = document.getElementById('direccion-cliente').value;
            const metodoPago = metodoPagoSelect.value; // Obtener el método de pago actual

            let montoPagado = 0;
            let cambioPendiente = 0;

            if (metodoPago === 'efectivo') {
                const montoEfectivoInput = document.getElementById('monto-efectivo');
                montoPagado = parseFloat(montoEfectivoInput.value) || 0;
                cambioPendiente = montoPagado - carrito.total;
            } else { // Para otros métodos, asume que se paga el total
                montoPagado = carrito.total;
                cambioPendiente = 0; // No hay cambio/pendiente si no es efectivo
            }

            const generador = new GeneradorFactura();
            generador.generarFactura(nombreCliente, direccionCliente, montoPagado, cambioPendiente, metodoPago);
        });
    }
});

// Función global para agregar al carrito (llamada desde otras páginas)
function agregarAlCarrito(nombre, precio) {
    carrito.agregarProducto({ nombre, precio });
} 