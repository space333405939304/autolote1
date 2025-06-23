document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('tasacion-form');
    const resultadoTasacionDiv = document.getElementById('resultado-tasacion');
    const valorEstimadoSpan = document.getElementById('valor-estimado');

    // Función simple para estimar el valor (simulación mejorada)
    function estimarValor(tipoVehiculo, año, kilometraje) {
        let valorEstimado = 0;
        const currentYear = new Date().getFullYear();
        const antiguedad = currentYear - parseInt(año);
        const km = parseInt(kilometraje);

        if (tipoVehiculo === 'carro') {
            valorEstimado = 1000000; // Valor base para un carro (Lempiras, ajustado)

            // Depreciación por año (más agresiva y escalonada)
            if (antiguedad <= 1) {
                valorEstimado -= (antiguedad * 10000); // Depreciación inicial menor
            } else if (antiguedad <= 5) {
                valorEstimado -= (antiguedad * 20000); // Depreciación moderada
            } else {
                valorEstimado -= (antiguedad * 30000); // Depreciación más alta para vehículos muy antiguos
            }

            // Depreciación por kilometraje (más agresiva)
            valorEstimado -= (km / 1000) * 200; // Reduce 200 L. por cada 1000 km (ajustado)
            
        } else if (tipoVehiculo === 'moto') {
            valorEstimado = 100000; // Valor base para una moto (Lempiras, ajustado)

            // Depreciación por año
            if (antiguedad <= 1) {
                valorEstimado -= (antiguedad * 5000);
            } else if (antiguedad <= 5) {
                valorEstimado -= (antiguedad * 10000);
            } else {
                valorEstimado -= (antiguedad * 15000);
            }

            // Depreciación por kilometraje
            valorEstimado -= (km / 1000) * 75; // Reduce 75 L. por cada 1000 km (ajustado)
        }

        // Asegurarse de que el valor no sea negativo y tenga un mínimo
        return Math.max(100000, valorEstimado); // Valor mínimo de 10,000 L.
    }

    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault(); // Evitar el envío predeterminado y la redirección

            // Recopilar datos del formulario
            const formData = new FormData(form);
            const formUrl = form.getAttribute('action');

            // Collect data for estimation
            const tipoVehiculo = document.getElementById('tipo-vehiculo').value;
            const año = document.getElementById('año').value;
            const kilometraje = document.getElementById('kilometraje').value;

            // Basic validation for required fields before sending
            const requiredFields = ['tipo_vehiculo', 'marca', 'modelo', 'año', 'kilometraje', 'nombre', 'email', 'telefono'];
            let allFieldsFilled = true;
            requiredFields.forEach(field => {
                if (!formData.get(field)) {
                    allFieldsFilled = false;
                }
            });

            if (!allFieldsFilled) {
                alert('Por favor, completa todos los campos obligatorios del formulario.');
                return;
            }

            try {
                // Enviar los datos a FormSubmit.co usando fetch
                const response = await fetch(formUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Importante para la característica AJAX de FormSubmit
                    }
                });

                if (response.ok) {
                    // Si el envío a FormSubmit fue exitoso
                    // Calcular y mostrar el valor estimado
                    const valorEstimado = estimarValor(tipoVehiculo, año, kilometraje);
                    valorEstimadoSpan.textContent = valorEstimado.toFixed(2); // Mostrar con 2 decimales
                    resultadoTasacionDiv.style.display = 'block'; // Mostrar la sección de resultados

                    alert('¡Solicitud de tasación enviada con éxito! El valor estimado se muestra en la página.');
                    form.reset(); // Limpiar el formulario
                } else {
                    // Manejar errores si FormSubmit no procesa el envío
                    alert('Hubo un error al enviar la solicitud de tasación. Por favor, inténtalo de nuevo.');
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                alert('Ocurrió un error de conexión. Por favor, intenta de nuevo más tarde.');
            }
        });
    }
}); 