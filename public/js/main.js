// Manejador de envío para el formulario de agregar programas
document.getElementById('form-agregar').addEventListener('submit', async (event) => {
    event.preventDefault();
    const nombre = document.getElementById('nombre-programa').value;

    const response = await fetch('/api/programas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
    });

    const nuevoPrograma = await response.json();
    if (response.ok) {
        agregarProgramaALista(nuevoPrograma);
        document.getElementById('nombre-programa').value = '';  // Limpia el campo de entrada
    }
});

// Función para agregar un programa a la lista en la interfaz
function agregarProgramaALista(programa) {
    const lista = document.getElementById('lista-programas');
    const item = document.createElement('li');
    item.id = `programa-${programa.id}`;
    item.innerHTML = `
        <strong>${programa.nombre}</strong> - Votos: <span class="votos">${programa.votos}</span>
        <button class="votar-btn" data-id="${programa.id}">Votar</button>
    `;
    lista.appendChild(item);
    item.querySelector('.votar-btn').addEventListener('click', votarPorPrograma);
}

// Manejador de clic para los botones de votar
async function votarPorPrograma(event) {
    const id = event.target.getAttribute('data-id');
    const response = await fetch(`/api/programas/${id}/votar`, { method: 'POST' });
    const programaActualizado = await response.json();

    if (response.ok) {
        const votos = document.querySelector(`#programa-${id} .votos`);
        votos.textContent = programaActualizado.votos;  // Actualiza el conteo de votos en la interfaz
    }
}

// Agrega los eventos de clic para votar en cada programa al cargar la página
document.querySelectorAll('.votar-btn').forEach(button => {
    button.addEventListener('click', votarPorPrograma);
});
