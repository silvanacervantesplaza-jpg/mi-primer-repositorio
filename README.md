# A tu ritmo · Gestor de tareas

Aplicación en HTML, CSS y JavaScript puro. Sin dependencias ni compilación.

## Cómo probarla

1. Desde la carpeta del repositorio, ejecuta `python3 -m http.server 8000 --bind 0.0.0.0`.
2. Abre `http://localhost:8000` en el navegador del ordenador.
3. Para probarla en un móvil Android, conecta ambos dispositivos a la misma red Wi-Fi y abre en Chrome `http://IP-DEL-ORDENADOR:8000` (sustituye la IP por la dirección local del ordenador). Permite el puerto 8000 en el cortafuegos si es necesario. Detén el servidor con Ctrl+C al terminar.

También puedes abrir `index.html` directamente en un navegador de escritorio, aunque se recomienda el servidor para que el almacenamiento local funcione de forma consistente.

## Comprobación manual

- Añade una tarea con el botón **Añadir** y otra pulsando Enter.
- Intenta introducir solo espacios: no debe añadirse una tarea.
- Marca la casilla de una tarea: se tacha y se actualizan los contadores. Desmárcala para devolverla a pendientes.
- Cambia entre **Todas**, **Pendientes** y **Completadas**.
- Recarga la página: las tareas y su estado deben mantenerse.
- Elimina una tarea con el icono de papelera y recarga: no debe reaparecer.
- Comprueba el diseño a 360 px de ancho o desde Chrome en Android. Los textos largos deben ajustarse sin desplazamiento horizontal.
- Navega con Tab y usa Espacio en las casillas y Enter en los botones.

## Archivos

- `index.html`: estructura y elementos accesibles.
- `styles.css`: diseño adaptable y controles táctiles.
- `app.js`: altas, cambios de estado, eliminación, filtros y persistencia.

Las tareas se guardan en `localStorage`, por navegador y origen (protocolo, dominio y puerto). No se sincronizan entre dispositivos. Borrar los datos del navegador elimina las tareas. Si el almacenamiento no está disponible, la aplicación muestra un aviso y permite trabajar temporalmente en memoria.
