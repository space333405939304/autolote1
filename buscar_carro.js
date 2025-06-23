document.addEventListener('DOMContentLoaded', function() {
    // Manejar el clic en los botones de compra
    const buyButtons = document.querySelectorAll('.buy-toggle');
    
    buyButtons.forEach(button => {
        button.onclick = function(e) {
            e.stopPropagation();
            const buyOptions = this.closest('.buy-options');
            const carroCard = this.closest('.carro-card'); // Obtener la tarjeta de carro padre
            
            // Cerrar todos los otros dropdowns y remover la clase active-dropdown-card de sus tarjetas
            document.querySelectorAll('.buy-options').forEach(option => {
                if (option !== buyOptions) {
                    option.classList.remove('active');
                    option.closest('.carro-card').classList.remove('active-dropdown-card');
                }
            });
            
            // Alternar el dropdown actual y la clase active-dropdown-card en la tarjeta
            buyOptions.classList.toggle('active');
            carroCard.classList.toggle('active-dropdown-card');
        };
    });

    // Cerrar dropdowns al hacer clic fuera
    document.onclick = function(e) {
        if (!e.target.matches('.buy-toggle') && !e.target.closest('.buy-dropdown-menu')) {
            document.querySelectorAll('.buy-options').forEach(option => {
                option.classList.remove('active');
                option.closest('.carro-card').classList.remove('active-dropdown-card');
            });
        }
    };

    // Manejar clic en "Simular Crédito"
    document.querySelectorAll('.simulate-credit').forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            const productName = this.dataset.name;
            const rawPrice = this.dataset.price.replace(/[^0-9.-]+/g,"");
            const productPrice = parseFloat(rawPrice);

            let cart = JSON.parse(sessionStorage.getItem('shoppingCart')) || [];
            const existingProduct = cart.find(item => item.nombre === productName);
            
            if (!existingProduct) {
                cart.push({ nombre: productName, precio: productPrice });
                sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
            }
            window.location.href = 'simular_credito.html';
        };
    });

    // Manejar clic en "Compra por Cartera"
    document.querySelectorAll('.buy-cash').forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            const productName = this.dataset.name;
            const rawPrice = this.dataset.price.replace(/[^0-9.-]+/g,"");
            const productPrice = parseFloat(rawPrice);

            let cart = JSON.parse(sessionStorage.getItem('shoppingCart')) || [];
            const existingProduct = cart.find(item => item.nombre === productName);

            if (!existingProduct) {
                cart.push({ nombre: productName, precio: productPrice });
                sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
            }
            window.location.href = 'compra_cartera.html';
        };
    });
}); 