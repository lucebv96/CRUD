// Importa las librerías necesarias
const express = require('express');  // Importa Express
const router = express.Router();  // Crea un enrutador para definir las rutas
const tareasController = require('../controllers/tareasController');  // Importa el controlador de tareas

// Ruta para obtener la lista de todos los programas (series o dibujos animados)
router.get('/api/programas', tareasController.obtenerProgramas);

// Ruta para agregar un nuevo programa a la lista
router.post('/api/programas', tareasController.crearPrograma);

// Ruta para votar por un programa (incrementa el número de votos)
router.post('/api/programas/:id/votar', tareasController.votarPrograma);

// Ruta para actualizar los datos de un programa (opcional, como cambiar el nombre)
router.put('/api/programas/:id', tareasController.actualizarPrograma);

// Ruta para eliminar un programa de la lista
router.delete('/api/programas/:id', tareasController.eliminarPrograma);

// Exporta el enrutador para que pueda ser usado en app.js
module.exports = router;
