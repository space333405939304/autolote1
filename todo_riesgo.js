document.addEventListener('DOMContentLoaded', function() {
    const todoRiesgoForm = document.getElementById('todo-riesgo-form');
    const modalOverlay = document.getElementById('modal-overlay');
    const comprarSoatBtn = document.getElementById('comprar-soat-btn');
    const continuarTodoRiesgoBtn = document.getElementById('continuar-todo-riesgo-btn');
    const todoRiesgoSection = document.getElementById('todo-riesgo-section');

    // Mostrar la modal al cargar la página
    if (modalOverlay) {
        modalOverlay.style.display = 'flex';
    }

    // Ocultar la sección principal del formulario inicialmente
    if (todoRiesgoSection) {
        todoRiesgoSection.style.display = 'none';
    }

    // Event listener para el botón "Comprar Soat"
    if (comprarSoatBtn) {
        comprarSoatBtn.addEventListener('click', function() {
            window.location.href = 'soat.html'; // Redirigir a la página SOAT
        });
    }

    // Event listener para el botón "Continuar"
    if (continuarTodoRiesgoBtn) {
        continuarTodoRiesgoBtn.addEventListener('click', function() {
            if (modalOverlay) {
                modalOverlay.style.display = 'none'; // Ocultar la modal
            }
            if (todoRiesgoSection) {
                todoRiesgoSection.style.display = 'flex'; // Mostrar la sección del formulario
            }
        });
    }

    if (todoRiesgoForm) {
        

            

            

            

            

            

                

                

                


                
            
        
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