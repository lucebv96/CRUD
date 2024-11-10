const express = require('express');
const app = express();
const path = require('path');
const tareasRoutes = require('./routes/tareasRoutes');
const tareasController = require('./controllers/tareasController');
const PORT = process.env.PORT || 3000;

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Ruta principal que renderiza la vista
app.get('/', (req, res) => {
    const db = require('./db');
    db.all("SELECT * FROM programas ORDER BY votos DESC", [], (err, programas) => {
        if (err) {
            console.error('Error al obtener programas:', err);
            return res.status(500).send('Error interno del servidor');
        }
        res.render('index', { programas: programas });
    });
});

// Rutas de la API
app.use('/', tareasRoutes);


// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});