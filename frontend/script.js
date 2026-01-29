const API_URL = 'http://localhost:3000/api/tasks';

// 1. Función para obtener y pintar tareas (GET)
async function obtenerTareas() {
    try {
        const respuesta = await fetch(API_URL);
        const tareas = await respuesta.json();
        
        const contenedor = document.getElementById('tareas-grid');
        contenedor.innerHTML = ''; // Limpiar antes de pintar

        tareas.forEach(tarea => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${tarea.titulo}</h3>
                <p><strong>Tecnología:</strong> ${tarea.tecnologia}</p>
                <p><strong>Estado:</strong> ${tarea.estado}</p>
                <button class="btn-eliminar" onclick="eliminarTarea('${tarea._id}')">Eliminar</button>
            `;
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar tareas:", error);
    }
}

// 2. Función para crear tarea (POST)
document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nuevaTarea = {
        titulo: document.getElementById('titulo').value,
        tecnologia: document.getElementById('tecnologia').value,
        estado: 'pending'
    };

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaTarea)
    });

    document.getElementById('task-form').reset();
    obtenerTareas(); // Recargar lista sin refrescar página (SPA)
});

// 3. Función para eliminar (DELETE)
async function eliminarTarea(id) {
    if (confirm('¿Deseas eliminar esta tarea y moverla al histórico?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        obtenerTareas();
    }
}

// Carga inicial
obtenerTareas();