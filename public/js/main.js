document.addEventListener('DOMContentLoaded', () => {
  const formularioSerie = document.getElementById('formularioSerie');
  const listaSeries = document.getElementById('listaSeries');
  const modal = document.getElementById('modalActualizar');
  const formularioActualizar = document.getElementById('formularioActualizar');
  const mensajeExito = document.getElementById('mensajeExito');
  const mensajeError = document.getElementById('mensajeError');
  let serieIdActual = null;

  // Función para agregar una nueva serie
  formularioSerie.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombreSerie').value.trim();

    try {
      const response = await fetch('/api/programas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      agregarSerieALista(data);
      document.getElementById('nombreSerie').value = ''; // Limpiar el campo
      mostrarMensajeExito('¡Serie agregada exitosamente!');
    } catch (error) {
      mensajeError.textContent = error.message;
    }
  });

  // Delegación de eventos para votar, eliminar y abrir el modal de actualización
  listaSeries.addEventListener('click', (e) => {
    const serieItem = e.target.closest('.serie-item');
    if (!serieItem) return;

    const id = serieItem.dataset.id;

    if (e.target.classList.contains('boton-votar')) {
      votarPorSerie(id);
    }

    if (e.target.classList.contains('boton-eliminar')) {
      eliminarSerie(id, serieItem);
    }

    if (e.target.classList.contains('boton-actualizar')) {
      abrirModalActualizar(id, serieItem);
    }
  });

  // Función para manejar el envío del formulario de actualización
  formularioActualizar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevoNombre = document.getElementById('nuevoNombre').value.trim();
    const mensajeErrorModal = document.getElementById('mensajeErrorModal');

    try {
      const response = await fetch(`/api/programas/${serieIdActual}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      actualizarNombreSerieEnLista(serieIdActual, nuevoNombre);
      cerrarModalActualizar();
      mostrarMensajeExito('Serie actualizada exitosamente!');
    } catch (error) {
      mensajeErrorModal.textContent = error.message;
    }
  });

  // Función para agregar una serie a la lista
  function agregarSerieALista(serie) {
    const li = document.createElement('li');
    li.className = 'serie-item';
    li.dataset.id = serie.id;
    li.innerHTML = `
      <span class="nombre-serie">${serie.nombre}</span>
      <div class="controles">
        <span class="votos">${serie.votos} votos</span>
        <button class="boton-votar">Votar</button>
        <button class="boton-actualizar">Actualizar</button>
        <button class="boton-eliminar">Eliminar</button>
      </div>
    `;
    listaSeries.appendChild(li);
  }

  // Función para votar por una serie
  async function votarPorSerie(id) {
    try {
      const response = await fetch(`/api/programas/${id}/votar`, { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        actualizarVotosSerie(data);
      } else {
        console.error('Error al votar:', data.error);
      }
    } catch (error) {
      console.error('Error al votar:', error);
    }
  }

  // Función para eliminar una serie
  async function eliminarSerie(id, serieItem) {
    try {
      const response = await fetch(`/api/programas/${id}`, { method: 'DELETE' });

      if (response.ok) {
        serieItem.remove(); // Eliminar de la interfaz
        mostrarMensajeExito('Serie eliminada exitosamente!');
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error) {
      mensajeError.textContent = error.message;
    }
  }

  // Función para abrir el modal de actualización
  function abrirModalActualizar(id, serieItem) {
    serieIdActual = id;
    const nombreActual = serieItem.querySelector('.nombre-serie').textContent;
    document.getElementById('nuevoNombre').value = nombreActual;
    modal.classList.add('activo');
  }

  // Función para cerrar el modal de actualización
  function cerrarModalActualizar() {
    modal.classList.remove('activo');
    document.getElementById('nuevoNombre').value = '';
    document.getElementById('mensajeErrorModal').textContent = '';
  }

  // Función para actualizar el nombre de la serie en la lista
  function actualizarNombreSerieEnLista(id, nuevoNombre) {
    const serieItem = document.querySelector(`[data-id="${id}"]`);
    serieItem.querySelector('.nombre-serie').textContent = nuevoNombre;
  }

  // Función para actualizar los votos de una serie en la lista
  function actualizarVotosSerie(serie) {
    const serieItem = document.querySelector(`[data-id="${serie.id}"]`);
    serieItem.querySelector('.votos').textContent = `${serie.votos} votos`;
    reordenarSeriesPorVotos();
  }

  // Función para reordenar las series según el número de votos
  function reordenarSeriesPorVotos() {
    const series = Array.from(listaSeries.children);
    series.sort((a, b) => {
      const votosA = parseInt(a.querySelector('.votos').textContent);
      const votosB = parseInt(b.querySelector('.votos').textContent);
      return votosB - votosA;
    });
    series.forEach(serie => listaSeries.appendChild(serie));
  }

  // Función para mostrar mensajes de éxito
  function mostrarMensajeExito(mensaje) {
    mensajeExito.textContent = mensaje;
    mensajeExito.style.display = 'block';
    setTimeout(() => {
      mensajeExito.style.display = 'none';
    }, 3000);
  }

  // Cerrar modal cuando se hace clic en el botón "Cancelar"
  document.querySelector('.boton-cancelar').addEventListener('click', cerrarModalActualizar);
});
