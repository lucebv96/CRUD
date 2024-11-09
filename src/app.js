// Importa las librerías necesarias
const express = require('express');  // Importa Express para manejar el servidor
const app = express();  // Crea una instancia de Express
const path = require('path');  // Path es una librería nativa de Node.js para manejar rutas de archivos
const tareasRoutes = require('./routes/tareasRoutes');  // Importa las rutas que definiremos en 'routes/tareasRoutes'
const tareasController = require('./controllers/tareasController');  // Importa el controlador para obtener los datos
const PORT = process.env.PORT || 3000;  // Define el puerto (3000 por defecto o uno definido en el entorno)

// Configura el motor de plantillas
app.set('view engine', 'ejs');  // Usa EJS como motor de plantillas
app.set('views', path.join(__dirname, 'views'));  // Define la carpeta 'views' para almacenar las plantillas EJS

// Middleware para analizar JSON en solicitudes
app.use(express.json());  // Permite que Express procese JSON en las solicitudes

// Configura la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));  // Sirve archivos estáticos desde la carpeta 'public'

// Define las rutas de la aplicación
app.use(tareasRoutes);  // Monta las rutas para manejar las tareas (agregar, votar, eliminar)

// Ruta principal para renderizar la página inicial con la lista de programas
app.get('/', (req, res) => {
    tareasController.obtenerProgramas(req, {
        json: (programas) => {
            res.render('index', { programas });  // Pasa la lista de programas a la vista 'index.ejs'
        }
    });
});

// Manejo de errores: Página no encontrada
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
