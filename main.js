/**
 * main.js
 * Lógica de negocio para validación dinámica de formulario y experiencia de usuario (Scroll).
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SMOOTH SCROLL PARA BOTONES CTA ---
    const scrollTriggers = document.querySelectorAll('.js-scroll-trigger');
    scrollTriggers.forEach(trigger => {
        trigger.addEventListener('click', function (e) {
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
        quoteForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Detenemos el envío nativo

            // --- UTM: Captura de parámetros de campaña ---
            var data_utm = {};
            const urlParams = new URLSearchParams(window.location.search);
            ['utm_id', 'utm_campaign', 'utm_source', 'utm_medium', 'utm_content', 'utm_term'].forEach(p => {
                const v = urlParams.get(p);
                if (v) data_utm[p] = v;
            });
            console.log('UTM params:', data_utm);

            let isValid = true;
            const formData = new FormData(quoteForm);
            const dataObj = {};

            // Limpiamos estados visuales previos
            Object.keys(formConfig.fields).forEach(id => {
                const element = document.getElementById(id);
                if (element) element.classList.remove('is-invalid');
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

                const nombre = quoteForm.querySelector("input[name='nombre']").value.trim();
                const correo = quoteForm.querySelector("input[name='email']").value.trim();
                const telefono = quoteForm.querySelector("input[name='telefono']").value.trim();
                const empresa = quoteForm.querySelector("input[name='empresa']").value.trim();
                const sector = quoteForm.querySelector("select[name='sector']").value;
                const volumen = quoteForm.querySelector("select[name='volumen']").value;
                const mensaje = quoteForm.querySelector("textarea[name='mensaje']").value.trim();

                const data = {
                    nombre: nombre,
                    correo: correo,
                    telefono: telefono,
                    empresa: empresa,
                    sector: sector,
                    volumen: volumen,
                    mensaje: mensaje,
                    utm_id: data_utm.utm_id || "",
                    utm_campaign: data_utm.utm_campaign || "",
                    utm_source: data_utm.utm_source || "",
                    utm_medium: data_utm.utm_medium || "",
                    utm_content: data_utm.utm_content || "",
                    utm_term: data_utm.utm_term || "",
                    api_key: "Q2xpZW50ZUlEOjo0MTg=",
                    to: ["adminmty@duratex.mx", "leads@futurite.net"],
                    origen: "https://uniformes.duratexmx.com/"
                };

                // Deshabilitar botón y mostrar spinner
                submitBtn.disabled = true;
                const originalHTML = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';

                // Envío con fetch (JSON).
                fetch('https://futurite.ongoing.mx/api/leads/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                    .then(response => {
                        // Guardamos el status HTTP para usarlo como respaldo
                        const httpOk = response.ok; // true si status 200-299
                        return response.text().then(rawText => {
                            console.log('Respuesta API (raw):', rawText);
                            let result = {};
                            try { result = JSON.parse(rawText); } catch (_) { }
                            console.log('Respuesta API (parsed):', result);
                            return { httpOk, result };
                        });
                    })
                    .then(({ httpOk, result }) => {
                        // Redirigimos si el HTTP fue exitoso (200-299) O si la API devuelve success:true
                        if (httpOk || result.success === true) {
                            quoteForm.reset();
                            sessionStorage.setItem('formSubmitted', 'true');
                            window.location.href = 'gracias.html';
                        } else {
                            console.warn('API devolvió error:', result);
                            alert('Ha ocurrido un error al enviar la forma de contacto, intenta más tarde');
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalHTML;
                        }
                    })
                    .catch(err => {
                        console.error('Error envío:', err);
                        alert('No fue posible enviar la solicitud. Intenta más tarde.');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalHTML;
                    });
            } else {
                // Hay errores, el form ha marcado los campos en rojo (.is-invalid)
                console.log('Formulario inválido. Corrige los campos marcados.');
            }
        });

        // EventListeners para limpiar el "is-invalid" al escribir/cambiar
        Object.keys(formConfig.fields).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
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
