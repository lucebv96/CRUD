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
        reordenarProgramas(); // Reordenar después de agregar un nuevo programa
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
        <button class="eliminar-btn" data-id="${programa.id}">Eliminar</button>
    `;
    lista.appendChild(item);

    // Añadir eventos de clic para votar y eliminar
    item.querySelector('.votar-btn').addEventListener('click', votarPorPrograma);
    item.querySelector('.eliminar-btn').addEventListener('click', eliminarPrograma);
}

// Manejador de clic para los botones de votar
async function votarPorPrograma(event) {
    const id = event.target.getAttribute('data-id');
    const response = await fetch(`/api/programas/${id}/votar`, { method: 'POST' });
    const programaActualizado = await response.json();

    if (response.ok) {
        const votos = document.querySelector(`#programa-${id} .votos`);
        votos.textContent = programaActualizado.votos;  // Actualiza el conteo de votos en la interfaz
        reordenarProgramas(); // Reordenar después de votar
    }
}

// Manejador de clic para los botones de eliminar
async function eliminarPrograma(event) {
    const id = event.target.getAttribute('data-id');
    const response = await fetch(`/api/programas/${id}`, { method: 'DELETE' });

    if (response.ok) {
        const elementoAEliminar = document.getElementById(`programa-${id}`);
        if (elementoAEliminar) {
            elementoAEliminar.remove();  // Elimina el elemento de la interfaz
        }
        reordenarProgramas(); // Reordenar después de eliminar
    } else {
        console.error('Error al eliminar el programa');
    }
}

// Función para reordenar los programas según la cantidad de votos
function reordenarProgramas() {
    const lista = document.getElementById('lista-programas');
    const items = Array.from(lista.children);

    // Ordena los elementos por la cantidad de votos (de mayor a menor)
    items.sort((a, b) => {
        const votosA = parseInt(a.querySelector('.votos').textContent);
        const votosB = parseInt(b.querySelector('.votos').textContent);
        return votosB - votosA;
    });

    // Borra la lista actual y vuelve a insertar los elementos en el nuevo orden
    lista.innerHTML = '';
    items.forEach(item => lista.appendChild(item));
}

// Agrega los eventos de clic para votar y eliminar en cada programa al cargar la página
document.querySelectorAll('.votar-btn').forEach(button => {
    button.addEventListener('click', votarPorPrograma);
});

document.querySelectorAll('.eliminar-btn').forEach(button => {
    button.addEventListener('click', eliminarPrograma);
});
