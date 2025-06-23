document.addEventListener('DOMContentLoaded', function() {
    const soatForm = document.getElementById('soat-form');

    if (soatForm) {
        soatForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const placa = document.getElementById('placa').value;
            const identificacionTipo = document.getElementById('identificacion-tipo').value;
            const identificacionNumero = document.getElementById('identificacion-numero').value;
            const notRobot = document.getElementById('not-robot').checked;

            if (placa && identificacionNumero && notRobot) {
                // Aquí puedes agregar la lógica para cotizar el SOAT
                // Por ahora, solo mostraremos una alerta con los datos
                alert(`Cotización SOAT:
Placa: ${placa}
Tipo de Identificación: ${identificacionTipo}
Número de Identificación: ${identificacionNumero}
No soy un robot: ${notRobot ? 'Sí' : 'No'}`);

                console.log('Datos del formulario SOAT:', {
                    placa,
                    identificacionTipo,
                    identificacionNumero,
                    notRobot
                });

                // Limpiar formulario si es necesario
                soatForm.reset();
            } else {
                alert('Por favor, completa todos los campos y confirma que no eres un robot.');
            }
        });
    }

    // Lógica para el menú desplegable del header (si no está ya en styles.js o similar)
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            navToggle.classList.toggle('toggle');
        });
    }

    document.querySelectorAll('.dropdown-toggle').forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            const dropdownMenu = item.nextElementSibling;
            dropdownMenu.classList.toggle('show');
        });
    });

    window.addEventListener('click', function(event) {
        if (!event.target.matches('.dropdown-toggle')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                openMenu.classList.remove('show');
            });
        }
    });

}); 