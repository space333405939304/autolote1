// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Navegación suave para los enlaces del menú
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animación del header al hacer scroll (modificado para nueva funcionalidad)
    const header = document.querySelector('header');
    const heroSection = document.getElementById('hero');
    const heroVideo = document.getElementById('hero-video');

    if (heroVideo) {
        heroVideo.addEventListener('loadeddata', () => {
            console.log('Video cargado exitosamente.');
        });
        heroVideo.addEventListener('error', (e) => {
            console.error('Error al cargar el video:', e);
        });
        console.log('Estado actual del video:', heroVideo.readyState);
    }

    // Solo aplicar la lógica de visibilidad del header en la página de inicio
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        let heroHeight = heroSection.offsetHeight;

        // Actualizar la altura de la sección hero si la ventana cambia de tamaño
        window.addEventListener('resize', () => {
            heroHeight = heroSection.offsetHeight;
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > heroHeight - header.offsetHeight) {
                header.classList.add('visible');
            } else {
                header.classList.remove('visible');
            }
        });
    } else {
        // Asegurar que el header siempre sea visible en otras páginas
        header.classList.add('visible');
    }

    // Manejo del formulario de contacto
    const contactoForm = document.getElementById('contacto-form');
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores del formulario
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Aquí puedes agregar la lógica para enviar el formulario
            console.log('Datos del formulario:', formValues);
            
            // Mostrar mensaje de éxito
            alert('¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.');
            this.reset();
        });
    }

    // Animación para las tarjetas de vehículos
    const vehiculoCards = document.querySelectorAll('.vehiculo-card');
    vehiculoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Botones "Ver Detalles"
    const verMasButtons = document.querySelectorAll('.ver-mas');
    verMasButtons.forEach(button => {
        // Eliminamos el listener de clic aquí ya que los botones ahora son enlaces directos.
        // const vehiculo = this.closest('.vehiculo-card');
        // const nombre = vehiculo.querySelector('h3').textContent;
        // alert(`Próximamente: Más detalles sobre el ${nombre}`);
    });

    // Animación de aparición para las secciones
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar todas las secciones principales
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Manejo de los menús desplegables en dispositivos móviles
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdownToggles.forEach((toggle, index) => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdowns[index].classList.toggle('active');
            }
        });
    });

    // Cerrar los menús desplegables al hacer clic fuera
    document.addEventListener('click', function(e) {
        // Excluir clics en botones con la clase cta-button
        if (e.target.classList.contains('cta-button')) {
            return;
        }

        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });

    // Lógica del Chat para Revisión Técnico Mecánica
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input input');
    const chatSendButton = document.querySelector('.chat-input button');
    const miaAvatar = 'logos/avatar goku.jpeg'; // Asegúrate de tener esta imagen

    if (chatInput && chatSendButton && chatMessages) {
        // Función para añadir un mensaje al chat
        function addMessage(sender, text, avatar = null) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender);

            if (avatar) {
                const avatarDiv = document.createElement('div');
                avatarDiv.classList.add('message-avatar');
                const avatarImg = document.createElement('img');
                avatarImg.src = avatar;
                avatarImg.alt = 'Avatar';
                avatarDiv.appendChild(avatarImg);
                messageDiv.appendChild(avatarDiv);
            }

            const bubbleDiv = document.createElement('div');
            bubbleDiv.classList.add('message-bubble');
            bubbleDiv.textContent = text;
            messageDiv.appendChild(bubbleDiv);

            chatMessages.appendChild(messageDiv);
            chatMessages.scrollIntoView({ behavior: 'smooth', block: 'end' }); // Scroll suave al último mensaje
        }

        // Simular respuesta de la IA
        function getMiaResponse(userMessage) {
            const lowerCaseMessage = userMessage.toLowerCase();

            if (lowerCaseMessage.includes('hola') || lowerCaseMessage.includes('saludo')) {
                return '¡Hola! ¿En qué ciudad te gustaría agendar tu revisión técnico mecánica?';
            } else if (lowerCaseMessage.includes('gracias') || lowerCaseMessage.includes('muchas gracias')) {
                return 'De nada, estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?';
            } else if (lowerCaseMessage === 'quiero agendar mi cita') {
                return 'Claro, para agendar tu cita de Revisión Técnico Mecánica, ¿en qué ciudad y qué día te gustaría realizarla?';
            } else if (lowerCaseMessage.includes('agendar') || lowerCaseMessage.includes('cita')) {
                return 'Claro, para agendar tu cita de Revisión Técnico Mecánica, ¿en qué ciudad y qué día te gustaría realizarla?';
            } else if (lowerCaseMessage.includes('mantenimiento') || lowerCaseMessage.includes('que incluye') || lowerCaseMessage.includes('qué incluye') || lowerCaseMessage.includes('carro') || lowerCaseMessage.includes('vehiculo') || lowerCaseMessage.includes('coche') || lowerCaseMessage.includes('auto') || lowerCaseMessage.includes('auto') || lowerCaseMessage.includes('revisar')) {
                return 'La Revisión Técnico Mecánica incluye la verificación de frenos, suspensión, luces, emisión de gases, estado de llantas, y más. Esencial para la seguridad y el cumplimiento normativo.';
            } else if (lowerCaseMessage.includes('olancho') || lowerCaseMessage.includes('aguazul rancho') || lowerCaseMessage.includes('los naranjos') || lowerCaseMessage.includes('rio lindo') || lowerCaseMessage.includes('tegucigalpa') || lowerCaseMessage.includes('san pedro sula') || lowerCaseMessage.includes('ciudad') || lowerCaseMessage.includes('peña blanca') || lowerCaseMessage.includes('cañaveral') || lowerCaseMessage.includes('honduras')) {
                return `Perfecto, en ${userMessage}. ¿Qué día y hora te gustaría agendar la revisión?`;
            } else if (lowerCaseMessage.includes('revision') || lowerCaseMessage.includes('revisión') || lowerCaseMessage.includes('mecanica') || lowerCaseMessage.includes('técnico')) {
                return 'Claro, para agendar tu revisión, ¿cuál es tu ciudad y qué día te vendría bien?';
            } else if (lowerCaseMessage.includes('dia') || lowerCaseMessage.includes('fecha') || lowerCaseMessage.includes('hora')) {
                return 'Gracias por la información. Por favor, indícame tu nombre completo y número de teléfono para confirmar la cita.';
            } else if (lowerCaseMessage.includes('nombre') && lowerCaseMessage.includes('telefono')) {
                return '¡Excelente! Tu cita para la revisión técnico mecánica ha sido agendada con éxito. Recibirás una confirmación por SMS.';
            } else {
                return 'Disculpa, no entendí tu pregunta. Por favor, intenta reformularla o pregunta sobre el agendamiento de la revisión técnico mecánica.';
            }
        }

        // Manejar el envío de mensajes
        function handleSendMessage() {
            const userMessage = chatInput.value.trim();
            if (userMessage) {
                addMessage('sent', userMessage);
                chatInput.value = '';

                // Simular respuesta de la IA después de un breve retraso
                setTimeout(() => {
                    const miaResponse = getMiaResponse(userMessage);
                    addMessage('received', miaResponse, miaAvatar);
                }, 1000); // Retraso de 1 segundo
            }
        }

        // Event listener para el botón de enviar
        chatSendButton.addEventListener('click', handleSendMessage);

        // Event listener para la tecla Enter en el input
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }

    // Manejar el clic en los botones de compra
    const buyButtons = document.querySelectorAll('.buy-toggle');
    
    buyButtons.forEach(button => {
        button.onclick = function(e) {
            e.stopPropagation();
            const buyOptions = this.closest('.buy-options');
            // Permitir que funcione tanto en .producto-card como en .tramite-card o .peritaje-card
            const card = this.closest('.producto-card') || this.closest('.tramite-card') || this.closest('.peritaje-card');

            // Cerrar todos los otros dropdowns y remover la clase active-dropdown-card de sus tarjetas
            document.querySelectorAll('.buy-options').forEach(option => {
                if (option !== buyOptions) {
                    option.classList.remove('active');
                    const parentCard = option.closest('.producto-card') || option.closest('.tramite-card') || option.closest('.peritaje-card');
                    if(parentCard){
                        parentCard.classList.remove('active-dropdown-card');
                    }
                }
            });
            
            // Alternar el dropdown actual y la clase active-dropdown-card en la tarjeta
            buyOptions.classList.toggle('active');
            if(card) card.classList.toggle('active-dropdown-card');
        };
    });

    // Cerrar dropdowns al hacer clic fuera
    // (Asegurarse de cerrar en todas las tarjetas)
    document.onclick = function(e) {
        if (!e.target.matches('.buy-toggle') && !e.target.closest('.buy-dropdown-menu')) {
            document.querySelectorAll('.buy-options').forEach(option => {
                option.classList.remove('active');
                const parentCard = option.closest('.producto-card') || option.closest('.tramite-card') || option.closest('.peritaje-card');
                if(parentCard){
                    parentCard.classList.remove('active-dropdown-card');
                }
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

    // Manejo del botón de compra
    const buyToggles = document.querySelectorAll('.buy-toggle');
    
    buyToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const buyOptions = this.closest('.buy-options');
                buyOptions.classList.toggle('active');
            }
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.buy-options')) {
            document.querySelectorAll('.buy-options').forEach(option => {
                option.classList.remove('active');
            });
        }
    });
}); 