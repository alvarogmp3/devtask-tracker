const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // Permite que el Frontend se comunique con el Backend [cite: 46]
app.use(express.json()); // Para que el servidor entienda el formato JSON [cite: 36]

// Conexión segura a MongoDB Atlas [cite: 33, 34]
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error de conexión:', err));

// Importar el modelo (el que creamos antes en models/Task.js)
const Task = require('./models/Task');

// --- RUTAS API REST (RA2) --- [cite: 35]

// 1. GET: Obtener todas las tareas [cite: 36]
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tareas' });
    }
});

// 2. POST: Crear una nueva tarea [cite: 36]
app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json(newTask); // Código 201 para "Creado" 
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la tarea' });
    }
});

// 3. DELETE: Eliminar una tarea [cite: 37]
const History = require('./models/History'); // Importa el nuevo modelo

app.delete('/api/tasks/:id', async (req, res) => {
    try {
        // 1. Buscamos la tarea antes de borrarla
        const taskToDelete = await Task.findById(req.params.id);
        
        if (taskToDelete) {
            // 2. La guardamos en el histórico (Requisito 3)
            const backup = new History({
                titulo: taskToDelete.titulo,
                tecnologia: taskToDelete.tecnologia
            });
            await backup.save();
        }

        // 3. La eliminamos de la lista principal
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tarea movida al histórico y eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el proceso de borrado' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
