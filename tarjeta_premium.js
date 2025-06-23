document.addEventListener('DOMContentLoaded', function() {
    // Función para manejar la solicitud de la tarjeta
    window.solicitarTarjeta = function() {
        // Aquí se podría implementar la lógica para redirigir a un formulario de solicitud
        // o mostrar un modal con el formulario
        alert('¡Gracias por tu interés en la Tarjeta Autostar Premium! Un asesor se pondrá en contacto contigo pronto.');
    };

    // Animación suave para los elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observar los elementos que queremos animar
    document.querySelectorAll('.benefit-card, .premium-features, .cta-section').forEach(element => {
        observer.observe(element);
    });
}); 