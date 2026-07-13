document.addEventListener('DOMContentLoaded', () => {
  const configImage = document.getElementById('configuradorImage');
  const configButtons = document.querySelectorAll('.config-btn');

  // Estado inicial de la configuración
  let activeMadera = 'cedro';
  let activeTipo = 'clasica';

  // Carpeta donde vas a meter tus fotos de combinación
  const basePath = 'assets/images/curso-inicial/guitarras/';

  configButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const group = button.getAttribute('data-group');
      const value = button.getAttribute('data-value');

      // 1. Desactivar botones anteriores del mismo grupo y activar el seleccionado
      document.querySelectorAll(`.config-btn[data-group="${group}"]`).forEach(btn => {
        btn.classList.remove('config-btn--active');
      });
      button.classList.add('config-btn--active');

      // 2. Actualizar el estado actual
      if (group === 'madera') {
        activeMadera = value;
      } else if (group === 'tipo') {
        activeTipo = value;
      }

      // 3. Generar la ruta de imagen dinámica basada en tu selección
      // Ejemplo: si eligen "parlor" y "caoba" -> assets/images/curso-inicial/guitarras/parlor-caoba.jpg
      const newImageSrc = `${basePath}${activeTipo}-${activeMadera}.jpg`;

      // 4. Cambiar la imagen con un pequeño efecto de transición suave
      configImage.style.opacity = '0.3';
      setTimeout(() => {
        configImage.src = newImageSrc;
        configImage.style.opacity = '1';
      }, 150);
    });
  });
});