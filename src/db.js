const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Corregir la ruta de la base de datos usando path
const dbPath = path.join(__dirname, '../database.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        console.log('Ruta de la base de datos:', dbPath);
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

module.exports = db;