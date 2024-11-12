const ProgramaModel = require('../models/programaModel');

// Obtener todos los programas y renderizar la vista principal
exports.obtenerProgramas = (req, res) => {
  ProgramaModel.obtenerTodos((err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener programas' });
    }
    res.render('index', { programas: rows });
  });
};

// Crear un nuevo programa
exports.crearPrograma = (req, res) => {
  const { nombre } = req.body;
  ProgramaModel.agregar(nombre, (err, programa) => {
    if (err) {
      return res.status(500).json({ error: 'Error al agregar programa' });
    }
    res.status(201).json(programa);
  });
};

// Votar por un programa existente
exports.votarPrograma = (req, res) => {
  const { id } = req.params;
  ProgramaModel.votar(id, (err, programa) => {
    if (err) {
      return res.status(500).json({ error: 'Error al votar' });
    }
    res.json(programa);
  });
};

// Actualizar el nombre de un programa existente
exports.actualizarPrograma = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  ProgramaModel.actualizarNombre(id, nombre, (err, programa) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar nombre del programa' });
    }
    res.json(programa);
  });
};

// Eliminar un programa existente
exports.eliminarPrograma = (req, res) => {
  const { id } = req.params;
  ProgramaModel.eliminar(id, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar programa' });
    }
    res.json({ mensaje: 'Programa eliminado' });
  });
};
