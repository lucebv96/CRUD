// Importa sqlite3 y habilita el modo verbose para obtener más detalles en la consola
const sqlite3 = require('sqlite3').verbose();

// Conecta a una base de datos llamada 'database.db' en la carpeta 'src'
const db = new sqlite3.Database('./src/database.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Configura la tabla de programas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS programas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            votos INTEGER DEFAULT 0
        )
    `, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message);
        } else {
            console.log('Tabla "programas" verificada o creada con éxito.');
        }
    });
});

// Exporta la conexión para usarla en otras partes de la aplicación
module.exports = db;
