/**
 * main.js
 * Lógica de negocio para validación dinámica de formulario y experiencia de usuario (Scroll).
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SMOOTH SCROLL PARA BOTONES CTA ---
    const scrollTriggers = document.querySelectorAll('.js-scroll-trigger');
    scrollTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Offset para el navbar fixed (apróx 70px)
                const offset = 70;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- 2. CONFIGURACIÓN DE VALIDACIÓN DEL FORMULARIO ---
    // Objeto de configuración donde se definen IDs e interacciones.
    const formConfig = {
        fields: {
            'nombre': {
                required: true,
                validate: (val) => val.trim().length > 2
            },
            'email': {
                required: true,
                // Regex simple para email
                validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
            },
            'telefono': {
                required: true,
                // Solo números, idealmente 10 dígitos para MX
                validate: (val) => /^[0-9]{10}$/.test(val.trim().replace(/\s|-/g, ''))
            },
            'empresa': {
                required: true,
                validate: (val) => val.trim().length > 1
            },
            'sector': {
                required: true,
                validate: (val) => val !== "" && val !== null
            },
            'volumen': {
                required: true,
                validate: (val) => val !== "" && val !== null
            },
            'mensaje': {
                required: false, // Opcional
                validate: () => true 
            }
        }
    };


    // --- 3. LOGICA DEL FORMULARIO ---
    const quoteForm = document.getElementById('quoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Detenemos el envío nativo
            
            let isValid = true;
            const formData = new FormData(quoteForm);
            const dataObj = {};

            // Limpiamos estados visuales previos
            Object.keys(formConfig.fields).forEach(id => {
                const element = document.getElementById(id);
                if(element) element.classList.remove('is-invalid');
            });

            // Validamos cada campo según la configuración
            for (const [id, rules] of Object.entries(formConfig.fields)) {
                const element = document.getElementById(id);
                if (!element) continue;

                let val = element.value;
                dataObj[id] = val; // Guardamos en objeto simulado para "POST"

                if (rules.required && (!val || val.trim() === '')) {
                    isValid = false;
                    element.classList.add('is-invalid');
                } else if (val && rules.validate && !rules.validate(val)) {
                    isValid = false;
                    element.classList.add('is-invalid');
                }
            }

            // --- 4. REDIRECCIÓN UX O SIMULACIÓN XHR/FETCH ---
            if (isValid) {
                const submitBtn = document.getElementById('submitBtn');
                const originalText = submitBtn.innerText;
                
                // Mostrar estado de carga (UX)
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';

                // Aquí conectarías con tu procesar.php real usando fetch()
                /*
                fetch('procesar.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if(response.ok) { window.location.href = 'gracias.html'; }
                })
                .catch(error => console.error(error));
                */

                // Simulación de delay de red por 1 segundo, luego redirección
                setTimeout(() => {
                    console.log('Datos validados y listos para enviar:', dataObj);
                    // Redirección exitosa (Pixel tracking compatible)
                    window.location.href = 'gracias.html';
                }, 1000);

            } else {
                // Hay errores, el form ha marcado los campos en rojo (.is-invalid)
                console.log('Formulario inválido. Corrige los campos marcados.');
            }
        });

        // EventListeners para limpiar el "is-invalid" al escribir/cambiar
        Object.keys(formConfig.fields).forEach(id => {
            const element = document.getElementById(id);
            if(element) {
                element.addEventListener('input', () => {
                   element.classList.remove('is-invalid'); 
                });
                element.addEventListener('change', () => {
                   element.classList.remove('is-invalid'); 
                });
            }
        });
    }

});
