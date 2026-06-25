document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       1. INTERACCIÓN ACORDEÓN (El Arte Detrás del Sonido)
       ========================================== */
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                if (item.classList.contains('active')) return;

                accordionItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        }
    });

    /* ==========================================
       2. INTERACCIÓN GALERÍA DE CURSOS (Del Taller a tus Manos)
       ========================================== */
    const courseItems = document.querySelectorAll('.course-item');
    const featuredTitle = document.querySelector('.featured-course-info h3');
    const featuredDesc = document.querySelector('.featured-course-info p');

    courseItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remover clase activa previa
            courseItems.forEach(c => c.classList.remove('active'));
            
            // Activar ítem actual
            item.classList.add('active');

            // Actualizar dinámicamente los textos de la tarjeta destacada izquierda
            const originalTitle = item.getAttribute('data-title');
            const originalDesc = item.getAttribute('data-desc');

            if (originalTitle && originalDesc) {
                featuredTitle.textContent = originalTitle.toUpperCase();
                featuredDesc.textContent = originalDesc;
            }
        });
    });

    /* ==========================================
       3. ANIMACIÓN DE CAMBIO DE COLOR (Scroll Trigger para Video)
       ========================================== */
    const scrollTriggerSection = document.getElementById('scroll-trigger-section');

    if (scrollTriggerSection) {
        window.addEventListener('scroll', () => {
            const rect = scrollTriggerSection.getBoundingClientRect();
            
            // Calculamos cuando la sección ocupa la parte central de la pantalla
            const triggerPoint = window.innerHeight / 1.5;

            if (rect.top <= triggerPoint && rect.bottom >= 100) {
                scrollTriggerSection.classList.add('inverted-theme');
            } else {
                scrollTriggerSection.classList.remove('inverted-theme');
            }
        });
    }
});