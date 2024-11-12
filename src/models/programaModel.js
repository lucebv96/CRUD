// Importar la base de datos
const db = require('../db');

// Modelo para manejar las operaciones de "programas"
const ProgramaModel = {
  // Obtener todos los programas
  obtenerTodos: (callback) => {
    const sql = 'SELECT * FROM programas ORDER BY votos DESC';
    db.all(sql, [], (err, rows) => {
      callback(err, rows);
    });
  },

  // Agregar un nuevo programa
  agregar: (nombre, callback) => {
    const sql = 'INSERT INTO programas (nombre, votos) VALUES (?, 0)';
    db.run(sql, [nombre], function (err) {
      callback(err, { id: this.lastID, nombre, votos: 0 });
    });
  },

  // Actualizar votos de un programa
  votar: (id, callback) => {
    const sql = 'UPDATE programas SET votos = votos + 1 WHERE id = ?';
    db.run(sql, [id], function (err) {
      if (err) return callback(err);
      db.get('SELECT * FROM programas WHERE id = ?', [id], callback);
    });
  },

  // Actualizar nombre de un programa
  actualizarNombre: (id, nombre, callback) => {
    const sql = 'UPDATE programas SET nombre = ? WHERE id = ?';
    db.run(sql, [nombre, id], function (err) {
      callback(err, { id, nombre });
    });
  },

  // Eliminar un programa
  eliminar: (id, callback) => {
    const sql = 'DELETE FROM programas WHERE id = ?';
    db.run(sql, [id], callback);
  }
};

module.exports = ProgramaModel;
