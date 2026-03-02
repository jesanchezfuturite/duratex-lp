# Duratex B2B Landing Page

Este proyecto contiene el código fuente de la **Landing Page B2B de Duratex**, diseñada para la captación y conversión de leads empresariales en sectores como el industrial, corporativo, salud, gastronómico y escolar.

La página fue construida utilizando un enfoque "Mobile-First", garantizando una experiencia de usuario rápida, limpia y altamente responsiva.

## 🚀 Tecnologías y Herramientas (Stack)

*   **HTML5** semántico para la estructura del sitio.
*   **CSS3 & Bootstrap 5**: Sistema de grillas nativo de Bootstrap (`col-md-4`, etc.) para asegurar que en dispositivos móviles las columnas colapsen al 100%. Personalización de estilos base (colores instucionales y fuentes) mediante `styles.css`.
*   **Vanilla JavaScript (ES6)**: Lógica en el cliente contenida en `main.js`. 
*   **Google Fonts**: *Montserrat* (Encabezados - H1, H2, H3) y *Roboto* (Cuerpos de texto y formularios).

## 🎨 Identidad Visual y Diseño Visual
Se utilizaron los activos de marca oficiales para mantener una presencia corporativa sólida:

*   **Logo Header:** El logotipo oficial de Duratex en color blanco insertado en la barra de navegación.
*   **Color Primario (Extraído):** `#2b5672` (Azul/Teal corporativo) utilizado para la barra de navegación, el texto destacado y los call-to-action (CTAs).
*   **Color Secundario:** Fondos grises (`#f4f6f8`) que otorgan contraste y limpieza en secciones intercaladas.

## 📁 Estructura del Proyecto

```plaintext
/
├── index.html        # Página principal y formulario B2B
├── gracias.html      # Página de validación y conversión (Agradecimiento)
├── styles.css        # Hoja de estilos complementaria a Bootstrap
├── main.js           # Validaciones de formulario y comportamientos nativos
└── /img              # Carpeta que contiene los visuales de las líneas de producción
```

## ⚙️ Características Técnicas y Componentes

1.  **Hero Section:** CTA enfocado y visual, con un overlay semitransparente oscuro optimizado para que resalte la propuesta de valor y el logotipo blanco.
2.  **Smooth Scrolling Anchors:** El proyecto incluye lógica JavaScript en `main.js` (`js-scroll-trigger`) para llevar al usuario de manera fluida y nativa desde el *Hero* o los beneficios directamente hacia el formulario de contacto B2B.
3.  **Sistema de Validación por Configuración:**
    *   La validación del formulario no depende de etiquetas HTML complejas; se administra a través de un objeto JS (`formConfig` en `main.js`). Esto permite escalabilidad por si se añaden o remueven campos en el futuro.
    *   Soporte Regex para email válido y para teléfonos de 10 dígitos.
4.  **Simulacro de Envío (AJAX/Fetch UX):**
    *   La Landing gestiona estéticamente el momento del envío: El botón se desactiva y muestra un "spinner" de Bootstrap y el texto "Enviando...".
    *   Posteriormente (para propósitos de Demo, tras 1 segundo) redirige correctamente a la URL de conversión final.
5.  **Página "Gracias" Aislada:** Un documento `gracias.html` simplificado y libre de distracciones, indispensable para la configuración de **Pixeles de conversión (ej. Meta Pixel, Google Analytics 4, Google Ads)**.

## 🛠 Instalación y Despliegue Local

Al ser un proyecto estático que no requiere pre-procesamiento ni compilación (Webpack, Vite), es posible ejecutarlo directamente:

1.  Abre la terminal en la raíz del proyecto.
2.  Puedes usar cualquier servidor web local, ejemplo con Node.js / npm:
    ```bash
    npx serve . -p 3000
    ```
    También puedes utilizar extensiones como **Live Server** en VS Code.
3.  Visita `http://localhost:3000` (o el puerto configurado).

## 📮 Integración de Backend

El código frontend se encuentra estructurado asumiendo que el envío (*submit*) consumirá un archivo intermedio vía petición POST (Ej. PHP, Node/Express, Python, etc.). 
*   **Ruta propuesta en HTML:** `procesar.php` (Propiedad `action` configurable dentro de `<form>`).
*   **Inteceptar con JS:** Simplemente se deben descomentar/activar las líneas de Fetch dentro de la sección "3. LOGICA DEL FORMULARIO" de `main.js`.
